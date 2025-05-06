// Realiza una solicitud al servidor para obtener las imágenes de la galería
fetch('http://localhost:3000/galeria') // URL según API
    .then(response => response.json()) // Convierte la respuesta en formato JSON
    .then(data => {
        const galeria = document.getElementById('galeria'); // Selecciona el contenedor de la galería
        galeria.innerHTML = ''; // Limpia el contenido previo de la galería

        // Itera sobre los datos obtenidos del servidor y genera los elementos de la galería
        data.forEach(item => {
            const div = document.createElement('div'); // Crea un contenedor para cada imagen y su descripción
            div.classList.add('galeria-item');
            const h3 = document.createElement('h3'); 
            h3.classList.add('galeria-usuario');
            const img = document.createElement('img'); // Crea un elemento <img> para la imagen
            const p = document.createElement('p'); // Crea un elemento <p> para el comentario

            h3.textContent= item.fk_usuario;//Inserta el usuario
            img.src = `uploadsGaleria/${item.img_galeria}`; // Ajusta la ruta de la imagen según la ubicación en el servidor
            img.classList.add('imgGal'); // Agrega la clase CSS para estilizar la imagen
            img.alt = item.fk_usuario; // Usa el nombre del usuario como atributo 'alt' de la imagen

            p.textContent = item.pie_galeria; // Inserta el texto del comentario debajo de la imagen
            p.classList.add('galeria-comentario');

            div.appendChild(h3);//Agrega el usuario al contenedor
            div.appendChild(img); // Agrega la imagen al contenedor
            div.appendChild(p); // Agrega el comentario al contenedor
            galeria.appendChild(div); // Agrega el contenedor a la galería
        });

        // Selecciona los elementos interactivos de la ventana de visualización completa
        const fullImgBox = document.querySelector("#fullImgBox"),
              fullImgGal = document.querySelector("#fullImgGal"),
              rightBtn = document.querySelector("#right-btn"),
              leftBtn = document.querySelector("#left-btn"),
              closeImg = document.querySelector("#closeImg"),
              listaImg = [...document.querySelectorAll(".imgGal")]; // Captura todas las imágenes generadas dinámicamente

        let indexImg = 0; // Variable que controla la imagen actual en la visualización completa

        // Agrega evento de clic a cada imagen para abrirla en pantalla completa
        listaImg.forEach((img, i) => {
            img.addEventListener("click", () => {
                clicked(i); // Guarda la posición de la imagen seleccionada
                fullImgBox.style.display = "flex"; // Muestra la ventana emergente con la imagen completa
                fullImgGal.src = img.src; // Muestra la imagen seleccionada en pantalla completa

                // Oculta el botón izquierdo si la primera imagen está activa
                leftBtn.style.display = i === 0 ? "none" : "block";

                // Oculta el botón derecho si la última imagen está activa
                rightBtn.style.display = i === listaImg.length - 1 ? "none" : "block";
            });
        });

        // Función para actualizar la imagen seleccionada
        function clicked(position) {
            indexImg = position; // Actualiza la posición de la imagen seleccionada
            fullImgGal.src = listaImg[indexImg].src; // Muestra la imagen correspondiente en pantalla completa
        }

        // Agrega evento para navegar a la imagen siguiente
        rightBtn.addEventListener("click", () => {
            if (indexImg < listaImg.length - 1) { // Verifica si hay una imagen siguiente
                indexImg++; // Incrementa la posición de la imagen
                fullImgGal.src = listaImg[indexImg].src; // Muestra la siguiente imagen
            }

            // Oculta el botón derecho si la última imagen está activa
            rightBtn.style.display = indexImg === listaImg.length - 1 ? "none" : "block";

            // Asegura que el botón izquierdo sea visible si ya no estamos en la primera imagen
            leftBtn.style.display = "block";
        });

        // Agrega evento para navegar a la imagen anterior
        leftBtn.addEventListener("click", () => {
            if (indexImg > 0) { // Verifica si hay una imagen anterior
                indexImg--; // Decrementa la posición de la imagen
                fullImgGal.src = listaImg[indexImg].src; // Muestra la imagen anterior
            }

            // Oculta el botón izquierdo si la primera imagen está activa
            leftBtn.style.display = indexImg === 0 ? "none" : "block";

            // Asegura que el botón derecho sea visible si aún hay imágenes siguientes
            rightBtn.style.display = "block";
        });

        // Agrega evento para cerrar la ventana emergente de imagen completa
        closeImg.addEventListener("click", () => {
            fullImgBox.style.display = "none"; // Oculta la ventana emergente
        });
    })
    .catch(error => console.error('Error al obtener las imágenes:', error)); // Captura y muestra errores en la consola