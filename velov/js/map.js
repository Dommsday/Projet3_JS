var Maping = {

    storage: window.sessionStorage,
    containerMap: document.querySelector("#map"), //Div de la map
    map: null, //Carte
    markers: [], //Tableau des markers
    ensembleMarker: null, //Stock tout les markers
    stations: [], //Tableau des stations
    addrStation: document.querySelector(".adresse_station"), //Texte de l'adresse
    buttonValidSignature: document.querySelector("#valid_signature"), //Bouton validation réservation
    availableBike: document.querySelector(".velo_dispo"), //Texte de l'adresse
    arrangBike: document.querySelector(".rangement_dispo"), //Texte rangements à vélo
    statestation: document.querySelector(".etat_station"), //Texte station ouverte ou fermée
    minreserv: document.querySelector(".compteur_minutes"), //Compteur minutes
    secreserv: document.querySelector(".compteur_secondes"), //Compteur secondes
    infoReservation: document.querySelector(".info_reservation"), //Texte de la réservation
    blockReservation: document.querySelector("#reservation"), //Bloc de réservation(Texte et Canvas)
    stationName: document.querySelector(".nom_station"), //Nom de la station
    NewReservation: document.querySelector(".new_reservation"), //Message rouge d'annulation
    stationRes: false, //Posibilité de réservation


    init: function () {
        this.initMap();
    },


    //Affiche de Lyon
    initMap: function () {

        this.map = new google.maps.Map(this.containerMap, {
            zoom: 13,
            center: {
                lat: 45.750000,
                lng: 4.850000
            }
        });

        this.initAjax();
    },



    //Affichage des markers
    initAjax: function () {

        Maping.refreshPage();
        
        
        ajaxGet.init("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=555a557989435e109942db67d8a8d77af46d1fb4", function (reponse) {

            Maping.bikes = JSON.parse(reponse);

            

            Maping.bikes.forEach(function (bike) {

                var marker = new google.maps.Marker({
                    position: bike.position,
                    map: Maping.map,
                    title: bike.name,
                    station: bike.name,
                    adresse: bike.address,
                    available_bikes: bike.available_bikes,
                    available_bike_stands: bike.available_bike_stands,
                    status: bike.status,
                    icon: Maping.stationIcon(bike)

                });

                Maping.markers.push(marker);

                //Affichage des renseignements sur un clique de chaque marker
                marker.addListener("click", function () {
                    Maping.afficheStation(marker);
                });
            });
        });
        CanvasSignature.valited();
    },

    
    //Si on rafraîchis la page
    refreshPage: function () {
        if (Maping.storage.length > 0) {
            Maping.infoReservation.textContent = Maping.storage.getItem("texte") + Maping.storage.getItem("station");
            Timer.text.textContent = Timer.init();
            Maping.blockReservation.style.display = "block";
            CanvasSignature.deleteReservation.style.display = "block";
            CanvasSignature.validReservation = false;
            
            
            CanvasSignature.deleteReservation.addEventListener("click", function () {
                Maping.annulationreservation();
            });

        } else if (Maping.storage.length === 0) {
            Maping.storage.clear();
            Maping.blockReservation.style.display = "none";

        }
    },

    //Afficher les détails de la station
    afficheStation: function (marker) {

        //On rassemble tout les markers
        Maping.ensembleMarker = marker;

        //Apparition du block de réservation
        Maping.blockReservation.style.display = "block";

        //Adresse de la station dans le détails
        Maping.addrStation.textContent = marker.adresse;

        //Vélos disponibles dans le détails
        Maping.availableBike.textContent = marker.available_bikes;

        //Rangements disponible dans le détails
        Maping.arrangBike.textContent = marker.available_bike_stands;


        //Etat de la station dans le détails
        if (marker.status === "OPEN") {
            Maping.statestation.textContent = " Ouverte";

        } else {
            Maping.statestation.textContent = " Fermée";
        }
        //Si la signature existe on l'efface
        CanvasSignature.signatureEmpty();

        Maping.condition(marker);
    },

    
    //Méthode de différentes conditions de marker en fonction des vélos
    condition: function (bike) {

        if (bike.status === "CLOSED" || bike.available_bikes === 0) { //Station fermée ou Plus de vélos

            //Disparition du bloc de réservation
            Maping.blockReservation.style.display = "none";

            //Message rouge
            document.querySelector(".message").style.display = "block";

            //Réservation disponible
            Maping.stationRes = false;

        } else if (bike.status === "OPEN" && bike.available_bikes > 0) { //Station ouverte

            Maping.stationRes = "true";

            //Message rouge
            document.querySelector(".message").style.display = "none";

            //Apparition du bloc de réservation
            Maping.blockReservation.style.display = "block";

        }
    },


    //Réservation de vélo à une station
    reservationMap: function () {

        if (Maping.ensembleMarker.available_bikes > 0 && CanvasSignature.validReservation === true) {

            //Message rouge d'annulation
            Maping.NewReservation.style.display = "none";

            //On retire un vélo de la station
            Maping.ensembleMarker.available_bikes--;
            Maping.availableBike.textContent = Maping.ensembleMarker.available_bikes;
            
            

            var now = new Date().getTime();
            Maping.storage.setItem("heure", now);

            Maping.storage.setItem("station", Maping.ensembleMarker.adresse);
            Maping.storage.setItem("texte", "Vélo réservé à : ");


            Maping.infoReservation.textContent = Maping.storage.getItem("texte") + Maping.storage.getItem("station");

            Timer.init(); //On lance le timer des 20 minutes

            CanvasSignature.signatureEmpty(); //On efface la signature

            CanvasSignature.deleteReservation.style.display = "block"; //Affichage du bouton d'annulation 

            //Clique sur le bouton "Annulation"
            CanvasSignature.deleteReservation.addEventListener("click", function () {
                Maping.annulationreservation();
            });
        }
    },

    //Une nouvelle réservation
    reservationNew: function () { 
        if (Maping.storage.length > 0 && Timer.timerOn === true) {
 
            Maping.NewReservation.style.display = "block";
            setTimeout(function () {
                Maping.NewReservation.style.display = "none";
            }, 3000);
        }
    },

    //Méthode qui change la couleur des marqeurs
    stationIcon: function (bike) {
        var icon;
        if (bike.status === "OPEN") {

            if (bike.available_bikes >= 20) {
                icon = "css/images/pin_green.png";
            } else if ((bike.available_bikes > 0) && (bike.available_bikes < 20)) {
                icon = "css/images/pin_yellow.png";
            } else {
                icon = "css/images/pin_red.png";
            }

        } else {
            icon = "css/images/closed_marker.png";
        }
        return icon;
    },

    //Annulation de la réservation
    annulationreservation: function () {
        Maping.storage.clear();
    }

}
