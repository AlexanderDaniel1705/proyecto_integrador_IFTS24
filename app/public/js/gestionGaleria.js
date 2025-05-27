// URL base para las operaciones de la galería
const urlAPIGaleria = "http://localhost:3000/galeria/";

// --- Variables del Módulo ---
// Estas se (re)asignarán CADA VEZ que la sección de usuarios se cargue.
let modalGaleriaInstance;     // Para la instancia de new bootstrap.Modal()
let currentFormGaleriaElement; // Para la referencia al <form id="register-formGal"> actual

// Variable para determinar si se está creando o editando
let accionFormGaleria = ''; 
// ID del registro de la galería que se editará
let idFormGaleria = 0; 


// --- Handlers para eventos del modal de Bootstrap ---
function handleModalBootstrapShow() {
    if (this) this.removeAttribute("inert");
}

function handleModalBootstrapHide() {
    // Uso currentFormUsuarioElement para el reset
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
    const galPicInput = document.getElementById('galeria_pic'); // Limpiar el input file también
    if (galPicInput) {
        galPicInput.value = null;
    }

    accionFormGaleria = '';
    idFormGaleria = 0;
    
    const btnAgregarGaleriaFocus = document.querySelector("#btnAgregarGaleria");
    setTimeout(() => {
        if (btnAgregarGaleriaFocus) btnAgregarGaleriaFocus.focus();
        if (this) this.setAttribute("inert", "");
    }, 10);
}

// Función para cargar la galería desde el servidor
export const cargarGaleria = async () => {
    console.log("Recargando datos de la galería desde la API...");

    const tablaCuerpoGaleria = document.querySelector("#tablaGaleria");

    // Verifica si el elemento de la tabla existe en el DOM
    if (!tablaCuerpoGaleria) {
        console.error("Error: El elemento con id 'tablaGaleria' no se encuentra en el DOM.");
        return;
    }
        // 1. OBTENER REFERENCIAS AL NUEVO DOM DEL MODAL Y FORMULARIO
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
        if (modalGaleriaInstance && typeof modalGaleriaInstance.dispose === 'function') {
            if (modalGaleriaInstance._element) {
                modalGaleriaInstance._element.removeEventListener("show.bs.modal", handleModalBootstrapShow);
                modalGaleriaInstance._element.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
            }
            modalGaleriaInstance.dispose();
        }
        modalGaleriaInstance = new bootstrap.Modal(modalElementDOMGal, {
            backdrop: 'static',
            keyboard: false
        });
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
    if (!currentFormGaleriaElement || !modalGaleriaInstance) {
        console.error("Faltan referencias al formulario o al modal.");
        return;
    }
    const btnAgregarGaleria = document.querySelector("#btnAgregarGaleria");
    const tablaGaleriaTBody = document.querySelector("#tablaGaleria");
    if (!btnAgregarGaleria) console.warn("Botón '#btnAgregargaleria' no encontrado para registrar evento.");
    if (!tablaGaleriaTBody) console.warn("Elemento 'tablaGaleria' (tbody) no encontrado para registrar evento.");

    alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado

    // Evento para el botón "Agregar"
    if (btnAgregarGaleria) {
        btnAgregarGaleria.addEventListener("click", async () => {
            console.log("Botón Agregar Galeria presionado.");
            accionFormGaleria = "crear";
            idFormGaleria = 0;
            currentFormGaleriaElement.reset(); // Usa la referencia actual del formulario

            // currentFormUsuarioElement.querySelector(".modal-title").textContent = "Agregar Nuevo Usuario";

            const imgPreviewGal = currentFormGaleriaElement.querySelector("#img-previewGal");
            if (imgPreviewGal) {
                imgPreviewGal.src = "#";
                imgPreviewGal.style.display = "none";
            }
            const galPicInput = currentFormGaleriaElement.querySelector("#galeria_pic");
            if (galPicInput) {
                galPicInput.value = null;
            }
            currentFormGaleriaElement.querySelectorAll('.errorGaleria, .errorGaleriaUsuario').forEach(span => {
                span.textContent = "";
                span.classList.add("escondido");
            });

            
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
     
                const imgPreviewGal = currentFormGaleriaElement.querySelector("#img-previewGal");
                if (imgPreviewGal) {
                    imgPreviewGal.src = "#";
                    imgPreviewGal.style.display = "none";
                }
                const galPicInput = currentFormGaleriaElement.querySelector("#galeria_pic"); 
                if (galPicInput) {
                    galPicInput.value = ""; // o null
                }
                currentFormGaleriaElement.querySelectorAll('.errorGaleria, .errorGaleriaUsuario').forEach(span => {
                    span.textContent = "";
                    span.classList.add("escondido");
                });
                
                currentFormGaleriaElement.querySelector("#fk_usuario").value = filaGaleria.cells[1].dataset.id;

                currentFormGaleriaElement.querySelector("#comentarioGal").value = filaGaleria.cells[3].textContent;
            
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
    tablaGaleriaTBody.dataset.eventRegistered = "true";
}

  // Evento para el submit del formulario
    if (currentFormGaleriaElement && !currentFormGaleriaElement.dataset.submitListenerAttached) {
        currentFormGaleriaElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const botonEnviar = e.submitter;
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...`;
            
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
                // const resJson = await response.json(); // Si esperas JSON en éxito
                alertify.success(accionFormGaleria === 'crear' ? "Galeria registrada." : "Galeria actualizada.");
               // Cierra el modal si está visible y hay instancia válida
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
            } finally {
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
            }
        });
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