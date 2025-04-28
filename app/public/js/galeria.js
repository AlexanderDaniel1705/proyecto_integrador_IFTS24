const fullImgBox = document.querySelector("#fullImgBox"),
        fullImgGal = document.querySelector("#fullImgGal"),
        rightBtn = document.querySelector("#right-btn"),
        leftBtn = document.querySelector("#left-btn"),
        closeImg= document.querySelector("#closeImg"),
        listaImg = [...document.querySelectorAll(".imgGal")];
        
        let indexImg =0 ;


        listaImg.forEach((img,i) => {
            img.addEventListener("click", (e) => {
                clicked(i);
                fullImgBox.style.display = "flex";
                fullImgGal.src = img.src
        // Si la primera imagen es seleccionada, oculta el botón izquierdo
        leftBtn.style.display = indexImg === 0 ? "none" : "block";

        // Si la última imagen es seleccionada, oculta el botón derecho
        rightBtn.style.display = indexImg === listaImg.length - 1 ? "none" : "block";
            })
        });

        function clicked(position) {
            indexImg = position;
            fullImgGal.src = listaImg[indexImg].src;
        };

        rightBtn.addEventListener("click", () => {
            if (indexImg < listaImg.length - 1) {
                indexImg++;
                fullImgGal.src = listaImg[indexImg].src;
            }
        
            //Oculta el botón derecho si llego a la última imagen
            rightBtn.style.display = indexImg === listaImg.length - 1 ? "none" : "block";
        
            //Asegura que el botón izquierdo reaparezca cuando ya no estoy en la primera imagen
            leftBtn.style.display = "block";
        });
        
        

        leftBtn.addEventListener("click", e => {
            if (indexImg > 0) {
                indexImg--;
                fullImgGal.src = listaImg[indexImg].src;
            }
            //  Si llega a la posición 0, oculta el botón
            leftBtn.style.display = indexImg === 0 ? "none" : "block";

             //  Si aún puedo avanzar, aseguro que el botón derecho siga visible
                rightBtn.style.display = "block";

        });

        closeImg.addEventListener("click", e => {
            fullImgBox.style.display = "none";
        });


        
        