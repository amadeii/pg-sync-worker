import { Router } from 'express';

import {
    listarContasReceberDuplicatas,
    listarContasReceberBoletosAnexos,
    listarContasReceberBoletosEmail,
    listarContasReceberBoletosFatura,
    listarContasReceberCartoes,
    listarContasReceberDuplicatasParciais,
    listarContasReceberTiposDocumento,

    listarContasPagarConferencias,
    listarContasPagarConferenciasItens,
    listarContasPagarDivergenciasFiscais,
    listarContasPagarDuplicatas,
    listarContasPagarDuplicatasParciais,
    listarContasPagarItens,
    listarContasPagarNotas,
} from '../services/financeiro.service.js';

const router = Router();

function responderComDados(res, resultado) {
    res.json({
        success: true,
        total: resultado.length,
        data: resultado,
    });
}

function responderComErro(res, nomeRecurso, error) {
    console.error(`Erro ao listar ${nomeRecurso}:`, error.message);

    res.status(500).json({
        success: false,
        error: error.message,
    });
}

// ===============================
// CONTAS A RECEBER
// ===============================

router.get('/contas-receber/duplicatas', async (req, res) => {
    try {
        const resultado = await listarContasReceberDuplicatas();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a receber - duplicatas', error);
    }
});

router.get('/contas-receber/boletos-anexos', async (req, res) => {
    try {
        const resultado = await listarContasReceberBoletosAnexos();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a receber - boletos anexos', error);
    }
});

router.get('/contas-receber/boletos-email', async (req, res) => {
    try {
        const resultado = await listarContasReceberBoletosEmail();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a receber - boletos email', error);
    }
});

router.get('/contas-receber/boletos-fatura', async (req, res) => {
    try {
        const resultado = await listarContasReceberBoletosFatura();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a receber - boletos fatura', error);
    }
});

router.get('/contas-receber/cartoes', async (req, res) => {
    try {
        const resultado = await listarContasReceberCartoes();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a receber - cartões', error);
    }
});

router.get('/contas-receber/duplicatas-parciais', async (req, res) => {
    try {
        const resultado = await listarContasReceberDuplicatasParciais();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a receber - duplicatas parciais', error);
    }
});

router.get('/contas-receber/tipos-documento', async (req, res) => {
    try {
        const resultado = await listarContasReceberTiposDocumento();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a receber - tipos de documento', error);
    }
});

// ===============================
// CONTAS A PAGAR
// ===============================

router.get('/contas-pagar/conferencias', async (req, res) => {
    try {
        const resultado = await listarContasPagarConferencias();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a pagar - conferências', error);
    }
});

router.get('/contas-pagar/conferencias-itens', async (req, res) => {
    try {
        const resultado = await listarContasPagarConferenciasItens();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a pagar - conferências itens', error);
    }
});

router.get('/contas-pagar/divergencias-fiscais', async (req, res) => {
    try {
        const resultado = await listarContasPagarDivergenciasFiscais();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a pagar - divergências fiscais', error);
    }
});

router.get('/contas-pagar/duplicatas', async (req, res) => {
    try {
        const resultado = await listarContasPagarDuplicatas();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a pagar - duplicatas', error);
    }
});

router.get('/contas-pagar/duplicatas-parciais', async (req, res) => {
    try {
        const resultado = await listarContasPagarDuplicatasParciais();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a pagar - duplicatas parciais', error);
    }
});

router.get('/contas-pagar/itens', async (req, res) => {
    try {
        const resultado = await listarContasPagarItens();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a pagar - itens', error);
    }
});

router.get('/contas-pagar/notas', async (req, res) => {
    try {
        const resultado = await listarContasPagarNotas();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'contas a pagar - notas', error);
    }
});

export default router;