const gridNoticias =
    document.getElementById("grid-noticias");

const noticiasOrdenadas = [...noticias]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));


function crearPaginaNoticias() {

    noticiasOrdenadas.forEach(noticia => {

        const tarjeta =
            document.createElement("article");

        tarjeta.classList.add("noticia-card");


        let multimedia = "";

        if (noticia.tipo === "video") {

            multimedia = `
                <video
                    class="noticia-card-media"
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
                    class="noticia-card-media"
                    src="${noticia.media}"
                    alt="${noticia.titulo}"
                    loading="lazy"
                >
            `;

        }


        tarjeta.innerHTML = `

            <a
                href="${noticia.enlace}"
                class="noticia-card-enlace"
            >

                <div class="noticia-card-imagen">

                    ${multimedia}

                </div>


                <div class="noticia-card-info">

                   <div class="noticia-meta">

                    <span class="categoria">
                            ${noticia.categoria}
                        </span>

                     <span class="noticia-fecha">
                         ${formatearFecha(noticia.fecha)}
                    </span>

                    </div>

                        <h2>
                             ${noticia.titulo}
                        </h2>

                    <p>
                        ${noticia.descripcion}
                    </p>

                    <span class="leer-noticia">
                        ${noticia.boton}
                        →
                    </span>

                </div>

            </a>

        `;


        gridNoticias.appendChild(tarjeta);

    });

}


function formatearFecha(fecha) {

    const fechaObjeto =
        new Date(fecha + "T00:00:00");

    return fechaObjeto.toLocaleDateString(
        "es-MX",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


crearPaginaNoticias();