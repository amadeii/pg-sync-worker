import cron from 'node-cron';
import { executarJob } from './job.js';

console.log('Worker iniciado...');
console.log('Aguardando próxima execução...');

cron.schedule('*/1 * * * *', async () => {
    try {
        await executarJob();
    } catch (error) {
        console.error('Erro ao executar job:', error);
    }
});