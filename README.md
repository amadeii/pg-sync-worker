# pg-sync-worker

Worker desenvolvido em Node.js para executar tarefas automáticas em intervalos definidos, com foco na leitura e processamento de dados armazenados em um banco PostgreSQL.

## Objetivo

O objetivo deste projeto é criar uma aplicação que rode em segundo plano, consulte dados no PostgreSQL periodicamente e execute uma rotina de processamento sobre esses dados.

Esse tipo de aplicação é conhecido como **worker**, pois não depende de uma interface visual e trabalha de forma automática.

## Tecnologias utilizadas

* Node.js
* PostgreSQL
* pg
* dotenv
* node-cron

## O que este projeto faz

Atualmente, o projeto possui uma estrutura inicial de worker com agendamento automático.

A aplicação é capaz de:

* iniciar pelo terminal usando `npm start`;
* executar uma tarefa automaticamente em intervalos definidos;
* separar a lógica principal em arquivos organizados;
* preparar a base para futura conexão com PostgreSQL.

## Estrutura do projeto

```txt
pg-sync-worker/
├── src/
│   ├── database.js
│   ├── index.js
│   └── job.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

## Explicação dos principais arquivos

### src/index.js

Arquivo principal da aplicação.
Responsável por iniciar o worker e agendar a execução automática da tarefa usando `node-cron`.

### src/job.js

Arquivo onde fica a lógica da tarefa executada pelo worker.
É aqui que futuramente ficará o processamento dos dados lidos do PostgreSQL.

### src/database.js

Arquivo reservado para configurar a conexão com o banco PostgreSQL.

### .env

Arquivo usado para armazenar configurações sensíveis, como dados de conexão com o banco.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=postgres
DB_PASSWORD=sua_senha
```

> O arquivo `.env` não deve ser enviado para o GitHub.

### .gitignore

Arquivo usado para definir quais arquivos e pastas o Git deve ignorar.

Exemplo:

```txt
node_modules
.env
```

## Como instalar as dependências

```bash
npm install
```

## Como rodar o projeto

```bash
npm start
```

## Dependências principais

### pg

Biblioteca usada para conectar o Node.js ao PostgreSQL.

### dotenv

Biblioteca usada para carregar variáveis de ambiente a partir do arquivo `.env`.

### node-cron

Biblioteca usada para agendar tarefas automáticas em intervalos definidos.

## Status do projeto

Projeto em desenvolvimento.

Etapas já realizadas:

* estrutura inicial criada;
* dependências instaladas;
* worker iniciado com sucesso;
* agendamento automático funcionando com `node-cron`.

Próximas etapas:

* configurar conexão com PostgreSQL;
* criar tabela de teste;
* buscar registros pendentes;
* processar dados;
* atualizar status dos registros no banco.
