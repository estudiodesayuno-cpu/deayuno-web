const sliderContenedor =
    document.getElementById("slider-contenedor");

const contenedorIndicadores =
    document.getElementById("slider-indicadores");


/* =========================
   FILTRAR Y ORDENAR NOTICIAS
========================= */

const noticiasDestacadas = [...noticias]
    .filter(noticia => noticia.destacada === true)
    .sort(
        (a, b) =>
            new Date(b.fecha) - new Date(a.fecha)
    )
    .slice(0, 5);


/* =========================
   CREAR SLIDER
========================= */

function crearSlider() {

    noticiasDestacadas.forEach(
        (noticia, indice) => {

            const slide =
                document.createElement("div");

            slide.classList.add("slide");


            if (indice === 0) {
                slide.classList.add("activo");
            }


            /* IMAGEN O VIDEO */

            let multimedia = "";


            if (noticia.tipo === "video") {

                multimedia = `
                    <video
                        class="slide-media"
                        autoplay
                        muted
                        loop
                        playsinline
                    >
                        <source
                            src="${noticia.media}"
                            type="video/mp4"
                        >
                    </video>
                `;

            } else {

                multimedia = `
                    <img
                        class="slide-media"
                        src="${noticia.media}"
                        alt="${noticia.titulo}"
                    >
                `;

            }


            /* CONTENIDO */

            slide.innerHTML = `

                <a href="${noticia.enlace}">

                    ${multimedia}

                    <div class="slide-overlay">

                        <div class="slide-contenido">

                            <span class="categoria">
                                ${noticia.categoria}
                            </span>

                            <h1>
                                ${noticia.titulo}
                            </h1>

                            <p>
                                ${noticia.descripcion}
                            </p>

                            <span class="boton">
                                ${noticia.boton}
                            </span>

                        </div>

                    </div>

                </a>
            `;


            sliderContenedor.appendChild(slide);


            /* INDICADORES */

            const indicador =
                document.createElement("button");

            indicador.classList.add("indicador");


            if (indice === 0) {
                indicador.classList.add("activo");
            }


            contenedorIndicadores.appendChild(
                indicador
            );

        }
    );

}


/* CREAR LAS NOTICIAS */

crearSlider();


/* =========================
   BUSCAR ELEMENTOS
========================= */

const slides =
    document.querySelectorAll(".slide");

const indicadores =
    document.querySelectorAll(".indicador");

const botonAnterior =
    document.querySelector(".anterior");

const botonSiguiente =
    document.querySelector(".siguiente");


let slideActual = 0;

let intervalo;


/* =========================
   MOSTRAR SLIDE
========================= */

function mostrarSlide(indice) {

    slides.forEach(slide => {
        slide.classList.remove("activo");
    });


    indicadores.forEach(indicador => {
        indicador.classList.remove("activo");
    });


    slides[indice].classList.add("activo");

    indicadores[indice].classList.add("activo");

}


/* =========================
   SIGUIENTE
========================= */

function siguienteSlide() {

    slideActual++;

    if (slideActual >= slides.length) {
        slideActual = 0;
    }

    mostrarSlide(slideActual);

}


/* =========================
   ANTERIOR
========================= */

function anteriorSlide() {

    slideActual--;

    if (slideActual < 0) {
        slideActual = slides.length - 1;
    }

    mostrarSlide(slideActual);

}


/* =========================
   BOTONES
========================= */

botonSiguiente.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        siguienteSlide();

        reiniciarIntervalo();

    }
);


botonAnterior.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        anteriorSlide();

        reiniciarIntervalo();

    }
);


/* =========================
   INDICADORES
========================= */

indicadores.forEach(
    (indicador, indice) => {

        indicador.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                slideActual = indice;

                mostrarSlide(slideActual);

                reiniciarIntervalo();

            }
        );

    }
);


/* =========================
   CAMBIO AUTOMÁTICO
========================= */

function iniciarIntervalo() {

    intervalo = setInterval(
        siguienteSlide,
        6000
    );

}


function reiniciarIntervalo() {

    clearInterval(intervalo);

    iniciarIntervalo();

}


if (slides.length > 1) {

    iniciarIntervalo();

}