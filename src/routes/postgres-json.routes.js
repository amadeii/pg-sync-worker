import { Router } from 'express';

import {
    limparTabelaJsonRaw,
    salvarJsonRaw,
    listarJsonRaw,
    contarJsonRaw,
} from '../services/postgres-json.service.js';
import { transformarJsonRawParaTabelaEstruturada } from '../services/json-raw-to-structured.service.js';
import { listarContasReceberDuplicatas } from '../services/financeiro.service.js';
import { logError, logSync } from '../logger.js';

const router = Router();

router.post('/:tabelaOrigem/salvar-json', async (req, res) => {
    try {
        const { tabelaOrigem } = req.params;
        const dados = req.body;

        logSync(`Recebendo JSON para salvar no PostgreSQL: ${tabelaOrigem}`, {
            tabela: tabelaOrigem,
            quantidadeRegistros: Array.isArray(dados) ? dados.length : 0,
        });

        await limparTabelaJsonRaw(tabelaOrigem);

        const resultado = await salvarJsonRaw(tabelaOrigem, dados);

        res.json({
            mensagem: 'JSON salvo no PostgreSQL com sucesso',
            tabela_origem: tabelaOrigem,
            tipo_coluna_dados: 'JSON',
            total_inserido: resultado.inseridos,
        });
    } catch (error) {
        logError('Erro ao salvar JSON no PostgreSQL', error, {
            tabelaOrigem: req.params.tabelaOrigem,
        });

        res.status(500).json({
            erro: 'Erro ao salvar JSON no PostgreSQL',
            detalhes: error.message,
        });
    }
});

router.get('/:tabelaOrigem/resumo', async (req, res) => {
    try {
        const { tabelaOrigem } = req.params;

        const resumo = await contarJsonRaw(tabelaOrigem);

        res.json({
            tabela_origem: tabelaOrigem,
            total: resumo.total,
        });
    } catch (error) {
        logError('Erro ao contar JSON no PostgreSQL', error, {
            tabelaOrigem: req.params.tabelaOrigem,
        });

        res.status(500).json({
            erro: 'Erro ao contar JSON no PostgreSQL',
            detalhes: error.message,
        });
    }
});

router.post(
    '/financeiro/contas-receber/duplicatas/sincronizar-estruturado',
    async (req, res) => {
        const tabelaFinanceira = 'financeiro_contas_receber_duplicatas';

        try {
            logSync('Sincronizando duplicatas de contas a receber estruturadas', {
                tabela: tabelaFinanceira,
            });

            const resultado = await listarContasReceberDuplicatas();

            await limparTabelaJsonRaw(tabelaFinanceira);

            const etapaRaw = await salvarJsonRaw(tabelaFinanceira, resultado);

            const etapaEstruturada =
                await transformarJsonRawParaTabelaEstruturada(
                    tabelaFinanceira,
                    tabelaFinanceira
                );

            res.json({
                sucesso: true,
                tabela_origem: tabelaFinanceira,
                tabela_destino: tabelaFinanceira,
                etapa_raw: etapaRaw,
                etapa_estruturada: etapaEstruturada,
                total_salvo_raw: etapaRaw.inseridos,
                total_inserido_estruturado:
                    etapaEstruturada.total_inserido,
            });
        } catch (error) {
            logError(
                'Erro ao sincronizar duplicatas de contas a receber estruturadas',
                error,
                {
                    tabela: tabelaFinanceira,
                }
            );

            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao sincronizar duplicatas de contas a receber estruturadas',
                detalhes: error.message,
            });
        }
    }
);

router.get('/:tabelaOrigem', async (req, res) => {
    try {
        const { tabelaOrigem } = req.params;

        const limit = Math.min(Number(req.query.limit) || 50, 100);
        const offset = Number(req.query.offset) || 0;

        const dados = await listarJsonRaw({
            tabelaOrigem,
            limit,
            offset,
        });

        res.json({
            tabela_origem: tabelaOrigem,
            limit,
            offset,
            total_retornado: dados.length,
            dados,
        });
    } catch (error) {
        logError('Erro ao listar JSON do PostgreSQL', error, {
            tabelaOrigem: req.params.tabelaOrigem,
        });

        res.status(500).json({
            erro: 'Erro ao listar JSON do PostgreSQL',
            detalhes: error.message,
        });
    }
});

export default router;
