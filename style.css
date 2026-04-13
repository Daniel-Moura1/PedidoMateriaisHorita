/* VARIÁVEIS DE CORES - Estilo Corporativo */
:root {
    --primary: #2806e7;
    --primary-dark: #1e04b5;
    --success: #198754;
    --bg-body: #f4f7f6;
    --text-main: #333;
    --text-muted: #666;
    --white: #ffffff;
    --border: #dee2e6;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    --danger: #dc3545;
}

/* RESET E BASE */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-body);
    color: var(--text-main);
    line-height: 1.6;
    padding: 40px;
}

/* HEADER */
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--white);
    padding: 20px 30px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin-bottom: 30px;
}

.logo {
    max-width: 150px;
    height: auto;
}

h2 {
    color: var(--primary);
    font-size: 26px;
    font-weight: 700;
}

/* FILTROS E BUSCA */
.filtros-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    background: var(--white);
    padding: 20px 30px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
    align-items: flex-end;
}

.campo-grupo {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}

.campo-grupo label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
}

input, select {
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background: #fdfdfd;
    transition: all 0.2s ease;
}

input:focus, select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(40, 6, 231, 0.1);
}

/* RESULTADOS FLUTUANTES */
#resultados {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    background: var(--white);
    border: 1px solid #dcdcdc;
    border-radius: 10px;
    max-height: 260px;
    overflow-y: auto;
    z-index: 999;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    animation: fadeIn 0.12s ease-in-out;
    will-change: transform, opacity;
}

#resultados::-webkit-scrollbar {
    width: 6px;
}

#resultados::-webkit-scrollbar-thumb {
    background: #cfcfcf;
    border-radius: 10px;
}

/* ITEM */
.item {
    padding: 12px 14px;
    font-size: 13.5px;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer;
    transition: background 0.1s ease-out;
}

.item:hover {
    background: #f4f6ff;
    color: var(--primary);
    padding-left: 18px;
}

/* ITEM SELECIONADO POR TECLADO */
.item.ativo {
    background-color: var(--primary) !important;
    color: white !important;
    font-weight: bold;
    border-left: 6px solid var(--primary-dark);
    padding-left: 20px;
}

/* DESTAQUE DE BUSCA */
.highlight {
    background: #fff176;
    border-radius: 2px;
    padding: 0 1px;
}

/* TABELA DE MATERIAIS */
.tabela-container {
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--shadow);
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background-color: var(--primary);
    color: var(--white);
    text-align: left;
    padding: 15px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
}

td {
    padding: 10px 15px;
    border-bottom: 1px solid #f1f1f1;
}

tbody tr:nth-child(even) {
    background-color: #fafafa;
}

tbody tr:hover {
    background-color: #f6f8ff;
}

/* ANIMAÇÃO DE LINHA ADICIONADA */
@keyframes linhaEntrada {
    0%   { background-color: #70a7fa; }
    100% { background-color: transparent; }
}

tbody tr.linha-nova {
    animation: linhaEntrada 1.2s ease-out forwards;
}

/* ESTADO VAZIO DA TABELA */
.estado-vazio {
    text-align: center;
    padding: 50px 20px !important;
    color: var(--text-muted);
}

.estado-vazio-icone {
    font-size: 36px;
    margin-bottom: 12px;
}

.estado-vazio-titulo {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 6px;
    color: var(--text-main);
}

.estado-vazio-subtitulo {
    font-size: 13px;
}

/* INPUTS DENTRO DA TABELA */
td input {
    width: 100%;
    border: 1px solid #f0f0f0;
    background: #fdfdfd;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 14px;
    text-transform: uppercase;
    transition: 0.2s;
}

td input::placeholder {
    text-transform: none;
}

td input:hover {
    border-color: var(--border);
    background: var(--white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

td input:focus {
    background: var(--white);
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(40, 6, 231, 0.05);
    outline: none;
}

/* CAMPO QUANTIDADE (OBRIGATÓRIO) */
.input-qtd {
    font-weight: bold;
    color: var(--primary);
}

.input-qtd:placeholder-shown {
    background-color: #fff5f5 !important;
    border: 1px solid #ffcccc !important;
    border-bottom: 2px solid #ff4d4d !important;
}

/* DESCRIÇÃO MANUAL (OBRIGATÓRIA) */
td input[oninput*="descricao"]:placeholder-shown {
    background-color: #fff5f5 !important;
    border: 1px solid #ffcccc !important;
    border-bottom: 2px solid #ff4d4d !important;
}

/* Cor do texto na descrição manual */
td input[oninput*="descricao"] {
    font-weight: 600;
    color: #897cff;
}

/* BOTÃO DE EXCLUIR */
.btn-excluir {
    background: #fff;
    border: 1px solid #ffcccc;
    color: #dc3545;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.btn-excluir:hover {
    background: #fc959f;
    color: #fff;
    border-color: #dc3545;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

/* RODAPÉ DE AÇÕES */
.acoes-container {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
}

/* CONTADOR DE ITENS */
#contador-itens {
    margin-left: auto;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    white-space: nowrap;
}

/* TODOS OS BOTÕES DO RODAPÉ */
.acoes-container button {
    flex: 1;
    max-width: 220px;
    min-width: 130px;
    height: 45px;
    padding: 0 20px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    white-space: nowrap;
    border: 2px solid transparent;
}

/* BOTÃO EXPORTAR EXCEL */
.btn-excel {
    background-color: var(--success);
    color: var(--white);
    box-shadow: 0 4px 12px rgba(25, 135, 84, 0.2);
}

.btn-excel:hover {
    background-color: #146c43;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(25, 135, 84, 0.3);
}

/* BOTÃO PDF */
.btn-pdf {
    background-color: #e74c3c;
    color: var(--white);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
}

.btn-pdf:hover {
    background-color: #c0392b;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(231, 76, 60, 0.3);
}

/* BOTÃO E-MAIL */
.btn-email {
    background-color: var(--primary);
    color: var(--white);
    box-shadow: 0 4px 12px rgba(40, 6, 231, 0.2);
}

.btn-email:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(40, 6, 231, 0.3);
}

/* BOTÃO LIMPAR (Ajustado para ter presença visual) */
.btn-refresh {
    background-color: #f8f9fa; /* Fundo leve para dar corpo ao botão */
    color: #6c757d;
    border: 2px solid #dee2e6 !important; /* Borda definida para parecer um botão real */
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.1); /* Sombra suave para profundidade */
}

.btn-refresh:hover {
    background-color: #fff;
    color: #dc3545; /* Cor de perigo/limpar */
    border-color: #dc3545 !important;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(220, 53, 69, 0.15);
}

/* Feedback visual ao clicar */
.btn-refresh:active {
    transform: translateY(0);
    box-shadow: none;
}

/* BOTÃO ITEM MANUAL */
.btn-manual {
    background-color: var(--white);
    color: var(--primary);
    border: 2px solid var(--primary);
    padding: 10px 15px;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
    white-space: nowrap;
}

.btn-manual:hover {
    background-color: var(--primary);
    color: var(--white);
}

/* BADGE DE CÓDIGO */
.badge-codigo {
    font-size: 11px;
    background: #f0f0f0;
    padding: 3px 6px;
    border-radius: 4px;
    color: var(--text-muted);
    font-weight: bold;
    display: inline-block;
}

/* CAMPO APLICAÇÃO */
#aplicacao {
    text-transform: uppercase;
}

#aplicacao::placeholder {
    text-transform: none;
}

/* RESPONSIVIDADE */
@media (max-width: 900px) {
    body {
        padding: 20px;
    }

    .filtros-container {
        flex-direction: column;
        align-items: stretch;
    }

    .campo-grupo {
        width: 100%;
    }

    .campo-grupo input,
    .campo-grupo select {
        width: 100% !important;
    }

    .acoes-container {
        justify-content: stretch;
    }

    .acoes-container button {
        max-width: none;
    }

    #contador-itens {
        width: 100%;
        margin-left: 0;
        text-align: center;
    }

    th, td {
        font-size: 12px;
        padding: 8px 10px;
    }
}
/* ============================================================
   SUGESTÃO DE OUTRAS CATEGORIAS
   ============================================================ */

/* Cabeçalho explicativo */
.item-cabecalho-sugestao {
    padding: 10px 14px 6px;
    font-size: 11.5px;
    font-weight: 700;
    color: #f30505;
    background: #ffc9c9;
    border-bottom: 1px solid #fde8c0;
    cursor: default;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

/* Separador de categoria dentro das sugestões */
.item-separador-categoria {
    padding: 6px 14px 4px;
    font-size: 10.5px;
    font-weight: 700;
    color: var(--primary);
    background: #f4f6ff;
    border-top: 1px solid #e8ecff;
    border-bottom: 1px solid #e8ecff;
    cursor: default;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

/* Item de sugestão — visual levemente diferente do item normal */
.item.item-sugestao {
    padding-left: 20px;
    color: #444;
    background: #fdfeff;
}

.item.item-sugestao:hover {
    background: #eef2ff;
    color: var(--primary);
    padding-left: 24px;
}
