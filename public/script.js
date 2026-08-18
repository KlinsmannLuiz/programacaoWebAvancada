const BASE_URL = "";

async function carregarItens() {
    try {

        const respostaPokemons = await fetch(`${BASE_URL}/api/pokemon/`);

        if (!respostaPokemons.ok) {
            console.log("aqui")
            throw new Error("Erro ao consultar a API.");
        }

        const texto = await respostaPokemons.text();

        if (!texto) {
            return;
        }

        const itens = JSON.parse(texto);

        const tabela = document.getElementById("tabelaItens");

        tabela.innerHTML = "";


        itens.forEach(item => {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.tipo}</td>
                <td>
                    <button onclick="excluirPokemon(${item.id})">
                        Excluir
                    </button>
                </td>`;

            tabela.appendChild(linha);

        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível carregar os itens.");
    }
}

async function editarPokemon() {

    const id = document.getElementById("idPokemon").value;
    const nome = document.getElementById("editarNomePokemon").value;
    const tipo = document.getElementById("editarTipo").value;

    if (id === "" || nome === "" || tipo === "") {
        alert("Preencha todos os campos.");
        return;
    }

    try {

        const resposta = await fetch(`${BASE_URL}/api/pokemon/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                tipo
            })
        });

        if (!resposta.ok) {

            const erro = await resposta.json();
            throw new Error(erro.erro);

        }

        const dados = await resposta.json();

        alert(dados.mensagem);

        document.getElementById("idPokemon").value = "";
        document.getElementById("editarNomePokemon").value = "";
        document.getElementById("editarTipo").value = "";

        carregarItens();

    } catch (erro) {

        console.error(erro);
        alert(erro.message);

    }

}

async function adicionarPokemon() {

    const nome = document.getElementById("NomePokemon").value;
    const tipo = document.getElementById("Tipo").value;

    if (nome === '' || tipo === '') {
        alert("Preencha todos os campos")
        return;
    }

    try {
        const resposta = await fetch(`${BASE_URL}/api/pokemon`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                tipo: tipo
            })
        });

        console.log(resposta.status)
        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar")
        }

        document.getElementById("NomePokemon").value = '';
        document.getElementById("Tipo").value = '';

        carregarItens();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar o item.");
    }

}

async function excluirPokemon(id) {
    const confirmar = confirm("Deseja Excluir esse pokemons da sua pokedex?")

    if (!confirmar) {
        return;
    }


    try {
        const resposta = await fetch(`${BASE_URL}/api/pokemon/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir.");
    }
    carregarItens();

}

window.onload = carregarItens;
document.getElementById("btnCadastrar").addEventListener("click", adicionarPokemon);
document.getElementById("btnEditar").addEventListener("click", editarPokemon);