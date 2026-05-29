import { consultarFirebird } from '../firebird.js';

export async function listarEmpresa() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM EMPRESA
    `);

    return resultado;
}

export async function listarEstoque() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM ESTOQUE
    `);

    return resultado;
}

export async function listarFornecedores() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM FORNECEDOR
    `);

    return resultado;
}

export async function listarNotasFiscais() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM NOTA_FISCAL
    `);

    return resultado;
}

export async function listarNotaProdutos() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM NOTA_PRODUTOS
    `);

    return resultado;
}

export async function listarPedidos() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM PEDIDO
    `);

    return resultado;
}

export async function listarPedidoDetalhes() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM PEDIDO_DETALHE
    `);

    return resultado;
}

export async function listarVendedores() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 50 *
        FROM VENDEDOR
    `);

    return resultado;
}