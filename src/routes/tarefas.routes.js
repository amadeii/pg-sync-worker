import { Router } from 'express';
import { pool } from '../database.js';
import { logError } from '../logger.js';
import { listarSyncHistory } from '../services/sync-history.service.js';

const router = Router();

router.get('/tarefas', async (req, res) => {
    try {
        const resultado = await pool.query(`
      SELECT 
        id,
        descricao,
        status,
        tentativas,
        erro,
        criado_em,
        processado_em
      FROM tarefas
      ORDER BY id ASC
      LIMIT 100
    `);

        res.json(resultado.rows);
    } catch (error) {
        logError('Erro ao buscar tarefas', error);

        res.status(500).json({
            success: false,
            error: 'Erro ao buscar tarefas',
            details: error.message,
        });
    }
});

router.get('/resumo', async (req, res) => {
    try {
        const resultado = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'pendente') AS pendentes,
        COUNT(*) FILTER (WHERE status = 'processando') AS processando,
        COUNT(*) FILTER (WHERE status = 'processado') AS processadas,
        COUNT(*) FILTER (WHERE status = 'erro') AS erros
      FROM tarefas
    `);

        res.json(resultado.rows[0]);
    } catch (error) {
        logError('Erro ao buscar resumo', error);

        res.status(500).json({
            success: false,
            error: 'Erro ao buscar resumo',
            details: error.message,
        });
    }
});

router.get('/sync-history', async (req, res) => {
    try {
        const registros = await listarSyncHistory({
            limit: req.query.limit,
        });

        res.json({
            success: true,
            total: registros.length,
            data: registros,
        });
    } catch (error) {
        logError('Erro ao buscar histórico de sincronizações', error);

        res.status(500).json({
            success: false,
            error: 'Erro ao buscar histórico de sincronizações',
            details: error.message,
        });
    }
});

export default router;
