// URL base para las operaciones de las provincias
const urlAPIRol = "http://localhost:3000/roles/";

// --- Variables del Módulo ---
// Estas se (re)asignarán CADA VEZ que la sección de usuarios se cargue.
let modalRolesInstance;     // Para la instancia de new bootstrap.Modal()
let currentFormRolesElement; // Para la referencia al <form id="register-formRol"> actual

// Variable para determinar si se está creando o editando
let accionFormRoles = ''; 
// ID del registro de la provincia que se editará 
let idFormRol = 0; 


// --- Handlers para eventos del modal de Bootstrap ---
function handleModalBootstrapShow() {
    if (this) this.removeAttribute("inert");
}

function handleModalBootstrapHide() {
    // Uso currentFormUsuarioElement para el reset
    if (currentFormRolesElement) {
        currentFormRolesElement.reset();
        // Limpiar mensajes de error específicos del formulario
        currentFormRolesElement.querySelectorAll('.errorRol').forEach(span => {
            span.textContent = "";
            span.classList.add("escondido");
        });
    }
   

    accionFormRoles = '';
    idFormRol = 0;
    
    const btnAgregarRolFocus = document.querySelector("#btnAgregarRol");
    setTimeout(() => {
        if (btnAgregarRolFocus) btnAgregarRolFocus.focus();
        if (this) this.setAttribute("inert", "");
    }, 10);
}

// Función para cargar los roles desde el servidor
export const cargarRoles = async () => {
    console.log("Recargando datos de las roles desde la API...");

    const tablaCuerpoRoles = document.querySelector("#tablaRoles");

    // Verifica si el elemento de la tabla existe en el DOM
    if (!tablaCuerpoRoles) {
        console.error("Error: El elemento con Roles no se encuentra en el DOM.");
        return;
    }
        // 1. OBTENER REFERENCIAS AL NUEVO DOM DEL MODAL Y FORMULARIO
        currentFormRolesElement = document.getElementById("register-formRoles");
        const modalElementDOMRoles = document.getElementById('modalRoles');

        if (!currentFormRolesElement) {
            console.error("Error: Formulario '#register-formRoles' no encontrado.");
            return;
        }
        if (!modalElementDOMRoles) {
            console.error("Error: Elemento del modal '#modalRoles' no encontrado.");
            return;
        }

        // 2. (RE)INICIALIZAR LA INSTANCIA DEL MODAL DE BOOTSTRAP
        if (modalRolesInstance && typeof modalRolesInstance.dispose === 'function') {
            if (modalRolesInstance._element) {
                modalRolesInstance._element.removeEventListener("show.bs.modal", handleModalBootstrapShow);
                modalRolesInstance._element.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
            }
            modalRolesInstance.dispose();
        }
        modalRolesInstance = new bootstrap.Modal(modalElementDOMRoles, {
            backdrop: 'static',
            keyboard: false
        });
        modalElementDOMRoles.removeEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMRoles.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
        modalElementDOMRoles.addEventListener("show.bs.modal", handleModalBootstrapShow);
        modalElementDOMRoles.addEventListener("hide.bs.modal", handleModalBootstrapHide);


    // Cargar datos en la tabla
    try {
        // Realiza una petición a la API para obtener los datos de los roless
        const response = await fetch(urlAPIRol);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const dataRoles = await response.json(); // Convierte la respuesta en JSON

        // Limpia el contenido actual de la tabla
        tablaCuerpoRoles.innerHTML = "";
        console.log("Datos de los roles cargados:", dataRoles);
        // Itera sobre cada objeto de roles y agrega una fila a la tabla
        dataRoles.forEach((rol) => {
            const filaRoles = tablaCuerpoRoles.insertRow(); // Más eficiente que crear tr y luego innerHTML
            filaRoles.innerHTML = `
                <td>${rol.id_rol}</td>
                <td>${rol.nombre_rol}</td>
                <td class="text-center">
                    <button class="btnEditarRol btn btn-outline-warning">Editar</button>
                    <button class="btnBorrarRol btn btn-outline-danger">Borrar</button>
                </td>
            `;
        }); 
    } catch (error) {
        console.error("Error al cargar los roles:", error);
        tablaCuerpoRoles.innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar los roles.</td></tr>`;
    }
    // Registra los eventos dinámicos para los botones de Editar y Borrar
    registrarEventosRoles();
};

// Función para registrar los eventos dinámicos de los botones en los roles
const registrarEventosRoles = () => {
    if (!currentFormRolesElement || !modalRolesInstance) {
        console.error("Faltan referencias al formulario o al modal.");
        return;
    }
    const btnAgregarRol = document.querySelector("#btnAgregarRol");
    const tablaRolesTBody = document.querySelector("#tablaRoles");
    if (!btnAgregarRol) console.warn("Botón '#btnAgregarRol' no encontrado para registrar evento.");
    if (!tablaRolesTBody) console.warn("Elemento 'tablaRoles' (tbody) no encontrado para registrar evento.");

    alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado

    // Evento para el botón "Agregar"
    if (btnAgregarRol) {
        btnAgregarRol.addEventListener("click", async () => {
            console.log("Botón Agregar Rol presionado.");
            accionFormRoles = "crear";
            idFormRol = 0;
            currentFormRolesElement.reset(); // Usa la referencia actual del formulario

            // currentFormUsuarioElement.querySelector(".modal-title").textContent = "Agregar Nuevo Usuario";


            currentFormRolesElement.querySelectorAll('.errorRol').forEach(span => {
                span.textContent = "";
                span.classList.add("escondido");
            });

            
            modalRolesInstance.show(); // Usa la instancia actual del modal
        });
    }

    // Eventos en la tabla (Editar/Borrar)
    if (tablaRolesTBody && !tablaRolesTBody.dataset.eventRegistered) {
        tablaRolesTBody.addEventListener("click", async (e) => {
            const targetButton = e.target.closest("button");
            if (!targetButton) return;

            const filaRoles = targetButton.closest("tr");
            if (!filaRoles) return;

            if (targetButton.classList.contains("btnEditarRol")) {
                console.log("Botón Editar presionado.");
                accionFormRoles = "editar";
                idFormRol = filaRoles.cells[0].textContent;
                currentFormRolesElement.reset();
     
                currentFormRolesElement.querySelectorAll('.errorRol').forEach(span => {
                    span.textContent = "";
                    span.classList.add("escondido");
                });
                
                currentFormRolesElement.querySelector("#nombre_rol").value = filaRoles.cells[1].textContent;
            
                
                modalRolesInstance.show();

    
        // Evento para el botón "Borrar"
             } else if (e.target.classList.contains("btnBorrarRol")) {
             const idRolBorrar = filaRoles.cells[0].textContent; // Obtiene el ID del género a eliminar
             if (!idRolBorrar) {
                console.error("No se pudo obtener ID para borrar.");
                alertify.error("No se pudo obtener ID para borrar.");
                return;
            }
            // Muestra una alerta de confirmación
            alertify.confirm( `¿Está seguro de eliminar el rol con ID: ${idRolBorrar}?`,
                async () => {
                    try {
                        const response = await fetch(`${urlAPIRol}${idRolBorrar}`, { method: "DELETE" });
                        if (!response.ok) {
                            let errorMsg = "Error al eliminar.";
                            try { errorMsg = (await response.json()).message || errorMsg; } catch (e) {}
                            throw new Error(errorMsg);
                        }
                        filaRoles.remove();
                        alertify.success("Rol eliminado.");
                    } catch (error) {
                        console.error("Error durante la eliminación:", error);
                        alertify.error(`Error: ${error.message}`);
                    }
                },
                () => { alertify.error("Cancelado"); }
            ).set('labels', {ok:'Sí, Eliminar', cancel:'Cancelar'});
        }
    });
    tablaRolesTBody.dataset.eventRegistered = "true";
}

  // Evento para el submit del formulario
    if (currentFormRolesElement && !currentFormRolesElement.dataset.submitListenerAttached) {
        currentFormRolesElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const botonEnviar = e.submitter;
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...`;
            
            // const formData = new FormData(currentFormRolesElement);
            


            let targetUrl = "";
            let metodoHTTP = "";

            if (accionFormRoles === 'crear') {
                targetUrl = urlAPIRol;
                metodoHTTP = "POST";
            } else if (accionFormRoles === 'editar') {
                targetUrl = `${urlAPIRol}${idFormRol}`;
                metodoHTTP = "PUT";
            } else {
                console.error("Acción desconocida:", accionFormRoles);
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
                return;
            }

            try {
                const nombre_rol = currentFormRolesElement.querySelector('[name="nombre_rol"]').value.trim();
                const payload = { nombre_rol };
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
                alertify.success(accionFormRoles === 'crear' ? "Rol registrado." : "Rol actualizado.");
               // Cierra el modal si está visible y hay instancia válida
               const modalRolesElement = document.getElementById("modalRoles");
                if (modalRolesElement && modalRolesElement.classList.contains("show")) {
                    const modalRolesInstance = bootstrap.Modal.getOrCreateInstance(modalRolesElement);

                    modalRolesElement.addEventListener("hidden.bs.modal", function handler() {
                        modalRolesElement.removeEventListener("hidden.bs.modal", handler); // Evita múltiples llamadas
                        cargarRoles(); // Solo se llama una vez el modal está cerrado
                    });

                    modalRolesInstance.hide();
                } else {
                    cargarRoles(); // Si no está visible, cargamos directamente
                }

            } catch (error) {
                console.error("Error en submit:", error);
                const mensajeErrorSpan = currentFormRolesElement.querySelector(".modal-footer .errorRol.escondido") || currentFormRolesElement.querySelector(".errorRol.escondido");
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
        currentFormRolesElement.dataset.submitListenerAttached = "true";
    }

    // Registrar Listeners de Validación de Inputs 
    // registrarValidadoresDeInput(); 
    

 // --- Listener para evento personalizado ---
// Escucha el evento personalizado disparado desde admin.js
document.addEventListener("seccionGestionRolesCargada", () => {
    console.log("Sección de gestión de roles cargada. Ejecutando inicializaciones...");

});
};