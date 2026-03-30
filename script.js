let jogos = []

let favoritos =
JSON.parse(localStorage.getItem("fav")) || []

let modo = "todos"

const grid =
document.getElementById("grid")

async function carregarJogos(){

const res =
await fetch("data/jogos.json")

jogos =
await res.json()

mostrarJogos(jogos)

}

function mostrarJogos(lista){

grid.innerHTML =
lista.map(jogo => {

const fav =
favoritos.includes(jogo.nome)
? "⭐"
: "☆"

return `

<div class="card">

<div class="card-content">

<div class="nome">
${jogo.nome}
</div>

<div>
📦 ${jogo.tamanho}
</div>

<div>
💿 ${jogo.formato}
</div>

<button
class="btn"
onclick="abrirModal('${jogo.nome}')"
>

Ver

</button>

</div>

</div>

`

}).join("")

}

function verFavoritos(){

modo = "favoritos"

mostrarJogos(

jogos.filter(
j => favoritos.includes(j.nome)
)

)

}

function mostrarTodos(){

modo = "todos"

mostrarJogos(jogos)

}

const modal =
document.getElementById("modal")

const modalImg =
document.getElementById("modal-img")

const modalNome =
document.getElementById("modal-nome")

const modalDesc =
document.getElementById("modal-desc")

const modalTamanho =
document.getElementById("modal-tamanho")

const modalFormato =
document.getElementById("modal-formato")

const modalLink =
document.getElementById("modal-link")

function abrirModal(nome){

const jogo =
jogos.find(
j => j.nome === nome
)

if(!jogo) return

modal.style.display = "flex"

modalImg.src =
jogo.imagem

modalNome.innerText =
jogo.nome

modalDesc.innerText =
jogo.descricao

modalTamanho.innerText =
jogo.tamanho

modalFormato.innerText =
jogo.formato

modalLink.href =
jogo.link

}

function fecharModal(){

modal.style.display =
"none"

}

carregarJogos()