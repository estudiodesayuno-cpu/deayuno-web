const CDN_COMICS =
    "https://pub-4f9f123581b24b2c9128afd4cc915fc7.r2.dev";






const comics = [
    {
        id: "comic-1",

        titulo: "Pimporra",

      portada:
        `${CDN_COMICS}/comic-1/portada.webp`,

      logo:
        `${CDN_COMICS}/comic-1/titulo.webp`,

        descripcion:
            "No lo dejan chambear al pobre.",

        categoria: "Comedia y putazos",

        estado: "En publicación",

        enlace:
            "lector.html?comic=comic-1",

        capitulos: [
            {
                titulo: "Capítulo 1",

                carpeta:
                    "comic-1/capitulo-1",

                paginas: 3
            },

            {
                titulo: "Capítulo 2",

                carpeta:
                    "comic-1/capitulo-2",

                paginas: 25
            }



        ]
    }
];