// script.js (DINÂMICO COM FIREBASE)

function criarNotif(texto){
const container=document.getElementById("notificacoes")

const notif=document.createElement("div")
notif.className="notif"

notif.innerHTML=`
<div class="notif-title">Sistema</div>
<div class="notif-text">${texto}</div>
<div class="bar"></div>
`

container.appendChild(notif)

setTimeout(()=>{
notif.remove()
},3000)
}

let lastTouchEnd=0
document.addEventListener('touchend',function(e){
let now=new Date().getTime()
if(now-lastTouchEnd<=300){e.preventDefault()}
lastTouchEnd=now
},false)

let descGrande = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(20)

let jogos=[]
let favoritos=JSON.parse(localStorage.getItem("fav"))||[]
let modo="todos"

const grid=document.getElementById("grid")
const search=document.getElementById("search")
const categoria=document.getElementById("categoria")

const modal=document.getElementById("modal")
const modalImg=document.getElementById("modal-img")
const modalNome=document.getElementById("modal-nome")
const modalDesc=document.getElementById("modal-desc")
const modalTamanho=document.getElementById("modal-tamanho")
const modalFormato=document.getElementById("modal-formato")
const modalLink=document.getElementById("modal-link")

function carregarCategorias(jogos){
const categorias=[...new Set(jogos.map(j=>j.categoria))]

categoria.innerHTML=`<option value="all">Todas categorias</option>`

categorias.forEach(cat=>{
const option=document.createElement("option")
option.value=cat
option.textContent=cat.charAt(0).toUpperCase()+cat.slice(1)
categoria.appendChild(option)
})
}

//
// 🔥 AQUI ESTÁ A MUDANÇA IMPORTANTE
//

function carregarJogosFirebase(){

db.ref("jogos").on("value",(snapshot)=>{

const dados=snapshot.val()

if(!dados){
jogos=[]
mostrarJogos([])
return
}

// transforma objeto em array
jogos = Object.values(dados)

carregarCategorias(jogos)

if(modo==="favoritos"){
verFavoritos()
}else{
mostrarJogos(jogos)
}

})

}

carregarJogosFirebase()

function mostrarJogos(lista){
grid.innerHTML = lista.map(jogo=>{
const fav = favoritos.includes(jogo.nome) ? "⭐" : "☆"
const nomeSeguro = jogo.nome.replace(/'/g, "\\'")
return `
<div class="card" onclick="ativarCard(this)">
<div class="fav" onclick="toggleFav(event,'${nomeSeguro}')">${fav}</div>
<img loading="lazy" src="${jogo.imagem}">
<div class="card-content">
<div class="nome">${jogo.nome}</div>
<div>📦 ${jogo.tamanho}</div>
<div>💿 ${jogo.formato}</div>
<button class="btn" onclick="event.stopPropagation();abrirModal('${nomeSeguro}')">Ver</button>
</div>
</div>`
}).join("")
}

function ativarCard(el){
document.querySelectorAll(".card.active").forEach(c=>c.classList.remove("active"))
el.classList.add("active")
}

function toggleFav(event,nome){
event.stopPropagation()

if(favoritos.includes(nome)){
favoritos=favoritos.filter(f=>f!==nome)
criarNotif("Removido dos favoritos")
}else{
favoritos.push(nome)
criarNotif("Adicionado aos favoritos")
}

localStorage.setItem("fav",JSON.stringify(favoritos))

modo==="favoritos"
?verFavoritos()
:mostrarJogos(jogos)
}

function verFavoritos(){
modo="favoritos"
mostrarJogos(jogos.filter(j=>favoritos.includes(j.nome)))
}

function mostrarTodos(){
modo="todos"
mostrarJogos(jogos)
}

search.oninput=filtrar
categoria.onchange=filtrar

function filtrar(){
modo="todos"
const texto=search.value.toLowerCase()
const cat=categoria.value

mostrarJogos(jogos.filter(j=>{
return j.nome.toLowerCase().includes(texto) &&
(cat==="all"||j.categoria===cat)
}))
}

function abrirModal(nome){
const jogo=jogos.find(j=>j.nome===nome)
if(!jogo)return

modal.style.display="flex"
document.body.classList.add("travado")

modalImg.src=jogo.imagem
modalNome.innerText=jogo.nome
modalDesc.innerText=jogo.descricao
modalTamanho.innerText=jogo.tamanho
modalFormato.innerText=jogo.formato
modalLink.href=jogo.link

modalImg.classList.remove("active")
}

function fecharModal(){
modal.style.display="none"
document.body.classList.remove("travado")
}

function toggleGlowModal(){
modalImg.classList.toggle("active")
  }
