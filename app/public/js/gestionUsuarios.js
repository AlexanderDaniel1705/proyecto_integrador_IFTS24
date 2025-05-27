    // Define la URL base de la API para todas las operaciones relacionadas con usuarios.
    const urlAPIUsuarios = "http://localhost:3000/user/"; 

    // --- Variables del Módulo ---
    // Estas variables guardarán el estado y las referencias a elementos importantes.
    // Se (re)asignarán CADA VEZ que la sección de usuarios se cargue dinámicamente
    // (cuando admin.js inserta gestionUsuarios.html en el <main>).

    // Guarda la instancia del objeto Modal de Bootstrap.
    // Se necesita para controlar el modal mediante JavaScript (ej. modalUsuariosInstance.show()).
    let modalUsuariosInstance;    
    // Guarda la referencia al elemento <form> con id "register-form" que está dentro del modal.
    // Se usa para interactuar con el formulario (ej. resetearlo, obtener sus datos).
    let currentFormUsuarioElement; 
    // Guarda la acción actual que se está realizando con el formulario del modal (ej. "crear" o "editar").
    let accionFormUsuario = '';
    // Guarda el ID del usuario que se está editando. 
    // Será 0 o nulo cuando la acción sea "crear".
    let idFormUsuario = 0;

    // Función genérica y reutilizable para cargar opciones en un elemento <select> desde una URL (API).
    const cargarSelectConOpciones = async (url, selectId, defaultOptionText, valorKey, textoKey) => {
    const selectElement = document.querySelector(selectId); 
    if (!selectElement) {
        console.error(`Error: Elemento select ${selectId} no encontrado.`);
        return;
    }
    selectElement.innerHTML = `<option value="" disabled selected>${defaultOptionText}</option>`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fallo al cargar ${selectId}`);
        const datos = await response.json();
        datos.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valorKey];
            option.textContent = item[textoKey];
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(`Error al cargar ${selectId}:`, error);
    }
    };

    // Funciones específicas que usan `cargarSelectConOpciones` para cargar roles, géneros y provincias.
    // Cada una define la URL de su API, el ID de su select, el texto por defecto y las claves para valor/texto
    const cargarRoles = () => cargarSelectConOpciones("http://localhost:3000/roles", "#rol_usuario", "Selecciona un rol", "id_rol", "nombre_rol");
    const cargarGeneros = () => cargarSelectConOpciones("http://localhost:3000/generos", "#generos", "Selecciona un género", "id_genero", "nombre_genero");
    const cargarProvincias = () => cargarSelectConOpciones("http://localhost:3000/provincias", "#provincias", "Selecciona una provincia", "id_provincia", "nombre_provincia");


    // --- Handlers(manejadores) para eventos del modal de Bootstrap ---
    // Estas funciones se ejecutarán cuando el modal se muestre o se oculte.
    // Se asocian al modal mediante `addEventListener` más adelante, en `cargarUsuarios`.

    // Función que se ejecuta JUSTO ANTES de que el modal se muestre.
    function handleModalBootstrapShow() {
        if (this) this.removeAttribute("inert");
    }
    // Función que se ejecuta JUSTO DESPUÉS de que el modal se ha ocultado.
    function handleModalBootstrapHide() {
    // Uso currentFormUsuarioElement para el reset
    if (currentFormUsuarioElement) {
        currentFormUsuarioElement.reset();
        // Limpia mensajes de error específicos del formulario
        currentFormUsuarioElement.querySelectorAll('.errorUsuario, .errorEmail, .errorFecha').forEach(span => {
            span.textContent = "";
            span.classList.add("escondido");
        });
    }
    
    // Limpiar imagen previa (document.getElementById obtiene el actual)
    const imgPreview = document.getElementById('img-preview');
    if (imgPreview) {
        imgPreview.src = ''; 
        imgPreview.style.display = 'none';
    }
    const userPicInput = document.getElementById('user_pic'); // Limpiar el input file también
    if (userPicInput) {
        userPicInput.value = null;
    }

    // Reinicia las variables de control de estado del formulario.
    accionFormUsuario = '';
    idFormUsuario = 0;
    
    // Intenta devolver el foco al botón "Agregar Usuarios" para mejorar la accesibilidad y flujo de usuario.
    const btnAgregarUsuariosFocus = document.querySelector("#btnAgregarUsuarios");
    // Se usa `setTimeout` para asegurar que el foco se mueva después de que el modal termine de ocultarse
    setTimeout(() => {
        if (btnAgregarUsuariosFocus) btnAgregarUsuariosFocus.focus();
        if (this) this.setAttribute("inert", "");
    }, 10);
    }


    // --- Función Principal Exportada (llamada desde admin.js) ---
    // Es responsable de cargar los datos de los usuarios, (re)inicializar el modal y el formulario,
    // y registrar los manejadores de eventos.
    export const cargarUsuarios = async () => {
        console.log("gestionUsuarios.js: Iniciando carga de sección de usuarios...");

    // Obtiene la referencia al cuerpo (<tbody>) de la tabla donde se mostrarán los usuarios.
    const tablaCuerpoUsuarios = document.querySelector("#tablaUsuarios");
    if (!tablaCuerpoUsuarios) {
        console.error("Error: El <tbody> '#tablaUsuarios' no se encuentra.");
        return;
    }

    // 1. OBTENER REFERENCIAS AL NUEVO DOM DEL MODAL Y FORMULARIO
    currentFormUsuarioElement = document.getElementById("register-form");
    const modalElementDOM = document.getElementById('modalUsuario');

    if (!currentFormUsuarioElement) {
        console.error("Error: Formulario '#register-form' no encontrado.");
        return;
    }
    if (!modalElementDOM) {
        console.error("Error: Elemento del modal '#modalUsuario' no encontrado.");
        return;
    }

    // 2. (RE)INICIALIZAR LA INSTANCIA DEL MODAL DE BOOTSTRAP
    if (modalUsuariosInstance && typeof modalUsuariosInstance.dispose === 'function') {
        if (modalUsuariosInstance._element) {
            modalUsuariosInstance._element.removeEventListener("show.bs.modal", handleModalBootstrapShow);
            modalUsuariosInstance._element.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
        }
        // `dispose()` elimina la instancia de Bootstrap y limpia los datos asociados y eventos que Bootstrap maneja.
        modalUsuariosInstance.dispose();
    }
    modalUsuariosInstance = new bootstrap.Modal(modalElementDOM, {
        backdrop: 'static',//impide que el modal se cierre al hacer clic fuera de él.
        keyboard: false //impide que el modal se cierre al presionar la tecla Escape.
    });
    modalElementDOM.removeEventListener("show.bs.modal", handleModalBootstrapShow);
    modalElementDOM.removeEventListener("hide.bs.modal", handleModalBootstrapHide);
    modalElementDOM.addEventListener("show.bs.modal", handleModalBootstrapShow);
    modalElementDOM.addEventListener("hide.bs.modal", handleModalBootstrapHide);

    // Cargar datos en la tabla
    try {
        const response = await fetch(urlAPIUsuarios);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const dataUsuarios = await response.json();
        tablaCuerpoUsuarios.innerHTML = "";

        dataUsuarios.forEach((usuarios, index) => {
            // Inserta una nueva fila (<tr>) en el cuerpo de la tabla. Es más eficiente que crear el elemento y luego añadirlo.
            const filaUsuarios = tablaCuerpoUsuarios.insertRow();
            // Formatea la fecha de nacimiento del usuario al formato DD/MM/YYYY. 
            const fechaFormateada = new Date(usuarios.fecha_nacimiento).toLocaleDateString("es-ES", {
                day: "2-digit", month: "2-digit", year: "numeric",
            });
            // Construye el HTML para las celdas (<td>) de la fila con los datos del usuario.
            filaUsuarios.innerHTML = `
                <td>${index + 1}</td>
                <td>${usuarios.id_usuario}</td>
                <td>${usuarios.usuario}</td>
                <td>${usuarios.nombre}</td>
                <td>${usuarios.apellido}</td>
                <td><img src="/uploads/${usuarios.imagen_perfil}" class="rounded" alt="Perfil" width="100" height="100" onerror="this.style.display='none'; this.alt='Img no disp.';"></td>
                <td>${usuarios.nombre_rol}</td>
                <td>${usuarios.email}</td>
                <td>${fechaFormateada}</td>
                <td>${usuarios.nombre_genero}</td>
                <td>${usuarios.nombre_provincia}</td>
                <td class="text-center">
                    <button class="btnEditar btn btn-outline-warning ">Editar</button> 
                    <button class="btnBorrar btn btn-outline-danger ">Borrar</button>
                </td>`;
        });
    } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        //`colspan="12"` hace que la celda ocupe todas las columnas.
        tablaCuerpoUsuarios.innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar usuarios.</td></tr>`;
    }
    // Después de cargar la tabla y (re)inicializar el modal/formulario,
    // registrar todos los manejadores de eventos para los botones y el formulario.
    registrarTodosLosEventosUsuarios();
    };

    // --- Registrar TODOS los Event Listeners de la sección ---
    const registrarTodosLosEventosUsuarios = () => {
        // Verificar que las referencias al formulario y a la instancia del modal estén disponibles.
        // Si no, no se pueden registrar los eventos que dependen de ellos.
        if (!currentFormUsuarioElement || !modalUsuariosInstance) {
            console.error("Faltan referencias al formulario o al modal.");
            return;
        }

    const btnAgregarUsuarios = document.querySelector("#btnAgregarUsuarios");
    const tablaUsuariosTBody = document.querySelector("#tablaUsuarios");

    if (!btnAgregarUsuarios) console.warn("Botón '#btnAgregarUsuarios' no encontrado para registrar evento.");
    if (!tablaUsuariosTBody) console.warn("Elemento 'tablaUsuarios' (tbody) no encontrado para registrar evento.");

    alertify.defaults.glossary.title = ''; // Configurar Alertify

    // Evento para "Agregar Usuario"
    if (btnAgregarUsuarios) {
        btnAgregarUsuarios.addEventListener("click", async () => {
            console.log("Botón Agregar Usuarios presionado.");
            accionFormUsuario = "crear";
            idFormUsuario = 0;
            // Resetea el formulario a sus valores por defecto usando la referencia actual.
            currentFormUsuarioElement.reset(); 

            // Cambiar el título del modal para reflejar la acción de "Agregar".
            // const modalTitleElement = currentFormUsuarioElement.querySelector(".modal-title");
            // if (modalTitleElement) modalTitleElement.textContent = "Agregar Nuevo Usuario";

             // Limpieza explícita de la vista previa de la imagen.
            const imgPreview = currentFormUsuarioElement.querySelector("#img-preview");
            if (imgPreview) {
                imgPreview.src = "#";
                imgPreview.style.display = "none";
            }
            // Limpieza explícita del input de archivo.
            const userPicInput = currentFormUsuarioElement.querySelector("#user_pic");
            if (userPicInput) {
                userPicInput.value = null;
            }
            // Limpiar mensajes de error del formulario.
            currentFormUsuarioElement.querySelectorAll('.errorUsuario, .errorEmail, .errorFecha').forEach(span => {
                span.textContent = "";
                span.classList.add("escondido");
            });
            // Carga las opciones actualizadas para los selects.
            // `await` asegura que se espera a que terminen antes de continuar (aunque aquí no hay código después que dependa inmediatamente).

            await cargarRoles();
            await cargarGeneros();
            await cargarProvincias();
            
             // Muestra el modal usando la instancia de Bootstrap Modal actual
            modalUsuariosInstance.show(); 
        });
    }

    // Eventos en la tabla (Editar/Borrar) Se usa delegación de eventos.
    // El listener se añade al `tbody` una sola vez (controlado por `dataset.eventRegistered`).
    // Esto es eficiente porque no se añade un listener a cada botón de cada fila.
    if (tablaUsuariosTBody && !tablaUsuariosTBody.dataset.eventRegistered) {
        tablaUsuariosTBody.addEventListener("click", async (e) => {
            // `e.target` es el elemento exacto donde se hizo clic.
            // `e.target.closest("button")` busca el ancestro más cercano que sea un <button>.
            // Esto asegura que se capture el clic incluso si se hace sobre un ícono dentro del botón.
            const targetButton = e.target.closest("button");
            if (!targetButton) return;
            // Si no se encuentra una fila (poco probable si el botón está en una), no hacer nada.
            const fila = targetButton.closest("tr");
            if (!fila) return;

            if (targetButton.classList.contains("btnEditar")) {
                console.log("Botón Editar presionado.");
                accionFormUsuario = "editar";
                idFormUsuario = fila.cells[1].textContent;
                // Resetea el formulario antes de poblarlo con nuevos datos.
                currentFormUsuarioElement.reset();

                // Cambiar el título del modal.
                // const modalTitleElement = currentFormUsuarioElement.querySelector(".modal-title");
                // if (modalTitleElement) modalTitleElement.textContent = "Editar Usuario";

                const imgPreview = currentFormUsuarioElement.querySelector("#img-preview");
                if (imgPreview) {
                    imgPreview.src = "#";
                    imgPreview.style.display = "none";
                }
                const userPicInput = currentFormUsuarioElement.querySelector("#user_pic"); 
                if (userPicInput) {
                    userPicInput.value = ""; // o null
                }
                currentFormUsuarioElement.querySelectorAll('.errorUsuario, .errorEmail, .errorFecha').forEach(span => {
                    span.textContent = "";
                    span.classList.add("escondido");
                });
                
                // Poblar los campos del formulario con los datos de la fila de la tabla.
                // Se usa `currentFormUsuarioElement.querySelector` para asegurar que se opera sobre el formulario actual.
                currentFormUsuarioElement.querySelector("#user").value = fila.cells[2].textContent;
                currentFormUsuarioElement.querySelector("#name").value = fila.cells[3].textContent;
                currentFormUsuarioElement.querySelector("#lastname").value = fila.cells[4].textContent;
                currentFormUsuarioElement.querySelector("#email").value = fila.cells[7].textContent;

                // Formatear la fecha de la tabla (DD/MM/YYYY) al formato que espera el input date (YYYY-MM-DD).
                const fechaNacTexto = fila.cells[8].textContent;
                if (fechaNacTexto) {
                    const [day, month, year] = fechaNacTexto.split("/");
                    currentFormUsuarioElement.querySelector("#fechaNac").value = `${year}-${month}-${day}`;
                }
                
                // Cargar las opciones de los selects (esto también las resetea, como en "Agregar").
                await cargarRoles();
                await cargarGeneros();
                await cargarProvincias();
                
                // Seleccionar después de que las opciones se carguen
                // Un pequeño delay puede ser útil si las opciones tardan en renderizarse.
                setTimeout(() => {
                    const selectRol = currentFormUsuarioElement.querySelector("#rol_usuario");
                    const selectGenero = currentFormUsuarioElement.querySelector("#generos");
                    const selectProvincia = currentFormUsuarioElement.querySelector("#provincias");

                    // Obtener los textos de la tabla para comparar con las opciones del select.
                    const rolTextoTabla = fila.cells[6].textContent.trim();
                    const generoTextoTabla = fila.cells[9].textContent.trim();
                    const provinciaTextoTabla = fila.cells[10].textContent.trim();

                    if(selectRol) Array.from(selectRol.options).find(opt => opt.textContent.trim() === rolTextoTabla)?.setAttribute('selected', 'selected');
                    if(selectGenero) Array.from(selectGenero.options).find(opt => opt.textContent.trim() === generoTextoTabla)?.setAttribute('selected', 'selected');
                    if(selectProvincia) Array.from(selectProvincia.options).find(opt => opt.textContent.trim() === provinciaTextoTabla)?.setAttribute('selected', 'selected');
                }, 200); 


                // Mostrar la imagen de perfil del usuario en la vista previa del modal.
                const imgEnTablaSrc = fila.cells[5].querySelector("img")?.src;
                if (imgPreview && imgEnTablaSrc && !imgEnTablaSrc.endsWith("undefined")) {
                    imgPreview.src = imgEnTablaSrc;
                    imgPreview.style.display = "block";
                }
                
                modalUsuariosInstance.show();

            // Si el botón clickeado tiene la clase "btnBorrar".
            } else if (targetButton.classList.contains("btnBorrar")) {
                // Obtener el ID del usuario a borrar.
                const idUsuarioBorrar = fila.cells[1].textContent; 
                // Verificar que se obtuvo un ID.
                if (!idUsuarioBorrar) {
                    console.error("No se pudo obtener ID para borrar.");
                    alertify.error("No se pudo obtener ID para borrar.");
                    return;
                }
                alertify.confirm( `¿Está seguro de eliminar el usuario con ID: ${idUsuarioBorrar}?`,
                    async () => {
                        try {
                            const response = await fetch(`${urlAPIUsuarios}${idUsuarioBorrar}`, { method: "DELETE" });
                            if (!response.ok) {
                                let errorMsg = "Error al eliminar.";
                                try { errorMsg = (await response.json()).message || errorMsg; } catch (e) {}
                                throw new Error(errorMsg);
                            }
                            fila.remove();
                            alertify.success("Usuario eliminado.");
                        } catch (error) {
                            console.error("Error durante la eliminación:", error);
                            alertify.error(`Error: ${error.message}`);
                        }
                    },
                    () => { alertify.error("Cancelado"); }
                ).set('labels', {ok:'Sí, Eliminar', cancel:'Cancelar'});
            }
        });
        tablaUsuariosTBody.dataset.eventRegistered = "true";
    }

    // --- Funciones de Utilidad ---
    function capitalizarTexto(texto) {
        if (!texto) return "";
        return texto.trim().split(" ").map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
    }
    // Evento para el "submit" (envío) del formulario del modal.
    // Se añade el listener al `currentFormUsuarioElement` (el formulario actual).
    // Se usa una bandera `dataset.submitListenerAttached` para asegurar que solo se añade una vez.
    if (currentFormUsuarioElement && !currentFormUsuarioElement.dataset.submitListenerAttached) {
        currentFormUsuarioElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const botonEnviar = e.submitter;
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando...`;

            // Crear un objeto FormData a partir del formulario actual.
            // FormData recopila todos los campos del formulario y sus valores,
            // y es útil para enviar datos, especialmente si hay archivos.
            const formData = new FormData(currentFormUsuarioElement);
            const nombre = formData.get("nombre")?.trim();
            const apellido = formData.get("apellido")?.trim();
            formData.set("nombre", capitalizarTexto(nombre || ""));
            formData.set("apellido", capitalizarTexto(apellido || ""));
            
            // Convertir fecha a formato YYYY-MM-DD si es necesario.
            // El input type="date" ya debería darlo en este formato, pero esto lo asegura si viene de otra fuente.
            const fechaNacimiento = new Date(formData.get("fecha_nacimiento")).toISOString().split("T")[0];
            formData.set("fecha_nacimiento", fechaNacimiento);

            // Determinar la URL y el método HTTP según si se está creando o editando.
            let targetUrl = "";
            let metodoHTTP = "";

            if (accionFormUsuario === 'crear') {
                targetUrl = urlAPIUsuarios;
                metodoHTTP = "POST";
            } else if (accionFormUsuario === 'editar') {
                targetUrl = `${urlAPIUsuarios}${idFormUsuario}`;
                metodoHTTP = "PUT";
            } else {
                console.error("Acción desconocida:", accionFormUsuario);
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Guardar";
                return;
            }

            try {
                const response = await fetch(targetUrl, { method: metodoHTTP, body: formData });
                if (!response.ok) {
                    let errorMsg = `Error ${response.status}`;
                    try { 
                        const errData = await response.json(); 
                        errorMsg = errData.message || JSON.stringify(errData); 
                    } catch (e) { 
                        errorMsg = await response.text() || errorMsg; 
                    }
                    throw new Error(errorMsg);
                }
                // const resJson = await response.json(); // Si se espera una respuesta JSON en caso de éxito
                alertify.success(accionFormUsuario === 'crear' ? "Usuario registrado." : "Usuario actualizado.");
                // Lógica para recargar usuarios DESPUÉS de que el modal se haya ocultado completamente.
                // Esto evita problemas visuales o de estado si `cargarUsuarios` se ejecuta mientras el modal aún se está cerrando.
               const modalUsuariosElement = document.getElementById("modalUsuario");
                if (modalUsuariosElement && modalUsuariosElement.classList.contains("show")) {
                    const modalUsuariosInstance = bootstrap.Modal.getOrCreateInstance(modalUsuariosElement);

                    modalUsuariosElement.addEventListener("hidden.bs.modal", function handler() {
                        modalUsuariosElement.removeEventListener("hidden.bs.modal", handler); // Evita múltiples llamadas
                        cargarUsuarios(); // Solo se llama una vez el modal está cerrado
                    });

                    modalUsuariosInstance.hide();
                } else {
                    cargarUsuarios(); // Si no está visible, cargamos directamente
                }

            } catch (error) {
                console.error("Error en submit:", error);
                const mensajeErrorSpan = currentFormUsuarioElement.querySelector(".modal-footer .errorUsuario.escondido") || currentFormUsuarioElement.querySelector(".errorUsuario.escondido");
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
        // Marcar el formulario para indicar que el listener de submit ya fue añadido.
        currentFormUsuarioElement.dataset.submitListenerAttached = "true";
    }

    // Registrar Listeners de Validación de Inputs 
    registrarValidadoresDeInput(); 
    };

    // --- Registrar Validadores de Input ---
    const registrarValidadoresDeInput = () => {
        if (!currentFormUsuarioElement) {
            console.warn("Formulario no disponible para registrar validadores.");
            return;
        }

    // Usuario: mínimo 8 caracteres, sin espacios internos
    const userInput = currentFormUsuarioElement.querySelector("#user");
    if (userInput && !userInput.dataset.validationAttached) {
        userInput.addEventListener("input", function (event) {
            const usuario = event.target.value.trim();
            const errorUsuario = currentFormUsuarioElement.querySelector(".errorUsuario");

        if (usuario.length < 8) {
            errorUsuario.textContent = "El usuario debe contener al menos 8 caracteres.";
            errorUsuario.classList.remove("escondido");
        } else if (/\s/.test(usuario)) {
            errorUsuario.textContent = "El usuario no debe contener espacios.";
            errorUsuario.classList.remove("escondido");
        } else {
            errorUsuario.textContent = "";
            errorUsuario.classList.add("escondido");
        }
    });
    userInput.dataset.validationAttached = "true";
    }

    // Nombre: Solo letras con acentos y espacios
    const nameInput = currentFormUsuarioElement.querySelector("#name");
    if (nameInput && !nameInput.dataset.validationAttached) {
        nameInput.addEventListener("input", function (event) {
            const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
            if (!regexNombre.test(event.target.value)) {
                event.target.value = event.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
            }
        });
        nameInput.dataset.validationAttached = "true";
    }

    // Apellido: Solo letras con acentos y espacios
    const lastnameInput = currentFormUsuarioElement.querySelector("#lastname");
    if (lastnameInput && !lastnameInput.dataset.validationAttached) {
    lastnameInput.addEventListener("input", function (event) {
        const regexApellido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!regexApellido.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
        }
    });
    lastnameInput.dataset.validationAttached = "true";
    }

    // Fecha de nacimiento: válida, no futura, mínimo 18 años
    const fechaNacInput = currentFormUsuarioElement.querySelector("#fechaNac");
    if (fechaNacInput && !fechaNacInput.dataset.validationAttached) {
    fechaNacInput.addEventListener("blur", function (event) {
        const valorFecha = event.target.value.trim();
        const errorFecha = currentFormUsuarioElement.querySelector(".errorFecha");

        if (!valorFecha) {
            errorFecha.textContent = "Por favor, ingresá una fecha válida.";
            errorFecha.classList.remove("escondido");
            return;
        }

        const fecha = new Date(valorFecha);
        if (isNaN(fecha.getTime())) {
            errorFecha.textContent = "Por favor, ingresá una fecha válida.";
            errorFecha.classList.remove("escondido");
            return;
        }

        const hoy = new Date();
        const edadMinima = 18;
        const limiteEdad = new Date(hoy.getFullYear() - edadMinima, hoy.getMonth(), hoy.getDate());

        if (fecha > hoy) {
            errorFecha.textContent = "La fecha de nacimiento no puede ser futura.";
            errorFecha.classList.remove("escondido");
            return;
        }

        if (fecha > limiteEdad) {
            errorFecha.textContent = `Debes tener al menos ${edadMinima} años para poder registrarte.`;
            errorFecha.classList.remove("escondido");
            return;
        }

        errorFecha.textContent = "";
        errorFecha.classList.add("escondido");
    });
    fechaNacInput.dataset.validationAttached = "true";
    }

    // Email: formato válido
    const emailInput = currentFormUsuarioElement.querySelector("#email");
    if (emailInput && !emailInput.dataset.validationAttached) {
    emailInput.addEventListener("input", function (event) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorEmail = currentFormUsuarioElement.querySelector(".errorEmail");

        if (!emailRegex.test(event.target.value)) {
            errorEmail.textContent = "Formato de email incorrecto.";
            errorEmail.classList.remove("escondido");
        } else {
            errorEmail.textContent = "";
            errorEmail.classList.add("escondido");
        }
    });
    emailInput.dataset.validationAttached = "true";
    }




    // --- Listener para evento personalizado ---
    // Este evento es disparado por `admin.js` después de cargar la sección de usuarios.
    document.addEventListener("seccionGestionUsuariosCargada", () => {
        console.log("gestionUsuarios.js: Evento 'seccionGestionUsuariosCargada' detectado.");
    });
    };

