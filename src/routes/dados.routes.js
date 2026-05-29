import { Router } from 'express';

import {
    listarEmpresa,
    listarEstoque,
    listarFornecedores,
    listarNotasFiscais,
    listarNotaProdutos,
    listarPedidos,
    listarPedidoDetalhes,
    listarVendedores,
} from '../services/dados.service.js';

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

router.get('/empresa', async (req, res) => {
    try {
        const resultado = await listarEmpresa();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'empresa', error);
    }
});

router.get('/estoque', async (req, res) => {
    try {
        const resultado = await listarEstoque();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'estoque', error);
    }
});

router.get('/fornecedores', async (req, res) => {
    try {
        const resultado = await listarFornecedores();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'fornecedores', error);
    }
});

router.get('/notas-fiscais', async (req, res) => {
    try {
        const resultado = await listarNotasFiscais();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'notas fiscais', error);
    }
});

router.get('/notas-produtos', async (req, res) => {
    try {
        const resultado = await listarNotaProdutos();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'produtos da nota', error);
    }
});

router.get('/pedidos', async (req, res) => {
    try {
        const resultado = await listarPedidos();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'pedidos', error);
    }
});

router.get('/pedidos-detalhes', async (req, res) => {
    try {
        const resultado = await listarPedidoDetalhes();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'detalhes dos pedidos', error);
    }
});

router.get('/vendedores', async (req, res) => {
    try {
        const resultado = await listarVendedores();
        responderComDados(res, resultado);
    } catch (error) {
        responderComErro(res, 'vendedores', error);
    }
});

export default router;