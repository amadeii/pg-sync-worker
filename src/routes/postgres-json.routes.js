import { Router } from 'express';

import {
    limparTabelaJsonRaw,
    salvarJsonRaw,
    listarJsonRaw,
    contarJsonRaw,
} from '../services/postgres-json.service.js';
import { sincronizarFinanceiroContasReceberDuplicatas } from '../services/financeiro-contas-receber-sync.service.js';
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
        try {
            const resultado =
                await sincronizarFinanceiroContasReceberDuplicatas();

            res.json(resultado);
        } catch (error) {
            logError(
                'Erro ao sincronizar duplicatas de contas a receber estruturadas',
                error,
                {
                    tabela: error.tabela,
                    etapa: error.etapa,
                }
            );

            res.status(500).json({
                sucesso: false,
                etapa: error.etapa,
                erro: error.message,
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
