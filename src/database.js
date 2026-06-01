import 'dotenv/config';
import pg from 'pg';
import { logError, logInfo, logQuery } from './logger.js';

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const queryOriginal = pool.query.bind(pool);

pool.on('connect', () => {
    logInfo('Conexão PostgreSQL estabelecida', {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
    });
});

pool.on('error', (error) => {
    logError('Erro inesperado no pool PostgreSQL', error, {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
    });
});

pool.query = async function queryComLog(sql, params = []) {
    const inicio = Date.now();

    try {
        const resultado = await queryOriginal(sql, params);

        logQuery({
            origem: 'postgres',
            sql,
            params,
            durationMs: Date.now() - inicio,
            rows: resultado.rowCount,
        });

        return resultado;
    } catch (error) {
        logQuery({
            origem: 'postgres',
            sql,
            params,
            durationMs: Date.now() - inicio,
            error,
        });

        throw error;
    }
};

export { pool };
export default pool;
