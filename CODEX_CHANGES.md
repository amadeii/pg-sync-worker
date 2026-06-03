# CODEX_CHANGES

## 2026-06-03 13:40:52 -03:00

### Arquivos criados

- `src/services/json-raw-to-structured.service.js`
- `CODEX_CHANGES.md`

### Arquivos alterados

- `src/routes/postgres-json.routes.js`

### Rotas criadas

- `POST /api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado`

### Services criados

- `src/services/json-raw-to-structured.service.js`

### Funcoes criadas

- `transformarJsonRawParaTabelaEstruturada(tabelaOrigem, nomeTabelaDestino)`

### Como testar

1. Validar sintaxe:

```powershell
node --check src\services\json-raw-to-structured.service.js
node --check src\routes\postgres-json.routes.js
```

2. Subir servidor:

```powershell
npm run server
```

3. Executar sincronizacao financeira estruturada:

```powershell
curl -X POST http://localhost:3000/api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado
```

### Exemplos de URLs

- `POST http://localhost:3000/api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado`

### Comandos PowerShell

```powershell
node --check src\services\json-raw-to-structured.service.js
node --check src\routes\postgres-json.routes.js
npm run server
curl -X POST http://localhost:3000/api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado
```

### Proximos passos

- Decidir se a tabela raw deve ser limpa antes de cada sincronizacao estruturada.
- Decidir se a tabela estruturada deve ser truncada antes de inserir novamente.
- Trocar insercao linha a linha por insercao em lote para tabelas grandes.
- Remover o `SELECT FIRST 100` de `listarContasReceberDuplicatas()` quando a sincronizacao deixar de ser apenas teste.

## 2026-06-03 14:17:05 -03:00

### Arquivos criados

- Nenhum.

### Arquivos alterados

- `src/routes/postgres-json.routes.js`
- `CODEX_CHANGES.md`

### Rotas criadas

- Nenhuma rota nova nesta alteracao. A rota existente foi ajustada:
  - `POST /api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado`

### Services criados

- Nenhum.

### Funcoes criadas

- Nenhuma.

### Como testar

1. Validar sintaxe:

```powershell
node --check src\routes\postgres-json.routes.js
```

2. Subir servidor:

```powershell
npm run server
```

3. Executar sincronizacao financeira estruturada:

```powershell
curl -X POST http://localhost:3000/api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado
```

### Exemplos de URLs

- `POST http://localhost:3000/api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado`

### Comandos PowerShell

```powershell
node --check src\routes\postgres-json.routes.js
npm run server
curl -X POST http://localhost:3000/api/postgres-json/financeiro/contas-receber/duplicatas/sincronizar-estruturado
```

### Proximos passos

- Validar se a tabela estruturada precisa ser limpa antes da transformacao para evitar duplicidade.
- Avaliar remocao do `SELECT FIRST 100` em `src/services/financeiro.service.js` quando a sincronizacao sair do modo de teste.
- Melhorar a transformacao para inserir em lote.
