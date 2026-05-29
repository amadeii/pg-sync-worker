const btnAtualizar = document.getElementById('btnAtualizar');
const btnTema = document.getElementById('btnTema');

const grupoAtual = document.getElementById('grupoAtual');
const datasetAtual = document.getElementById('datasetAtual');
const totalRegistros = document.getElementById('totalRegistros');
const statusApi = document.getElementById('statusApi');

const tituloTabela = document.getElementById('tituloTabela');
const subtituloTabela = document.getElementById('subtituloTabela');
const ultimaAtualizacao = document.getElementById('ultimaAtualizacao');

const tabelaHead = document.getElementById('tabelaHead');
const tabelaBody = document.getElementById('tabelaBody');

const workerTotal = document.getElementById('workerTotal');
const workerPendentes = document.getElementById('workerPendentes');
const workerProcessando = document.getElementById('workerProcessando');
const workerProcessadas = document.getElementById('workerProcessadas');
const workerErros = document.getElementById('workerErros');

const groupButtons = document.querySelectorAll('.group-button');
const datasetPanels = document.querySelectorAll('.dataset-panel');
const datasetButtons = document.querySelectorAll('.dataset-button');

let datasetSelecionado = document.querySelector('.dataset-button.active');

async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status} ao buscar dados.`);
    }

    const json = await resposta.json();

    if (!json || json.success !== true || !Array.isArray(json.data)) {
        throw new Error('A API não retornou o JSON no padrão esperado.');
    }

    return json;
}

async function carregarResumoWorker() {
    try {
        const resposta = await fetch('/api/resumo');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar resumo do worker.');
        }

        const resumo = await resposta.json();

        workerTotal.textContent = resumo.total ?? 0;
        workerPendentes.textContent = resumo.pendentes ?? 0;
        workerProcessando.textContent = resumo.processando ?? 0;
        workerProcessadas.textContent = resumo.processadas ?? 0;
        workerErros.textContent = resumo.erros ?? 0;
    } catch (error) {
        console.error('Erro no resumo do worker:', error);

        workerTotal.textContent = '-';
        workerPendentes.textContent = '-';
        workerProcessando.textContent = '-';
        workerProcessadas.textContent = '-';
        workerErros.textContent = '-';
    }
}

function limparTexto(valor) {
    if (valor === null || valor === undefined || valor === '') {
        return '-';
    }

    if (typeof valor === 'object') {
        return JSON.stringify(valor);
    }

    return valor;
}

function formatarNomeColuna(coluna) {
    return coluna
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function atualizarHorario() {
    const agora = new Date().toLocaleString('pt-BR');
    ultimaAtualizacao.textContent = `Última atualização: ${agora}`;
}

function mostrarCarregando() {
    tabelaHead.innerHTML = `
        <tr>
            <th>Carregando</th>
        </tr>
    `;

    tabelaBody.innerHTML = `
        <tr>
            <td class="empty-message">Buscando dados no Firebird...</td>
        </tr>
    `;
}

function mostrarErro(mensagem) {
    tabelaHead.innerHTML = `
        <tr>
            <th>Erro</th>
        </tr>
    `;

    tabelaBody.innerHTML = `
        <tr>
            <td class="empty-message">${mensagem}</td>
        </tr>
    `;
}

function renderizarTabelaGenerica(registros) {
    tabelaHead.innerHTML = '';
    tabelaBody.innerHTML = '';

    if (!registros || registros.length === 0) {
        tabelaHead.innerHTML = `
            <tr>
                <th>Sem dados</th>
            </tr>
        `;

        tabelaBody.innerHTML = `
            <tr>
                <td class="empty-message">Nenhum registro encontrado.</td>
            </tr>
        `;

        return;
    }

    const colunas = Object.keys(registros[0]);
    const linhaCabecalho = document.createElement('tr');

    colunas.forEach((coluna) => {
        const th = document.createElement('th');
        th.textContent = formatarNomeColuna(coluna);
        linhaCabecalho.appendChild(th);
    });

    tabelaHead.appendChild(linhaCabecalho);

    registros.forEach((registro) => {
        const linha = document.createElement('tr');

        colunas.forEach((coluna) => {
            const td = document.createElement('td');
            td.textContent = limparTexto(registro[coluna]);
            linha.appendChild(td);
        });

        tabelaBody.appendChild(linha);
    });
}

function atualizarCards({ grupo, dataset, total, status }) {
    grupoAtual.textContent = grupo;
    datasetAtual.textContent = dataset;
    totalRegistros.textContent = total;
    statusApi.textContent = status;
}

async function carregarDataset(button) {
    if (!button) {
        return;
    }

    const url = button.dataset.url;
    const titulo = button.dataset.title;
    const grupo = button.dataset.groupName;

    datasetSelecionado = button;

    try {
        btnAtualizar.disabled = true;
        btnAtualizar.textContent = 'Atualizando...';

        tituloTabela.textContent = titulo;
        subtituloTabela.textContent = '';

        atualizarCards({
            grupo,
            dataset: titulo,
            total: 0,
            status: 'Carregando',
        });

        mostrarCarregando();

        const resposta = await buscarDados(url);
        const registros = resposta.data || [];

        renderizarTabelaGenerica(registros);

        atualizarCards({
            grupo,
            dataset: titulo,
            total: resposta.total ?? registros.length,
            status: 'Online',
        });

        atualizarHorario();
    } catch (error) {
        console.error(error);

        atualizarCards({
            grupo,
            dataset: titulo,
            total: 0,
            status: 'Erro',
        });

        mostrarErro(error.message);
        ultimaAtualizacao.textContent = 'Falha ao atualizar os dados.';
    } finally {
        btnAtualizar.disabled = false;
        btnAtualizar.textContent = 'Atualizar dados';
    }
}

function ativarDataset(button) {
    datasetButtons.forEach((item) => {
        item.classList.remove('active');
    });

    button.classList.add('active');
}

function ativarGrupo(groupId) {
    groupButtons.forEach((button) => {
        button.classList.remove('active');
    });

    datasetPanels.forEach((panel) => {
        panel.classList.remove('active');
    });

    const groupButton = document.querySelector(`[data-group="${groupId}"]`);
    const groupPanel = document.getElementById(`group-${groupId}`);

    if (groupButton) {
        groupButton.classList.add('active');
    }

    if (groupPanel) {
        groupPanel.classList.add('active');

        const primeiroDatasetDoGrupo = groupPanel.querySelector('.dataset-button');

        if (primeiroDatasetDoGrupo) {
            ativarDataset(primeiroDatasetDoGrupo);
            carregarDataset(primeiroDatasetDoGrupo);
        }
    }
}

function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem('tema-dashboard');

    if (temaSalvo === 'escuro') {
        document.body.classList.add('dark-mode');
        btnTema.textContent = '☀️ Modo claro';
    } else {
        document.body.classList.remove('dark-mode');
        btnTema.textContent = '🌙 Modo escuro';
    }
}

function alternarTema() {
    const modoEscuroAtivo = document.body.classList.toggle('dark-mode');

    if (modoEscuroAtivo) {
        localStorage.setItem('tema-dashboard', 'escuro');
        btnTema.textContent = '☀️ Modo claro';
    } else {
        localStorage.setItem('tema-dashboard', 'claro');
        btnTema.textContent = '🌙 Modo escuro';
    }
}

btnTema.addEventListener('click', alternarTema);

groupButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const groupId = button.dataset.group;
        ativarGrupo(groupId);
    });
});

datasetButtons.forEach((button) => {
    button.addEventListener('click', () => {
        ativarDataset(button);
        carregarDataset(button);
    });
});

btnAtualizar.addEventListener('click', () => {
    carregarDataset(datasetSelecionado);
    carregarResumoWorker();
});

aplicarTemaSalvo();

carregarDataset(datasetSelecionado);
carregarResumoWorker();