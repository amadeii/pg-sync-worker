const totalEl = document.getElementById('total');
const pendentesEl = document.getElementById('pendentes');
const processandoEl = document.getElementById('processando');
const processadasEl = document.getElementById('processadas');
const errosEl = document.getElementById('erros');

const tarefasBody = document.getElementById('tarefasBody');
const btnAtualizar = document.getElementById('btnAtualizar');
const ultimaAtualizacao = document.getElementById('ultimaAtualizacao');

async function buscarResumo() {
    const resposta = await fetch('/api/resumo');

    if (!resposta.ok) {
        throw new Error('Erro ao buscar resumo');
    }

    return resposta.json();
}

async function buscarTarefas() {
    const resposta = await fetch('/api/tarefas');

    if (!resposta.ok) {
        throw new Error('Erro ao buscar tarefas');
    }

    return resposta.json();
}

function atualizarCards(resumo) {
    totalEl.textContent = resumo.total ?? 0;
    pendentesEl.textContent = resumo.pendentes ?? 0;
    processandoEl.textContent = resumo.processando ?? 0;
    processadasEl.textContent = resumo.processadas ?? 0;
    errosEl.textContent = resumo.erros ?? 0;
}

function formatarData(data) {
    if (!data) {
        return '-';
    }

    return new Date(data).toLocaleString('pt-BR');
}

function criarStatusClasse(status) {
    const statusSeguro = status || 'pendente';
    return `status status-${statusSeguro}`;
}

function atualizarTabela(tarefas) {
    tarefasBody.innerHTML = '';

    if (!tarefas.length) {
        tarefasBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-message">Nenhuma tarefa encontrada.</td>
      </tr>
    `;

        return;
    }

    tarefas.forEach((tarefa) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
      <td>${tarefa.id}</td>
      <td>${tarefa.descricao}</td>
      <td>
        <span class="${criarStatusClasse(tarefa.status)}">
          ${tarefa.status}
        </span>
      </td>
      <td>${tarefa.tentativas}</td>
      <td>${formatarData(tarefa.criado_em)}</td>
      <td>${formatarData(tarefa.processado_em)}</td>
    `;

        tarefasBody.appendChild(linha);
    });
}

function atualizarHorario() {
    const agora = new Date().toLocaleString('pt-BR');
    ultimaAtualizacao.textContent = `Última atualização: ${agora}`;
}

async function carregarDashboard() {
    console.log('Carregando dashboard...');
    try {
        btnAtualizar.disabled = true;
        btnAtualizar.textContent = 'Atualizando...';

        const [resumo, tarefas] = await Promise.all([
            buscarResumo(),
            buscarTarefas(),
        ]);

        atualizarCards(resumo);
        atualizarTabela(tarefas);
        atualizarHorario();
    } catch (error) {
        console.error(error);

        tarefasBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-message">
          Erro ao carregar dados da automação.
        </td>
      </tr>
    `;
    } finally {
        btnAtualizar.disabled = false;
        btnAtualizar.textContent = 'Atualizar dados';
    }
}

btnAtualizar.addEventListener('click', carregarDashboard);

carregarDashboard();