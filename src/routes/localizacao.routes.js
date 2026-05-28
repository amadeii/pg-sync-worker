import { Router } from 'express';
import {
    listarCidades,
    listarBairros,
} from '../services/localizacao.service.js';

const router = Router();

router.get('/cidades', async (req, res) => {
    try {
        const resultado = await listarCidades();

        res.json({
            success: true,
            total: resultado.length,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao listar cidades:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

router.get('/bairros', async (req, res) => {
    try {
        const resultado = await listarBairros();

        res.json({
            success: true,
            total: resultado.length,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao listar bairros:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;