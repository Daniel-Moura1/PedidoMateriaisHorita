let produtosFiltrados = [];
let lista = [];

//  CARREGAR JSON
async function carregarProdutos(categoria) {
    try {
        let response = await fetch(categoria + ".json");
        produtosFiltrados = await response.json();
    } catch (erro) {
        alert("Erro ao carregar JSON. Use o Live Server do VS Code para testar.");
    }
}

//  TROCAR CATEGORIA
async function trocarCategoria() {
    let categoria = document.getElementById("categoria").value;
    if (!categoria) return;

    await carregarProdutos(categoria);
    
    buscarProduto(); 
}

//  BUSCAR / MOSTRAR AO CLICAR
function buscarProduto() {
    let termo = document.getElementById("busca").value.toLowerCase();

    // Se não tiver categoria selecionada, avisa o usuário
    if (produtosFiltrados.length === 0) {
        document.getElementById("resultados").innerHTML = "<div class='item' style='cursor:default; color:orange;'>Selecione uma categoria primeiro!</div>";
        return;
    }

    let termos = termo.split(" ");
    let filtrados = produtosFiltrados.filter(p => {
        let textoBusca = (p.descricao + p.codigo).toLowerCase();
        return termos.every(t => textoBusca.includes(t));
    });

    mostrarResultados(filtrados);
}

//  RESULTADOS DA BUSCA
function mostrarResultados(listaProdutos) {
    let div = document.getElementById("resultados");
    div.innerHTML = "";
    
    indexSelecionado = -1; // <--- ADICIONE ISSO AQUI

    if (listaProdutos.length === 0) {
        div.innerHTML = "<div class='item' style='cursor:default;'>Nenhum produto encontrado...</div>";
        return;
    }

    listaProdutos.forEach(p => {
        let item = document.createElement("div");
        item.className = "item";
        let termo = document.getElementById("busca").value.toLowerCase();

        let descricao = p.descricao.replace(
            new RegExp(`(${termo})`, "gi"),
            `<span class="highlight">$1</span>`
        );

        item.innerHTML = descricao;

        item.onclick = () => {
            adicionarDireto(p);
            div.innerHTML = "";
            document.getElementById("busca").value = "";
        };

        div.appendChild(item);
    });
}

document.getElementById("busca").addEventListener("click", function() {
    // Só abre se já houver produtos carregados da categoria
    if (produtosFiltrados.length > 0) {
        buscarProduto(); 
    } else {
        document.getElementById("resultados").innerHTML = "<div class='item' style='cursor:default; color:red;'>Selecione uma categoria primeiro!</div>";
    }
});

//  ADICIONAR NA TABELA
function adicionarDireto(produto) {
    let existente = lista.find(item => item.codigo === produto.codigo);

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
}

// ❌ REMOVER
function remover(index) {
    lista.splice(index, 1);
    atualizarTabela();
}

//  ATUALIZAR TABELA
function atualizarTabela() {
    let tbody = document.querySelector("#tabela tbody");
    
    tbody.innerHTML = lista.map((item, index) => {
        // LÓGICA: Se o código for MANUAL, a descrição vira um campo de texto (input)
        const celulaDescricao = item.codigo === "SEM CADASTRO" 
            ? `<input type="text" placeholder="Escreva o nome do produto..." 
                value="${item.descricao}" 
                oninput="lista[${index}].descricao = this.value.toUpperCase()"
                style="border-bottom: 2px solid var(--primary); background: #fffdf0;">`
            : item.descricao;

        return `
        <tr>
            <td><span class="badge-codigo">${item.codigo}</span></td>
            <td>${celulaDescricao}</td>
            <td>
                <input type="text" placeholder="Ex: 10un" class="input-qtd"
                value="${item.Quantidade}"
                oninput="lista[${index}].Quantidade = this.value.toUpperCase()">
            </td>
            <td>
                <input type="text" placeholder="Marca"
                value="${item.marca}"
                oninput="lista[${index}].marca = this.value.toUpperCase()">
            </td>
            <td>
                <input type="text" placeholder="Cor"
                value="${item.cor}"
                oninput="lista[${index}].cor = this.value.toUpperCase()">
            </td>
            <td>
                <input type="text" placeholder="Observações"
                value="${item.obs}"
                oninput="lista[${index}].obs = this.value.toUpperCase()">
            </td>
            <td style="text-align:center;">
                <button class="btn-excluir" onclick="remover(${index})">❌</button>
            </td>
        </tr>
        `;
    }).join('');
}

//  REFRESH SISTEMA
function refreshSistema() {
    if (confirm("Deseja realmente limpar toda a lista?")) {
        lista = [];
        atualizarTabela();
        document.getElementById("busca").value = "";
        document.getElementById("resultados").innerHTML = "";
    }
}

//  EXPORTAR EXCEL (Formatado e Profissional)
function exportarExcel() {
    const fazenda = document.getElementById("fazenda").value;
    const aplicacao = document.getElementById("aplicacao").value.trim();

    if (!fazenda || !aplicacao) {
        alert("Por favor, selecione a Fazenda e o Local de Aplicação.");
        return;
    }

    if (lista.length === 0) {
        alert("A lista está vazia!");
        return;
    }

    //  Validação de campos obrigatórios
    if (lista.some(item => (item.codigo === "SEM CADASTRO" && !item.descricao.trim()) || !item.Quantidade.trim())) {
        alert("Preencha todas as descrições de itens SEM CADASTRO e quantidades.");
        return;
    }

    //  Organização dos dados em MAIÚSCULO
    const dadosTratados = lista.map(item => ({
        "FAZENDA": fazenda.toUpperCase(),
        "LOCAL APLICAÇÃO": aplicacao.toUpperCase(),
        "CÓDIGO": item.codigo,
        "DESCRIÇÃO": item.descricao.toUpperCase(),
        "QUANTIDADE": item.Quantidade.toUpperCase(),
        "MARCA": (item.marca || "").toUpperCase(),
        "COR": (item.cor || "").toUpperCase(),
        "OBSERVAÇÕES": (item.obs || "").toUpperCase()
    }));

    // 1. Cria a planilha a partir dos dados
    let ws = XLSX.utils.json_to_sheet(dadosTratados);
    let wb = XLSX.utils.book_new();

    // 2. CONFIGURAÇÃO DE LARGURA DAS COLUNAS (Ajuste Visual)
    const wscols = [
        {wch: 20}, // Fazenda
        {wch: 25}, // Local Aplicação
        {wch: 15}, // Código
        {wch: 40}, // Descrição
        {wch: 12}, // Quantidade
        {wch: 15}, // Marca
        {wch: 12}, // Cor
        {wch: 45}  // Observações (Bem larga para caber o texto)
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Pedido de Materiais");

    // 3. Nome do arquivo com Data e Hora
    let agora = new Date();
    let dataStr = agora.toLocaleDateString('pt-BR').replace(/\//g, '-'); 
    let horaStr = agora.getHours() + "h" + agora.getMinutes();
    let nomeArquivo = `PEDIDO_${fazenda.replace(/\s+/g, '_')}_${dataStr}_${horaStr}.xlsx`;

    // 4. Gera o download
    XLSX.writeFile(wb, nomeArquivo);
}

// Fecha a lista ao clicar fora
document.addEventListener("click", function(evento) {
    const divResultados = document.getElementById("resultados");
    const campoBusca = document.getElementById("busca");

    if (!divResultados.contains(evento.target) && evento.target !== campoBusca) {
        divResultados.innerHTML = "";
    }
});

// NOVA FUNÇÃO: Adiciona uma linha vazia editável (Com confirmação)
function adicionarManual() {
    // Mensagem de alerta para evitar cadastros manuais desnecessários
    const mensagem = "Você tem certeza que não encontrou o produto na busca?\n\nItens cadastrados manualmente podem atrasar o processo de compra.";
    
    if (confirm(mensagem)) {
        lista.push({
            codigo: "SEM CADASTRO", 
            descricao: "",    // Fica vazio para o usuário escrever
            Quantidade: "",
            marca: "",
            cor: "",
            obs: ""
        });
        atualizarTabela();
    }
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const fazenda = document.getElementById("fazenda").value;
    const aplicacao = document.getElementById("aplicacao").value.trim();

    //  Validação: Fazenda e Local
    if (!fazenda || !aplicacao) {
        alert("Por favor, selecione a Fazenda e o Local de Aplicação.");
        return;
    }

    //  Validação: Lista vazia
    if (lista.length === 0) {
        alert("A lista está vazia!");
        return;
    }

    //  Validação: Itens sem Quantidade e Manuais sem Descrição
    const temErro = lista.some(item => {
        const semQtd = !item.Quantidade || item.Quantidade.trim() === "";
        const manualSemDesc = item.codigo === "SEM CADASTRO" && (!item.descricao || item.descricao.trim() === "");
        return semQtd || manualSemDesc;
    });

    if (temErro) {
        alert("Atenção: Preencha todas as Quantidades e as Descrições dos itens manuais antes de exportar.");
        return;
    }

    // --- CONFIGURAÇÃO VISUAL ---
    const azulHorita = [40, 6, 231]; 
    const cinzaEscuro = [51, 51, 51];
    const cinzaClaro = [102, 102, 102];

    // Título Principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...azulHorita);
    doc.text("SOLICITAÇÃO DE MATERIAIS", 14, 30);

    // Linha Divisória
    doc.setDrawColor(...azulHorita);
    doc.setLineWidth(1);
    doc.line(14, 33, 60, 33);

    // Informações do Pedido
    doc.setFontSize(10);
    doc.setTextColor(...cinzaEscuro);
    doc.text("DADOS DO SOLICITANTE", 14, 45);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...cinzaClaro);
    doc.text(`Fazenda Unidade:`, 14, 52);
    doc.text(`Local de Aplicação:`, 14, 58);
    doc.text(`Data da Emissão:`, 14, 64);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`${fazenda.toUpperCase()}`, 50, 52);
    doc.text(`${aplicacao.toUpperCase()}`, 50, 58);
    doc.text(`${new Date().toLocaleDateString('pt-BR')}`, 50, 64);

    // Preparar os dados da tabela
    const rows = lista.map((item) => [
        item.codigo,
        item.descricao.toUpperCase(),
        item.Quantidade.toUpperCase(),
        item.marca.toUpperCase() || "-",
        item.cor.toUpperCase() || "-",
        item.obs.toUpperCase() || "-"
    ]);

    // 6. Gerar a Tabela com Quebra de Texto Automática
    doc.autoTable({
        startY: 75,
        head: [['Cód', 'Descrição', 'Qtd', 'Marca', 'Cor', 'Obs']],
        body: rows,
        theme: 'striped',
        headStyles: { 
            fillColor: azulHorita,
            halign: 'center' 
        },
        styles: { 
            fontSize: 8,        
            cellPadding: 2,
            overflow: 'linebreak' 
        },
        columnStyles: {
            0: { cellWidth: 20, halign: 'center' }, // Cód menor
            1: { cellWidth: 50 },                   // Descrição com espaço bom
            2: { cellWidth: 14, halign: 'center' }, // Qtd
            3: { cellWidth: 25 },                   // Marca
            4: { cellWidth: 20 },                   // Cor
            5: { cellWidth: 'auto' }                // Obs ocupa o resto e QUEBRA A LINHA
        },
        // Garante que a tabela não "fuja" da página se houver muitas linhas
        margin: { left: 14, right: 14 },
        pageBreak: 'auto' 
    });

    doc.save(`SOLICITACAO_${fazenda.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
}

//  DICIONÁRIO DE DESTINATÁRIOS POR FAZENDA
const contatosFazendas = {
    "Faz. Arizona": "vitoria@horita.com.br",
    "Faz. Vitoria": "vitoria@horita.com.br",
    "Faz. Australia": "australia@horita.com.br",
    "Faz. Colorado": "colorado@horita.com.br",
    "Faz. Acalanto": "acalanto@horita.com.br",
    "Faz. Roda Velha": "acalanto@horita.com.br",
    "Faz. Timbauba": "timbauba@horita.com.br",
    "Faz. Anda Luz": "timbauba@horita.com.br",
    "Faz. Sagarana": "sagarana@horita.com.br",
    "Faz. Requinte": "requinte@horita.com.br",
    "Algodoeira": "algodoeira.vitoria@horita.com.br",
    "Escritório Central": null, // Envio apenas para o compras
    "Chácara": null             // Envio apenas para o compras
};

//  FUNÇÃO PARA GERAR O E-MAIL AUTOMÁTICO
function enviarEmail() {
    const fazenda = document.getElementById("fazenda").value;
    const aplicacao = document.getElementById("aplicacao").value.trim();

    //  Validação de cabeçalho
    if (!fazenda || !aplicacao) {
        alert("Selecione a Fazenda e o Local de Aplicação antes de gerar o e-mail.");
        return;
    }

    //  Validação de lista e itens
    if (lista.length === 0) return alert("A lista está vazia!");
    
    const temErro = lista.some(item => {
        const semQtd = !item.Quantidade || item.Quantidade.trim() === "";
        const manualSemDesc = item.codigo === "SEM CADASTRO" && (!item.descricao || item.descricao.trim() === "");
        return semQtd || manualSemDesc;
    });

    if (temErro) {
        alert("Preencha todas as Quantidades e Descrições Manuais antes de enviar.");
        return;
    }

    // 📩 Configuração dos Destinatários
    const emailFazenda = contatosFazendas[fazenda];
    const emailCompras = "compras@horita.com.br";

    // LÓGICA: Se tiver e-mail da fazenda, concatena. Se não, usa só o de compras.
    const destinatarios = emailFazenda 
        ? `${emailFazenda}; ${emailCompras}` 
        : emailCompras;
    
    const assunto = `Solicitação de Materiais - ${fazenda.toUpperCase()} (${aplicacao.toUpperCase()})`;

    //  Montagem do corpo do e-mail em formato de tabela textual
    let corpo = `Olá,\n\nSegue solicitação de materiais conforme detalhes abaixo:\n\n`;
    corpo += `FAZENDA: ${fazenda.toUpperCase()}\n`;
    corpo += `LOCAL DE APLICAÇÃO: ${aplicacao.toUpperCase()}\n`;
    corpo += `DATA: ${new Date().toLocaleDateString('pt-BR')}\n`;
    corpo += `--------------------------------------------------\n\n`;

    lista.forEach((item, index) => {
        corpo += `${index + 1}. ${item.descricao.toUpperCase()}\n`;
        corpo += `   CÓD: ${item.codigo} | QTD: ${item.Quantidade.toUpperCase()}\n`;
        if (item.marca) corpo += `   MARCA: ${item.marca.toUpperCase()}\n`;
        if (item.obs) corpo += `   OBS: ${item.obs.toUpperCase()}\n`;
        corpo += `--------------------------------------------------\n`;
    });

    corpo += `\nFavor conferir o arquivo oficial em anexo.\nAtenciosamente.`;

    //  Gerar link mailto
    const mailtoLink = `mailto:${destinatarios}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    
    //  Abrir o cliente de e-mail
    window.location.href = mailtoLink;
}

let indexSelecionado = -1;

// Ajuste no Listener de Teclado
document.getElementById("busca").addEventListener("keydown", function(e) {
    // Se o usuário apertar setas, cancelamos qualquer busca pendente para focar na navegação
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        clearTimeout(timeoutBusca); 
    }

    const itens = document.querySelectorAll("#resultados .item");
    
    // Se não houver itens ainda (porque o delay não acabou), não faz nada
    if (!itens.length || itens[0].innerText.includes("Selecione") || itens[0].innerText.includes("Nenhum")) return;

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

// Função de Seleção mais Fluida
function atualizarSelecao(itens) {
    itens.forEach((item, i) => {
        if (i === indexSelecionado) {
            item.classList.add("ativo");
            // O segredo do scroll suave:
            item.scrollIntoView({
                behavior: "smooth", // Movimento fluido
                block: "nearest"    // Não pula a tela toda
            });
        } else {
            item.classList.remove("ativo");
        }
    });
}

let timeoutBusca;

function buscarProduto() {
    clearTimeout(timeoutBusca);
    
    timeoutBusca = setTimeout(() => {
        let termo = document.getElementById("busca").value.toLowerCase();
        if (produtosFiltrados.length === 0) return;

        let termos = termo.split(" ");
        let filtrados = produtosFiltrados.filter(p => {
            let texto = (p.descricao + p.codigo).toLowerCase();
            return termos.every(t => texto.includes(t));
        });

        indexSelecionado = -1; // Reseta a posição ao filtrar novo termo
        mostrarResultados(filtrados);
    }, 150); // 150ms é imperceptível para o humano, mas alivia muito o processador
}
