// ============================================================
//  VARIÁVEIS GLOBAIS
// ============================================================
let produtosFiltrados = [];
let lista = [];
let indexSelecionado = -1;
let timeoutBusca;

// ============================================================
//  MAPA DE CATEGORIAS (mesmo valor do <select> do HTML)
// ============================================================
const CATEGORIAS = {
    "ferramenta_manual": "Ferramentas Manuais",
    "construcao":        "Mats. Construção",
    "eletrico":          "Mats. Elétricos",
    "equipamentos":      "Mats. Equipamentos",
    "ferragem":          "Mats. Ferragens",
    "hidraulico":        "Mats. Hidráulicos",
    "jardinagem":        "Mats. Jardinagens",
    "pintura":           "Mats. Pinturas",
    "pecas_acessorios":  "Mats. Uso na Oficina"
};

// ============================================================
//  PERSISTÊNCIA (localStorage)
// ============================================================
const STORAGE_KEY = "horita_pedido_v1";

function salvarLocal() {
    const estado = {
        fazenda:   document.getElementById("fazenda").value,
        aplicacao: document.getElementById("aplicacao").value,
        lista
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function carregarLocal() {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY);
        if (!salvo) return;

        const estado = JSON.parse(salvo);

        if (estado.fazenda)
            document.getElementById("fazenda").value = estado.fazenda;
        if (estado.aplicacao)
            document.getElementById("aplicacao").value = estado.aplicacao;
        if (Array.isArray(estado.lista) && estado.lista.length > 0) {
            lista = estado.lista;
            atualizarTabela();
        }
    } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
    }
}

// ============================================================
//  SEGURANÇA — SANITIZAR TEXTO PARA innerHTML
// ============================================================
function sanitizar(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

// ============================================================
//  CARREGAR JSON
// ============================================================
async function carregarProdutos(categoria) {
    try {
        let response = await fetch(categoria + ".json");
        produtosFiltrados = await response.json();
    } catch (erro) {
        alert("Erro ao carregar JSON. Use o Live Server do VS Code para testar.");
    }
}

// ============================================================
//  TROCAR CATEGORIA
// ============================================================
async function trocarCategoria() {
    let categoria = document.getElementById("categoria").value;
    if (!categoria) return;

    await carregarProdutos(categoria);
    buscarProduto();
}

// ============================================================
//  BUSCAR PRODUTO (com debounce de 150ms)
// ============================================================
function buscarProduto() {
    clearTimeout(timeoutBusca);

    timeoutBusca = setTimeout(async () => {
        const termo = document.getElementById("busca").value.toLowerCase().trim();

        if (produtosFiltrados.length === 0) {
            document.getElementById("resultados").innerHTML =
                "<div class='item' style='cursor:default; color:orange;'>Selecione uma categoria primeiro!</div>";
            return;
        }

        // Não busca com termo muito curto para evitar resultados ruins
        if (termo.length < 2) {
            document.getElementById("resultados").innerHTML = "";
            return;
        }

        const termos = termo.split(" ").filter(t => t.length > 0);
        const filtrados = produtosFiltrados.filter(p => {
            const textoBusca = (p.descricao + " " + p.codigo).toLowerCase();
            return termos.every(t => textoBusca.includes(t));
        });

        indexSelecionado = -1;

        if (filtrados.length > 0) {
            // Resultados normais na categoria atual
            mostrarResultados(filtrados, null);
        } else {
            // Nenhum resultado: busca nas outras categorias
            mostrarResultados([], null); // mostra "procurando..." enquanto busca
            await buscarEmOutrasCategorias(termo, termos);
        }
    }, 150);
}

// ============================================================
//  BUSCA EM OUTRAS CATEGORIAS (sugestão cruzada)
// ============================================================
async function buscarEmOutrasCategorias(termo, termos) {
    const div = document.getElementById("resultados");
    const categoriaAtual = document.getElementById("categoria").value;

    // Feedback visual imediato
    div.innerHTML = `<div class='item item-buscando' style='cursor:default; color: var(--text-muted); font-style: italic;'>
        🔍 Procurando em outras categorias...
    </div>`;

    const sugestoes = []; // { produto, categoriaKey, categoriaNome }

    const promessas = Object.entries(CATEGORIAS)
        .filter(([key]) => key !== categoriaAtual)
        .map(async ([key, nome]) => {
            try {
                const res = await fetch(key + ".json");
                if (!res.ok) return;
                const produtos = await res.json();
                const encontrados = produtos.filter(p => {
                    const textoBusca = (p.descricao + " " + p.codigo).toLowerCase();
                    return termos.every(t => textoBusca.includes(t));
                });
                encontrados.forEach(p => sugestoes.push({ produto: p, categoriaKey: key, categoriaNome: nome }));
            } catch {
                // Ignora categorias que falharem silenciosamente
            }
        });

    await Promise.all(promessas);

    div.innerHTML = "";

    if (sugestoes.length === 0) {
        div.innerHTML = "<div class='item' style='cursor:default;'>Nenhum produto encontrado em nenhuma categoria.</div>";
        return;
    }

    // Cabeçalho de sugestão
    const cabecalho = document.createElement("div");
    cabecalho.className = "item-cabecalho-sugestao";
    cabecalho.textContent = `Não encontrado aqui — veja sugestões de outras categorias:`;
    div.appendChild(cabecalho);

    // Agrupa por categoria para exibir separadores
    const porCategoria = {};
    sugestoes.forEach(s => {
        if (!porCategoria[s.categoriaNome]) porCategoria[s.categoriaNome] = [];
        porCategoria[s.categoriaNome].push(s);
    });

    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    Object.entries(porCategoria).forEach(([nomeCat, itens]) => {
        // Separador de categoria
        const sep = document.createElement("div");
        sep.className = "item-separador-categoria";
        sep.textContent = nomeCat;
        div.appendChild(sep);

        itens.forEach(({ produto, categoriaKey, categoriaNome }) => {
            const item = document.createElement("div");
            item.className = "item item-sugestao";

            let descricaoSegura = sanitizar(produto.descricao);
            if (termoEscapado) {
                descricaoSegura = descricaoSegura.replace(
                    new RegExp(`(${termoEscapado})`, "gi"),
                    `<span class="highlight">$1</span>`
                );
            }

            item.innerHTML = descricaoSegura;

            item.onclick = async () => {
                // Troca a categoria automaticamente e adiciona o produto
                const selectCategoria = document.getElementById("categoria");
                selectCategoria.value = categoriaKey;
                await carregarProdutos(categoriaKey);

                adicionarDireto(produto);
                div.innerHTML = "";
                document.getElementById("busca").value = "";
            };

            div.appendChild(item);
        });
    });
}

// ============================================================
//  MOSTRAR RESULTADOS DA BUSCA (categoria atual)
// ============================================================
function mostrarResultados(listaProdutos, _ignorado) {
    const div = document.getElementById("resultados");
    div.innerHTML = "";

    if (listaProdutos.length === 0) {
        // Não exibe "nenhum encontrado" aqui pois buscarEmOutrasCategorias assume o controle
        return;
    }

    const termo = document.getElementById("busca").value.toLowerCase();
    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    listaProdutos.forEach(p => {
        const item = document.createElement("div");
        item.className = "item";

        let descricaoSegura = sanitizar(p.descricao);
        if (termoEscapado) {
            descricaoSegura = descricaoSegura.replace(
                new RegExp(`(${termoEscapado})`, "gi"),
                `<span class="highlight">$1</span>`
            );
        }

        item.innerHTML = descricaoSegura;

        item.onclick = () => {
            adicionarDireto(p);
            div.innerHTML = "";
            document.getElementById("busca").value = "";
        };

        div.appendChild(item);
    });
}

// ============================================================
//  EVENTOS DO CAMPO DE BUSCA
// ============================================================
document.getElementById("busca").addEventListener("click", function () {
    if (produtosFiltrados.length > 0) {
        buscarProduto();
    } else {
        document.getElementById("resultados").innerHTML =
            "<div class='item' style='cursor:default; color:red;'>Selecione uma categoria primeiro!</div>";
    }
});

document.getElementById("busca").addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        clearTimeout(timeoutBusca);
    }

    const itens = document.querySelectorAll("#resultados .item:not(.item-buscando)");

    if (!itens.length ||
        itens[0].innerText.includes("Selecione") ||
        itens[0].innerText.includes("Nenhum")) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        indexSelecionado = (indexSelecionado + 1) % itens.length;
        atualizarSelecao(itens);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        indexSelecionado = (indexSelecionado - 1 + itens.length) % itens.length;
        atualizarSelecao(itens);
    } else if (e.key === "Enter") {
        if (indexSelecionado > -1 && itens[indexSelecionado]) {
            e.preventDefault();
            itens[indexSelecionado].click();
        }
    }
});

// Salva fazenda e aplicação ao alterar
document.getElementById("fazenda").addEventListener("change", salvarLocal);
document.getElementById("aplicacao").addEventListener("input", salvarLocal);

// Fecha a lista ao clicar fora
document.addEventListener("click", function (evento) {
    const divResultados = document.getElementById("resultados");
    const campoBusca = document.getElementById("busca");

    if (!divResultados.contains(evento.target) && evento.target !== campoBusca) {
        divResultados.innerHTML = "";
    }
});

// ============================================================
//  ATUALIZAR SELEÇÃO POR TECLADO
// ============================================================
function atualizarSelecao(itens) {
    itens.forEach((item, i) => {
        if (i === indexSelecionado) {
            item.classList.add("ativo");
            item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            item.classList.remove("ativo");
        }
    });
}

// ============================================================
//  ADICIONAR PRODUTO DA BUSCA NA TABELA
// ============================================================
function adicionarDireto(produto) {
    const existente = lista.find(item => item.codigo === produto.codigo);

    if (existente) {
        alert("Este item já foi adicionado à lista!");
        return;
    }

    lista.push({
        codigo: produto.codigo,
        descricao: produto.descricao,
        Quantidade: "",
        marca: "",
        cor: "",
        obs: ""
    });

    atualizarTabela();
    salvarLocal();
    destacarUltimaLinha();
}

// ============================================================
//  DESTACAR ÚLTIMA LINHA ADICIONADA
// ============================================================
function destacarUltimaLinha() {
    const tbody = document.querySelector("#tabela tbody");
    const linhas = tbody.querySelectorAll("tr");
    if (!linhas.length) return;

    const ultima = linhas[linhas.length - 1];
    ultima.classList.add("linha-nova");
    setTimeout(() => ultima.classList.remove("linha-nova"), 1200);
}

// ============================================================
//  ADICIONAR ITEM MANUAL
// ============================================================
function adicionarManual() {
    const mensagem = "Você tem certeza que não encontrou o produto na busca?\n\nItens cadastrados manualmente podem atrasar o processo de compra.";

    if (confirm(mensagem)) {
        lista.push({
            codigo: "SEM CADASTRO",
            descricao: "",
            Quantidade: "",
            marca: "",
            cor: "",
            obs: ""
        });
        atualizarTabela();
        salvarLocal();
        destacarUltimaLinha();
    }
}

// ============================================================
//  REMOVER ITEM DA LISTA
// ============================================================
function remover(index) {
    lista.splice(index, 1);
    atualizarTabela();
    salvarLocal();
}

// ============================================================
//  ATUALIZAR TABELA
// ============================================================
function atualizarTabela() {
    const tbody = document.querySelector("#tabela tbody");

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr id="linha-vazia">
                <td colspan="7" class="estado-vazio">
                    <div class="estado-vazio-icone">📋</div>
                    <div class="estado-vazio-titulo">Nenhum item adicionado</div>
                    <div class="estado-vazio-subtitulo">Selecione uma categoria e busque produtos, ou adicione um item manual.</div>
                </td>
            </tr>
        `;
        atualizarContador();
        return;
    }

    tbody.innerHTML = lista.map((item, index) => {
        const celulaDescricao = item.codigo === "SEM CADASTRO"
            ? `<input type="text" placeholder="Escreva o nome do produto..."
                value="${sanitizar(item.descricao)}"
                oninput="lista[${index}].descricao = this.value.toUpperCase(); salvarLocal()"
                style="border-bottom: 2px solid var(--primary); background: #fffdf0;">`
            : sanitizar(item.descricao);

        return `
        <tr>
            <td><span class="badge-codigo">${sanitizar(item.codigo)}</span></td>
            <td>${celulaDescricao}</td>
            <td>
                <input type="text" placeholder="Ex: 10un" class="input-qtd"
                value="${sanitizar(item.Quantidade)}"
                oninput="lista[${index}].Quantidade = this.value.toUpperCase(); salvarLocal()">
            </td>
            <td>
                <input type="text" placeholder="Marca"
                value="${sanitizar(item.marca)}"
                oninput="lista[${index}].marca = this.value.toUpperCase(); salvarLocal()">
            </td>
            <td>
                <input type="text" placeholder="Cor"
                value="${sanitizar(item.cor)}"
                oninput="lista[${index}].cor = this.value.toUpperCase(); salvarLocal()">
            </td>
            <td>
                <input type="text" placeholder="Observações"
                value="${sanitizar(item.obs)}"
                oninput="lista[${index}].obs = this.value.toUpperCase(); salvarLocal()">
            </td>
            <td style="text-align:center;">
                <button class="btn-excluir" onclick="remover(${index})">❌</button>
            </td>
        </tr>
        `;
    }).join('');

    atualizarContador();
}

// ============================================================
//  CONTADOR DE ITENS
// ============================================================
function atualizarContador() {
    const contador = document.getElementById("contador-itens");
    if (!contador) return;

    contador.textContent = lista.length === 0 ? ""
        : lista.length === 1 ? "1 item na lista"
        : `${lista.length} itens na lista`;
}

// ============================================================
//  LIMPAR SISTEMA
// ============================================================
function refreshSistema() {
    if (confirm("Deseja realmente limpar toda a lista?")) {
        lista = [];
        atualizarTabela();
        document.getElementById("busca").value = "";
        document.getElementById("resultados").innerHTML = "";
        localStorage.removeItem(STORAGE_KEY);
    }
}

// ============================================================
//  VALIDAÇÃO COMUM (Excel, PDF e E-mail)
// ============================================================
function validarParaExportar() {
    const fazenda   = document.getElementById("fazenda").value;
    const aplicacao = document.getElementById("aplicacao").value.trim();

    if (!fazenda || !aplicacao) {
        alert("Por favor, selecione a Fazenda e o Local de Aplicação.");
        return false;
    }
    if (lista.length === 0) {
        alert("A lista está vazia!");
        return false;
    }
    const temErro = lista.some(item => {
        const semQtd        = !item.Quantidade || item.Quantidade.trim() === "";
        const manualSemDesc = item.codigo === "SEM CADASTRO" && (!item.descricao || item.descricao.trim() === "");
        return semQtd || manualSemDesc;
    });
    if (temErro) {
        alert("Preencha todas as Quantidades e as Descrições dos itens manuais antes de exportar.");
        return false;
    }
    return true;
}

// ============================================================
//  EXPORTAR EXCEL
// ============================================================
function exportarExcel() {
    if (!validarParaExportar()) return;

    const fazenda   = document.getElementById("fazenda").value;
    const aplicacao = document.getElementById("aplicacao").value.trim();

    const dadosTratados = lista.map(item => ({
        "FAZENDA":         fazenda.toUpperCase(),
        "LOCAL APLICAÇÃO": aplicacao.toUpperCase(),
        "CÓDIGO":          item.codigo,
        "DESCRIÇÃO":       item.descricao.toUpperCase(),
        "QUANTIDADE":      item.Quantidade.toUpperCase(),
        "MARCA":           (item.marca || "").toUpperCase(),
        "COR":             (item.cor   || "").toUpperCase(),
        "OBSERVAÇÕES":     (item.obs   || "").toUpperCase()
    }));

    let ws = XLSX.utils.json_to_sheet(dadosTratados);
    let wb = XLSX.utils.book_new();

    ws['!cols'] = [
        { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 40 },
        { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 45 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Pedido de Materiais");

    const agora   = new Date();
    const dataStr = agora.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const horas   = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const nomeArquivo = `PEDIDO_${fazenda.replace(/\s+/g, '_')}_${dataStr}_${horas}h${minutos}.xlsx`;

    XLSX.writeFile(wb, nomeArquivo);
}

// ============================================================
//  EXPORTAR PDF
// ============================================================
function exportarPDF() {
    if (!validarParaExportar()) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const fazenda   = document.getElementById("fazenda").value;
    const aplicacao = document.getElementById("aplicacao").value.trim();

    const azulHorita  = [40, 6, 231];
    const cinzaEscuro = [51, 51, 51];
    const cinzaClaro  = [102, 102, 102];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...azulHorita);
    doc.text("SOLICITAÇÃO DE MATERIAIS", 14, 30);

    doc.setDrawColor(...azulHorita);
    doc.setLineWidth(1);
    doc.line(14, 33, 60, 33);

    doc.setFontSize(10);
    doc.setTextColor(...cinzaEscuro);
    doc.text("DADOS DO SOLICITANTE", 14, 45);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...cinzaClaro);
    doc.text("Fazenda Unidade:", 14, 52);
    doc.text("Local de Aplicação:", 14, 58);
    doc.text("Data da Emissão:", 14, 64);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(fazenda.toUpperCase(), 50, 52);
    doc.text(aplicacao.toUpperCase(), 50, 58);
    doc.text(new Date().toLocaleDateString('pt-BR'), 50, 64);

    const rows = lista.map(item => [
        item.codigo,
        item.descricao.toUpperCase(),
        item.Quantidade.toUpperCase(),
        (item.marca || "").toUpperCase() || "-",
        (item.cor   || "").toUpperCase() || "-",
        (item.obs   || "").toUpperCase() || "-"
    ]);

    doc.autoTable({
        startY: 75,
        head: [['Cód', 'Descrição', 'Qtd', 'Marca', 'Cor', 'Obs']],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: azulHorita, halign: 'center' },
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: {
            0: { cellWidth: 20, halign: 'center' },
            1: { cellWidth: 50 },
            2: { cellWidth: 14, halign: 'center' },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 },
        pageBreak: 'auto'
    });

    doc.save(`SOLICITACAO_${fazenda.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
}

// ============================================================
//  DICIONÁRIO DE DESTINATÁRIOS POR FAZENDA
// ============================================================
const contatosFazendas = {
    "Faz. Arizona":       "vitoria@horita.com.br",
    "Faz. Vitoria":       "vitoria@horita.com.br",
    "Faz. Australia":     "australia@horita.com.br",
    "Faz. Colorado":      "colorado@horita.com.br",
    "Faz. Acalanto":      "acalanto@horita.com.br",
    "Faz. Roda Velha":    "acalanto@horita.com.br",
    "Faz. Timbauba":      "timbauba@horita.com.br",
    "Faz. Anda Luz":      "timbauba@horita.com.br",
    "Faz. Sagarana":      "sagarana@horita.com.br",
    "Faz. Requinte":      "requinte@horita.com.br",
    "Algodoeira":         "algodoeira.vitoria@horita.com.br",
    "Escritório Central": null,
    "Chácara":            null
};

// ============================================================
//  ENVIAR E-MAIL
// ============================================================
function enviarEmail() {
    if (!validarParaExportar()) return;

    const fazenda   = document.getElementById("fazenda").value;
    const aplicacao = document.getElementById("aplicacao").value.trim();

    const emailFazenda  = contatosFazendas[fazenda];
    const emailCompras  = "compras@horita.com.br";
    const destinatarios = emailFazenda
        ? `${emailFazenda}; ${emailCompras}`
        : emailCompras;

    const assunto = `Solicitação de Materiais - ${fazenda.toUpperCase()} (${aplicacao.toUpperCase()})`;

    let corpo = `Olá,\n\nSegue solicitação de materiais conforme detalhes abaixo:\n\n`;
    corpo += `FAZENDA: ${fazenda.toUpperCase()}\n`;
    corpo += `LOCAL DE APLICAÇÃO: ${aplicacao.toUpperCase()}\n`;
    corpo += `DATA: ${new Date().toLocaleDateString('pt-BR')}\n`;
    corpo += `--------------------------------------------------\n\n`;

    lista.forEach((item, index) => {
        corpo += `${index + 1}. ${item.descricao.toUpperCase()}\n`;
        corpo += `   CÓD: ${item.codigo} | QTD: ${item.Quantidade.toUpperCase()}\n`;
        if (item.marca) corpo += `   MARCA: ${item.marca.toUpperCase()}\n`;
        if (item.obs)   corpo += `   OBS: ${item.obs.toUpperCase()}\n`;
        corpo += `--------------------------------------------------\n`;
    });

    corpo += `\nFavor conferir o arquivo oficial em anexo.\nAtenciosamente.`;

    window.location.href = `mailto:${destinatarios}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
}

// ============================================================
//  INICIALIZAÇÃO
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    carregarLocal();
});