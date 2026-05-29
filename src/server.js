import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import tarefasRoutes from './routes/tarefas.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import localizacaoRoutes from './routes/localizacao.routes.js';
import diagnosticoRoutes from './routes/diagnostico.routes.js';
import dadosRoutes from './routes/dados.routes.js';
import financeiroRoutes from './routes/financeiro.routes.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', tarefasRoutes);
app.use('/api/fdb/clientes', clientesRoutes);
app.use('/api/fdb/localizacao', localizacaoRoutes);
app.use('/api/fdb/diagnostico', diagnosticoRoutes);
app.use('/api/fdb/dados', dadosRoutes);
app.use('/api/fdb/financeiro', financeiroRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});