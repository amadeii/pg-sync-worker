import { consultarFirebird } from '../firebird.js';

export async function listarClientes() {
  const resultado = await consultarFirebird(`
        SELECT
            CL_CODIGO AS ID,
            CL_RAZAO AS RAZAO,
            CL_FANTASIA AS FANTASIA,
            CL_CLASSIFICACAO_CLIENTE AS CLASSIFICACAO
        FROM CLIENTES
        ORDER BY CL_CODIGO
    `);

  return resultado;
}