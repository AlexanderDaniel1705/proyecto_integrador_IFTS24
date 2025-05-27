document.addEventListener("DOMContentLoaded", () => {
    const user = sessionStorage.getItem("user");

    const btnLogin = document.getElementById("btnLogin");
    const btnRegister = document.getElementById("btnregister");
    const btnLogout = document.getElementById("btnLogout");

    if (user) {
      // Usuario logueado: ocultar login/registro y mostrar logout
      btnLogin.style.display = "none";
      btnRegister.style.display = "none";
      btnLogout.style.display = "block";

      btnLogout.addEventListener("click", () => {
        fetch("/auth/logout", { method: "POST" }).then(() => {
          sessionStorage.clear();
          window.location.replace("/"); // Redirige al usuario a la página principal
        });
      });
    } else {
      // Usuario NO logueado: mostrar login/registro y ocultar logout
      btnLogin.style.display = "block";
      btnRegister.style.display = "block";
      btnLogout.style.display = "none";
    }
  });
