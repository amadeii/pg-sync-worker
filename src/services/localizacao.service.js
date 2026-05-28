import { consultarFirebird } from '../firebird.js';

export async function listarCidades() {
    const resultado = await consultarFirebird(`
    SELECT FIRST 50
      CID_CODIGO AS ID,
      CID_COD_IBGE AS IBGE,
      CID_CIDADE AS CIDADE,
      CID_ESTADO AS ESTADO,
      CID_CEP_INICIO AS CEP_INICIO,
      CID_CEP_FINAL AS CEP_FINAL
    FROM CIDADE
    ORDER BY CID_CIDADE
  `);

    return resultado;
}

export async function listarBairros() {
    const resultado = await consultarFirebird(`
    SELECT FIRST 50
      BAI_CODIGO AS ID,
      BAI_BAIRRO AS BAIRRO,
      BAI_CEP AS CEP,
      BAI_COD_CIDADE AS COD_CIDADE,
      BAI_COD_REGIAO AS COD_REGIAO
    FROM BAIRROS
    ORDER BY BAI_BAIRRO
  `);

    return resultado;
}