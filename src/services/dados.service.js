import { consultarFirebird } from '../firebird.js';

export async function listarEmpresa() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM EMPRESA
    `);

    return resultado;
}

export async function listarTodasEmpresas() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM EMPRESA
    `);

    return resultado;
}

export async function listarEstoque() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM ESTOQUE
    `);

    return resultado;
}

export async function listarTodosEstoques() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM ESTOQUE
    `);

    return resultado;
}

export async function listarFornecedores() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM FORNECEDOR
    `);

    return resultado;
}

export async function listarTodosFornecedores() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM FORNECEDOR
    `);

    return resultado;
}

export async function listarNotasFiscais() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM NOTA_FISCAL
    `);

    return resultado;
}

export async function listarTodasNotasFiscais() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM NOTA_FISCAL
    `);

    return resultado;
}

export async function listarNotaProdutos() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM NOTA_PRODUTOS
    `);

    return resultado;
}

export async function listarTodosNotaProdutos() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM NOTA_PRODUTOS
    `);

    return resultado;
}

export async function listarPedidos() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM PEDIDO
    `);

    return resultado;
}

export async function listarTodosPedidos() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM PEDIDO
    `);

    return resultado;
}

export async function listarPedidoDetalhes() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM PEDIDO_DETALHE
    `);

    return resultado;
}

export async function listarTodosPedidoDetalhes() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM PEDIDO_DETALHE
    `);

    return resultado;
}

export async function listarVendedores() {
    const resultado = await consultarFirebird(`
        SELECT FIRST 100 *
        FROM VENDEDOR
    `);

    return resultado;
}

export async function listarTodosVendedores() {
    const resultado = await consultarFirebird(`
        SELECT *
        FROM VENDEDOR
    `);

    return resultado;
}
