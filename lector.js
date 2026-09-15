/* =========================================
   LECTOR DE CÓMICS
========================================= */


/* =========================================
   DATOS DESDE URL
========================================= */

const parametros =
    new URLSearchParams(window.location.search);

const comicId =
    parametros.get("comic");

const comicActual =
    comics.find(comic => comic.id === comicId);


/* =========================================
   ELEMENTOS HTML
========================================= */

const lectorLogo =
    document.getElementById("lector-logo");

const selectorCapitulo =
    document.getElementById("selector-capitulo");

const lectorComic =
    document.getElementById("lector-comic");

const barraProgreso =
    document.getElementById("barra-progreso");

const porcentajeLectura =
    document.getElementById("porcentaje-lectura");

const textoPaginaActual =
    document.getElementById("pagina-actual");

const finCapitulo =
    document.getElementById("fin-capitulo");

const finTitulo =
    document.getElementById("fin-titulo");

const finAnterior =
    document.getElementById("fin-anterior");

const finSiguiente =
    document.getElementById("fin-siguiente");

const barraLector =
    document.querySelector(
        ".barra-lector"
    );


const barraLector =
    document.querySelector(".barra-lector");



/* =========================================
   VARIABLES
========================================= */

let capituloActual = 0;

let paginaVisibleActual = 1;

let observadorPaginas = null;

let temporizadorGuardado = null;

let actualizandoScroll = false;

let ultimoScroll =
    window.scrollY;
let ultimoScroll =
    window.scrollY;

/* =========================================
   INICIAR
========================================= */

if (!comicActual) {

    mostrarComicNoEncontrado();

} else {

    iniciarComic();

}


/* =========================================
   INICIAR CÓMIC
========================================= */

function iniciarComic() {

    lectorLogo.src =
    comicActual.logo;

    lectorLogo.alt =
    comicActual.titulo;

    if (
        !comicActual.capitulos ||
        comicActual.capitulos.length === 0
    ) {

        mostrarSinCapitulos();

        return;
    }


    crearSelectorCapitulos();

    recuperarCapituloGuardado();

    cargarCapitulo(
        capituloActual,
        true
    );

}


/* =========================================
   CÓMIC NO ENCONTRADO
========================================= */

function mostrarComicNoEncontrado() {

   


    selectorCapitulo.disabled = true;

    finAnterior.disabled = true;

    finSiguiente.disabled = true;


    lectorComic.innerHTML = `
        <div class="lector-error">

            <h2>
                Cómic no encontrado
            </h2>

            <p>
                No pudimos encontrar esta historia.
            </p>

            <a
                href="comics.html"
                class="boton"
            >
                Volver a cómics
            </a>

        </div>
    `;

}


/* =========================================
   SIN CAPÍTULOS
========================================= */

function mostrarSinCapitulos() {

    selectorCapitulo.disabled = true;

    finAnterior.disabled = true;

    finSiguiente.disabled = true;


    lectorComic.innerHTML = `
        <div class="lector-error">

            <h2>
                Próximamente
            </h2>

            <p>
                Todavía no hay capítulos disponibles.
            </p>

        </div>
    `;

}


/* =========================================
   SELECTOR DE CAPÍTULOS
========================================= */

function crearSelectorCapitulos() {

    selectorCapitulo.innerHTML = "";


    comicActual.capitulos.forEach(
        (capitulo, indice) => {

            const opcion =
                document.createElement("option");

            opcion.value =
                indice;

            opcion.textContent =
                capitulo.titulo;

            selectorCapitulo.appendChild(
                opcion
            );

        }
    );

}


/* =========================================
   CARGAR CAPÍTULO
========================================= */

function cargarCapitulo(
    indice,
    restaurarLectura = false
) {

    if (
        indice < 0 ||
        indice >= comicActual.capitulos.length
    ) {
        return;
    }


    if (observadorPaginas) {

        observadorPaginas.disconnect();

    }


    capituloActual =
        indice;


    paginaVisibleActual =
        1;


    lectorComic.innerHTML =
        "";


    selectorCapitulo.value =
        capituloActual;


    const capitulo =
        comicActual.capitulos[
            capituloActual
        ];


    /* -------------------------
       VALIDAR CAPÍTULO
    ------------------------- */

    if (
        !capitulo.carpeta ||
        !capitulo.paginas ||
        capitulo.paginas <= 0
    ) {

        lectorComic.innerHTML = `
            <div class="lector-error">

                <h2>
                    Capítulo no disponible
                </h2>

            </div>
        `;

        actualizarFinCapitulo();

        return;

    }


    /* -------------------------
       CREAR OBSERVADOR
    ------------------------- */

    crearObservadorPaginas();


    /* -------------------------
       CREAR IMÁGENES
    ------------------------- */

    for (
        let numero = 1;
        numero <= capitulo.paginas;
        numero++
    ) {

        const numeroArchivo =
            String(numero)
                .padStart(3, "0");


        const url =
            `${CDN_COMICS}/${capitulo.carpeta}/${numeroArchivo}.webp`;


        const imagen =
            document.createElement("img");


        imagen.src =
            url;


        imagen.alt =
            `${capitulo.titulo} - Página ${numero}`;


        imagen.dataset.pagina =
            numero;


        /*
        Las primeras páginas cargan
        inmediatamente.
        */

        if (numero <= 3) {

            imagen.loading =
                "eager";

        } else {

            imagen.loading =
                "lazy";

        }


        imagen.decoding =
            "async";


        imagen.addEventListener(
            "load",
            function() {

                actualizarProgresoLectura();

            }
        );


        imagen.addEventListener(
            "error",
            function() {

                console.error(
                    "No se pudo cargar:",
                    url
                );

                imagen.classList.add(
                    "pagina-error"
                );

            }
        );


        lectorComic.appendChild(
            imagen
        );


        observadorPaginas.observe(
            imagen
        );

    }


    /* -------------------------
       ACTUALIZAR UI
    ------------------------- */

    actualizarFinCapitulo();

    actualizarTextoPagina();

    guardarCapitulo();


    /*
    Esperamos un poco para que las
    imágenes tengan dimensiones.
    */

    requestAnimationFrame(
        function() {

            actualizarProgresoLectura();

        }
    );


    /* -------------------------
       RESTAURAR LECTURA
    ------------------------- */

    if (restaurarLectura) {

        setTimeout(
            restaurarPaginaGuardada,
            500
        );

    } else {

        window.scrollTo({
            top: 0,
            behavior: "auto"
        });


        setTimeout(
            actualizarProgresoLectura,
            100
        );

    }

}


/* =========================================
   OBSERVADOR DE PÁGINAS
========================================= */

function crearObservadorPaginas() {

    observadorPaginas =
        new IntersectionObserver(

            function(entradas) {

                let mejorPagina = null;

                let mejorDistancia =
                    Infinity;


                entradas.forEach(
                    entrada => {

                        if (
                            !entrada.isIntersecting
                        ) {
                            return;
                        }


                        const rect =
                            entrada.target
                                .getBoundingClientRect();


                        /*
                        Calculamos cuál imagen
                        está más cerca del centro
                        de la pantalla.
                        */

                        const centroImagen =
                            rect.top +
                            rect.height / 2;


                        const centroPantalla =
                            window.innerHeight / 2;


                        const distancia =
                            Math.abs(
                                centroImagen -
                                centroPantalla
                            );


                        if (
                            distancia <
                            mejorDistancia
                        ) {

                            mejorDistancia =
                                distancia;

                            mejorPagina =
                                entrada.target;

                        }

                    }
                );


                if (mejorPagina) {

                    paginaVisibleActual =
                        Number(
                            mejorPagina
                                .dataset
                                .pagina
                        );


                    actualizarTextoPagina();

                }

            },

            {
                threshold: [
                    0,
                    0.1,
                    0.25,
                    0.5,
                    0.75
                ]
            }

        );

}


/* =========================================
   TEXTO PÁGINA X DE X
========================================= */

function actualizarTextoPagina() {

    if (!comicActual) {
        return;
    }


    const capitulo =
        comicActual.capitulos[
            capituloActual
        ];


    textoPaginaActual.textContent =
        `Página ${paginaVisibleActual} de ${capitulo.paginas}`;

}


/* =========================================
   PROGRESO DE LECTURA
========================================= */

function actualizarProgresoLectura() {

    if (
        !lectorComic ||
        !barraProgreso ||
        !porcentajeLectura
    ) {
        return;
    }


    const rect =
        lectorComic
            .getBoundingClientRect();


    /*
    Posición absoluta donde empieza
    el cómic.
    */

    const inicioComic =
        window.scrollY +
        rect.top;


    /*
    Posición absoluta donde termina
    el cómic.
    */

    const finalComic =
        inicioComic +
        lectorComic.offsetHeight;


    /*
    Usamos el centro de la pantalla
    como punto actual de lectura.
    */

    const posicionActual =
        window.scrollY +
        window.innerHeight / 2;


    const recorrido =
        finalComic -
        inicioComic;


    let progreso = 0;


    if (recorrido > 0) {

        progreso =
            (
                posicionActual -
                inicioComic
            ) /
            recorrido;

    }


    progreso =
        Math.max(
            0,
            Math.min(
                1,
                progreso
            )
        );


    const porcentaje =
        Math.round(
            progreso * 100
        );


    barraProgreso.style.width =
        `${porcentaje}%`;


    porcentajeLectura.textContent =
        `${porcentaje}%`;

}


/* =========================================
   GUARDAR CAPÍTULO
========================================= */

function guardarCapitulo() {

    localStorage.setItem(

        `comic-${comicActual.id}-capitulo`,

        capituloActual

    );

}


/* =========================================
   RECUPERAR CAPÍTULO
========================================= */

function recuperarCapituloGuardado() {

    const guardado =
        localStorage.getItem(

            `comic-${comicActual.id}-capitulo`

        );


    if (guardado === null) {
        return;
    }


    const numero =
        Number(guardado);


    if (
        !Number.isNaN(numero) &&
        numero >= 0 &&
        numero <
        comicActual.capitulos.length
    ) {

        capituloActual =
            numero;

    }

}


/* =========================================
   GUARDAR PÁGINA Y POSICIÓN
========================================= */

function guardarPosicionLectura() {

    if (!comicActual) {
        return;
    }


    const imagen =
        lectorComic.querySelector(

            `img[data-pagina="${paginaVisibleActual}"]`

        );


    if (!imagen) {
        return;
    }


    const rect =
        imagen
            .getBoundingClientRect();


    let progreso =
        (
            window.innerHeight / 2 -
            rect.top
        ) /
        rect.height;


    progreso =
        Math.max(
            0,
            Math.min(
                1,
                progreso
            )
        );


    localStorage.setItem(

        `comic-${comicActual.id}-capitulo-${capituloActual}-pagina`,

        paginaVisibleActual

    );


    localStorage.setItem(

        `comic-${comicActual.id}-capitulo-${capituloActual}-progreso`,

        progreso

    );

}


/* =========================================
   RESTAURAR PÁGINA
========================================= */

function restaurarPaginaGuardada() {

    const paginaGuardada =
        Number(
            localStorage.getItem(

                `comic-${comicActual.id}-capitulo-${capituloActual}-pagina`

            )
        );


    if (
        !paginaGuardada ||
        paginaGuardada < 1
    ) {

        actualizarProgresoLectura();

        return;

    }


    const imagen =
        lectorComic.querySelector(

            `img[data-pagina="${paginaGuardada}"]`

        );


    if (!imagen) {
        return;
    }


    let progreso =
        Number(
            localStorage.getItem(

                `comic-${comicActual.id}-capitulo-${capituloActual}-progreso`

            )
        );


    if (
        Number.isNaN(progreso)
    ) {

        progreso = 0;

    }


    paginaVisibleActual =
        paginaGuardada;


    actualizarTextoPagina();


    /*
    Primero colocamos la página arriba.
    */

    imagen.scrollIntoView({
        behavior: "auto",
        block: "start"
    });


    /*
    Después ajustamos dentro de
    la propia página.
    */

    setTimeout(
        function() {

            const altura =
                imagen.offsetHeight;


            window.scrollBy({
                top:
                    altura * progreso -
                    window.innerHeight / 2,

                behavior: "auto"
            });


            actualizarProgresoLectura();

        },
        150
    );

}


/* =========================================
   FIN DEL CAPÍTULO
========================================= */

function actualizarFinCapitulo() {

    const capitulo =
        comicActual.capitulos[
            capituloActual
        ];


    finTitulo.textContent =
        `Terminaste ${capitulo.titulo}`;


    finAnterior.disabled =
        capituloActual === 0;


    finSiguiente.disabled =
        capituloActual ===
        comicActual.capitulos.length - 1;

}


/* =========================================
   CAMBIAR CON SELECTOR
========================================= */

selectorCapitulo.addEventListener(
    "change",
    function() {

        guardarPosicionLectura();


        const nuevo =
            Number(
                selectorCapitulo.value
            );


        cargarCapitulo(
            nuevo,
            false
        );

    }
);


/* =========================================
   CAPÍTULO ANTERIOR
========================================= */

finAnterior.addEventListener(
    "click",
    function() {

        if (
            capituloActual <= 0
        ) {
            return;
        }


        guardarPosicionLectura();


        cargarCapitulo(
            capituloActual - 1,
            false
        );

    }
);


/* =========================================
   SIGUIENTE CAPÍTULO
========================================= */

finSiguiente.addEventListener(
    "click",
    function() {

        if (
            capituloActual >=
            comicActual.capitulos.length - 1
        ) {
            return;
        }


        guardarPosicionLectura();


        cargarCapitulo(
            capituloActual + 1,
            false
        );

    }
);


/* =========================================
   SCROLL
========================================= */

window.addEventListener(
    "scroll",
    function() {

        const scrollActual =
            window.scrollY;


        /* =========================================
           PROGRESO DE LECTURA
        ========================================= */

        if (!actualizandoScroll) {

            actualizandoScroll = true;

            requestAnimationFrame(
                function() {

                    actualizarProgresoLectura();

                    actualizandoScroll =
                        false;
                }
            );
        }


        /* =========================================
           GUARDAR POSICIÓN
        ========================================= */

        clearTimeout(
            temporizadorGuardado
        );

        temporizadorGuardado =
            setTimeout(
                guardarPosicionLectura,
                250
            );


        /* =========================================
           BARRA MÓVIL AUTOMÁTICA
        ========================================= */

        if (
            window.innerWidth <= 700 &&
            barraLector
        ) {

            /*
            Si estamos cerca de arriba,
            siempre mostramos la barra.
            */

            if (scrollActual < 100) {

                barraLector
                    .classList
                    .remove("oculta");
            }

            /*
            Estamos bajando.
            */

            else if (
                scrollActual >
                ultimoScroll
            ) {

                barraLector
                    .classList
                    .add("oculta");
            }

            /*
            Estamos subiendo.
            */

            else if (
                scrollActual <
                ultimoScroll
            ) {

                barraLector
                    .classList
                    .remove("oculta");
            }
        }


        /*
        Guardamos la posición para
        compararla en el siguiente scroll.
        */

        ultimoScroll =
            scrollActual;
    },
    {
        passive: true
    }
);

/* =========================================
   CAMBIO DE TAMAÑO
========================================= */

window.addEventListener(
    "resize",
    actualizarProgresoLectura
);


/* =========================================
   ANTES DE SALIR
========================================= */

window.addEventListener(
    "beforeunload",
    guardarPosicionLectura
);