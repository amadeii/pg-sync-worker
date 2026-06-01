import cron from 'node-cron';
import { executarJob } from './job.js';
import { logError, logInfo } from './logger.js';
import { inicializarSyncHistory } from './services/sync-history.service.js';

try {
    await inicializarSyncHistory();
    logInfo('Worker iniciado');
    logInfo('Aguardando próxima execução');
} catch (error) {
    logError('Erro ao inicializar banco do worker', error);
    process.exit(1);
}

cron.schedule('*/1 * * * *', async () => {
    try {
        await executarJob();
    } catch (error) {
        logError('Erro ao executar job', error);
    }
});
