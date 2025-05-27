// URL base para las operaciones de las provincias
const urlAPIGenero = "http://localhost:3000/generos/";

// --- Variables del Módulo ---
// Estas se (re)asignarán CADA VEZ que la sección de usuarios se cargue.
let modalGenerosInstance;     // Para la instancia de new bootstrap.Modal()
let currentFormGenerosElement; // Para la referencia al <form id="register-formGenero"> actual

// Variable para determinar si se está creando o editando
let accionFormGeneros = ''; 
// ID del registro de la provincia que se editará
let idFormGenero = 0; 


// --- Handlers para eventos del modal de Bootstrap ---
function handleModalBootstrapShow() {
    if (this) this.removeAttribute("inert");
}

function handleModalBootstrapHide() {
    // Uso currentFormUsuarioElement para el reset
    if (currentFormGenerosElement) {
        currentFormGenerosElement.reset();
        // Limpiar mensajes de error específicos del formulario
        currentFormGenerosElement.querySelectorAll('.errorGenero').forEach(span => {
            span.textContent = "";
            span.classList.add("escondido");
        });
    }
   

    accionFormGeneros = '';
    idFormGenero = 0;
    
    const btnAgregarGeneroFocus = document.querySelector("#btnAgregarGenero");
    setTimeout(() => {
        if (btnAgregarGeneroFocus) btnAgregarGeneroFocus.focus();
        if (this) this.setAttribute("inert", "");
    }, 10);
}

// Función para cargar las géneros desde el servidor
export const cargarGeneros = async () => {
    console.log("Recargando datos de los géneros desde la API...");

    const tablaCuerpoGeneros = document.querySelector("#tablaGeneros");

    // Verifica si el elemento de la tabla existe en el DOM
    if (!tablaCuerpoGeneros) {
        console.error("Error: El elemento con id 'tablaGeneros' no se encuentra en el DOM.");
        return;
    }
        // 1. OBTENER REFERENCIAS AL NUEVO DOM DEL MODAL Y FORMULARIO
        currentFormGenerosElement = document.getElementById("register-formGeneros");
        const modalElementDOMGeneros = document.getElementById('modalGeneros');

        if (!currentFormGenerosElement) {
            console.error("Error: Formulario '#register-formGeneros' no encontrado.");
            return;
        }
        if (!modalElementDOMGeneros) {
            console.error("Error: Elemento del modal '#modalGeneros' no encontrado.");
            return;
        }

        // 2. (RE)INICIALIZAR LA INSTANCIA DEL MODAL DE BOOTSTRAP
        if (modalGenerosInstance && typeof modalGenerosInstance.dispose === 'function') {
            if (modalGenerosInstance._element) {
                modalGenerosInstance._element.removeEventListener("show.bs.modal", handleModalBootstrapShow);
                modalGenerosInstance._element.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
            }
            modalGenerosInstance.dispose();
        }
        modalGenerosInstance = new bootstrap.Modal(modalElementDOMGeneros, {
            backdrop: 'static',
            keyboard: false
        });
        modalElementDOMGeneros.removeEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMGeneros.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
        modalElementDOMGeneros.addEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMGeneros.addEventListener("hide.bs.modal", handleModalBootstrapHide);


    // Cargar datos en la tabla
    try {
        // Realiza una petición a la API para obtener los datos de los géneros
        const response = await fetch(urlAPIGenero);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const dataGeneros = await response.json(); // Convierte la respuesta en JSON

        // Limpia el contenido actual de la tabla
        tablaCuerpoGeneros.innerHTML = "";
        console.log("Datos de los géneros cargados:", dataGeneros);
        // Itera sobre cada objeto de géneros y agrega una fila a la tabla
        dataGeneros.forEach((genero) => {
            const filaGeneros = tablaCuerpoGeneros.insertRow(); // Más eficiente que crear tr y luego innerHTML
            filaGeneros.innerHTML = `
                <td>${genero.id_genero}</td>
                <td>${genero.nombre_genero}</td>
                <td class="text-center">
                    <button class="btnEditarGenero btn btn-outline-warning">Editar</button>
                    <button class="btnBorrarGenero btn btn-outline-danger">Borrar</button>
                </td>
            `;
        }); 
    } catch (error) {
        console.error("Error al cargar los géneros:", error);
        tablaCuerpoGeneros.innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar los géneros.</td></tr>`;
    }
    // Registra los eventos dinámicos para los botones de Editar y Borrar
    registrarEventosGeneros();
};

// Función para registrar los eventos dinámicos de los botones en los géneros
const registrarEventosGeneros = () => {
    if (!currentFormGenerosElement || !modalGenerosInstance) {
        console.error("Faltan referencias al formulario o al modal.");
        return;
    }
    const btnAgregarGenero = document.querySelector("#btnAgregarGenero");
    const tablaGenerosTBody = document.querySelector("#tablaGeneros");
    if (!btnAgregarGenero) console.warn("Botón '#btnAgregarGenero' no encontrado para registrar evento.");
    if (!tablaGenerosTBody) console.warn("Elemento 'tablaGeneros' (tbody) no encontrado para registrar evento.");

    alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado

    // Evento para el botón "Agregar"
    if (btnAgregarGenero) {
        btnAgregarGenero.addEventListener("click", async () => {
            console.log("Botón Agregar Género presionado.");
            accionFormGeneros = "crear";
            idFormGenero = 0;
            currentFormGenerosElement.reset(); // Usa la referencia actual del formulario

            // currentFormUsuarioElement.querySelector(".modal-title").textContent = "Agregar Nuevo Usuario";


            currentFormGenerosElement.querySelectorAll('.errorGenero').forEach(span => {
                span.textContent = "";
                span.classList.add("escondido");
            });

            
            modalGenerosInstance.show(); // Usa la instancia actual del modal
        });
    }

    // Eventos en la tabla (Editar/Borrar)
    if (tablaGenerosTBody && !tablaGenerosTBody.dataset.eventRegistered) {
        tablaGenerosTBody.addEventListener("click", async (e) => {
            const targetButton = e.target.closest("button");
            if (!targetButton) return;

            const filaGeneros = targetButton.closest("tr");
            if (!filaGeneros) return;

            if (targetButton.classList.contains("btnEditarGenero")) {
                console.log("Botón Editar presionado.");
                accionFormGeneros = "editar";
                idFormGenero = filaGeneros.cells[0].textContent;
                currentFormGenerosElement.reset();
     
                currentFormGenerosElement.querySelectorAll('.errorGenero').forEach(span => {
                    span.textContent = "";
                    span.classList.add("escondido");
                });
                
                currentFormGenerosElement.querySelector("#nombre_genero").value = filaGeneros.cells[1].textContent;
            
                
                modalGenerosInstance.show();

    
        // Evento para el botón "Borrar"
             } else if (e.target.classList.contains("btnBorrarGenero")) {
             const idGeneroBorrar = filaGeneros.cells[0].textContent; // Obtiene el ID del género a eliminar
             if (!idGeneroBorrar) {
                console.error("No se pudo obtener ID para borrar.");
                alertify.error("No se pudo obtener ID para borrar.");
                return;
            }
            // Muestra una alerta de confirmación
            alertify.confirm( `¿Está seguro de eliminar el género con ID: ${idGeneroBorrar}?`,
                async () => {
                    try {
                        const response = await fetch(`${urlAPIGenero}${idGeneroBorrar}`, { method: "DELETE" });
                        if (!response.ok) {
                            let errorMsg = "Error al eliminar.";
                            try { errorMsg = (await response.json()).message || errorMsg; } catch (e) {}
                            throw new Error(errorMsg);
                        }
                        filaGeneros.remove();
                        alertify.success("Genero eliminado.");
                    } catch (error) {
                        console.error("Error durante la eliminación:", error);
                        alertify.error(`Error: ${error.message}`);
                    }
                },
                () => { alertify.error("Cancelado"); }
            ).set('labels', {ok:'Sí, Eliminar', cancel:'Cancelar'});
        }
    });
    tablaGenerosTBody.dataset.eventRegistered = "true";
}

  // Evento para el submit del formulario
    if (currentFormGenerosElement && !currentFormGenerosElement.dataset.submitListenerAttached) {
        currentFormGenerosElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const botonEnviar = e.submitter;
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...`;
            
            // const formData = new FormData(currentFormGenerosaElement);
            


            let targetUrl = "";
            let metodoHTTP = "";

            if (accionFormGeneros === 'crear') {
                targetUrl = urlAPIGenero;
                metodoHTTP = "POST";
            } else if (accionFormGeneros === 'editar') {
                targetUrl = `${urlAPIGenero}${idFormGenero}`;
                metodoHTTP = "PUT";
            } else {
                console.error("Acción desconocida:", accionFormGeneros);
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
                return;
            }

            try {
                const nombre_genero = currentFormGenerosElement.querySelector('[name="nombre_genero"]').value.trim();
                const payload = { nombre_genero };
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
                alertify.success(accionFormGeneros === 'crear' ? "Género registrado." : "Género actualizado.");
               // Cierra el modal si está visible y hay instancia válida
               const modalGenerosElement = document.getElementById("modalGeneros");
                if (modalGenerosElement && modalGenerosElement.classList.contains("show")) {
                    const modalGenerosInstance = bootstrap.Modal.getOrCreateInstance(modalGenerosElement);

                    modalGenerosElement.addEventListener("hidden.bs.modal", function handler() {
                        modalGenerosElement.removeEventListener("hidden.bs.modal", handler); // Evita múltiples llamadas
                        cargarGeneros(); // Solo se llama una vez el modal está cerrado
                    });

                    modalGenerosInstance.hide();
                } else {
                    cargarGeneros(); // Si no está visible, cargamos directamente
                }

            } catch (error) {
                console.error("Error en submit:", error);
                const mensajeErrorSpan = currentFormGenerosElement.querySelector(".modal-footer .errorGenero.escondido") || currentFormGenerosElement.querySelector(".errorGenero.escondido");
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
        currentFormGenerosElement.dataset.submitListenerAttached = "true";
    }

    // Registrar Listeners de Validación de Inputs 
    // registrarValidadoresDeInput(); 
    

 // --- Listener para evento personalizado ---
// Escucha el evento personalizado disparado desde admin.js
document.addEventListener("seccionGestionGenerosCargada", () => {
    console.log("Sección de gestión de géneros cargada. Ejecutando inicializaciones...");

});
};