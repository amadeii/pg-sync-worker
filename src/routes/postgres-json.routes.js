const express = require('express');

const {
    limparTabelaJsonRaw,
    salvarJsonRaw,
    listarJsonRaw,
    contarJsonRaw,
} = require('../services/postgres-json.service');

const router = express.Router();

router.post('/:tabelaOrigem/salvar-json', async (req, res) => {
    try {
        const { tabelaOrigem } = req.params;
        const dados = req.body;

        console.log(`Recebendo JSON para salvar no PostgreSQL: ${tabelaOrigem}`);

        await limparTabelaJsonRaw(tabelaOrigem);

        const resultado = await salvarJsonRaw(tabelaOrigem, dados);

        res.json({
            mensagem: 'JSON salvo no PostgreSQL com sucesso',
            tabela_origem: tabelaOrigem,
            tipo_coluna_dados: 'JSON',
            total_inserido: resultado.inseridos,
        });
    } catch (error) {
        console.error('Erro ao salvar JSON no PostgreSQL:', error);

        res.status(500).json({
            erro: 'Erro ao salvar JSON no PostgreSQL',
            detalhes: error.message,
        });
    }
});

router.get('/:tabelaOrigem/resumo', async (req, res) => {
    try {
        const { tabelaOrigem } = req.params;

        const resumo = await contarJsonRaw(tabelaOrigem);

        res.json({
            tabela_origem: tabelaOrigem,
            total: resumo.total,
        });
    } catch (error) {
        console.error('Erro ao contar JSON no PostgreSQL:', error);

        res.status(500).json({
            erro: 'Erro ao contar JSON no PostgreSQL',
            detalhes: error.message,
        });
    }
});

router.get('/:tabelaOrigem', async (req, res) => {
    try {
        const { tabelaOrigem } = req.params;

        const limit = Number(req.query.limit) || 50;
        const offset = Number(req.query.offset) || 0;

        const dados = await listarJsonRaw({
            tabelaOrigem,
            limit,
            offset,
        });

        res.json({
            tabela_origem: tabelaOrigem,
            limit,
            offset,
            total_retornado: dados.length,
            dados,
        });
    } catch (error) {
        console.error('Erro ao listar JSON do PostgreSQL:', error);

        res.status(500).json({
            erro: 'Erro ao listar JSON do PostgreSQL',
            detalhes: error.message,
        });
    }
});

module.exports = router;