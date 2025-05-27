// URL base para las operaciones de las provincias
const urlAPICervezas = "http://localhost:3000/cervezas/";

// --- Variables del Módulo ---
// Estas se (re)asignarán CADA VEZ que la sección de usuarios se cargue.
let modalCervezasInstance;     // Para la instancia de new bootstrap.Modal()
let currentFormCervezasElement; // Para la referencia al <form id="register-formRol"> actual

// Variable para determinar si se está creando o editando
let accionFormCervezas = ''; 
// ID del registro de la provincia que se editará 
let idFormCerveza = 0; 


// --- Handlers para eventos del modal de Bootstrap ---
function handleModalBootstrapShow() {
    if (this) this.removeAttribute("inert");
}

function handleModalBootstrapHide() {
    // Uso currentFormUsuarioElement para el reset
    if (currentFormCervezasElement) {
        currentFormCervezasElement.reset();
        // Limpiar mensajes de error específicos del formulario
        currentFormCervezasElement.querySelectorAll('.errorCerveza').forEach(span => {
            span.textContent = "";
            span.classList.add("escondido");
        });
    }
   

    accionFormCervezas = '';
    idFormCerveza = 0;
    
    const btnAgregarCervezaFocus = document.querySelector("#btnAgregarCerveza");
    setTimeout(() => {
        if (btnAgregarCervezaFocus) btnAgregarCervezaFocus.focus();
        if (this) this.setAttribute("inert", "");
    }, 10);
}

// Función para cargar las cervezas desde el servidor
export const cargarCervezas = async () => {
    console.log("Recargando datos de las cerveza desde la API...");

    const tablaCuerpoCervezas = document.querySelector("#tablaCervezas");

    // Verifica si el elemento de la tabla existe en el DOM
    if (!tablaCuerpoCervezas) {
        console.error("Error: El elemento con cervezas no se encuentra en el DOM.");
        return;
    }
        // 1. OBTENER REFERENCIAS AL NUEVO DOM DEL MODAL Y FORMULARIO
        currentFormCervezasElement = document.getElementById("register-formCervezas");
        const modalElementDOMCervezas = document.getElementById('modalCervezas');

        if (!currentFormCervezasElement) {
            console.error("Error: Formulario '#register-formCervezas' no encontrado.");
            return;
        }
        if (!modalElementDOMCervezas) {
            console.error("Error: Elemento del modal '#modalCervezas' no encontrado.");
            return;
        }

        // 2. (RE)INICIALIZAR LA INSTANCIA DEL MODAL DE BOOTSTRAP
        if (modalCervezasInstance && typeof modalCervezasInstance.dispose === 'function') {
            if (modalCervezasInstance._element) {
                modalCervezasInstance._element.removeEventListener("show.bs.modal", handleModalBootstrapShow);
                modalCervezasInstance._element.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
            }
            modalCervezasInstance.dispose();
        }
        modalCervezasInstance = new bootstrap.Modal(modalElementDOMCervezas, {
            backdrop: 'static',
            keyboard: false
        });
        modalElementDOMCervezas.removeEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMCervezas.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
        modalElementDOMCervezas.addEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMCervezas.addEventListener("hide.bs.modal", handleModalBootstrapHide);


    // Cargar datos en la tabla
    try {
        // Realiza una petición a la API para obtener los datos de las cervezas
        const response = await fetch(urlAPICervezas);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const dataCervezas = await response.json(); // Convierte la respuesta en JSON

        // Limpia el contenido actual de la tabla
        tablaCuerpoCervezas.innerHTML = "";
        console.log("Datos de las cervezas cargados:", dataCervezas);
        // Itera sobre cada objeto de cervezas y agrega una fila a la tabla
        dataCervezas.forEach((cerveza) => {
            const filaCervezas = tablaCuerpoCervezas.insertRow(); // Más eficiente que crear tr y luego innerHTML
            filaCervezas.innerHTML = `
                <td>${cerveza.id}</td>
                <td>${cerveza.nombre_cerveza}</td>
                <td>${cerveza.descripcion_cerveza}</td>
                <td class="text-center">
                    <button class="btnEditarCerveza btn btn-outline-warning">Editar</button>
                    <button class="btnBorrarCerveza btn btn-outline-danger">Borrar</button>
                </td>
            `;
        }); 
    } catch (error) {
        console.error("Error al cargar los cervezas:", error);
        tablaCuerpoCervezas.innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar las cervezas.</td></tr>`;
    }
    // Registra los eventos dinámicos para los botones de Editar y Borrar
    registrarEventosCervezas();
};

// Función para registrar los eventos dinámicos de los botones en las cervezas
const registrarEventosCervezas = () => {
    if (!currentFormCervezasElement || !modalCervezasInstance) {
        console.error("Faltan referencias al formulario o al modal.");
        return;
    }
    const btnAgregarCerveza = document.querySelector("#btnAgregarCerveza");
    const tablaCervezasTBody = document.querySelector("#tablaCervezas");
    if (!btnAgregarCerveza) console.warn("Botón '#btnAgregarCerveza' no encontrado para registrar evento.");
    if (!tablaCervezasTBody) console.warn("Elemento 'tablaCervezas' (tbody) no encontrado para registrar evento.");

    alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado

    // Evento para el botón "Agregar"
    if (btnAgregarCerveza) {
        btnAgregarCerveza.addEventListener("click", async () => {
            console.log("Botón Agregar cerveza presionado.");
            accionFormCervezas = "crear";
            idFormCerveza = 0;
            currentFormCervezasElement.reset(); // Usa la referencia actual del formulario

            currentFormCervezasElement.querySelectorAll('.errorCerveza').forEach(span => {
                span.textContent = "";
                span.classList.add("escondido");
            });

            
            modalCervezasInstance.show(); // Usa la instancia actual del modal
        });
    }

    // Eventos en la tabla (Editar/Borrar)
    if (tablaCervezasTBody && !tablaCervezasTBody.dataset.eventRegistered) {
        tablaCervezasTBody.addEventListener("click", async (e) => {
            const targetButton = e.target.closest("button");
            if (!targetButton) return;

            const filaCervezas = targetButton.closest("tr");
            if (!filaCervezas) return;

            if (targetButton.classList.contains("btnEditarCerveza")) {
                console.log("Botón Editar presionado.");
                accionFormCervezas = "editar";
                idFormCerveza = filaCervezas.cells[0].textContent;
                currentFormCervezasElement.reset();
     
                currentFormCervezasElement.querySelectorAll('.errorCerveza').forEach(span => {
                    span.textContent = "";
                    span.classList.add("escondido");
                });
                
                currentFormCervezasElement.querySelector("#nombre_cerveza").value = filaCervezas.cells[1].textContent;
                currentFormCervezasElement.querySelector("#descripcion_cerveza").value = filaCervezas.cells[2].textContent;
            
                
                modalCervezasInstance.show();

    
        // Evento para el botón "Borrar"
             } else if (e.target.classList.contains("btnBorrarCerveza")) {
             const idCervezaBorrar = filaCervezas.cells[0].textContent; // Obtiene el ID del género a eliminar
             if (!idCervezaBorrar) {
                console.error("No se pudo obtener ID para borrar.");
                alertify.error("No se pudo obtener ID para borrar.");
                return;
            }
            // Muestra una alerta de confirmación
            alertify.confirm( `¿Está seguro de eliminar la cerveza con ID: ${idCervezaBorrar}?`,
                async () => {
                    try {
                        const response = await fetch(`${urlAPICervezas}${idCervezaBorrar}`, { method: "DELETE" });
                        if (!response.ok) {
                            let errorMsg = "Error al eliminar.";
                            try { errorMsg = (await response.json()).message || errorMsg; } catch (e) {}
                            throw new Error(errorMsg);
                        }
                        filaCervezas.remove();
                        alertify.success("Cerveza eliminado.");
                    } catch (error) {
                        console.error("Error durante la eliminación:", error);
                        alertify.error(`Error: ${error.message}`);
                    }
                },
                () => { alertify.error("Cancelado"); }
            ).set('labels', {ok:'Sí, Eliminar', cancel:'Cancelar'});
        }
    });
    tablaCervezasTBody.dataset.eventRegistered = "true";
}

  // Evento para el submit del formulario
    if (currentFormCervezasElement && !currentFormCervezasElement.dataset.submitListenerAttached) {
        currentFormCervezasElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const botonEnviar = e.submitter;
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...`;
            


            let targetUrl = "";
            let metodoHTTP = "";

            if (accionFormCervezas === 'crear') {
                targetUrl = urlAPICervezas;
                metodoHTTP = "POST";
            } else if (accionFormCervezas === 'editar') {
                targetUrl = `${urlAPICervezas}${idFormCerveza}`;
                metodoHTTP = "PUT";
            } else {
                console.error("Acción desconocida:", accionFormCervezas);
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
                return;
            }

            try {
                const nombre_cerveza = currentFormCervezasElement.querySelector('[name="nombre_cerveza"]').value.trim();
                const descripcion_cerveza = currentFormCervezasElement.querySelector('[name="descripcion_cerveza"]').value.trim();
                const payload = { nombre_cerveza, descripcion_cerveza };
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
                alertify.success(accionFormCervezas === 'crear' ? "Cerveza registrada." : "Cerveza actualizada.");
               // Cierra el modal si está visible y hay instancia válida
               const modalCervezasElement = document.getElementById("modalCervezas");
                if (modalCervezasElement && modalCervezasElement.classList.contains("show")) {
                    const modalCervezasInstance = bootstrap.Modal.getOrCreateInstance(modalCervezasElement);

                    modalCervezasElement.addEventListener("hidden.bs.modal", function handler() {
                        modalCervezasElement.removeEventListener("hidden.bs.modal", handler); // Evita múltiples llamadas
                        cargarCervezas(); // Solo se llama una vez el modal está cerrado
                    });

                    modalCervezasInstance.hide();
                } else {
                    cargarCervezas(); // Si no está visible, cargamos directamente
                }

            } catch (error) {
                console.error("Error en submit:", error);
                const mensajeErrorSpan = currentFormCervezasElement.querySelector(".modal-footer .errorCerveza.escondido") || currentFormCervezasElement.querySelector(".errorCerveza.escondido");
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
        currentFormCervezasElement.dataset.submitListenerAttached = "true";
    }

    // Registrar Listeners de Validación de Inputs 
    // registrarValidadoresDeInput(); 
    

 // --- Listener para evento personalizado ---
// Escucha el evento personalizado disparado desde admin.js
document.addEventListener("seccionGestionCervezasCargada", () => {
    console.log("Sección de gestión de cervezas cargada. Ejecutando inicializaciones...");

});
};