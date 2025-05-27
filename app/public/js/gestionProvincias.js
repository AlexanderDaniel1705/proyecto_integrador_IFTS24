// URL base para las operaciones de las provincias
const urlAPIProvincia = "http://localhost:3000/provincias/";

// --- Variables del Módulo ---
// Estas variables guardarán el estado y las referencias a elementos importantes de esta sección.
// Se (re)asignarán CADA VEZ que la sección de provincia se cargue dinámicamente.

// Guardará la instancia del objeto Modal de Bootstrap 
let modalProvinciasInstance;  
// Guardará la referencia al elemento <form> del modal  (ej. <form id="register-formProvincias">).   
let currentFormProvinciasElement; 

// Variable para determinar si se está creando o editando
let accionFormProvincias = ''; 
// Guarda el ID del elemento de la galería que se está editando.
let idFormProvincia = 0; 


// --- Handlers (manejadores) para eventos del modal de Bootstrap 
// Estas funciones se ejecutarán cuando el modal  se muestre o se oculte.

// Función que se ejecuta JUSTO ANTES de que el modal  se muestre.
function handleModalBootstrapShow() {
    if (this) this.removeAttribute("inert");
}

// Función que se ejecuta JUSTO DESPUÉS de que el modal de galería se ha ocultado.
function handleModalBootstrapHide() {
    // Uso currentFormUsuarioElement para el reset
    if (currentFormProvinciasElement) {
        currentFormProvinciasElement.reset();
        // Limpiar mensajes de error específicos del formulario
        currentFormProvinciasElement.querySelectorAll('.errorProvincia').forEach(span => {
            span.textContent = "";
            span.classList.add("escondido");
        });
    }
   
    // Reinicia las variables de control de estado del formulario de provincias.
    accionFormProvincias = '';
    idFormProvincia = 0;
    // Intenta devolver el foco al botón "Agregar Provincia".
    const btnAgregarProvinciaFocus = document.querySelector("#btnAgregarProvincia");
    setTimeout(() => {
        if (btnAgregarProvinciaFocus) btnAgregarProvinciaFocus.focus();
        if (this) this.setAttribute("inert", "");
    }, 10);
}

// --- Función Principal Exportada (llamada desde admin.js para esta sección) ---
// Responsable de cargar los datos de las provincias, (re)inicializar su modal y formulario,
// y registrar sus manejadores de eventos.

export const cargarProvincias = async () => {
    console.log("Recargando datos de las provincias desde la API...");

    const tablaCuerpoProvincias = document.querySelector("#tablaProvincias");

    // Verifica si el elemento de la tabla existe en el DOM
    if (!tablaCuerpoProvincias) {
        console.error("Error: El elemento con id 'tablaProvincias' no se encuentra en el DOM.");
        return;
    }
        // 1. OBTENER REFERENCIAS AL NUEVO DOM DEL MODAL Y FORMULARIO
        currentFormProvinciasElement = document.getElementById("register-formProvincias");
        const modalElementDOMProvincias = document.getElementById('modalProvincias');

        if (!currentFormProvinciasElement) {
            console.error("Error: Formulario '#register-formProvincias' no encontrado.");
            return;
        }
        if (!modalElementDOMProvincias) {
            console.error("Error: Elemento del modal '#modalProvincias' no encontrado.");
            return;
        }

        // 2. (RE)INICIALIZAR LA INSTANCIA DEL MODAL DE BOOTSTRAP
        if (modalProvinciasInstance && typeof modalProvinciasInstance.dispose === 'function') {
            if (modalProvinciasInstance._element) {
                modalProvinciasInstance._element.removeEventListener("show.bs.modal", handleModalBootstrapShow);
                modalProvinciasInstance._element.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
            }
            modalProvinciasInstance.dispose();
        }
        modalProvinciasInstance = new bootstrap.Modal(modalElementDOMProvincias, {
            backdrop: 'static',
            keyboard: false
        });
        modalElementDOMProvincias.removeEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMProvincias.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
        modalElementDOMProvincias.addEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMProvincias.addEventListener("hide.bs.modal", handleModalBootstrapHide);


    // Cargar datos en la tabla
    try {
        // Realiza una petición a la API para obtener los datos de las provincias
        const response = await fetch(urlAPIProvincia);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const dataProvincias = await response.json(); // Convierte la respuesta en JSON

        // Limpia el contenido actual de la tabla
        tablaCuerpoProvincias.innerHTML = "";
        console.log("Datos de las provincias cargados:", dataProvincias);
        // Itera sobre cada objeto de provincias y agrega una fila a la tabla
        dataProvincias.forEach((provincia) => {
            const filaProvincias = tablaCuerpoProvincias.insertRow(); // Más eficiente que crear tr y luego innerHTML
            filaProvincias.innerHTML = `
                <td>${provincia.id_provincia}</td>
                <td>${provincia.nombre_provincia}</td>
                <td class="text-center">
                    <button class="btnEditarProvincia btn btn-outline-warning">Editar</button>
                    <button class="btnBorrarProvincia btn btn-outline-danger">Borrar</button>
                </td>
            `;
        }); 
    } catch (error) {
        console.error("Error al cargar las provincias:", error);
        tablaCuerpoProvincias.innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar las provincias.</td></tr>`;
    }
    // Registra los eventos dinámicos para los botones de Editar y Borrar
    registrarEventosProvincias();
};

// Función para registrar los eventos dinámicos de los botones en las provincias
const registrarEventosProvincias = () => {
    if (!currentFormProvinciasElement || !modalProvinciasInstance) {
        console.error("Faltan referencias al formulario o al modal.");
        return;
    }
    const btnAgregarProvincia = document.querySelector("#btnAgregarProvincia");
    const tablaProvinciasTBody = document.querySelector("#tablaProvincias");
    if (!btnAgregarProvincia) console.warn("Botón '#btnAgregarProvincia' no encontrado para registrar evento.");
    if (!tablaProvinciasTBody) console.warn("Elemento 'tablaProvincias' (tbody) no encontrado para registrar evento.");

    alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado

    // Evento para el botón "Agregar"
    if (btnAgregarProvincia) {
        btnAgregarProvincia.addEventListener("click", async () => {
            console.log("Botón Agregar provincia presionado.");
            accionFormProvincias = "crear";
            idFormProvincia = 0;
            currentFormProvinciasElement.reset(); // Usa la referencia actual del formulario

            // Cambiar título del modal 
            // const modalTitleElement = currentFormProvinciasElement.querySelector(".modal-title");
            // if (modalTitleElement) modalTitleElement.textContent = "Agregar Nueva Provincia";



            currentFormProvinciasElement.querySelectorAll('.errorProvincia').forEach(span => {
                span.textContent = "";
                span.classList.add("escondido");
            });

            
            modalProvinciasInstance.show(); //Muestra el modal de provincias.
        });
    }

    // Eventos en la tabla (Editar/Borrar)
    if (tablaProvinciasTBody && !tablaProvinciasTBody.dataset.eventRegistered) {
        tablaProvinciasTBody.addEventListener("click", async (e) => {
            const targetButton = e.target.closest("button");
            if (!targetButton) return;

            const filaProvincias = targetButton.closest("tr");
            if (!filaProvincias) return;

            if (targetButton.classList.contains("btnEditarProvincia")) {
                console.log("Botón Editar presionado.");
                accionFormProvincias = "editar";
                idFormProvincia = filaProvincias.cells[0].textContent;
                currentFormProvinciasElement.reset();

                // Cambiar título del modal 
                // const modalTitleElement = currentFormProvinciasElement.querySelector(".modal-title");
                // if (modalTitleElement) modalTitleElement.textContent = "Editar Provincia";

     
                currentFormProvinciasElement.querySelectorAll('.errorProvincia').forEach(span => {
                    span.textContent = "";
                    span.classList.add("escondido");
                });
                // Poblar el campo del nombre de la provincia en el formulario.
                currentFormProvinciasElement.querySelector("#nombre_provincia").value = filaProvincias.cells[1].textContent;
            
                
                modalProvinciasInstance.show();

    
        // Evento para el botón "Borrar"
             } else if (e.target.classList.contains("btnBorrarProvincia")) {
             const idProvinciaBorrar = filaProvincias.cells[0].textContent; // Obtiene el ID de la Provincia a eliminar
             if (!idProvinciaBorrar) {
                console.error("No se pudo obtener ID para borrar.");
                alertify.error("No se pudo obtener ID para borrar.");
                return;
            }
            // Muestra una alerta de confirmación
            alertify.confirm( `¿Está seguro de eliminar la provincia con ID: ${idProvinciaBorrar}?`,
                async () => {
                    try {
                        const response = await fetch(`${urlAPIProvincia}${idProvinciaBorrar}`, { method: "DELETE" });
                        if (!response.ok) {
                            let errorMsg = "Error al eliminar.";
                            try { errorMsg = (await response.json()).message || errorMsg; } catch (e) {}
                            throw new Error(errorMsg);
                        }
                        filaProvincias.remove();
                        alertify.success("Provincia eliminada.");
                    } catch (error) {
                        console.error("Error durante la eliminación:", error);
                        alertify.error(`Error: ${error.message}`);
                    }
                },
                () => { alertify.error("Cancelado"); }
            ).set('labels', {ok:'Sí, Eliminar', cancel:'Cancelar'});
        }
    });
    tablaProvinciasTBody.dataset.eventRegistered = "true";
}

  // Evento para el submit del formulario
    if (currentFormProvinciasElement && !currentFormProvinciasElement.dataset.submitListenerAttached) {
        currentFormProvinciasElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const botonEnviar = e.submitter;// Botón que hizo submit.
            // Deshabilitar y mostrar feedback.
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...`;
            
            // const formData = new FormData(currentFormProvinciasElement);
            // No se usa FormData aquí, se construye un objeto JSON directamente.
            // Esto asume que tu API para provincias espera un JSON con `nombre_provincia`.



            let targetUrl = "";
            let metodoHTTP = "";

            if (accionFormProvincias === 'crear') {
                targetUrl = urlAPIProvincia;
                metodoHTTP = "POST";
            } else if (accionFormProvincias === 'editar') {
                targetUrl = `${urlAPIProvincia}${idFormProvincia}`;
                metodoHTTP = "PUT";
            } else {
                console.error("Acción desconocida:", accionFormProvincias);
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
                return;
            }

            try {
                const nombre_provincia = currentFormProvinciasElement.querySelector('[name="nombre_provincia"]').value.trim();
                const payload = { nombre_provincia };
                console.log("Payload a enviar:", payload);
                // const response = await fetch(targetUrl, { method: metodoHTTP, body: formData });
                const response = await fetch(targetUrl, {
                    method: metodoHTTP,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  
                if (!response.ok) {
                    let errorMsg = `Error ${response.status}`;
                    try { const errData = await response.json(); errorMsg = errData.message || JSON.stringify(errData); }
                    catch (e) { errorMsg = await response.text() || errorMsg; }
                    throw new Error(errorMsg);
                }
                // const resJson = await response.json(); // Si esperas JSON en éxito
                alertify.success(accionFormProvincias === 'crear' ? "Provincia registrada." : "Provincia actualizada.");
               // Cierra el modal si está visible y hay instancia válida
               const modalProvinciasElement = document.getElementById("modalProvincias");
                if (modalProvinciasElement && modalProvinciasElement.classList.contains("show")) {
                    const modalProvinciasInstance = bootstrap.Modal.getOrCreateInstance(modalProvinciasElement);

                    modalProvinciasElement.addEventListener("hidden.bs.modal", function handler() {
                        modalProvinciasElement.removeEventListener("hidden.bs.modal", handler); // Evita múltiples llamadas
                        cargarProvincias(); // Solo se llama una vez el modal está cerrado
                    });

                    modalProvinciasInstance.hide();
                } else {
                    cargarProvincias(); // Si no está visible, cargamos directamente
                }

            } catch (error) {
                console.error("Error en submit:", error);
                const mensajeErrorSpan = currentFormProvinciasElement.querySelector(".modal-footer .errorProvincia.escondido") || currentFormProvinciasElement.querySelector(".errorProvincia.escondido");
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
        currentFormProvinciasElement.dataset.submitListenerAttached = "true";
    }

    
    

 // --- Listener para evento personalizado ---
// Escucha el evento personalizado disparado desde admin.js
document.addEventListener("seccionGestionProvinciasCargada", () => {
    console.log("Sección de gestión de provincias cargada. Ejecutando inicializaciones...");

});
};