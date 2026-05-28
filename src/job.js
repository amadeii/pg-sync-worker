export async function executarJob() {
    const agora = new Date().toLocaleString('pt-BR');

    console.log(`[${agora}] Job executado com sucesso.`);
}