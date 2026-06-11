import { Router } from 'express';

import { sincronizarFinanceiroContasReceberDuplicatas } from '../services/financeiro-contas-receber-sync.service.js';
import { logError, logSync } from '../logger.js';

const router = Router();

async function sincronizarModuloFinanceiroContasReceber() {
    const modulo = 'financeiro_contas_receber';
    const etapas = [];
    const erros = [];

    try {
        logSync('Sincronizando modulo financeiro contas a receber', {
            modulo,
        });

        const resultadoDuplicatas =
            await sincronizarFinanceiroContasReceberDuplicatas();

        etapas.push({
            nome: 'duplicatas',
            sucesso: true,
            total: resultadoDuplicatas.totalEstruturado,
        });

        return {
            sucesso: true,
            modulo,
            etapas,
            erros,
        };
    } catch (error) {
        const erro = {
            nome: 'duplicatas',
            etapa: error.etapa,
            erro: error.message,
        };

        erros.push(erro);

        etapas.push({
            nome: 'duplicatas',
            sucesso: false,
            total: 0,
        });

        logError('Erro ao sincronizar modulo financeiro contas a receber', error, {
            modulo,
            etapa: error.etapa,
        });

        return {
            sucesso: false,
            modulo,
            etapas,
            erros,
        };
    }
}

router.post('/financeiro', async (req, res) => {
    const modulo = 'financeiro';
    const etapas = [];
    const erros = [];

    try {
        logSync('Sincronizando modulo financeiro', {
            modulo,
        });

        const resultadoContasReceber =
            await sincronizarModuloFinanceiroContasReceber();

        etapas.push({
            nome: 'contas_receber',
            sucesso: resultadoContasReceber.sucesso,
            etapas: resultadoContasReceber.etapas,
        });

        if (!resultadoContasReceber.sucesso) {
            erros.push({
                nome: 'contas_receber',
                erros: resultadoContasReceber.erros,
            });
        }

        res.status(resultadoContasReceber.sucesso ? 200 : 500).json({
            sucesso: resultadoContasReceber.sucesso,
            modulo,
            etapas,
            erros,
        });
    } catch (error) {
        const erro = {
            nome: 'financeiro',
            etapa: error.etapa,
            erro: error.message,
        };

        erros.push(erro);

        logError('Erro ao sincronizar modulo financeiro', error, {
            modulo,
            etapa: error.etapa,
        });

        res.status(500).json({
            sucesso: false,
            modulo,
            etapas,
            erros,
        });
    }
});

router.post('/financeiro/contas-receber', async (req, res) => {
    const resultado = await sincronizarModuloFinanceiroContasReceber();

    res.status(resultado.sucesso ? 200 : 500).json(resultado);
});

export default router;
