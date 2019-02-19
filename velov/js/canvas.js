var CanvasSignature = {

    canvas: document.querySelector("#canvas"),
    ctx: this.canvas.getContext("2d"),
    deleteSignature: document.querySelector("#delete_signature"), //Bouton "Effacer
    validSignature: document.querySelector("#valid_signature"), //Bouton "Valider"
    deleteReservation: document.querySelector("#delete_reservation"), //Bouton "Annulation"
    validReservation: false,

    //configuration souris
    lastX: 0,
    lastY: 0,

    //configuration tactiles
    startx: 0,
    starty: 0,
    distx: 0,
    disty: 0,



    init: function () {
        this.signatureEmpty();
        this.moveInCanvas();
        this.buttonDelete();
        this.valited();
    },


    moveInCanvas: function (e) {
        this.canvas.addEventListener("mousedown", this.pointerDown, false);
        this.canvas.addEventListener("mouseup", this.pointerUp, false);
        this.canvas.addEventListener("touchstart", this.touchDown, false);
        this.canvas.addEventListener("touchend", this.touchUp, false);
        this.canvas.addEventListener("touchmove", this.paintTouch,false);
    },


    //Partie Souris
    pointerDown: function (e) {
        [CanvasSignature.lastX, CanvasSignature.lastY] = [e.offsetX, e.offsetY];
        CanvasSignature.canvas.addEventListener("mousemove", CanvasSignature.paint, false);
        
        Maping.reservationNew();
        
        CanvasSignature.validSignature.disabled = false;
        CanvasSignature.validReservation = true;
    },

    pointerUp: function (e) {
        CanvasSignature.canvas.removeEventListener("mousemove", CanvasSignature.paint);
        CanvasSignature.paint(e);
    },
    
    


    paint: function (e) {
        CanvasSignature.ctx.beginPath();
        CanvasSignature.ctx.moveTo(CanvasSignature.lastX, CanvasSignature.lastY);
        CanvasSignature.ctx.lineTo(e.offsetX, e.offsetY);
        CanvasSignature.ctx.stroke();
        [CanvasSignature.lastX, CanvasSignature.lastY] = [e.offsetX, e.offsetY];
    },


    //Canvas vide
    signatureEmpty: function () {
        CanvasSignature.ctx.clearRect(0, 0, CanvasSignature.canvas.width, CanvasSignature.canvas.height);
        CanvasSignature.validReservation = false;
        CanvasSignature.validSignature.disabled = true;
    },

    //On efface la signature lors du clique
    buttonDelete: function () {
        this.deleteSignature.addEventListener("click", function () {
            CanvasSignature.signatureEmpty();
        });
    },

    //Lors du clique sur le bouton Valider
    valited: function () {
        this.validSignature.addEventListener("click", function () {
            Maping.reservationMap();
        });
    },


    //Partie Tactile
    
    //Dessin pour le tactile
    paintTact: function () {

        CanvasSignature.lastX = CanvasSignature.startx + CanvasSignature.distx;
        CanvasSignature.lastY = CanvasSignature.starty + CanvasSignature.disty;
        var rect = CanvasSignature.canvas.getBoundingClientRect();
        
        CanvasSignature.ctx.arc((CanvasSignature.lastX - rect.left), (CanvasSignature.lastY - rect.top), 0.1, 0, 180);
        CanvasSignature.ctx.stroke();
    },


    touchDown: function (e) {
        var touche = e.changedTouches[0]; //Indique le doigts
        CanvasSignature.startx = touche.clientX; // Récuperation du toucher
        CanvasSignature.starty = touche.clientY;

        Maping.reservationNew();
        CanvasSignature.validSignature.disabled = false;
        CanvasSignature.validReservation = true;

        e.preventDefault(); //Empêche le scroll de la page
    },
    
    touchUp:function(e){
        e.preventDefault();
        CanvasSignature.paint(e);
        
    },
    
    paintTouch: function (e) {
        var touche = e.changedTouches[0];
        CanvasSignature.distx = touche.clientX - CanvasSignature.startx;
        CanvasSignature.disty = touche.clientY - CanvasSignature.starty;
        CanvasSignature.paintTact();
        e.preventDefault();
    }

};

CanvasSignature.init();

