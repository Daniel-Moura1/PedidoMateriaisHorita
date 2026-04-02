let produtosFiltrados = [];
let lista = [];

// 🔄 CARREGAR JSON
async function carregarProdutos(categoria) {
    try {
        let response = await fetch(categoria + ".json");
        produtosFiltrados = await response.json();
    } catch (erro) {
        alert("Erro ao carregar JSON. Use o Live Server do VS Code para testar.");
    }
}

// 🔄 TROCAR CATEGORIA
async function trocarCategoria() {
    let categoria = document.getElementById("categoria").value;
    if (!categoria) return;

    await carregarProdutos(categoria);
    document.getElementById("busca").value = "";
    // Removi a chamada automática aqui para o usuário clicar no campo e abrir
}

// 🔍 BUSCAR / MOSTRAR AO CLICAR
function buscarProduto() {
    let termo = document.getElementById("busca").value.toLowerCase();

    // Se não tiver categoria selecionada, avisa o usuário
    if (produtosFiltrados.length === 0) {
        document.getElementById("resultados").innerHTML = "<div class='item' style='cursor:default; color:orange;'>Selecione uma categoria primeiro!</div>";
        return;
    }

    let filtrados = produtosFiltrados.filter(p =>
        p.descricao.toLowerCase().includes(termo) ||
        p.codigo.toString().includes(termo)
    );

    mostrarResultados(filtrados);
}

// 📋 RESULTADOS DA BUSCA
function mostrarResultados(listaProdutos) {
    let div = document.getElementById("resultados");
    div.innerHTML = "";

    if (listaProdutos.length === 0) {
        div.innerHTML = "<div class='item' style='cursor:default;'>Nenhum produto encontrado...</div>";
        return;
    }

    listaProdutos.forEach(p => {
        let item = document.createElement("div");
        item.className = "item";
        item.innerText = `${p.descricao}`;

        item.onclick = () => {
            adicionarDireto(p);
            div.innerHTML = "";
            document.getElementById("busca").value = "";
        };

        div.appendChild(item);
    });
}

// 🔥 ADICIONE ESTA PARTE PARA ABRIR AO CLICAR
document.getElementById("busca").addEventListener("click", function() {
    // Só abre se já houver produtos carregados da categoria
    if (produtosFiltrados.length > 0) {
        buscarProduto(); 
    } else {
        document.getElementById("resultados").innerHTML = "<div class='item' style='cursor:default; color:red;'>Selecione uma categoria primeiro!</div>";
    }
});

// ➕ ADICIONAR NA TABELA
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

// 🔄 ATUALIZAR TABELA
function atualizarTabela() {
    let tbody = document.querySelector("#tabela tbody");
    
    tbody.innerHTML = lista.map((item, index) => `
        <tr>
            <td>${item.codigo}</td>
            <td>${item.descricao}</td>
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
    `).join('');
}

// 🔄 REFRESH SISTEMA
function refreshSistema() {
    if (confirm("Deseja realmente limpar toda a lista?")) {
        lista = [];
        atualizarTabela();
        document.getElementById("busca").value = "";
        document.getElementById("resultados").innerHTML = "";
    }
}

// 📊 EXPORTAR EXCEL
function exportarExcel() {
    if (lista.length === 0) {
        alert("A lista está vazia! Adicione produtos antes de exportar.");
        return;
    }

    let itensSemQuantidade = lista.filter(item => item.Quantidade.trim() === "");

    if (itensSemQuantidade.length > 0) {
        alert(`Atenção: Existem ${itensSemQuantidade.length} itens sem quantidade preenchida. Por favor, preencha antes de exportar.`);
        return;
    }

    let ws = XLSX.utils.json_to_sheet(lista);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Solicitação de Materiais");

    let agora = new Date();
    let data = agora.toLocaleDateString('pt-BR').replace(/\//g, '-'); 
    let hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(/:/g, 'h');

    XLSX.writeFile(wb, `pedido_materiais_${data}_${hora}.xlsx`);
}

// Fecha a lista ao clicar fora
document.addEventListener("click", function(evento) {
    const divResultados = document.getElementById("resultados");
    const campoBusca = document.getElementById("busca");

    if (!divResultados.contains(evento.target) && evento.target !== campoBusca) {
        divResultados.innerHTML = "";
    }
});