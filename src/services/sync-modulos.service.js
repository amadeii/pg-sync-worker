import { logError, logSync } from '../logger.js';
import { listarTodosClientes } from './clientes.service.js';
import {
    listarTodasCidades,
    listarTodosBairros,
} from './localizacao.service.js';
import {
    listarTodasEmpresas,
    listarTodosEstoques,
    listarTodosFornecedores,
    listarTodasNotasFiscais,
    listarTodosNotaProdutos,
    listarTodosPedidos,
    listarTodosPedidoDetalhes,
    listarTodosVendedores,
} from './dados.service.js';
import { sincronizarFinanceiroContasReceberDuplicatas } from './financeiro-contas-receber-sync.service.js';
import { sincronizarEtapasFirebird } from './firebird-full-sync.service.js';

const etapaClientes = {
    nome: 'clientes',
    listarDados: listarTodosClientes,
    origemRaw: 'clientes',
    tabelaDestino: 'clientes',
};

const etapaCidades = {
    nome: 'cidades',
    listarDados: listarTodasCidades,
    origemRaw: 'localizacao_cidades',
    tabelaDestino: 'localizacao_cidades',
};

const etapaBairros = {
    nome: 'bairros',
    listarDados: listarTodosBairros,
    origemRaw: 'localizacao_bairros',
    tabelaDestino: 'localizacao_bairros',
};

const etapaEmpresa = {
    nome: 'empresa',
    listarDados: listarTodasEmpresas,
    origemRaw: 'dados_empresa',
    tabelaDestino: 'dados_empresa',
};

const etapaFornecedores = {
    nome: 'fornecedores',
    listarDados: listarTodosFornecedores,
    origemRaw: 'dados_fornecedores',
    tabelaDestino: 'dados_fornecedores',
};

const etapaVendedores = {
    nome: 'vendedores',
    listarDados: listarTodosVendedores,
    origemRaw: 'dados_vendedores',
    tabelaDestino: 'dados_vendedores',
};

const etapaEstoque = {
    nome: 'estoque',
    listarDados: listarTodosEstoques,
    origemRaw: 'estoque',
    tabelaDestino: 'estoque',
};

const etapaPedidos = {
    nome: 'pedidos',
    listarDados: listarTodosPedidos,
    origemRaw: 'vendas_pedidos',
    tabelaDestino: 'vendas_pedidos',
};

const etapaPedidosDetalhes = {
    nome: 'pedidos_detalhes',
    listarDados: listarTodosPedidoDetalhes,
    origemRaw: 'vendas_pedidos_detalhes',
    tabelaDestino: 'vendas_pedidos_detalhes',
};

const etapaNotasFiscais = {
    nome: 'notas_fiscais',
    listarDados: listarTodasNotasFiscais,
    origemRaw: 'vendas_notas_fiscais',
    tabelaDestino: 'vendas_notas_fiscais',
};

const etapaNotasProdutos = {
    nome: 'notas_produtos',
    listarDados: listarTodosNotaProdutos,
    origemRaw: 'vendas_notas_produtos',
    tabelaDestino: 'vendas_notas_produtos',
};

function criarResultadoModulo(modulo, etapas) {
    const erros = etapas
        .filter((etapa) => !etapa.sucesso)
        .map((etapa) => ({
            nome: etapa.nome,
            etapa: etapa.etapa,
            origem_raw: etapa.origem_raw,
            tabela_destino: etapa.tabela_destino,
            erro: etapa.erro,
        }));

    return {
        sucesso: erros.length === 0,
        modulo,
        etapas,
        erros,
    };
}

async function executarModulos({ modulo, modulos }) {
    const etapas = [];
    const erros = [];

    for (const item of modulos) {
        try {
            logSync(`Sincronizando modulo ${item.nome}`);

            const resultado = await item.executar();

            etapas.push({
                nome: item.nome,
                sucesso: resultado.sucesso,
                etapas: resultado.etapas,
            });

            if (!resultado.sucesso) {
                erros.push({
                    nome: item.nome,
                    erros: resultado.erros,
                });
            }
        } catch (error) {
            logError(`Erro inesperado ao sincronizar modulo ${item.nome}`, error);

            etapas.push({
                nome: item.nome,
                sucesso: false,
                etapas: [],
            });

            erros.push({
                nome: item.nome,
                erro: error.message,
            });
        }
    }

    return {
        sucesso: erros.length === 0,
        modulo,
        etapas,
        erros,
    };
}

export async function sincronizarModuloClientes() {
    return sincronizarEtapasFirebird({
        modulo: 'clientes',
        etapas: [etapaClientes],
    });
}

export async function sincronizarModuloLocalizacao() {
    return sincronizarEtapasFirebird({
        modulo: 'localizacao',
        etapas: [etapaCidades, etapaBairros],
    });
}

export async function sincronizarDadosEmpresa() {
    return sincronizarEtapasFirebird({
        modulo: 'dados_empresa',
        etapas: [etapaEmpresa],
    });
}

export async function sincronizarDadosFornecedores() {
    return sincronizarEtapasFirebird({
        modulo: 'fornecedores',
        etapas: [etapaFornecedores],
    });
}

export async function sincronizarDadosVendedores() {
    return sincronizarEtapasFirebird({
        modulo: 'vendedores',
        etapas: [etapaVendedores],
    });
}

export async function sincronizarModuloDados() {
    return sincronizarEtapasFirebird({
        modulo: 'dados',
        etapas: [etapaEmpresa, etapaFornecedores, etapaVendedores],
    });
}

export async function sincronizarModuloEstoque() {
    return sincronizarEtapasFirebird({
        modulo: 'estoque',
        etapas: [etapaEstoque],
    });
}

export async function sincronizarModuloVendas() {
    return sincronizarEtapasFirebird({
        modulo: 'vendas',
        etapas: [
            etapaPedidos,
            etapaPedidosDetalhes,
            etapaNotasFiscais,
            etapaNotasProdutos,
        ],
    });
}

export async function sincronizarModuloFinanceiroContasReceber() {
    try {
        const resultado = await sincronizarFinanceiroContasReceberDuplicatas();

        return criarResultadoModulo('financeiro_contas_receber', [
            {
                nome: 'duplicatas',
                sucesso: true,
                total: resultado.totalEstruturado,
                origem_raw: resultado.origem,
                tabela_destino: resultado.destino,
                total_firebird: resultado.totalFirebird,
                total_raw_salvo: resultado.totalRawSalvo,
            },
        ]);
    } catch (error) {
        logError('Erro ao sincronizar financeiro contas a receber', error, {
            etapa: error.etapa,
            tabela: error.tabela,
        });

        return criarResultadoModulo('financeiro_contas_receber', [
            {
                nome: 'duplicatas',
                sucesso: false,
                total: 0,
                origem_raw: 'financeiro_contas_receber_duplicatas',
                tabela_destino: 'financeiro_contas_receber_duplicatas',
                etapa: error.etapa,
                erro: error.message,
            },
        ]);
    }
}

export async function sincronizarModuloFinanceiro() {
    const resultadoContasReceber =
        await sincronizarModuloFinanceiroContasReceber();

    const etapas = [
        {
            nome: 'contas_receber',
            sucesso: resultadoContasReceber.sucesso,
            etapas: resultadoContasReceber.etapas,
        },
    ];

    const erros = resultadoContasReceber.sucesso
        ? []
        : [
              {
                  nome: 'contas_receber',
                  erros: resultadoContasReceber.erros,
              },
          ];

    return {
        sucesso: erros.length === 0,
        modulo: 'financeiro',
        etapas,
        erros,
    };
}

export async function sincronizarFluxoCompleto() {
    return executarModulos({
        modulo: 'sync',
        modulos: [
            {
                nome: 'localizacao',
                executar: sincronizarModuloLocalizacao,
            },
            {
                nome: 'clientes',
                executar: sincronizarModuloClientes,
            },
            {
                nome: 'dados_empresa',
                executar: sincronizarDadosEmpresa,
            },
            {
                nome: 'fornecedores',
                executar: sincronizarDadosFornecedores,
            },
            {
                nome: 'vendedores',
                executar: sincronizarDadosVendedores,
            },
            {
                nome: 'estoque',
                executar: sincronizarModuloEstoque,
            },
            {
                nome: 'financeiro',
                executar: sincronizarModuloFinanceiro,
            },
            {
                nome: 'vendas',
                executar: sincronizarModuloVendas,
            },
        ],
    });
}
