import { consultarFirebird } from '../firebird.js';

// ===============================
// CONTAS A RECEBER
// ===============================

export async function listarContasReceberDuplicatas() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CRCDUPLICATA
    `);
}

export async function listarContasReceberBoletosAnexos() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CRCDUPLICATA_BOLETO_ANEXO
    `);
}

export async function listarContasReceberBoletosEmail() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CRCDUPLICATA_BOLETO_EMAIL
    `);
}

export async function listarContasReceberBoletosFatura() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CRCDUPLICATA_BOLETO_FATURA
    `);
}

export async function listarContasReceberCartoes() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CRCDUPLICATA_CARTAO
    `);
}

export async function listarContasReceberDuplicatasParciais() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CRCDUPLICATA_PARCIAL
    `);
}

export async function listarContasReceberTiposDocumento() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CRCTIPO_DOCUMENTO
    `);
}

// ===============================
// CONTAS A PAGAR
// ===============================

export async function listarContasPagarConferencias() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CPG_CONFERENCIA
    `);
}

export async function listarContasPagarConferenciasItens() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CPG_CONFERENCIA_ITEM
    `);
}

export async function listarContasPagarDivergenciasFiscais() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CPG_DIVERGENCIA_FISCAL
    `);
}

export async function listarContasPagarDuplicatas() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CPGDUPLICATA
    `);
}

export async function listarContasPagarDuplicatasParciais() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CPGDUPLICATA_PARCIAL
    `);
}

export async function listarContasPagarItens() {
    return consultarFirebird(`
        SELECT FIRST 50 *
        FROM CPGITEM
    `);
}

export async function listarContasPagarNotas() {
    return consultarFirebird(`
        SELECT *
        FROM CPGNOTA
    `);
}