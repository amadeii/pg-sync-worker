import { pool } from '../database.js';

let tabelaInicializada = false;

export async function inicializarSyncHistory() {
    if (tabelaInicializada) {
        return;
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS sync_history (
            id SERIAL PRIMARY KEY,
            data_execucao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            tabela TEXT NOT NULL,
            quantidade_registros INTEGER NOT NULL DEFAULT 0,
            duracao_ms INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            erro TEXT
        )
    `);

    tabelaInicializada = true;
}

export async function registrarSyncHistory({
    tabela,
    quantidadeRegistros = 0,
    duracaoMs = 0,
    status,
    erro = null,
}) {
    await inicializarSyncHistory();

    await pool.query(
        `
        INSERT INTO sync_history (
            tabela,
            quantidade_registros,
            duracao_ms,
            status,
            erro
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
            tabela || 'desconhecida',
            Number(quantidadeRegistros) || 0,
            Number(duracaoMs) || 0,
            status,
            erro,
        ]
    );
}

export async function listarSyncHistory({ limit = 20 } = {}) {
    const limiteSeguro = Math.min(Number(limit) || 20, 100);

    const resultado = await pool.query(
        `
        SELECT
            id,
            data_execucao,
            tabela,
            quantidade_registros,
            duracao_ms,
            status,
            erro
        FROM sync_history
        ORDER BY data_execucao DESC
        LIMIT $1
        `,
        [limiteSeguro]
    );

    return resultado.rows;
}
