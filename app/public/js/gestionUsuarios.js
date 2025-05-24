// Obtener los registros desde el backend
const url = "http://localhost:3000/user/"
let modalUsuariosInstance;
let currentFormUsuario;

let accionFormUsuario = '';
let idFormUsuario = 0; 
const formUsuario = document.getElementById("register-form");
const modalUsuarios = new bootstrap.Modal(document.getElementById('modalUsuario'), {
    backdrop: 'static',
    keyboard: false
});

modalUsuarios._element.addEventListener("show.bs.modal", () => {
  modalUsuarios._element.removeAttribute("inert");
});

modalUsuarios._element.addEventListener("hide.bs.modal", () => {
  const btnAgregarUsuariosFocus = document.querySelector("#btnAgregarUsuarios");
  setTimeout(() => {
    if (btnAgregarUsuariosFocus) btnAgregarUsuariosFocus.focus();
    modalUsuarios._element.setAttribute("inert", ""); 
  }, 10);
});

const cargarSelectConOpciones = async (url, selectId, defaultOption) => {
  const select = document.querySelector(selectId);
  select.innerHTML = defaultOption;
  try {
    const response = await fetch(url);
    const datos = await response.json();
    datos.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id_rol || item.id_genero || item.id_provincia;
      option.textContent = item.nombre_rol || item.nombre_genero || item.nombre_provincia;
      select.appendChild(option);
    });
  } catch (error) {
    console.error(`Error al cargar ${selectId}:`, error);
  }
};

const cargarRoles = () => cargarSelectConOpciones("http://localhost:3000/roles", "#rol_usuario", '<option value="" disabled selected>Selecciona un rol</option>');
const cargarGeneros = () => cargarSelectConOpciones("http://localhost:3000/generos", "#generos", '<option value="" disabled selected>Selecciona un género</option>');
const cargarProvincias = () => cargarSelectConOpciones("http://localhost:3000/provincias", "#provincias", '<option value="" disabled selected>Selecciona una provincia</option>');

export const cargarUsuarios = async () => {
  console.log("Recargando datos de los usuarios desde la API...");
  const tablaCuerpoUsuarios = document.querySelector("#tablaUsuarios");
  if (!tablaCuerpoUsuarios) {
    console.error("Error: El elemento con id 'tablaUsuarios' no se encuentra en el DOM.");
    return;
  }

  try {
    const response = await fetch(url);
    const dataUsuarios = await response.json();
    tablaCuerpoUsuarios.innerHTML = "";
    dataUsuarios.forEach((usuarios, index) => {
      const filaUsuarios = document.createElement("tr");
      const fechaFormateada = new Date(usuarios.fecha_nacimiento).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      filaUsuarios.innerHTML = `
        <td>${index + 1}</td>
        <td>${usuarios.id_usuario}</td>
        <td>${usuarios.usuario}</td>
        <td>${usuarios.nombre}</td>
        <td>${usuarios.apellido}</td>
        <td><img src="/uploads/${usuarios.imagen_perfil}" class="rounded" alt="Imagen de perfil" width="100" height="100"></td>
        <td>${usuarios.nombre_rol}</td>
        <td>${usuarios.email}</td>
        <td>${fechaFormateada}</td>
        <td>${usuarios.nombre_genero}</td>
        <td>${usuarios.nombre_provincia}</td>
        <td class="text-center">
          <a class="btnEditar btn btn-outline-warning">Editar</a> 
          <a class="btnBorrar btn btn-outline-danger">Borrar</a>
        </td>
      `;
      tablaCuerpoUsuarios.appendChild(filaUsuarios);
    });
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
  }
  registrarEventosUsuarios();
};

const registrarEventosUsuarios = () => {
  console.log("Datos de usuarios cargados correctamente.");
  const btnAgregarUsuarios = document.querySelector("#btnAgregarUsuarios");
  const tablaUsuarios = document.querySelector("#tablaUsuarios");

  if (!btnAgregarUsuarios || !tablaUsuarios) {
    console.error("Error: Elementos requeridos para registrar eventos no encontrados.");
    return;
  }

  if (tablaUsuarios.dataset.eventRegistered) {
    console.log("Eventos ya registrados en tablaUsuarios. No se duplicarán.");
    return;
  }

  btnAgregarUsuarios.addEventListener("click", async () => {
    if (formUsuario) formUsuario.reset();
    const imgAgregarUsuario = document.querySelector("#img-preview");
    if (imgAgregarUsuario) imgAgregarUsuario.style.display = "none";
    await cargarRoles();
    await cargarGeneros();
    await cargarProvincias();
    accionFormUsuario = "crear";
    modalUsuarios.show();
  });

  tablaUsuarios.addEventListener("click", async (e) => {
    const fila = e.target.closest("tr");
    if (!fila) return;

    if (e.target.classList.contains("btnEditar")) {
      if (formUsuario) formUsuario.reset();
      const imgPreview = document.querySelector("#img-preview");
      if (imgPreview) {
        imgPreview.src = "";
        imgPreview.style.display = "none";
      }
      document.getElementById("user_pic").value = "";

      await cargarRoles();
      await cargarGeneros();
      await cargarProvincias();

      const selectRol = document.getElementById("rol_usuario");
      const selectGenero = document.getElementById("generos");
      const selectProvincia = document.getElementById("provincias");

      selectRol.value = [...selectRol.options].find(opt => opt.textContent.trim() === fila.children[6].textContent.trim())?.value || "";
      selectGenero.value = [...selectGenero.options].find(opt => opt.textContent.trim() === fila.children[9].textContent.trim())?.value || "";
      selectProvincia.value = [...selectProvincia.options].find(opt => opt.textContent.trim() === fila.children[10].textContent.trim())?.value || "";

      idFormUsuario = fila.children[1].innerHTML;
      document.getElementById("user").value = fila.children[2].innerHTML;
      document.getElementById("name").value = fila.children[3].innerHTML;
      document.getElementById("lastname").value = fila.children[4].innerHTML;
      document.getElementById("email").value = fila.children[7].innerHTML;

      const imgEnTabla = fila.children[5].querySelector("img");
      if (imgPreview && imgEnTabla) {
        imgPreview.src = imgEnTabla.src;
        imgPreview.style.display = "block";
      }

      const [day, month, year] = fila.children[8].innerHTML.split("/");
      document.getElementById("fechaNac").value = `${year}-${month}-${day}`;

      accionFormUsuario = "editar";
      modalUsuarios.show();
    }

    else if (e.target.classList.contains("btnBorrar")) {
      const id = fila.children[1].innerHTML;
      alertify.confirm("¿Está seguro de eliminar el usuario?", async () => {
        try {
          const response = await fetch(url + id, { method: 'DELETE' });
          if (!response.ok) throw new Error("Error al eliminar el usuario.");
          fila.remove();
          alertify.message("Usuario eliminado exitosamente.");
        } catch (error) {
          console.error("Error durante la eliminación:", error);
          alertify.error("Hubo un problema al intentar eliminar el usuario.");
        }
      }, () => {
        alertify.error("Eliminación cancelada.");
      });
    }
  });

  tablaUsuarios.dataset.eventRegistered = true;
  accionFormUsuario = "";
  idFormUsuario = "";
  if (formUsuario) formUsuario.reset();
};




//Procedimientos para crear y editar
formUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target); // Captura los datos del formulario
  console.log("Datos enviados:", Object.fromEntries(formData.entries()));

  // Transformar datos específicos
  const nombre = formData.get("nombre")?.trim();
  const apellido = formData.get("apellido")?.trim();
  const nombreTransformado = capitalizarTexto(nombre);
  const apellidoTransformado = capitalizarTexto(apellido);

  formData.set("nombre", nombreTransformado);
  formData.set("apellido", apellidoTransformado);

  // Convertir fecha a formato YYYY-MM-DD si es necesario
  const fechaNacimiento = new Date(formData.get("fecha_nacimiento")).toISOString().split("T")[0];
  formData.set("fecha_nacimiento", fechaNacimiento);

const mensajeErrorUsuario = document.querySelector(".errorUsuario"); 


  const botonEnviarUsuarios = e.submitter; // Botón que dispara el evento

  // Mostrar indicador de carga
  botonEnviarUsuarios.disabled = true;
  botonEnviarUsuarios.textContent = "Enviando...";

  try {
      let url2 = "";
      let metodo = "";

      if (accionFormUsuario === 'crear') {
          url2= "http://localhost:3000/user";
          metodo = "POST";
      } else if (accionFormUsuario === 'editar') {
          url2 = `http://localhost:3000/user/${idFormUsuario}`;
          metodo = "PUT";
      }

      const res = await fetch(url2, {
          method: metodo,
          body: formData
      });

      if (!res.ok) {
          const errorText = await res.text();
          mensajeErrorUsuario.classList.remove("escondido");
          mensajeErrorUsuario.textContent = errorText || "Hubo un error inesperado.";
          console.error("Error en la solicitud:", errorText);
          botonEnviarUsuarios.disabled = false;
          botonEnviarUsuarios.textContent = "Guardar";
          return;
      }

      const resJson = await res.json();
      console.log(resJson);

      // Configuro Alertify para ocultar el encabezado
    alertify.defaults.glossary.title = ''; // Título vacío, elimina el encabezado
      // Notificar éxito
      alertify.alert(accionFormUsuario === 'crear' ? "Usuario registrado exitosamente." : "Usuario actualizado correctamente.", function(){
          alertify.message('OK');
          cargarUsuarios();
        });
     
      
      // Limpio formulario y cierro el modal
      formUsuario.reset();
      modalUsuarios.hide();
      
  } catch (error) {
      console.error("Error en la solicitud:", error);
      alertify.error("Hubo un problema al realizar la operación. Intenta más tarde.");
  } finally {
      // Restaurar estado del botón
      botonEnviarUsuarios.disabled = false;
      botonEnviarUsuarios.textContent = "Guardar";
  }
});



// Restricciones para el nombre: Solo letras con acentos, sin números ni espacios
document.querySelector("#name").addEventListener("input", function(event) {
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/; // Solo letras con acentos
  if (!regexNombre.test(event.target.value)) {
    event.target.value = event.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, "");
  }
});

// Restricciones para el apellido: Solo letras con acentos y espacios
document.querySelector("#lastname").addEventListener("input", function(event) {
  const regexApellido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Letras con acentos y espacios
  if (!regexApellido.test(event.target.value)) {
    event.target.value = event.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  }
});

//evento para validar usuario
document.querySelector("#user").addEventListener("input", function(event){
  const usuario = event.target.value.trim();
  const errorUsuario = document.querySelector(".errorUsuario")

  if (usuario.length < 8) {
      errorUsuario.textContent = "El usuario debe contener al menos 8 caracteres.";
      errorUsuario.classList.remove("escondido");
  }else {
      errorUsuario.textContent= "";
      errorUsuario.classList.add("escondido");
  }
})

//evento para validar fecha
document.querySelector("#fechaNac").addEventListener("blur", function(event) {
  //El evento blur se activa cuando el usuario pierde el foco del elemento 
  const fechaNacInput = event.target.value.trim();
  //event.target: Representa el elemento que disparó el evento

  const errorFecha = document.querySelector(".errorFecha");

  // Validar que el input no esté vacío
  if (!fechaNacInput) {
      errorFecha.textContent = "Por favor, ingresá una fecha válida.";
      errorFecha.classList.remove("escondido");
      return; // Detener el flujo si no hay una fecha
  }

  // Crear un objeto Date con la fecha ingresada
  const fechaNac = new Date(fechaNacInput);

  // Validar si la fecha es válida
  if (isNaN(fechaNac.getTime())) {
      errorFecha.textContent = "Por favor, ingresá una fecha válida.";
      errorFecha.classList.remove("escondido");
      return; // Detener el flujo si la fecha no es válida
  }

  const hoy = new Date();
  //Este objeto contiene información sobre el año, mes, día, hora, minuto,
  //  segundo, etc., del momento exacto en que se ejecuta el código.
  const edadMinima = 18;

  // Crear el límite de edad
  const limiteEdad = new Date(hoy.getFullYear() - edadMinima, hoy.getMonth(), hoy.getDate());
  //Crea un nuevo objeto Date utilizando los valores calculados
  //representa el límite exacto de nacimiento que cumple con la edad mínima.

  // Validar si la fecha es futura
  if (fechaNac > hoy) {
      errorFecha.textContent = "La fecha de nacimiento no puede ser futura.";
      errorFecha.classList.remove("escondido");
      return; // Detener el flujo si la fecha es futura
  }

  // Validar si el usuario cumple la edad mínima
  if (fechaNac > limiteEdad) {
      errorFecha.textContent = `Debes tener al menos ${edadMinima} años para poder registrarte.`;
      errorFecha.classList.remove("escondido");
      return; // Detener el flujo si no cumple la edad mínima
  }

  // Si todo es válido, limpiar el mensaje de error
  errorFecha.textContent = "";
  errorFecha.classList.add("escondido");
});

//evento para validar emal
document.querySelector("#email").addEventListener("input", function(event) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errorEmail = document.querySelector(".errorEmail") ;

  if ( !emailRegex.test(event.target.value) ) {
      errorEmail.textContent = "Formato de email incorrecto.";
      errorEmail.classList.remove("escondido");
  } else{
      errorEmail.textContent="";
      errorEmail.classList.add("escondido");
  }
})
  //Funcion para capitalizar texto
  function capitalizarTexto(texto){
    return texto
    .trim()
    .split(" ")//dividir en palabras
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())//primera letra en mayuscula
    .join(" ");//Unir las palabras con espacios
}
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Página cargada");
//   cargarUsuarios();
// });
// window.addEventListener("load", () => {
//   console.log("Página cargada");
//   cargarUsuarios();
// });
// Escucha el evento personalizado disparado desde admin.js
document.addEventListener("seccionGestionUsuariosCargada", () => {
  console.log("Sección de gestión de usuarios cargada. Ejecutando inicializaciones...");

});


 // const tablaUsuarios = document.querySelector("#tablaUsuarios");

  // tablaUsuarios.addEventListener("click", async (e) => {

  //     // Evento para "Editar Usuario"
  //     if (e.target.classList.contains("btnEditar")) {
  //       //  // Limpia manualmente el formulario
  //       //  document.getElementById("user").value = "";
  //       //  document.getElementById("name").value = "";
  //       //  document.getElementById("lastname").value = "";
  //       //  document.getElementById("email").value = "";
  //       //  document.getElementById("rol_usuario").value = "";
  //       //  document.getElementById("generos").value = "";
  //       //  document.getElementById("provincias").value = "";
  //       //  document.getElementById("fechaNac").value = "";
  //     const fila = e.target.closest("tr");
  //         console.log("Botón Editar presionado en fila:", fila.children[0].innerHTML);
  //       // Validar si una fila fue seleccionada correctamente
  //     if (!fila) {
  //       console.error("Error: No se pudo encontrar la fila correspondiente.");
  //       return;
  //     }
  //       // Limpia el formulario
  
  //   if (formUsuario) formUsuario.reset();
    
    
  //   // console.log("Fila seleccionada:", fila);
  //       console.log("Datos de la fila seleccionada:");
  //       console.log("ID:", fila.children[1]?.innerHTML);
  //       console.log("Usuario:", fila.children[2]?.innerHTML);
  //       console.log("Nombre:", fila.children[3]?.innerHTML);
  //       console.log("Apellido:", fila.children[4]?.innerHTML);

      
  //         // Obtén valores de la fila
  //         idFormUsuario = fila.children[1].innerHTML;

         

       
  //         // Asigna los valores
  //         document.getElementById("user").value = fila.children[2].innerHTML;
  //         document.getElementById("name").value = fila.children[3].innerHTML;
  //         document.getElementById("lastname").value = fila.children[4].innerHTML;
  //         document.getElementById("email").value = fila.children[7].innerHTML;
          
  //         const imgPreview = document.querySelector("#img-preview");
  //         if (imgPreview) {
  //             imgPreview.src = fila.children[5].querySelector("img").src;
  //             imgPreview.style.display = "block";
  //         }

  //         // Carga valores dinámicos para selects
  //         try {
  //           const selectRol = document.getElementById("rol_usuario");
  //           const selectGenero = document.getElementById("generos");
  //           const selectProvincia = document.getElementById("provincias");
        
  //           // Limpia opciones previas para evitar duplicados
  //           selectRol.innerHTML = "";
  //           selectGenero.innerHTML = "";
  //           selectProvincia.innerHTML = "";
        
        
  //           await cargarRoles();
  //           await cargarGeneros();
  //           await cargarProvincias();
        
  //           const rolId = Array.from(document.getElementById("rol_usuario").options).find(
  //               option => option.textContent === fila.children[6]?.innerHTML
  //           )?.value;
  //           selectRol.value = rolId || "";
        
  //           const generoId = Array.from(document.getElementById("generos").options).find(
  //               option => option.textContent === fila.children[9]?.innerHTML
  //           )?.value;
  //           selectGenero.value = generoId || "";
        
  //           const provinciaId = Array.from(document.getElementById("provincias").options).find(
  //               option => option.textContent === fila.children[10]?.innerHTML
  //           )?.value;
  //           selectProvincia.value = provinciaId || "";
  //       } catch (error) {
  //           console.error("Error al cargar selects dinámicos:", error);
  //       }

  //         // Formatea la fecha antes de asignarla
  //         const [day, month, year] = fila.children[8].innerHTML.split("/");
  //         const formattedDate = `${year}-${month}-${day}`;
  //         document.getElementById("fechaNac").value = formattedDate;
    
  //         accionFormUsuario = "editar"; // Marca la acción como "editar"
  //         console.log("Mostrando el modal de edición...");
  //         modalUsuarios.show();
          
  //     }
