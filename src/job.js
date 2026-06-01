import { pool } from './database.js';
import { logSync, logSyncError } from './logger.js';
import { registrarSyncHistory } from './services/sync-history.service.js';

export async function executarJob() {
    const inicio = Date.now();

    logSync('Iniciando busca de tarefas pendentes');

    try {
        const resultado = await pool.query(`
    SELECT *
    FROM tarefas
    WHERE status = 'pendente'
    ORDER BY id ASC
    LIMIT 10
  `);

        const tarefas = resultado.rows;

        logSync('Tarefas pendentes encontradas', {
            total: tarefas.length,
        });

        for (const tarefa of tarefas) {
            const inicioTarefa = Date.now();

            logSync('Processando tarefa', {
                tarefaId: tarefa.id,
                descricao: tarefa.descricao,
            });

            await pool.query(`
      UPDATE tarefas
      SET 
        status = 'processado',
        processado_em = NOW()
      WHERE id = $1
    `, [tarefa.id]);

            logSync('Tarefa processada com sucesso', {
                tarefaId: tarefa.id,
                durationMs: Date.now() - inicioTarefa,
            });
        }

        logSync('Execução do job concluída', {
            total: tarefas.length,
            durationMs: Date.now() - inicio,
        });

        await registrarSyncHistory({
            tabela: 'tarefas',
            quantidadeRegistros: tarefas.length,
            duracaoMs: Date.now() - inicio,
            status: 'sucesso',
        });
    } catch (error) {
        logSyncError('Erro ao executar job de sincronização', error, {
            durationMs: Date.now() - inicio,
        });

        await registrarSyncHistory({
            tabela: 'tarefas',
            quantidadeRegistros: 0,
            duracaoMs: Date.now() - inicio,
            status: 'erro',
            erro: error.message,
        });

        throw error;
    }
}
