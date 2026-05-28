import { consultarFirebird } from './firebird.js';

async function testarConexaoFirebird() {
    try {
        console.log('Testando conexão com Firebird...');

        const resultado = await consultarFirebird(`
      SELECT 1 AS TESTE
      FROM RDB$DATABASE
    `);

        console.log('Conexão com Firebird funcionando!');
        console.log(resultado);
    } catch (error) {
        console.error('Erro ao conectar no Firebird:', error.message);
    }
}

testarConexaoFirebird();