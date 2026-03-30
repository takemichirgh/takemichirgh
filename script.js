import {
  jogosRef,
  onValue
} from "./firebase.js";

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const categoriaSelect = document.getElementById("categoria");

let jogos = [];
let favoritos =
JSON.parse(localStorage.getItem("favoritos")) || [];

let modoFavoritos = false;

let primeiraCarga = true;
let jogosAnteriores = [];

onValue(jogosRef, (snapshot) => {

  const data = snapshot.val();

  if (!data) {
    grid.innerHTML =
    "<h2>Nenhum jogo encontrado</h2>";
    return;
  }

  const novosJogos =
  Object.entries(data).map(([id, jogo]) => ({
    id,
    ...jogo
  }));

  // Notificação de novo jogo

  if (!primeiraCarga) {

    novosJogos.forEach(jogo => {

      const existe =
      jogosAnteriores.find(
        j => j.id === jogo.id
      );

      if (!existe) {

        criarNotif(
        "Novo jogo adicionado: " +
        jogo.nome
        );

      }

    });

  }

  primeiraCarga = false;

  jogosAnteriores = novosJogos;

  jogos = novosJogos;

  atualizarCategorias();

  renderizarJogos();

});

function atualizarCategorias(){

  const categorias = new Set();

  jogos.forEach(j => {

    if (j.categoria)
    categorias.add(j.categoria);

  });

  categoriaSelect.innerHTML =
  `<option value="all">
  Todas categorias
  </option>`;

  categorias.forEach(cat => {

    const option =
    document.createElement("option");

    option.value = cat;

    option.textContent = cat;

    categoriaSelect.appendChild(option);

  });

}

function renderizarJogos(){

  grid.innerHTML = "";

  let lista = jogos;

  const busca =
  searchInput.value.toLowerCase();

  const categoria =
  categoriaSelect.value;

  if (busca){

    lista =
    lista.filter(j =>
    j.nome.toLowerCase()
    .includes(busca)
    );

  }

  if (categoria !== "all"){

    lista =
    lista.filter(j =>
    j.categoria === categoria
    );

  }

  if (modoFavoritos){

    lista =
    lista.filter(j =>
    favoritos.includes(j.id)
    );

  }

  lista.forEach(jogo => {

    const card =
    document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <span class="fav">
      ${
      favoritos.includes(jogo.id)
      ? "⭐"
      : "☆"
      }
      </span>

      <img src="${jogo.imagem}">

      <div class="card-content">

        <div class="nome">
        ${jogo.nome}
        </div>

        <button class="btn">
        Ver
        </button>

      </div>
    `;

    // Favorito

    card.querySelector(".fav")
    .onclick = (e) => {

      e.stopPropagation();

      toggleFavorito(jogo.id);

    };

    // Abrir modal

    card.onclick = () =>
    abrirModal(jogo);

    grid.appendChild(card);

  });

}

function toggleFavorito(id){

  const jogo =
  jogos.find(j => j.id === id);

  if (favoritos.includes(id)){

    favoritos =
    favoritos.filter(
      f => f !== id
    );

    criarNotif(
    "Removido dos favoritos: "
    + jogo.nome
    );

  } else {

    favoritos.push(id);

    criarNotif(
    "Adicionado aos favoritos: "
    + jogo.nome
    );

  }

  localStorage.setItem(
  "favoritos",
  JSON.stringify(favoritos)
  );

  renderizarJogos();

}

window.verFavoritos = function(){

  modoFavoritos = true;

  criarNotif(
  "Mostrando favoritos"
  );

  renderizarJogos();

};

window.mostrarTodos = function(){

  modoFavoritos = false;

  criarNotif(
  "Mostrando todos os jogos"
  );

  renderizarJogos();

};

searchInput
.addEventListener(
"input",
renderizarJogos
);

categoriaSelect
.addEventListener(
"change",
renderizarJogos
);

function abrirModal(jogo){

  document.body
  .classList
  .add("travado");

  document
  .getElementById("modal")
  .style
  .display = "flex";

  document
  .getElementById("modal-img")
  .src = jogo.imagem;

  document
  .getElementById("modal-nome")
  .textContent = jogo.nome;

  document
  .getElementById("modal-desc")
  .textContent =
  jogo.descricao;

  document
  .getElementById("modal-tamanho")
  .textContent =
  jogo.tamanho;

  document
  .getElementById("modal-formato")
  .textContent =
  jogo.formato;

  document
  .getElementById("modal-link")
  .href = jogo.link;

}

window.fecharModal = function(){

  document.body
  .classList
  .remove("travado");

  document
  .getElementById("modal")
  .style
  .display = "none";

};

window.toggleGlowModal =
function(){

  const img =
  document
  .getElementById("modal-img");

  img
  .classList
  .toggle("active");

};

// NOTIFICAÇÃO

function criarNotif(texto){

  const container =
  document
  .getElementById(
  "notificacoes"
  );

  const notif =
  document
  .createElement("div");

  notif.className = "notif";

  notif.innerHTML = `
    <div class="notif-title">
    Sistema
    </div>

    <div class="notif-text">
    ${texto}
    </div>

    <div class="bar"></div>
  `;

  container.appendChild(notif);

  setTimeout(() => {

    notif.remove();

  }, 3000);

        }
