import { Router } from 'express';
import { listarClientes } from '../services/clientes.service.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const resultado = await listarClientes();

        res.json({
            success: true,
            total: resultado.length,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao listar clientes:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;