import { Router } from 'express';
import { consultarFirebird } from '../firebird.js';

const router = Router();

const tabelasPermitidasPreview = [
    'BAIRROS',
    'CIDADE',
    'CLIENTES',
    'EMPRESA',
    'ESTOQUE',
    'FORNECEDOR',
    'NOTA_FISCAL',
    'NOTA_PRODUTOS',
    'PEDIDO',
    'PEDIDO_DETALHE',
    'VENDEDOR',
];

router.get('/teste', async (req, res) => {
    try {
        const resultado = await consultarFirebird(`
      SELECT 1 AS TESTE
      FROM RDB$DATABASE
    `);

        res.json({
            success: true,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao consultar Firebird:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

router.get('/tabelas-clientes', async (req, res) => {
    try {
        const resultado = await consultarFirebird(`
      SELECT
        TRIM(RDB$RELATION_NAME) AS TABELA
      FROM RDB$RELATIONS
      WHERE RDB$SYSTEM_FLAG = 0
        AND UPPER(RDB$RELATION_NAME) LIKE '%CLIENT%'
      ORDER BY RDB$RELATION_NAME
    `);

        res.json({
            success: true,
            total: resultado.length,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao listar tabelas de clientes:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

router.get('/schema/:tabela', async (req, res) => {
    try {
        const tabela = req.params.tabela.toUpperCase();

        const resultado = await consultarFirebird(`
      SELECT
        TRIM(rf.RDB$FIELD_NAME) AS COLUNA,
        rf.RDB$FIELD_POSITION AS POSICAO
      FROM RDB$RELATION_FIELDS rf
      WHERE rf.RDB$RELATION_NAME = ?
      ORDER BY rf.RDB$FIELD_POSITION
    `, [tabela]);

        res.json({
            success: true,
            tabela,
            total: resultado.length,
            colunas: resultado.map((item) => item.COLUNA),
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao buscar schema:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

router.get('/preview/:tabela', async (req, res) => {
    try {
        const tabela = req.params.tabela.toUpperCase();

        if (!tabelasPermitidasPreview.includes(tabela)) {
            return res.status(400).json({
                success: false,
                error: 'Tabela não permitida para preview.',
            });
        }

        const resultado = await consultarFirebird(`
      SELECT FIRST 20 *
      FROM ${tabela}
    `);

        res.json({
            success: true,
            tabela,
            total: resultado.length,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao buscar preview:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

router.get('/views', async (req, res) => {
    try {
        const resultado = await consultarFirebird(`
      SELECT
        TRIM(RDB$RELATION_NAME) AS VIEW_NAME
      FROM RDB$RELATIONS
      WHERE RDB$VIEW_BLR IS NOT NULL
        AND RDB$SYSTEM_FLAG = 0
      ORDER BY RDB$RELATION_NAME
    `);

        res.json({
            success: true,
            total: resultado.length,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao listar views:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

router.get('/views/buscar/:termo', async (req, res) => {
    try {
        const termo = req.params.termo.toUpperCase();

        const resultado = await consultarFirebird(`
      SELECT
        TRIM(RDB$RELATION_NAME) AS VIEW_NAME
      FROM RDB$RELATIONS
      WHERE RDB$VIEW_BLR IS NOT NULL
        AND RDB$SYSTEM_FLAG = 0
        AND UPPER(RDB$RELATION_NAME) LIKE ?
      ORDER BY RDB$RELATION_NAME
    `, [`%${termo}%`]);

        res.json({
            success: true,
            termo,
            total: resultado.length,
            data: resultado,
        });
    } catch (error) {
        console.error('Erro ao buscar views:', error.message);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;