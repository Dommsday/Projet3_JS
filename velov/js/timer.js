var Timer = {
    duree: 20,
    text: document.querySelector(".compteur"),
    timerOn: false,


    init: function () {


        var countdown = setInterval(function () {

            Timer.timerOn = true;
            
            console.log("TimerOn = "+Timer.timerOn);
            var temps = new Date().getTime();

            var difference = temps - Maping.storage.getItem("heure");

            var compteur = Math.round(((Timer.duree * 60000) - difference) / 1000);

            var minutes = Math.floor(compteur / 60);
            var secondes = compteur % 60;

            Timer.text.textContent = minutes + " minutes et " + secondes + " secondes";
            console.log(Timer.text.textContent);


            if (minutes <= 0 && secondes <= 0) {
                Maping.storage.clear();
                clearInterval(countdown);
                CanvasSignature.signatureEmpty();
                CanvasSignature.deleteReservation.style.display = "none";
                Timer.text.textContent = "Votre réservation à expirée";
                setTimeout(function () {
                    Maping.blockReservation.style.display = "none";

                    if (Maping.storage.length === 0) {
                        Timer.text.textContent = " ";
                        Maping.infoReservation.textContent = " ";
                        Maping.ensembleMarker.available_bikes++;
                        Maping.availableBike.textContent = Maping.ensembleMarker.available_bikes;
                        Timer.timerOn = false;
                        CanvasSignature.deleteSignature.disabled = false;     
                    }
                }, 1500);
            }
        }, 1000)
    }

}
