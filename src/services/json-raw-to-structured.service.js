import { pool } from '../database.js';
import { listarJsonRaw } from './postgres-json.service.js';

function quoteIdentifier(identifier) {
    if (!identifier || typeof identifier !== 'string') {
        throw new Error('Identificador SQL invalido');
    }

    return `"${identifier.replaceAll('"', '""')}"`;
}

function quoteTableName(tableName) {
    return tableName
        .split('.')
        .map((part) => quoteIdentifier(part.trim()))
        .join('.');
}

function extrairRegistro(raw) {
    if (raw && typeof raw === 'object') {
        return raw.dados ?? raw.data ?? raw;
    }

    return raw;
}

function normalizarValorParaTexto(valor) {
    if (valor === null || valor === undefined) {
        return null;
    }

    if (typeof valor === 'object') {
        return JSON.stringify(valor);
    }

    return String(valor);
}

export async function transformarJsonRawParaTabelaEstruturada(
    tabelaOrigem,
    nomeTabelaDestino
) {
    // Busca os registros raw ja salvos no PostgreSQL para a tabela de origem.
    const registrosRaw = await listarJsonRaw({
        tabelaOrigem,
        limit: Number.MAX_SAFE_INTEGER,
    });

    const registros = registrosRaw.map(extrairRegistro);

    if (!Array.isArray(registros) || registros.length === 0) {
        throw new Error('Nao existem registros JSON raw para transformar');
    }

    const possuiRegistroInvalido = registros.some(
        (registro) =>
            !registro || typeof registro !== 'object' || Array.isArray(registro)
    );

    if (possuiRegistroInvalido) {
        throw new Error('Os dados JSON raw precisam ser um array de objetos');
    }

    // Usa o primeiro registro como referencia inicial das colunas da tabela destino.
    const colunas = Object.keys(registros[0]);

    if (colunas.length === 0) {
        throw new Error('O primeiro registro JSON raw nao possui colunas');
    }

    const tabelaDestinoSql = quoteTableName(nomeTabelaDestino);
    const colunasSql = colunas
        .map((coluna) => `${quoteIdentifier(coluna)} TEXT`)
        .join(', ');

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${tabelaDestinoSql} (
            ${colunasSql}
        )
    `);

    let totalInserido = 0;

    // Insere os valores com parametros; somente nomes de tabela/coluna sao interpolados.
    for (const registro of registros) {
        const nomesColunasSql = colunas.map(quoteIdentifier).join(', ');
        const parametrosSql = colunas
            .map((_, index) => `$${index + 1}`)
            .join(', ');
        const valores = colunas.map((coluna) =>
            normalizarValorParaTexto(registro[coluna])
        );

        const resultado = await pool.query(
            `
            INSERT INTO ${tabelaDestinoSql} (${nomesColunasSql})
            VALUES (${parametrosSql})
            `,
            valores
        );

        totalInserido += resultado.rowCount;
    }

    return {
        tabela_origem: tabelaOrigem,
        tabela_destino: nomeTabelaDestino,
        total_lido: registros.length,
        total_inserido: totalInserido,
    };
}
