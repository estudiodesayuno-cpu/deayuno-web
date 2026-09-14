/* =========================================
   PÁGINA DE CÓMICS
========================================= */

const gridComics =
    document.getElementById("grid-comics");


/* =========================================
   CREAR TARJETAS
========================================= */

comics.forEach(comic => {

    const tarjeta =
        document.createElement("article");


    tarjeta.classList.add("comic-card");


    /* =====================================
       LEER PROGRESO GUARDADO
    ===================================== */

    const progreso =
        obtenerProgresoComic(comic);


    /* =====================================
       TEXTO DEL BOTÓN
    ===================================== */

    let textoBoton =
        "Comenzar a leer →";


    let informacionLectura =
        "";


    if (progreso.iniciado) {

        textoBoton =
            "Continuar leyendo →";


        informacionLectura = `
            <div class="comic-continuar">

                <span class="comic-continuar-etiqueta">
                    Continuar donde lo dejaste
                </span>

                <span class="comic-continuar-posicion">
                    ${progreso.tituloCapitulo}
                    · Página ${progreso.pagina}
                </span>

            </div>
        `;

    }


    /* =====================================
       BARRA DE PROGRESO
    ===================================== */

    let barraProgreso = "";


    if (progreso.iniciado) {

        barraProgreso = `
            <div class="comic-progreso">

                <div
                    class="comic-progreso-barra"
                    style="width: ${progreso.porcentaje}%"
                ></div>

            </div>

            <span class="comic-progreso-texto">
                ${progreso.porcentaje}% leído
            </span>
        `;

    }


    /* =====================================
       SIN CAPÍTULOS
    ===================================== */

    const tieneCapitulos =
        comic.capitulos &&
        comic.capitulos.length > 0;


    let boton = "";


    if (tieneCapitulos) {

        boton = `
            <a
                href="${comic.enlace}"
                class="comic-boton"
            >
                ${textoBoton}
            </a>
        `;

    } else {

        boton = `
            <span class="comic-boton comic-boton-deshabilitado">
                Próximamente
            </span>
        `;

    }


    /* =====================================
       HTML DE LA TARJETA
    ===================================== */

    tarjeta.innerHTML = `

        <a
            href="${tieneCapitulos ? comic.enlace : "#"}"
            class="comic-portada-enlace"
        >

            <img
                src="${comic.portada}"
                alt="${comic.titulo}"
                class="comic-card-portada"
                loading="lazy"
            >

        </a>


        <div class="comic-card-contenido">

            <div class="comic-card-meta">

                <span class="comic-categoria">
                    ${comic.categoria}
                </span>

                <span class="comic-estado">
                    ${comic.estado}
                </span>

            </div>


            <h2>
                ${comic.titulo}
            </h2>


            <p class="comic-descripcion">
                ${comic.descripcion}
            </p>


            ${informacionLectura}


            ${barraProgreso}


            ${boton}

        </div>

    `;


    gridComics.appendChild(
        tarjeta
    );

});


/* =========================================
   OBTENER PROGRESO DEL CÓMIC
========================================= */

function obtenerProgresoComic(comic) {

    const resultado = {

        iniciado: false,

        capitulo: 0,

        pagina: 1,

        tituloCapitulo: "",

        porcentaje: 0

    };


    if (
        !comic.capitulos ||
        comic.capitulos.length === 0
    ) {

        return resultado;

    }


    /* =====================================
       CAPÍTULO GUARDADO
    ===================================== */

    const claveCapitulo =
        `comic-${comic.id}-capitulo`;


    const capituloGuardado =
        localStorage.getItem(
            claveCapitulo
        );


    /*
    Si nunca abrió el cómic,
    todavía no existe progreso.
    */

    if (capituloGuardado === null) {

        return resultado;

    }


    let indiceCapitulo =
        Number(capituloGuardado);


    if (
        Number.isNaN(indiceCapitulo) ||
        indiceCapitulo < 0 ||
        indiceCapitulo >=
        comic.capitulos.length
    ) {

        indiceCapitulo = 0;

    }


    /* =====================================
       PÁGINA GUARDADA
    ===================================== */

    const clavePagina =
        `comic-${comic.id}-capitulo-${indiceCapitulo}-pagina`;


    const paginaGuardada =
        localStorage.getItem(
            clavePagina
        );


    let pagina =
        Number(paginaGuardada);


    if (
        Number.isNaN(pagina) ||
        pagina < 1
    ) {

        pagina = 1;

    }


    const capitulo =
        comic.capitulos[
            indiceCapitulo
        ];


    if (
        pagina >
        capitulo.paginas
    ) {

        pagina =
            capitulo.paginas;

    }


    /* =====================================
       CALCULAR PROGRESO TOTAL DEL CÓMIC
    ===================================== */

    let totalPaginas = 0;

    let paginasLeidas = 0;


    comic.capitulos.forEach(
        (capituloActual, indice) => {

            const cantidad =
                Number(
                    capituloActual.paginas
                ) || 0;


            totalPaginas +=
                cantidad;


            /*
            Capítulos anteriores:
            cuentan completos.
            */

            if (
                indice <
                indiceCapitulo
            ) {

                paginasLeidas +=
                    cantidad;

            }

        }
    );


    /*
    Sumamos la página actual.
    */

    paginasLeidas +=
        pagina;


    let porcentaje = 0;


    if (totalPaginas > 0) {

        porcentaje =
            Math.round(
                (
                    paginasLeidas /
                    totalPaginas
                ) * 100
            );

    }


    porcentaje =
        Math.max(
            0,
            Math.min(
                100,
                porcentaje
            )
        );


    /* =====================================
       RESULTADO
    ===================================== */

    resultado.iniciado =
        true;


    resultado.capitulo =
        indiceCapitulo;


    resultado.pagina =
        pagina;


    resultado.tituloCapitulo =
        capitulo.titulo;


    resultado.porcentaje =
        porcentaje;


    return resultado;

}