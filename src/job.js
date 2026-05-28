import { pool } from './database.js';

export async function executarJob() {
    const agora = new Date().toLocaleString('pt-BR');

    console.log(`[${agora}] Buscando tarefas pendentes...`);

    const resultado = await pool.query(`
    SELECT *
    FROM tarefas
    WHERE status = 'pendente'
    ORDER BY id ASC
    LIMIT 10
  `);

    const tarefas = resultado.rows;

    console.log(`Tarefas encontradas: ${tarefas.length}`);

    for (const tarefa of tarefas) {
        console.log(`Processando tarefa ${tarefa.id}: ${tarefa.descricao}`);

        await pool.query(`
      UPDATE tarefas
      SET 
        status = 'processado',
        processado_em = NOW()
      WHERE id = $1
    `, [tarefa.id]);

        console.log(`Tarefa ${tarefa.id} processada com sucesso.`);
    }
}