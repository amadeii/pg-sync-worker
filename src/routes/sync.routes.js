import { Router } from 'express';

import { logError } from '../logger.js';
import {
    sincronizarFluxoCompleto,
    sincronizarModuloClientes,
    sincronizarModuloDados,
    sincronizarModuloEstoque,
    sincronizarModuloFinanceiro,
    sincronizarModuloFinanceiroContasReceber,
    sincronizarModuloLocalizacao,
    sincronizarModuloVendas,
} from '../services/sync-modulos.service.js';

const router = Router();

function responderResultado(res, resultado) {
    res.status(resultado.sucesso ? 200 : 500).json(resultado);
}

async function executarRotaSync(res, modulo, sincronizar) {
    try {
        const resultado = await sincronizar();

        responderResultado(res, resultado);
    } catch (error) {
        logError(`Erro inesperado na rota de sync ${modulo}`, error);

        res.status(500).json({
            sucesso: false,
            modulo,
            etapas: [],
            erros: [
                {
                    nome: modulo,
                    erro: error.message,
                },
            ],
        });
    }
}

router.post('/', async (req, res) => {
    await executarRotaSync(res, 'sync', sincronizarFluxoCompleto);
});

router.post('/clientes', async (req, res) => {
    await executarRotaSync(res, 'clientes', sincronizarModuloClientes);
});

router.post('/localizacao', async (req, res) => {
    await executarRotaSync(res, 'localizacao', sincronizarModuloLocalizacao);
});

router.post('/dados', async (req, res) => {
    await executarRotaSync(res, 'dados', sincronizarModuloDados);
});

router.post('/estoque', async (req, res) => {
    await executarRotaSync(res, 'estoque', sincronizarModuloEstoque);
});

router.post('/vendas', async (req, res) => {
    await executarRotaSync(res, 'vendas', sincronizarModuloVendas);
});

router.post('/financeiro', async (req, res) => {
    await executarRotaSync(res, 'financeiro', sincronizarModuloFinanceiro);
});

router.post('/financeiro/contas-receber', async (req, res) => {
    await executarRotaSync(
        res,
        'financeiro_contas_receber',
        sincronizarModuloFinanceiroContasReceber
    );
});

export default router;
