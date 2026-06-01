import { consultarFirebird } from './firebird.js';
import { logError, logInfo } from './logger.js';

async function testarConexaoFirebird() {
    try {
        logInfo('Testando conexão com Firebird');

        const resultado = await consultarFirebird(`
      SELECT 1 AS TESTE
      FROM RDB$DATABASE
    `);

        logInfo('Conexão com Firebird funcionando', {
            resultado,
        });
    } catch (error) {
        logError('Erro ao conectar no Firebird', error);
    }
}

testarConexaoFirebird();
