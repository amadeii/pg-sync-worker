import { logError, logSync } from '../logger.js';
import {
    limparTabelaJsonRaw,
    salvarJsonRaw,
} from './postgres-json.service.js';
import { transformarJsonRawParaTabelaEstruturada } from './json-raw-to-structured.service.js';

export async function sincronizarTabelaFirebirdCompleta({
    nome,
    listarDados,
    origemRaw,
    tabelaDestino,
}) {
    let etapa = 'consultar_firebird';

    try {
        logSync(`Sincronizando ${nome}`, {
            origemRaw,
            tabelaDestino,
        });

        const dadosFirebird = await listarDados();

        etapa = 'limpar_json_raw';
        await limparTabelaJsonRaw(origemRaw);

        etapa = 'salvar_json_raw';
        const etapaRaw = await salvarJsonRaw(origemRaw, dadosFirebird);

        etapa = 'transformar_json_raw_para_estruturado';
        const etapaEstruturada = await transformarJsonRawParaTabelaEstruturada(
            origemRaw,
            tabelaDestino
        );

        return {
            nome,
            sucesso: true,
            total: etapaEstruturada.total_inserido,
            origem_raw: origemRaw,
            tabela_destino: tabelaDestino,
            total_firebird: dadosFirebird.length,
            total_raw_salvo: etapaRaw.inseridos,
        };
    } catch (error) {
        logError(`Erro ao sincronizar ${nome}`, error, {
            etapa,
            origemRaw,
            tabelaDestino,
        });

        return {
            nome,
            sucesso: false,
            total: 0,
            origem_raw: origemRaw,
            tabela_destino: tabelaDestino,
            etapa,
            erro: error.message,
        };
    }
}

export async function sincronizarEtapasFirebird({ modulo, etapas }) {
    const resultados = [];
    const erros = [];

    for (const etapa of etapas) {
        const resultado = await sincronizarTabelaFirebirdCompleta(etapa);

        resultados.push(resultado);

        if (!resultado.sucesso) {
            erros.push({
                nome: resultado.nome,
                etapa: resultado.etapa,
                origem_raw: resultado.origem_raw,
                tabela_destino: resultado.tabela_destino,
                erro: resultado.erro,
            });
        }
    }

    return {
        sucesso: erros.length === 0,
        modulo,
        etapas: resultados,
        erros,
    };
}
