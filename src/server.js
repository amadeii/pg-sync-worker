import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './database.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/tarefas', async (req, res) => {
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
    `);

        res.json(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error.message);

        res.status(500).json({
            error: 'Erro ao buscar tarefas',
        });
    }
});

app.get('/api/resumo', async (req, res) => {
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
        console.error('Erro ao buscar resumo:', error.message);

        res.status(500).json({
            error: 'Erro ao buscar resumo',
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});