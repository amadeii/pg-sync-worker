import 'dotenv/config';
import Firebird from 'node-firebird';

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

export function consultarFirebird(sql, params = []) {
    return new Promise((resolve, reject) => {
        Firebird.attach(options, (erroConexao, db) => {
            if (erroConexao) {
                reject(erroConexao);
                return;
            }

            db.query(sql, params, (erroQuery, resultado) => {
                db.detach();

                if (erroQuery) {
                    reject(erroQuery);
                    return;
                }

                resolve(resultado);
            });
        });
    });
}