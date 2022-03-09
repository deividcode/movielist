const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
let resultadosMovie = document.querySelector(".resultados");
class Ui {
  constructor() {
  }
  limpiarCartelera() {
    while (resultadosMovie.firstElementChild) {
      resultadosMovie.removeChild(resultadosMovie.firstElementChild);
    }
  }
  mostrarCartelera(datos) {
    console.log(datos);
    let datosRevisados = datos.filter((e) => e.poster_path != null);
    datosRevisados.forEach((movie) => {
      let { title, id, poster_path, release_date } = movie;
      let imgMovie = "https://image.tmdb.org/t/p/w500/" + poster_path;
      resultadosMovie.insertAdjacentHTML("afterbegin", `
            
                <div class="box-pelicula">            
                    <a class="box-pelicula__enlace" href="pelicula.html?id=${id}">                
                        <div class="box-pelicula__img">
                            <img src="${imgMovie}">                    
                        </div>
                    </a>
    
                    <div class="box-pelicula__text">                                
                        <h5>${title}</h5>
                        <p class="box-pelicula__date">${release_date}</p>                        
                        </div>
                </div>                        
            
            `);
    });
  }
}
const ui = new Ui();
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "api_key=bc1ec0aeff28eba96fa4dc1b0c704b97";
const API_URL_CARTELERA = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
function pedirPopulares() {
  fetch(API_URL_CARTELERA).then((response) => response.json()).then((movies) => ui.mostrarCartelera(movies.results));
}
function peticionAPI(titulo, seriePelicula, contenidoAdulto, date) {
  let API_URL = BASE_URL + `/search/${seriePelicula}?` + API_KEY + `&language=en-US&query=${titulo}&include_adult=${contenidoAdulto}&year=${date}`;
  console.log(API_URL);
  fetch(API_URL).then((response) => response.json()).then((movies) => {
    ui.limpiarCartelera();
    ui.mostrarCartelera(movies.results);
  });
}
document.querySelector(".box-pelicula");
let pageCartelera = document.querySelector(".page-cartelera");
let formulario = document.querySelector("#formulario");
let formularioInputSearch = document.querySelector(".formulario__inputSearch");
document.querySelector(".formulario__submit");
let formularioInputSP = document.querySelector("input[name='seriePelicula']");
let formularioInputAC = document.querySelector("input[name='contenidoAdulto']");
document.addEventListener("DOMContentLoaded", function() {
  if (pageCartelera.hidden == false)
    pedirPopulares();
  formulario.addEventListener("submit", tomarDatosFormulario);
});
function tomarDatosFormulario(e) {
  var _a;
  e.preventDefault();
  let titulo = (_a = formularioInputSearch.value) != null ? _a : null;
  let seriePelicula = formularioInputSP.value == "pelicula" ? "movie" : "serie";
  let contenidoAdulto = formularioInputAC.checked ? true : false;
  console.log(titulo, seriePelicula, contenidoAdulto);
  peticionAPI(titulo, seriePelicula, contenidoAdulto);
}
