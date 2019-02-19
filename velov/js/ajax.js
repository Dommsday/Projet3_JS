//Initialisation de la demande GET
var ajaxGet = {

    init: function (url, callback) {
        var req = new XMLHttpRequest;
        req.open("GET", url);

        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                callback(req.responseText);
            } else {
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });

        req.addEventListener("error", function () {
            console.log("Erreur réseau avec l'url " + url);
        });
        req.send(null);
    }
}

