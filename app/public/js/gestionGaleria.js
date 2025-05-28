// URL base para las operaciones de la galería
const urlAPIGaleria = "http://localhost:3000/galeria/";

// --- Variables del Módulo ---
// Estas variables guardarán el estado y las referencias a elementos importantes de esta sección.
// Se (re)asignarán CADA VEZ que la sección de galería se cargue dinámicamente.

let modalGaleriaInstance;     // Para la instancia de new bootstrap.Modal()
let currentFormGaleriaElement; // Para la referencia al <form id="register-formGal"> actual

// Guarda la instancia del objeto Modal de Bootstrap para la galería.
let accionFormGaleria = ''; 
// Guarda la referencia al elemento <form> del modal de galería (ej. <form id="register-formGal">).
let idFormGaleria = 0; 

 // Código drag-scroll para la tabla galeria
    function inicializarDragScroll() {
    const tablaContenedor = document.querySelector('.table-responsive'); // Asumo que este es el contenedor de tu #tablaUsuarios

    if (tablaContenedor && !tablaContenedor.dataset.dragScrollInitialized) { // Verifica si ya se inicializó
        let isDown = false;
        let startX;
        let scrollLeft;

        tablaContenedor.addEventListener('mousedown', (e) => {
        // Evitar que el drag-scroll se active si se hace clic en un elemento interactivo dentro de la tabla.
        // Ajusto el selector '.closest()' según los elementos interactivos 
        if (e.target.closest('button, a, input, select, textarea, [onclick]')) {
            isDown = false; // Asegura que no se inicie el drag si el clic fue en un control
            tablaContenedor.classList.remove('active');
            return;
        }
        isDown = true;
        tablaContenedor.classList.add('active');
        startX = e.pageX - tablaContenedor.offsetLeft;
        scrollLeft = tablaContenedor.scrollLeft;
        });

        tablaContenedor.addEventListener('mouseleave', () => {
        if (isDown) { // Solo actuar si el mouse estaba presionado y salió del contenedor
            isDown = false;
            tablaContenedor.classList.remove('active');
        }
        });

        tablaContenedor.addEventListener('mouseup', () => {
        if (isDown) { // Solo actuar si el mouse estaba presionado
            isDown = false;
            tablaContenedor.classList.remove('active');
        }
        });

        tablaContenedor.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // Prevenir la selección de texto mientras se arrastra
        const x = e.pageX - tablaContenedor.offsetLeft;
        const walk = (x - startX) * 2; // velocidad del scroll
        tablaContenedor.scrollLeft = scrollLeft - walk;
        });

        tablaContenedor.dataset.dragScrollInitialized = 'true'; // Marca el elemento como inicializado
        console.log("Drag-scroll inicializado para .table-responsive.");
    } else if (tablaContenedor && tablaContenedor.dataset.dragScrollInitialized) {
        // console.log("Drag-scroll ya estaba inicializado para este .table-responsive.");
    } else {
        console.warn("Contenedor .table-responsive no encontrado para inicializar drag-scroll.");
    }
    }

// --- Handlers (manejadores) para eventos del modal de Bootstrap  ---
// Estas funciones se ejecutarán cuando el modal de galería se muestre o se oculte.

// Función que se ejecuta JUSTO ANTES de que el modal de galería se muestre.
function handleModalBootstrapShow() {
    // 'this' se refiere al elemento DOM del modal.
    // Quita el atributo 'inert' para asegurar que el modal sea interactivo.
    if (this) this.removeAttribute("inert");
}

// Función que se ejecuta JUSTO DESPUÉS de que el modal de galería se ha ocultado.
function handleModalBootstrapHide() {
    // referencia al formulario actual del modal 
    if (currentFormGaleriaElement) {
        currentFormGaleriaElement.reset();
        // Limpiar mensajes de error específicos del formulario
        currentFormGaleriaElement.querySelectorAll('.errorGaleria, .errorGaleriaUsuario').forEach(span => {
            span.textContent = "";
            span.classList.add("escondido");
        });
    }
    // Limpiar imagen previa (document.getElementById obtiene el actual)
    const imgPreviewGal = document.getElementById('img-previewGal');
    if (imgPreviewGal) {
        imgPreviewGal.src = ''; 
        imgPreviewGal.style.display = 'none';
    }
    // Limpia el input de archivo de imagen del modal de galería.
    const galPicInput = document.getElementById('galeria_pic'); // Limpiar el input file también
    if (galPicInput) {
        galPicInput.value = null;
    }
    // Reinicia las variables de control de estado del formulario 
    accionFormGaleria = '';
    idFormGaleria = 0;
    
    const btnAgregarGaleriaFocus = document.querySelector("#btnAgregarGaleria");
    setTimeout(() => {
        if (btnAgregarGaleriaFocus) btnAgregarGaleriaFocus.focus();
        if (this) this.setAttribute("inert", "");
    }, 10);// Pequeño delay.
}

// --- Función Principal Exportada (llamada desde admin.js para esta sección) ---
// Responsable de cargar los datos de la galería, (re)inicializar su modal y formulario,
// y registrar sus manejadores de eventos.

export const cargarGaleria = async () => {
    console.log("Recargando datos de la galería desde la API...");
    inicializarDragScroll();
    // Obtiene la referencia al cuerpo (<tbody>) de la tabla donde se mostrarán los elementos de la galería.
    const tablaCuerpoGaleria = document.querySelector("#tablaGaleria");

    // Verifica si el elemento de la tabla existe en el DOM
    if (!tablaCuerpoGaleria) {
        console.error("Error: El elemento con id 'tablaGaleria' no se encuentra en el DOM.");
        return;
    }
        // 1. OBTENER REFERENCIAS AL NUEVO DOM DEL MODAL Y FORMULARIO
        //admin.js recrea el HTML de la sección.
        currentFormGaleriaElement = document.getElementById("register-formGal");
        const modalElementDOMGal = document.getElementById('modalGaleria');

        if (!currentFormGaleriaElement) {
            console.error("Error: Formulario '#register-formGal' no encontrado.");
            return;
        }
        if (!modalElementDOMGal) {
            console.error("Error: Elemento del modal '#modalGaleria' no encontrado.");
            return;
        }

        // 2. (RE)INICIALIZAR LA INSTANCIA DEL MODAL DE BOOTSTRAP
            // Si ya existe una instancia de `modalGaleriaInstance` (de una carga anterior),
            // se debe "desechar" la instancia antigua.
        if (modalGaleriaInstance && typeof modalGaleriaInstance.dispose === 'function') {
            if (modalGaleriaInstance._element) {
                modalGaleriaInstance._element.removeEventListener("show.bs.modal", handleModalBootstrapShow);
                modalGaleriaInstance._element.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
            }
            // `dispose()` limpia la instancia de Bootstrap.
            modalGaleriaInstance.dispose();
        }
        // Crea una NUEVA instancia de `bootstrap.Modal` con el elemento DOM del modal de galería *actual*.
        modalGaleriaInstance = new bootstrap.Modal(modalElementDOMGal, {
            backdrop: 'static',// No cerrar al hacer clic fuera.
            keyboard: false // No cerrar con tecla Escape.
        });
            // (Re)Adjunta los manejadores de eventos `show` y `hide` al NUEVO elemento DOM del modal de galería.
        modalElementDOMGal.removeEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMGal.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
        modalElementDOMGal.addEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMGal.addEventListener("hide.bs.modal", handleModalBootstrapHide);


    // Cargar datos en la tabla
    try {
        // Realiza una petición a la API para obtener los datos de la galería
        const response = await fetch(urlAPIGaleria);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const dataGaleria = await response.json(); // Convierte la respuesta en JSON

        // Limpia el contenido actual de la tabla
        tablaCuerpoGaleria.innerHTML = "";
        console.log("Datos de la galería cargados:", dataGaleria);
        // Itera sobre cada objeto de galería y agrega una fila a la tabla
        dataGaleria.forEach((galeria) => {
            const filaGaleria = tablaCuerpoGaleria.insertRow(); // Más eficiente que crear tr y luego innerHTML
            // Construye el HTML para las celdas (<td>) de la fila.
            filaGaleria.innerHTML = `
                <td>${galeria.id_galeria}</td>
                <td data-id="${galeria.fk_usuario}">${galeria.usuario}</td> 
                <td><img src="/uploadsGaleria/${galeria.img_galeria}" class="rounded" alt="Imagen de perfil" width="250" height="200"></td>
                <td>${galeria.pie_galeria}</td>
                <td class="text-center">
                    <button class="btnEditarGaleria btn btn-outline-warning">Editar</button>
                    <button class="btnBorrarGaleria btn btn-outline-danger">Borrar</button>
                </td>
            `;
            // // console.log(`Usuario en la tabla: ${galeria.usuario}, ID almacenado: ${galeria.fk_usuario}`);
            // tablaCuerpoGaleria.appendChild(filaGaleria); // Agrega la fila a la tabla
        }); 
    } catch (error) {
        console.error("Error al cargar la galería:", error);
        tablaCuerpoGaleria.innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar la galeria.</td></tr>`;
    }
    // Registra los eventos dinámicos para los botones de Editar y Borrar
    registrarEventosGaleria();
};

// Función para registrar los eventos dinámicos de los botones en la galería
const registrarEventosGaleria = () => {
    // Verificar que las referencias al formulario y a la instancia del modal de galería estén disponibles.
    if (!currentFormGaleriaElement || !modalGaleriaInstance) {
        console.error("Faltan referencias al formulario o al modal.");
        return;
    }
     // Obtener referencias a los botones y la tabla de galería.
    const btnAgregarGaleria = document.querySelector("#btnAgregarGaleria");
    const tablaGaleriaTBody = document.querySelector("#tablaGaleria");
    // Advertir si no se encuentran elementos clave.
    if (!btnAgregarGaleria) console.warn("Botón '#btnAgregargaleria' no encontrado para registrar evento.");
    if (!tablaGaleriaTBody) console.warn("Elemento 'tablaGaleria' (tbody) no encontrado para registrar evento.");

    alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado

    // Evento para el botón "Agregar"
    if (btnAgregarGaleria) {
        btnAgregarGaleria.addEventListener("click", async () => {
            console.log("Botón Agregar Galeria presionado.");
            accionFormGaleria = "crear";
            idFormGaleria = 0;
            // Resetea el formulario de galería usando la referencia actual.
            currentFormGaleriaElement.reset(); 

            // Cambiar el título del modal de galería (opcional).
            // const modalTitleElement = currentFormGaleriaElement.querySelector(".modal-title"); 
            // if (modalTitleElement) modalTitleElement.textContent = "Agregar Nueva Imagen a Galería";

            // Limpieza explícita de la vista previa de la imagen de galería.
            const imgPreviewGal = currentFormGaleriaElement.querySelector("#img-previewGal");
            if (imgPreviewGal) {
                imgPreviewGal.src = "#";
                imgPreviewGal.style.display = "none";
            }
            // Limpieza explícita del input de archivo de galería.
            const galPicInput = currentFormGaleriaElement.querySelector("#galeria_pic");
            if (galPicInput) {
                galPicInput.value = null;
            }
            // Limpiar mensajes de error del formulario de galería.
            currentFormGaleriaElement.querySelectorAll('.errorGaleria, .errorGaleriaUsuario').forEach(span => {
                span.textContent = "";
                span.classList.add("escondido");
            });
             // ======= Obtener usuario desde sessionStorage y asignar al input =======
        const usuarioJSON = sessionStorage.getItem('user');
        // console.log("Usuario JSON desde sessionStorage:", usuarioJSON);

        if (usuarioJSON) {
            const usuarioObj = JSON.parse(usuarioJSON);
            /* console.log("Objeto usuario parseado:", usuarioObj); */

            const usuarioNombre = usuarioObj.usuario || "";
        /*  console.log("Nombre del usuario a asignar:", usuarioId); */

            const inputUsuario = currentFormGaleriaElement.querySelector("#fk_usuario");
            if (inputUsuario) {
                inputUsuario.value = usuarioNombre;
                /* console.log("Valor del input fk_usuario asignado:", inputUsuario.value); */
            } else {
                console.warn("Input #fk_usuario no encontrado en el formulario.");
            }
        } else {
            console.warn("No se encontró usuario en sessionStorage.");
        }


            
            modalGaleriaInstance.show(); // Usa la instancia actual del modal
        });
    }

    // Eventos en la tabla (Editar/Borrar)
    if (tablaGaleriaTBody && !tablaGaleriaTBody.dataset.eventRegistered) {
        tablaGaleriaTBody.addEventListener("click", async (e) => {
            const targetButton = e.target.closest("button");
            if (!targetButton) return;

            const filaGaleria = targetButton.closest("tr");
            if (!filaGaleria) return;

            if (targetButton.classList.contains("btnEditarGaleria")) {
                console.log("Botón Editar presionado.");
                accionFormGaleria = "editar";
                idFormGaleria = filaGaleria.cells[0].textContent;
                currentFormGaleriaElement.reset();

                // Cambiar título del modal (opcional).
                // const modalTitleElement = currentFormGaleriaElement.querySelector(".modal-title");
                // if (modalTitleElement) modalTitleElement.textContent = "Editar Imagen de Galería";

                // Limpieza explícita de la imagen y file input ANTES de poblar.
                const imgPreviewGal = currentFormGaleriaElement.querySelector("#img-previewGal");
                if (imgPreviewGal) {
                    imgPreviewGal.src = "#";
                    imgPreviewGal.style.display = "none";
                }
                const galPicInput = currentFormGaleriaElement.querySelector("#galeria_pic"); 
                if (galPicInput) {
                    galPicInput.value = ""; // o null
                }
                 // Limpiar mensajes de error.
                currentFormGaleriaElement.querySelectorAll('.errorGaleria, .errorGaleriaUsuario').forEach(span => {
                    span.textContent = "";
                    span.classList.add("escondido");
                });
                
                // Poblar los campos del formulario de galería con los datos de la fila.
                currentFormGaleriaElement.querySelector("#fk_usuario").value = filaGaleria.cells[1].dataset.id;

                currentFormGaleriaElement.querySelector("#comentarioGal").value = filaGaleria.cells[3].textContent;
            
                // Mostrar la imagen actual de la galería en la vista previa del modal.
                const imgEnTablaSrc = filaGaleria.cells[2].querySelector("img")?.src;
                if (imgPreviewGal && imgEnTablaSrc && !imgEnTablaSrc.endsWith("undefined")) {
                    imgPreviewGal.src = imgEnTablaSrc;
                    imgPreviewGal.style.display = "block";
                }
                
                modalGaleriaInstance.show();

    
        // Evento para el botón "Borrar"
             } else if (e.target.classList.contains("btnBorrarGaleria")) {
             const idGalBorrar = filaGaleria.cells[0].textContent; // Obtiene el ID de la galería a eliminar
             if (!idGalBorrar) {
                console.error("No se pudo obtener ID para borrar.");
                alertify.error("No se pudo obtener ID para borrar.");
                return;
            }
            // Muestra una alerta de confirmación
            alertify.confirm( `¿Está seguro de eliminar galeria con ID: ${idGalBorrar}?`,
                async () => {
                    try {
                        const response = await fetch(`${urlAPIGaleria}${idGalBorrar}`, { method: "DELETE" });
                        if (!response.ok) {
                            let errorMsg = "Error al eliminar.";
                            try { errorMsg = (await response.json()).message || errorMsg; } catch (e) {}
                            throw new Error(errorMsg);
                        }
                        filaGaleria.remove();
                        alertify.success("Galeria eliminada.");
                    } catch (error) {
                        console.error("Error durante la eliminación:", error);
                        alertify.error(`Error: ${error.message}`);
                    }
                },
                () => { alertify.error("Cancelado"); }
            ).set('labels', {ok:'Sí, Eliminar', cancel:'Cancelar'});
        }
    });
    // Marcar el tbody para evitar re-registrar el listener.
    tablaGaleriaTBody.dataset.eventRegistered = "true";
}

  // Evento para el submit del formulario
    if (currentFormGaleriaElement && !currentFormGaleriaElement.dataset.submitListenerAttached) {
        currentFormGaleriaElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const botonEnviar = e.submitter;// Botón que hizo submit.
            // Deshabilitar botón y mostrar feedback.
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...`;
            
             // Crear FormData con los datos del formulario de galería.
            const formData = new FormData(currentFormGaleriaElement);

            let targetUrl = "";
            let metodoHTTP = "";

            if (accionFormGaleria === 'crear') {
                targetUrl = urlAPIGaleria;
                metodoHTTP = "POST";
            } else if (accionFormGaleria === 'editar') {
                targetUrl = `${urlAPIGaleria}${idFormGaleria}`;
                metodoHTTP = "PUT";
            } else {
                console.error("Acción desconocida:", accionFormGaleria);
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
                return;
            }

            try {
                const response = await fetch(targetUrl, { method: metodoHTTP, body: formData });
                if (!response.ok) {
                    let errorMsg = `Error ${response.status}`;
                    try { const errData = await response.json(); errorMsg = errData.message || JSON.stringify(errData); }
                    catch (e) { errorMsg = await response.text() || errorMsg; }
                    throw new Error(errorMsg);
                }
                
                alertify.success(accionFormGaleria === 'crear' ? "Galeria registrada." : "Galeria actualizada.");
                // Lógica para cerrar modal y recargar tabla 
               const modalGaleriaElement = document.getElementById("modalGaleria");
                if (modalGaleriaElement && modalGaleriaElement.classList.contains("show")) {
                    const modalGaleriaInstance = bootstrap.Modal.getOrCreateInstance(modalGaleriaElement);

                    modalGaleriaElement.addEventListener("hidden.bs.modal", function handler() {
                        modalGaleriaElement.removeEventListener("hidden.bs.modal", handler); // Evita múltiples llamadas
                        cargarGaleria(); // Solo se llama una vez el modal está cerrado
                    });

                    modalGaleriaInstance.hide();
                } else {
                    cargarGaleria(); // Si no está visible, cargamos directamente
                }

            } catch (error) {
                console.error("Error en submit:", error);
                const mensajeErrorSpan = currentFormGaleriaElement.querySelector(".modal-footer .errorGaleria.escondido") || currentFormGaleriaElement.querySelector(".errorGaleria.escondido");
                if(mensajeErrorSpan){
                    mensajeErrorSpan.textContent = error.message;
                    mensajeErrorSpan.classList.remove("escondido");
                } else {
                    alertify.error(error.message);
                }
            } finally {// Siempre se ejecuta.
                // Restaurar botón de envío.
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
            }
        });
        // Marcar formulario para evitar re-registrar listener de submit.
        currentFormGaleriaElement.dataset.submitListenerAttached = "true";
    }

    // Registrar Listeners de Validación de Inputs 
    // registrarValidadoresDeInput(); 
    

 // --- Listener para evento personalizado ---
// Escucha el evento personalizado disparado desde admin.js
document.addEventListener("seccionGestionGaleriaCargada", () => {
    console.log("Sección de gestión de galería cargada. Ejecutando inicializaciones...");

});
};