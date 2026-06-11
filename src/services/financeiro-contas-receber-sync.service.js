import { logSync } from '../logger.js';
import { listarTodasContasReceberDuplicatas } from './financeiro.service.js';
import {
    limparTabelaJsonRaw,
    salvarJsonRaw,
} from './postgres-json.service.js';
import { transformarJsonRawParaTabelaEstruturada } from './json-raw-to-structured.service.js';

const TABELA_DUPLICATAS = 'financeiro_contas_receber_duplicatas';

export async function sincronizarFinanceiroContasReceberDuplicatas() {
    let etapa = 'iniciar_sincronizacao';

    try {
        logSync('Sincronizando duplicatas de contas a receber estruturadas', {
            tabela: TABELA_DUPLICATAS,
        });

        etapa = 'consultar_firebird';
        const dadosFirebird = await listarTodasContasReceberDuplicatas();

        etapa = 'limpar_json_raw';
        await limparTabelaJsonRaw(TABELA_DUPLICATAS);

        etapa = 'salvar_json_raw';
        const etapaRaw = await salvarJsonRaw(TABELA_DUPLICATAS, dadosFirebird);

        etapa = 'transformar_json_raw_para_estruturado';
        const etapaEstruturada = await transformarJsonRawParaTabelaEstruturada(
            TABELA_DUPLICATAS,
            TABELA_DUPLICATAS
        );

        return {
            sucesso: true,
            origem: TABELA_DUPLICATAS,
            destino: TABELA_DUPLICATAS,
            totalFirebird: dadosFirebird.length,
            totalRawSalvo: etapaRaw.inseridos,
            totalEstruturado: etapaEstruturada.total_inserido,
        };
    } catch (error) {
        error.etapa = etapa;
        error.tabela = TABELA_DUPLICATAS;
        throw error;
    }
}
