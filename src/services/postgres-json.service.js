import { pool } from '../database.js';
import { logSync } from '../logger.js';
import { registrarSyncHistory } from './sync-history.service.js';

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

async function limparTabelaJsonRaw(tabelaOrigem) {
    await pool.query(
        `
      DELETE FROM firebird_json_raw
      WHERE tabela_origem = $1
    `,
        [tabelaOrigem]
    );
}

async function salvarJsonRaw(tabelaOrigem, dados) {
    const inicio = Date.now();
    let totalInseridos = 0;

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
                    `($${posicao + 1}, $${posicao + 2}, $${posicao + 3}::json)`
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

async function contarJsonRaw(tabelaOrigem) {
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
    limparTabelaJsonRaw,
    salvarJsonRaw,
    listarJsonRaw,
    contarJsonRaw,
};
