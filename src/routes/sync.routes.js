import { Router } from 'express';

import { sincronizarFinanceiroContasReceberDuplicatas } from '../services/financeiro-contas-receber-sync.service.js';
import { logError, logSync } from '../logger.js';

const router = Router();

router.post('/financeiro/contas-receber', async (req, res) => {
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

        res.json({
            sucesso: true,
            modulo,
            etapas,
            erros,
        });
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

        res.status(500).json({
            sucesso: false,
            modulo,
            etapas,
            erros,
        });
    }
});

export default router;
