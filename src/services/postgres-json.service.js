const pool = require('../database');

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
    if (!Array.isArray(dados)) {
        throw new Error('Os dados precisam ser um array de objetos JSON');
    }

    if (dados.length === 0) {
        return {
            inseridos: 0,
        };
    }

    const tamanhoDoLote = 500;
    let totalInseridos = 0;

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

        console.log(`Inseridos até agora em ${tabelaOrigem}: ${totalInseridos}`);
    }

    return {
        inseridos: totalInseridos,
    };
}

async function listarJsonRaw({ tabelaOrigem, limit = 50, offset = 0 }) {
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
        [tabelaOrigem, limit, offset]
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

module.exports = {
    limparTabelaJsonRaw,
    salvarJsonRaw,
    listarJsonRaw,
    contarJsonRaw,
};