// URL base para las operaciones de la galería
const url = "http://localhost:3000/galeria/";
// Variable para determinar si se está creando o editando
let accionFormGal = ''; 
// ID del registro de la galería que se editará
let idFormGaleria = 0; 
// Referencia al formulario de la galería
const formGaleria = document.querySelector("form");

// Inicializa el modal para la galería
const modalGaleria = new bootstrap.Modal(document.getElementById('modalGaleria'), {
    backdrop: 'static', // Desactiva el cierre del modal con clic fuera del modal
    keyboard: false // Desactiva el cierre del modal con la tecla ESC
});

// // Evento para cuando el modal se muestra
modalGaleria._element.addEventListener("show.bs.modal", () => {
    // Cuando el modal se muestra, eliminamos 'inert' para que sea accesible e interactuable
    modalGaleria._element.removeAttribute("inert");
  });
  // // Evento para cuando el modal se oculta
  modalGaleria._element.addEventListener("hide.bs.modal", () => {
    setTimeout(() => {
      if (btnAgregarGaleria) btnAgregarGaleria.focus(); // Mueve el foco fuera del modal
  
      // Cuando el modal se oculta, agregamos 'inert' para desactivar la interactividad
      modalGaleria._element.setAttribute("inert", ""); 
    }, 10);
  });


// Función para cargar la galería desde el servidor
export const cargarGaleria = async () => {
    console.log("Recargando datos de la galería desde la API...");

    const tablaCuerpoGaleria = document.querySelector("#tablaGaleria");

    // Verifica si el elemento de la tabla existe en el DOM
    if (!tablaCuerpoGaleria) {
        console.error("Error: El elemento con id 'tablaGaleria' no se encuentra en el DOM.");
        return;
    }

    try {
        // Realiza una petición a la API para obtener los datos de la galería
        const response = await fetch(url);
        const dataGaleria = await response.json(); // Convierte la respuesta en JSON

        // Limpia el contenido actual de la tabla
        tablaCuerpoGaleria.innerHTML = "";

        // Itera sobre cada objeto de galería y agrega una fila a la tabla
        dataGaleria.forEach((galeria) => {
            console.log("Datos de la galería cargados:", dataGaleria);
            const filaGaleria = document.createElement("tr");
            filaGaleria.innerHTML = `
                <td>${galeria.id_galeria}</td>
                <td data-id="${galeria.fk_usuario}">${galeria.usuario}</td> 
                <td><img src="/uploadsGaleria/${galeria.img_galeria}" class="rounded" alt="Imagen de perfil" width="250" height="200"></td>
                <td>${galeria.pie_galeria}</td>
                <td class="text-center">
                    <a class="btnEditarGaleria btn btn-outline-warning">Editar</a>
                    <a class="btnBorrarGaleria btn btn-outline-danger">Borrar</a>
                </td>
            `;
            console.log(`Usuario en la tabla: ${galeria.usuario}, ID almacenado: ${galeria.fk_usuario}`);
            tablaCuerpoGaleria.appendChild(filaGaleria); // Agrega la fila a la tabla
        });

        
    } catch (error) {
        console.error("Error al cargar la galería:", error);
    }
    // Registra los eventos dinámicos para los botones de Editar y Borrar
    registrarEventosGaleria();
};

// Función para registrar los eventos dinámicos de los botones en la galería
const registrarEventosGaleria = () => {
    const btnAgregarGaleria = document.querySelector("#btnAgregarGaleria");

    // Evento para el botón "Agregar"
    if (btnAgregarGaleria) {
        btnAgregarGaleria.addEventListener("click", () => {
            console.log("El botón AgregarGaleria fue presionado.");

            if (formGaleria) formGaleria.reset(); // Limpia el formulario

            

            const imgAgregarGaleria = document.querySelector("#img-preview2");
            if (imgAgregarGaleria) imgAgregarGaleria.style.display = "none"; // Oculta la imagen previa
            

            modalGaleria.show(); // Muestra el modal
            accionFormGal = 'crear'; // Configura la opción como "crear"
        });
    }
    

    // Delegación de eventos para los botones "Editar" y "Borrar"
    const tablaGaleria = document.querySelector("#tablaGaleria");
    if (!tablaGaleria) {
        console.error("Error: La tabla de galería no está en el DOM.");
        return;
    }

    // Evitar duplicación de eventos
    if (tablaGaleria.dataset.eventRegistered) {
        console.log("Eventos ya registrados en tablaGaleria. No se duplicarán.");
        return;
    }


    tablaGaleria.addEventListener("click", (e) => {
        // Evento para el botón "Editar"
        if (e.target.classList.contains("btnEditarGaleria")) {
            const filaGaleria = e.target.closest("tr"); // Obtiene la fila del elemento clickeado
            if (!filaGaleria) {
                console.error("Error: No se pudo obtener la fila correspondiente.");
                return;
            }
    
            console.log("Fila seleccionada:", filaGaleria); // Depuración: Muestra la fila seleccionada
            
            idFormGaleria = filaGaleria.children[0].innerHTML; // Obtiene el ID del registro a editar
            console.log("ID de galería a actualizar:", idFormGaleria);
                 // Rellena el formulario con los valores actuales de la fila
                 const fkUserInput = document.getElementById("fk_user");
                 const comentarioInput = document.getElementById("comentarioGal");
     
                 if (fkUserInput && comentarioInput) {
                    fkUserInput.value = filaGaleria.children[1]?.getAttribute("data-id"); //Captura el ID
        console.log("ID de usuario capturado:", fkUserInput.value); // Verificar en consola
    
                    //  fkUserInput.value = filaGaleria.children[1].getAttribute("data-id"); // Obtiene el ID

                     comentarioInput.value = filaGaleria.children[3].innerHTML;
                 } else {
                     console.error("Error: Los inputs no están disponibles en el DOM.");
                 }
     
            const imgPreview2 = document.querySelector("#img-preview2");
            const imagenElemento = filaGaleria.children[2].querySelector("img");

            // Asigna el `src` de la imagen seleccionada al `img-preview2`
            imgPreview2.src = imagenElemento.src;
            imgPreview2.style.display = "block"; // Asegúrate de que la imagen sea visible
           
            accionFormGal = 'editar'; // Configura la opción como "editar"
            modalGaleria.show(); // Muestra el modal
        }

        
        // Evento para el botón "Borrar"
        else if (e.target.classList.contains("btnBorrarGaleria")) {
            const filaGaleria = e.target.closest("tr"); // Obtiene la fila del elemento clickeado
            const id = filaGaleria.firstElementChild.innerHTML; // Obtiene el ID de la galería a eliminar

            // Muestra una alerta de confirmación
            alertify.confirm("¿Está seguro de eliminar la galería?", () => {
                // Si el usuario confirma, realiza la solicitud DELETE
                fetch(url + id, { method: 'DELETE' })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar galería.");
                        filaGaleria.remove(); // Elimina la fila de la tabla sin recargar la página
                        alertify.alert("Galería eliminada.", () => alertify.message('OK'));
                    })
                    .catch((error) => {
                        console.error("Error durante la eliminación:", error);
                        alertify.error("Hubo un problema al intentar eliminar la galería.");
                    });
            }, () => {
                alertify.error('Cancel'); // Si el usuario cancela, muestra un mensaje
            });
        }
        
    });
        // Marca que los eventos ya se registraron
        tablaGaleria.dataset.eventRegistered = true;

};

// Evento para enviar el formulario de creación o edición
formGaleria.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    const formData = new FormData(e.target); // Captura los datos del formulario
    console.log("Datos capturados:", formData.get("fk_usuario"), formData.get("pie_galeria"));

    // Verifica que los campos necesarios no estén vacíos
    if (!formData.get("fk_usuario") || !formData.get("pie_galeria")) {
        console.error("Los datos están incompletos. Verifica el formulario.");
        return;
    }

    // Referencia a la sección de mensajes de error
    const mensajeErrorGaleria = document.querySelector(".errorGaleria");

    const botonEnviarGaleria = e.submitter; // Obtiene el botón que envió el formulario

    // Deshabilita el botón y cambia el texto mientras se envían los datos
    botonEnviarGaleria.disabled = true;
    botonEnviarGaleria.textContent = "Enviando...";

    try {
        let url2 = "";
        let metodo = "";

        // Determina si se va a crear o editar en función de la opción seleccionada
        if (accionFormGal === 'crear') {
            url2 = "http://localhost:3000/galeria";
            metodo = "POST"; // Método para crear
        } else if (accionFormGal === 'editar') {
            url2 = `http://localhost:3000/galeria/${idFormGaleria}`;
            metodo = "PUT"; // Método para editar
        }

        // Realiza la solicitud al servidor con los datos del formulario
        const res = await fetch(url2, {
            method: metodo,
            body: formData 
        });
        console.log("Datos enviados:", Object.fromEntries(formData.entries()));
        if (!res.ok) {
            const errorText = await res.text(); // Obtiene el mensaje de error
            mensajeErrorGaleria.classList.remove("escondido"); // Muestra el mensaje de error
            mensajeErrorGaleria.textContent = errorText || "Hubo un error inesperado.";
            console.error("Error en la solicitud:", errorText);
            botonEnviarGaleria.disabled = false; // Habilita el botón nuevamente
            botonEnviarGaleria.textContent = "Guardar"; // Restaura el texto del botón
            return;
        }

        const resJson = await res.json(); // Convierte la respuesta en JSON
        console.log(resJson);

         // Configuro Alertify para ocultar el encabezado
        alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado
        // Muestra un mensaje de éxito y cierra el modal
        alertify.alert(accionFormGal === 'crear' ? "Galería creada exitosamente." : "Galería actualizada correctamente.", () => {
            alertify.message('OK');
        });
        // Limpio formulario y cierro el modal
      formGaleria.reset();
        modalGaleria.hide(); // Cierra el modal después de guardar

        

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alertify.error("Hubo un problema al realizar la operación. Intenta más tarde.");
    } finally {
        // Restaura el estado del botón
        botonEnviarGaleria.disabled = false;
        botonEnviarGaleria.textContent = "Guardar";
    }
    
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada completamente.");
    cargarGaleria(); 
});
// Escucha el evento personalizado disparado desde admin.js
document.addEventListener("seccionGestionGaleriaCargada", () => {
    console.log("Sección de gestión de galería cargada. Ejecutando inicializaciones...");

});


// document.addEventListener("seccionGestionGaleriaCargada", () => {
//     const tablaGaleria = document.querySelector("#tablaGaleria");

//     if (!tablaGaleria) {
//         console.error("Error: No se encontró la tabla de galería en el DOM.");
//         return;
//     }

//     // Verificar si los datos ya están cargados
//     if (tablaGaleria.dataset.dataLoaded) {
//         console.log("Los datos de la galería ya están cargados. Saltando recarga.");
//         return;
//     }

//     console.log("Sección de gestión de galería cargada. Ejecutando inicializaciones...");
//     // cargarGaleria(); // Solo recarga los datos una vez
//     tablaGaleria.dataset.dataLoaded = true; // Marca los datos como cargados
// });








// // Gestion galeria
// const url = "http://localhost:3000/galeria/";
// let opcion2 = '';
// let idFormGaleria = 0;
// const formGaleria = document.querySelector("form");

// // Inicializa modalUsuarios como constante al cargar el DOM
// const modalGaleria = new bootstrap.Modal(document.getElementById('modalGaleria'), {
//     backdrop: 'static', // Desactiva el cierre del modal con click fuera del modal
//     keyboard: false // Desactiva el cierre del modal con la tecla ESC
// });

// modalGaleria._element.addEventListener("show.bs.modal", () => {
//     modalGaleria._element.removeAttribute("inert"); // Quitar inert cuando se muestra el modal
// });

// modalGaleria._element.addEventListener("hide.bs.modal", () => {
//     setTimeout(() => {
//         const btnAgregarGaleria = document.querySelector("#btnAgregarGaleria");
//         if (btnAgregarGaleria) btnAgregarGaleria.focus(); // Mueve el foco fuera del modal
//         modalGaleria._element.setAttribute("inert", ""); // Agregar inert al cerrar el modal
//     }, 10);
// });

// // Función para cargar la galería
// export const cargarGaleria = async () => {
//     const tablaCuerpoGaleria = document.querySelector("#tablaGaleria");

//     if (!tablaCuerpoGaleria) {
//         console.error("Error: El elemento con id 'tablaGaleria' no se encuentra en el DOM.");
//         return;
//     }

//     try {
//         const response = await fetch(url);
//         const dataGaleria = await response.json();
//         tablaCuerpoGaleria.innerHTML = ""; // Limpia contenido de la tabla

//         dataGaleria.forEach((galeria) => {
//             const fila = document.createElement("tr");
//             fila.innerHTML = `
//                 <td>${galeria.id_galeria}</td>
//                 <td>${galeria.fk_usuario}</td>
//                 <td><img src="/uploadsGaleria/${galeria.img_galeria}" class="rounded" alt="Imagen de perfil" width="250" height="200"></td>
//                 <td>${galeria.pie_galeria}</td>
//                 <td class="text-center">
//                     <a class="btnEditarGaleria btn btn-outline-warning">Editar</a>
//                     <a class="btnBorrarGaleria btn btn-outline-danger">Borrar</a>
//                 </td>
//             `;
//             tablaCuerpoGaleria.appendChild(fila);
//         });

//         registrarEventosGaleria(); // Registra eventos dinámicos
//     } catch (error) {
//         console.error("Error al cargar la galería:", error);
//     }
// };

// // Registra los eventos dinámicos de la sección
// const registrarEventosGaleria = () => {
//     const btnAgregarGaleria = document.querySelector("#btnAgregarGaleria");

//     if (btnAgregarGaleria) {
//         btnAgregarGaleria.addEventListener("click", () => {
//             console.log("El botón Agregar fue presionado.");
//             if (formGaleria) formGaleria.reset(); // Limpia el formulario

//             const fileInfo = document.querySelector("#file-info");
//             if (fileInfo) {
//                 fileInfo.textContent = ''; // Limpia información del archivo
//             }

//             const imgPreview2 = document.querySelector("#img-preview2");
//             if (imgPreview2) {
//                 imgPreview2.src = "";
//                 imgPreview2.style.display = "none"; // Oculta la imagen previa
//             }

//             modalGaleria.show();
//             opcion2 = 'crear';
//         });
//     }

//     document.querySelectorAll(".btnEditarGaleria").forEach((btn) => {
//         btn.addEventListener("click", (e) => {
//             console.log("El botón Editar fue presionado.");
//             const fila = e.target.closest("tr");
//             idFormGaleria = fila.children[0].innerHTML;

//             document.getElementById("fk_user").value = fila.children[1].innerHTML;
//             document.getElementById("comentarioGal").value = fila.children[3].innerHTML;

//             const imgPreview2 = document.querySelector("#img-preview2");
//             const imagenElemento = fila.children[2].querySelector("img");
//             if (imgPreview2 && imagenElemento) {
//                 imgPreview2.src = imagenElemento.src;
//                 imgPreview2.style.display = "block";
//             } else {
//                 imgPreview2.src = "";
//                 imgPreview2.style.display = "none";
//             }

//             modalGaleria.show();
//             opcion2 = 'editar';
//         });
//     });

//     document.querySelectorAll(".btnBorrarGaleria").forEach((btn) => {
//         btn.addEventListener("click", (e) => {
//             const fila = e.target.closest("tr");
//             const id = fila.firstElementChild.innerHTML;

//             alertify.confirm("¿Está seguro de eliminar la galería?", () => {
//                 fetch(url + id, { method: 'DELETE' })
//                     .then((res) => {
//                         if (!res.ok) throw new Error("Error al eliminar galería.");
//                         fila.remove(); // Elimina la fila sin recargar la página
//                         alertify.alert("Galería eliminada.", () => alertify.message('OK'));
//                     })
//                     .catch((error) => {
//                         console.error("Error durante la eliminación:", error);
//                         alertify.error("Hubo un problema al intentar eliminar la galería.");
//                     });
//             }, () => {
//                 alertify.error('Cancel');
//             });
//         });
//     });
// };

// // Procedimientos para crear y editar
// formGaleria.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.target); // Captura los datos del formulario
//     console.log("Datos capturados:", formData.get("fk_usuario"), formData.get("pie_galeria"));

//     if (!formData.get("fk_usuario") || !formData.get("pie_galeria")) {
//         console.error("Los datos están incompletos. Verifica el formulario.");
//         return;
//     }

//     const mensajeError = document.querySelector(".errorGaleria");
//     const botonEnviar = e.submitter;

//     botonEnviar.disabled = true;
//     botonEnviar.textContent = "Enviando...";

//     try {
//         let url2 = "";
//         let metodo = "";

//         if (opcion2 === 'crear') {
//             url2 = "http://localhost:3000/galeria";
//             metodo = "POST";
//         } else if (opcion2 === 'editar') {
//             url2 = `http://localhost:3000/galeria/${idFormGaleria}`;
//             metodo = "PUT";
//         }

//         const res = await fetch(url2, { method: metodo, body: formData });
//         if (!res.ok) {
//             const errorText = await res.text();
//             mensajeError.classList.remove("escondido");
//             mensajeError.textContent = errorText || "Hubo un error inesperado.";
//             console.error("Error en la solicitud:", errorText);
//             botonEnviar.disabled = false;
//             botonEnviar.textContent = "Guardar";
//             return;
//         }

//         const resJson = await res.json();
//         console.log(resJson);
//         alertify.alert(opcion2 === 'crear' ? "Galería creada exitosamente." : "Galería actualizada correctamente.", () => {
//             alertify.message('OK');
//         });

//         modalGaleria.hide();
//     } catch (error) {
//         console.error("Error en la solicitud:", error);
//         alertify.error("Hubo un problema al realizar la operación. Intenta más tarde.");
//     } finally {
//         botonEnviar.disabled = false;
//         botonEnviar.textContent = "Guardar";
//     }
// });

// // Ejecutar automáticamente al cargar la sección
// document.addEventListener("DOMContentLoaded", () => {
//     cargarGaleria();
// });

