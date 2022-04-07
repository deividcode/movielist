var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
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
let resultadosMovie = document.querySelector(".cartelera__resultado");
class Ui {
  constructor() {
    __publicField(this, "arrPeliculas", []);
  }
  limpiarCartelera() {
    while (resultadosMovie.firstElementChild) {
      resultadosMovie.removeChild(resultadosMovie.firstElementChild);
    }
  }
  ordenarPelicula() {
    let selectValueOrden2 = document.querySelector(".caja-busqueda__opciones select");
    console.log(this.arrPeliculas);
    switch (selectValueOrden2.value) {
      case "a-up":
        return this.arrPeliculas.sort((a, b) => {
          let { title } = a;
          let titleM = title == null ? "name" : "title";
          return b[titleM] < a[titleM] ? -1 : 1;
        });
      case "a-down":
        return this.arrPeliculas.sort((a, b) => {
          let { title } = a;
          let titleM = title == null ? "name" : "title";
          return b[titleM] > a[titleM] ? -1 : 1;
        });
      case "f-up":
        return this.arrPeliculas.sort((a, b) => {
          let { first_air_date } = a;
          let dateM = first_air_date == null ? "release_date" : "first_air_date";
          return new Date(a[dateM]) - new Date(b[dateM]);
        });
      case "f-down":
        return this.arrPeliculas.sort((a, b) => {
          let { first_air_date } = a;
          let dateM = first_air_date == null ? "release_date" : "first_air_date";
          return new Date(b[dateM]) - new Date(a[dateM]);
        });
      default:
        return this.arrPeliculas;
    }
  }
  mostrarPeliculas(datos, ubicacion) {
    this.limpiarCartelera();
    this.arrPeliculas = datos != null ? datos : this.arrPeliculas;
    console.log(this.arrPeliculas);
    this.arrPeliculas = this.ordenarPelicula();
    if (ubicacion == "inicio") {
      this.arrPeliculas = this.arrPeliculas.slice(0, 10);
      console.log(this.arrPeliculas);
      let catalogoPopulares = document.querySelector(".b-popular__catalogo-pelicula");
      console.log("Hola Aqui");
      this.arrPeliculas.forEach((movie) => {
        let { title, id, poster_path, release_date, vote_average } = movie;
        let imgMovie = "https://image.tmdb.org/t/p/w500/" + poster_path;
        catalogoPopulares.insertAdjacentHTML("afterbegin", `
            
                    <div class="movie-catalog">     

                        <div class="movie-catalog__add-list">
                            +
                        </div>       

                        <a class="movie-catalog__link" href="pelicula.html?id=${id}">                
                        
                            <div class="movie-catalog__image">
                                <img src="${imgMovie}">  
                                <div class="movie-catalog__rating">${vote_average}</div>                  
                            </div>
        
                            <div class="movie-catalog__text">                                
                                <h5 class="movie-catalog__title">${title}</h5>
                                <p class="movie-catalog__date">${release_date}</p>                        
                            </div>

                        </a>
                    </div>                        
            
                `);
      });
    }
    if (ubicacion == "cartelera") {
      this.arrPeliculas.forEach((movie) => {
        let { title, name, id, poster_path, release_date, first_air_date, vote_average } = movie;
        let imgMovie = "https://image.tmdb.org/t/p/w500/" + poster_path;
        resultadosMovie.insertAdjacentHTML("afterbegin", `
            
                    <div class="movie-catalog">     

                        <div class="movie-catalog__add-list">
                            +
                        </div>       

                        <a class="movie-catalog__link" href="pelicula.html?id=${id}">                
                        
                            <div class="movie-catalog__image">
                                <img src="${imgMovie}">  
                                <div class="movie-catalog__rating">${vote_average}</div>                  
                            </div>
        
                            <div class="movie-catalog__text">                                
                                <h5 class="movie-catalog__title">${title != null ? title : name}</h5>
                                <p class="movie-catalog__date">${release_date != null ? release_date : first_air_date}</p>                        
                            </div>

                        </a>
                    </div>                        
            
                `);
      });
    }
  }
  mostrarError(msj, ubicacion) {
    if (ubicacion == "caja busqueda") {
      let msjError = document.querySelector(".mensaje-error");
      msjError.style.display = "block";
    }
    if (ubicacion == "cartelera") {
      console.log("Error en la ccartelera");
    }
    console.log(msj);
  }
}
const ui = new Ui();
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "api_key=bc1ec0aeff28eba96fa4dc1b0c704b97";
const API_URL_POPULARES = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
function pedirPopulares(ubicacion) {
  fetch(API_URL_POPULARES).then((response) => response.json()).then((response) => response.results.filter((e) => e.poster_path != null)).then((movies) => ui.mostrarPeliculas(movies, ubicacion));
}
function pedirPeliculas(titulo, seriePelicula) {
  let API_URL = BASE_URL + `/search/${seriePelicula}?` + API_KEY + `&language=en-US&query=${titulo}`;
  fetch(API_URL).then((response) => response.json()).then((response) => response.results.filter((e) => e.poster_path != null)).then((movies) => {
    ui.mostrarPeliculas(movies, "cartelera");
  });
}
let formulario = document.querySelector("#caja-busqueda__formulario");
let formularioInputSearch = document.querySelector(".caja-busqueda__inputSearch");
document.querySelector(".caja-busqueda__submit");
let selectValueOrden = document.querySelector(".caja-busqueda__opciones select");
document.addEventListener("DOMContentLoaded", function() {
  if (location.href == "http://localhost:8080/" || location.href == "http://localhost:8080/#") {
    pedirPopulares("inicio");
  }
  if (location.href == "http://localhost:8080/cartelera.html" || location.href == "http://localhost:8080/cartelera.html/#") {
    pedirPopulares("cartelera");
  }
  formulario.addEventListener("submit", tomarDatosFormulario);
  selectValueOrden.addEventListener("change", function saludo() {
    console.log("CAMbio");
    ui.mostrarPeliculas(null, "cartelera");
  });
});
function tomarDatosFormulario(e) {
  var _a;
  e.preventDefault();
  let formularioInputSP = document.querySelector("input[name='seriePelicula']:checked");
  if (formularioInputSearch.value == "") {
    return ui.mostrarError("", "caja busqueda");
  } else {
    let msjError = document.querySelector(".mensaje-error");
    msjError.style.display = "none";
  }
  let titulo = (_a = formularioInputSearch.value) != null ? _a : null;
  let seriePelicula = formularioInputSP.value == "pelicula" ? "movie" : "tv";
  pedirPeliculas(titulo, seriePelicula);
}
