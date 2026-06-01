import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, '../logs');

const arquivosPorCanal = {
    app: 'app.log',
    error: 'errors.log',
    query: 'queries.log',
    sync: 'sync.log',
};

function garantirDiretorioLogs() {
    fs.mkdirSync(logsDir, { recursive: true });
}

function normalizarSql(sql) {
    if (!sql) {
        return null;
    }

    if (typeof sql === 'string') {
        return sql.replace(/\s+/g, ' ').trim();
    }

    if (typeof sql === 'object' && sql.text) {
        return sql.text.replace(/\s+/g, ' ').trim();
    }

    return String(sql);
}

function serializarErro(error) {
    if (!error) {
        return null;
    }

    return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
    };
}

function escreverLog(canal, nivel, mensagem, contexto = {}) {
    garantirDiretorioLogs();

    const arquivo = arquivosPorCanal[canal] || arquivosPorCanal.app;
    const registro = {
        timestamp: new Date().toISOString(),
        level: nivel,
        message: mensagem,
        ...contexto,
    };

    const linha = `${JSON.stringify(registro)}\n`;
    fs.appendFileSync(path.join(logsDir, arquivo), linha, 'utf8');

    if (nivel === 'error') {
        console.error(mensagem, contexto.error?.message || '');
        return;
    }

    console.log(mensagem);
}

export function logInfo(mensagem, contexto = {}) {
    escreverLog('app', 'info', mensagem, contexto);
}

export function logError(mensagem, error, contexto = {}) {
    escreverLog('error', 'error', mensagem, {
        ...contexto,
        error: serializarErro(error),
    });
}

export function logQuery({ origem, sql, params = [], durationMs, rows, error }) {
    const contexto = {
        origem,
        sql: normalizarSql(sql),
        params,
        durationMs,
        rows,
    };

    escreverLog('query', error ? 'error' : 'info', error ? 'Consulta falhou' : 'Consulta executada', {
        ...contexto,
        error: serializarErro(error),
    });
}

export function logSync(evento, contexto = {}) {
    escreverLog('sync', 'info', evento, contexto);
}

export function logSyncError(evento, error, contexto = {}) {
    escreverLog('sync', 'error', evento, {
        ...contexto,
        error: serializarErro(error),
    });
}
