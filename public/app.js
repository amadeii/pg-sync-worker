const btnAtualizar = document.getElementById('btnAtualizar');

const totalClientes = document.getElementById('totalClientes');
const totalCidades = document.getElementById('totalCidades');
const totalBairros = document.getElementById('totalBairros');
const statusApi = document.getElementById('statusApi');

const ultimaAtualizacao = document.getElementById('ultimaAtualizacao');

const tudoBody = document.getElementById('tudoBody');
const clientesBody = document.getElementById('clientesBody');
const cidadesBody = document.getElementById('cidadesBody');
const bairrosBody = document.getElementById('bairrosBody');

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar dados em: ${url}`);
    }

    return resposta.json();
}

function limparTexto(valor) {
    if (valor === null || valor === undefined || valor === '') {
        return '-';
    }

    return valor;
}

function renderizarTudo(clientes, cidades, bairros) {
    tudoBody.innerHTML = '';

    const linhas = [];

    clientes.forEach((cliente) => {
        linhas.push({
            tipo: 'Cliente',
            id: cliente.ID,
            nome: cliente.RAZAO,
            complemento: cliente.FANTASIA || cliente.CLASSIFICACAO
        });
    });

    cidades.forEach((cidade) => {
        linhas.push({
            tipo: 'Cidade',
            id: cidade.ID,
            nome: cidade.NOME || cidade.CIDADE || cidade.DESCRICAO,
            complemento: cidade.UF || cidade.ESTADO
        });
    });

    bairros.forEach((bairro) => {
        linhas.push({
            tipo: 'Bairro',
            id: bairro.ID,
            nome: bairro.NOME || bairro.BAIRRO || bairro.DESCRICAO,
            complemento: bairro.CIDADE || bairro.ID_CIDADE || bairro.CIDADE_ID
        });
    });

    if (linhas.length === 0) {
        tudoBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">Nenhum dado encontrado.</td>
            </tr>
        `;
        return;
    }

    linhas.forEach((item) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${limparTexto(item.tipo)}</td>
            <td>${limparTexto(item.id)}</td>
            <td>${limparTexto(item.nome)}</td>
            <td>${limparTexto(item.complemento)}</td>
        `;

        tudoBody.appendChild(linha);
    });
}

function renderizarClientes(clientes) {
    clientesBody.innerHTML = '';

    if (!clientes || clientes.length === 0) {
        clientesBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">Nenhum cliente encontrado.</td>
            </tr>
        `;
        return;
    }

    clientes.forEach((cliente) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${limparTexto(cliente.ID)}</td>
            <td>${limparTexto(cliente.RAZAO)}</td>
            <td>${limparTexto(cliente.FANTASIA)}</td>
            <td>${limparTexto(cliente.CLASSIFICACAO)}</td>
        `;

        clientesBody.appendChild(linha);
    });
}

function renderizarCidades(cidades) {
    cidadesBody.innerHTML = '';

    if (!cidades || cidades.length === 0) {
        cidadesBody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">Nenhuma cidade encontrada.</td>
            </tr>
        `;
        return;
    }

    cidades.forEach((cidade) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${limparTexto(cidade.ID)}</td>
            <td>${limparTexto(cidade.NOME || cidade.CIDADE || cidade.DESCRICAO)}</td>
            <td>${limparTexto(cidade.UF || cidade.ESTADO)}</td>
        `;

        cidadesBody.appendChild(linha);
    });
}

function renderizarBairros(bairros) {
    bairrosBody.innerHTML = '';

    if (!bairros || bairros.length === 0) {
        bairrosBody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">Nenhum bairro encontrado.</td>
            </tr>
        `;
        return;
    }

    bairros.forEach((bairro) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${limparTexto(bairro.ID)}</td>
            <td>${limparTexto(bairro.NOME || bairro.BAIRRO || bairro.DESCRICAO)}</td>
            <td>${limparTexto(bairro.CIDADE || bairro.ID_CIDADE || bairro.CIDADE_ID)}</td>
        `;

        bairrosBody.appendChild(linha);
    });
}

function mostrarCarregando() {
    tudoBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-message">Carregando dados...</td>
        </tr>
    `;

    clientesBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-message">Carregando clientes...</td>
        </tr>
    `;

    cidadesBody.innerHTML = `
        <tr>
            <td colspan="3" class="empty-message">Carregando cidades...</td>
        </tr>
    `;

    bairrosBody.innerHTML = `
        <tr>
            <td colspan="3" class="empty-message">Carregando bairros...</td>
        </tr>
    `;
}

function mostrarErro() {
    tudoBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-message">Erro ao carregar os dados do Firebird.</td>
        </tr>
    `;

    clientesBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-message">Erro ao carregar clientes.</td>
        </tr>
    `;

    cidadesBody.innerHTML = `
        <tr>
            <td colspan="3" class="empty-message">Erro ao carregar cidades.</td>
        </tr>
    `;

    bairrosBody.innerHTML = `
        <tr>
            <td colspan="3" class="empty-message">Erro ao carregar bairros.</td>
        </tr>
    `;
}

function atualizarHorario() {
    const agora = new Date().toLocaleString('pt-BR');
    ultimaAtualizacao.textContent = `Última atualização: ${agora}`;
}

async function carregarDashboard() {
    console.log('Carregando dashboard Firebird...');

    try {
        btnAtualizar.disabled = true;
        btnAtualizar.textContent = 'Atualizando...';
        statusApi.textContent = 'Carregando';

        mostrarCarregando();

        const [clientesResposta, cidadesResposta, bairrosResposta] = await Promise.all([
            buscarDados('/api/fdb/clientes'),
            buscarDados('/api/fdb/localizacao/cidades'),
            buscarDados('/api/fdb/localizacao/bairros')
        ]);

        const clientes = clientesResposta.data || [];
        const cidades = cidadesResposta.data || [];
        const bairros = bairrosResposta.data || [];

        totalClientes.textContent = clientesResposta.total || clientes.length;
        totalCidades.textContent = cidadesResposta.total || cidades.length;
        totalBairros.textContent = bairrosResposta.total || bairros.length;

        renderizarTudo(clientes, cidades, bairros);
        renderizarClientes(clientes);
        renderizarCidades(cidades);
        renderizarBairros(bairros);

        statusApi.textContent = 'Online';

        atualizarHorario();
    } catch (error) {
        console.error(error);

        statusApi.textContent = 'Erro';
        ultimaAtualizacao.textContent = 'Falha ao atualizar os dados.';

        mostrarErro();
    } finally {
        btnAtualizar.disabled = false;
        btnAtualizar.textContent = 'Atualizar dados';
    }
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const tabSelecionada = button.dataset.tab;

        tabButtons.forEach((btn) => {
            btn.classList.remove('active');
        });

        tabContents.forEach((content) => {
            content.classList.remove('active');
        });

        button.classList.add('active');

        const sectionSelecionada = document.getElementById(`tab-${tabSelecionada}`);

        if (sectionSelecionada) {
            sectionSelecionada.classList.add('active');
        }
    });
});

btnAtualizar.addEventListener('click', carregarDashboard);

carregarDashboard();