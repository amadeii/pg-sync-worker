import 'dotenv/config';
import Firebird from 'node-firebird';
import { logError, logInfo, logQuery } from './logger.js';
import { registrarSyncHistory } from './services/sync-history.service.js';

const options = {
    host: process.env.FDB_HOST,
    port: Number(process.env.FDB_PORT),
    database: process.env.FDB_DATABASE,
    user: process.env.FDB_USER,
    password: process.env.FDB_PASSWORD,
    lowercase_keys: process.env.FDB_LOWERCASE_KEYS === 'true',
    role: process.env.FDB_ROLE || null,
    pageSize: Number(process.env.FDB_PAGE_SIZE) || 4096,
};

function identificarTabela(sql) {
    const texto = String(sql || '').replace(/\s+/g, ' ').trim();
    const match = texto.match(/\bFROM\s+([A-Z0-9_$.-]+)/i);

    return match ? match[1].replace(/["']/g, '').toUpperCase() : 'FIREBIRD_QUERY';
}

export function consultarFirebird(sql, params = []) {
    return new Promise((resolve, reject) => {
        const inicioConexao = Date.now();

        logInfo('Conectando ao Firebird', {
            host: options.host,
            port: options.port,
            database: options.database,
        });

        Firebird.attach(options, (erroConexao, db) => {
            if (erroConexao) {
                logError('Erro na conexão com Firebird', erroConexao, {
                    host: options.host,
                    port: options.port,
                    database: options.database,
                    durationMs: Date.now() - inicioConexao,
                });
                reject(erroConexao);
                return;
            }

            logInfo('Conexão Firebird estabelecida', {
                host: options.host,
                port: options.port,
                database: options.database,
                durationMs: Date.now() - inicioConexao,
            });

            const inicioQuery = Date.now();

            db.query(sql, params, (erroQuery, resultado) => {
                db.detach();
                const durationMs = Date.now() - inicioQuery;
                const tabela = identificarTabela(sql);

                if (erroQuery) {
                    logQuery({
                        origem: 'firebird',
                        sql,
                        params,
                        durationMs,
                        error: erroQuery,
                    });

                    registrarSyncHistory({
                        tabela,
                        quantidadeRegistros: 0,
                        duracaoMs: durationMs,
                        status: 'erro',
                        erro: erroQuery.message,
                    }).catch((error) => {
                        logError('Erro ao registrar histórico de sincronização', error, {
                            tabela,
                        });
                    });

                    reject(erroQuery);
                    return;
                }

                const quantidadeRegistros = Array.isArray(resultado) ? resultado.length : 0;

                logQuery({
                    origem: 'firebird',
                    sql,
                    params,
                    durationMs,
                    rows: quantidadeRegistros,
                });

                registrarSyncHistory({
                    tabela,
                    quantidadeRegistros,
                    duracaoMs: durationMs,
                    status: 'sucesso',
                }).catch((error) => {
                    logError('Erro ao registrar histórico de sincronização', error, {
                        tabela,
                    });
                });

                resolve(resultado);
            });
        });
    });
}
