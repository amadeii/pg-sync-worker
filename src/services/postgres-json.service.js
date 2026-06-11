import { pool } from '../database.js';
import { logSync } from '../logger.js';
import { registrarSyncHistory } from './sync-history.service.js';

let tabelaJsonRawInicializada = false;

function descobrirCodigoOrigem(item) {
    return (
        item.CODIGO ||
        item.ID ||
        item.CDCLIENTE ||
        item.CODCLIENTE ||
        item.CODIGOCLIENTE ||
        item.CODIGO_ORIGEM ||
        null
    );
}

async function garantirTabelaFirebirdJsonRaw() {
    if (tabelaJsonRawInicializada) {
        return;
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS firebird_json_raw (
        id SERIAL PRIMARY KEY,
        tabela_origem TEXT NOT NULL,
        codigo_origem TEXT,
        dados JSONB NOT NULL,
        sincronizado_em TIMESTAMP DEFAULT NOW()
      )
    `);

    tabelaJsonRawInicializada = true;
}

async function limparJsonRawPorOrigem(tabelaOrigem) {
    await garantirTabelaFirebirdJsonRaw();

    await pool.query(
        `
      DELETE FROM firebird_json_raw
      WHERE tabela_origem = $1
    `,
        [tabelaOrigem]
    );
}

async function limparTabelaJsonRaw(tabelaOrigem) {
    await limparJsonRawPorOrigem(tabelaOrigem);
}

async function salvarJsonRaw(tabelaOrigem, dados) {
    const inicio = Date.now();
    let totalInseridos = 0;

    await garantirTabelaFirebirdJsonRaw();

    if (!Array.isArray(dados)) {
        throw new Error('Os dados precisam ser um array de objetos JSON');
    }

    try {
        if (dados.length === 0) {
            await registrarSyncHistory({
                tabela: tabelaOrigem,
                quantidadeRegistros: 0,
                duracaoMs: Date.now() - inicio,
                status: 'sucesso',
            });

            return {
                inseridos: 0,
            };
        }

        const tamanhoDoLote = 500;

        for (let i = 0; i < dados.length; i += tamanhoDoLote) {
            const lote = dados.slice(i, i + tamanhoDoLote);

            const valores = [];
            const parametros = [];

            lote.forEach((item, index) => {
                const posicao = index * 3;

                const codigoOrigem = descobrirCodigoOrigem(item);

                parametros.push(tabelaOrigem);
                parametros.push(codigoOrigem ? String(codigoOrigem) : null);
                parametros.push(JSON.stringify(item));

                valores.push(
                    `($${posicao + 1}, $${posicao + 2}, $${posicao + 3}::jsonb)`
                );
            });

            const sql = `
      INSERT INTO firebird_json_raw (
        tabela_origem,
        codigo_origem,
        dados
      )
      VALUES ${valores.join(', ')}
    `;

            await pool.query(sql, parametros);

            totalInseridos += lote.length;

            logSync(`Inseridos ate agora em ${tabelaOrigem}`, {
                tabela: tabelaOrigem,
                totalInseridos,
            });
        }

        await registrarSyncHistory({
            tabela: tabelaOrigem,
            quantidadeRegistros: totalInseridos,
            duracaoMs: Date.now() - inicio,
            status: 'sucesso',
        });

        return {
            inseridos: totalInseridos,
        };
    } catch (error) {
        await registrarSyncHistory({
            tabela: tabelaOrigem,
            quantidadeRegistros: totalInseridos,
            duracaoMs: Date.now() - inicio,
            status: 'erro',
            erro: error.message,
        });

        throw error;
    }
}

async function listarJsonRaw({ tabelaOrigem, limit = 50, offset = 0 }) {
    await garantirTabelaFirebirdJsonRaw();

    const limiteSeguro = Math.min(Number(limit) || 50, 100);

    const resultado = await pool.query(
        `
      SELECT
        id,
        tabela_origem,
        codigo_origem,
        dados,
        sincronizado_em
      FROM firebird_json_raw
      WHERE tabela_origem = $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3
    `,
        [tabelaOrigem, limiteSeguro, offset]
    );

    return resultado.rows;
}

async function listarTodosJsonRaw(tabelaOrigem) {
    await garantirTabelaFirebirdJsonRaw();

    const resultado = await pool.query(
        `
      SELECT
        id,
        tabela_origem,
        codigo_origem,
        dados,
        sincronizado_em
      FROM firebird_json_raw
      WHERE tabela_origem = $1
      ORDER BY id ASC
    `,
        [tabelaOrigem]
    );

    return resultado.rows;
}

async function contarJsonRaw(tabelaOrigem) {
    await garantirTabelaFirebirdJsonRaw();

    const resultado = await pool.query(
        `
      SELECT COUNT(*)::int AS total
      FROM firebird_json_raw
      WHERE tabela_origem = $1
    `,
        [tabelaOrigem]
    );

    return resultado.rows[0];
}

export {
    garantirTabelaFirebirdJsonRaw,
    limparJsonRawPorOrigem,
    limparTabelaJsonRaw,
    salvarJsonRaw,
    listarJsonRaw,
    listarTodosJsonRaw,
    contarJsonRaw,
};
