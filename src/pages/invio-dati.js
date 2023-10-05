import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const mqtt = require('mqtt/dist/mqtt');


if ('geolocation' in navigator) {
    console.log("la geolocalizzazione è supportata");
} else {
    alert("la geolocalizzazione non è supporatata");
}


const us = {
    clientId: 'mqttGabo_' + Math.random().toString(16).substring(2, 8),
    // username: mqtt.username,
    // password: mqtt.password,
    useSSL: false,
    // onSuccess: onActionS,
    // onFailure: onActionF,
    protocolId: 'MQTT',
    protocolVersion: 5,
    rejectUnauthorized: false,
    clean: true,
    reconnectPeriod: 20000,
    connectTimeout: 30 * 1000,
    protocol: 'mqtt',
};
var client = mqtt.connect("ws://localhost:1883", us);
client.on("connect", () => {
    console.log('Connesso al broker MQTT');
})

var IDclient = 'IDclient' + Math.random().toString(16).substring(2, 8)

document.title = 'Trova il tuo dispositivo'; // Sostituisci 'Nuovo Titolo della Pagina' con il titolo desiderato

export const Invio = () => {
    const navigate = useNavigate();
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [isSending, setIsSending] = useState(false);

    function successCallback(position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
    }

    function errorCallback(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error('L\'utente ha negato l\'autorizzazione alla geolocalizzazione.');
                break;
            case error.POSITION_UNAVAILABLE:
                console.error('Informazioni sulla posizione non disponibili.');
                break;
            case error.TIMEOUT:
                console.error('Timeout durante la richiesta di geolocalizzazione.');
                break;
            case error.UNKNOWN_ERROR:
                console.error('Errore sconosciuto durante la geolocalizzazione.');
                break;
        }
    }
    const options = {
        enableHighAccuracy: true, // Richiede dati di alta precisione (se disponibili)
        timeout: 5000,           // Timeout della richiesta (in millisecondi)
        maximumAge: 0            // Tempo massimo di conservazione della cache dei dati di localizzazione (0 = nessuna cache)
    };


    const navigaHome = async () => {
        sendStop();
        navigate("/");
    }

    const sendStop = async () => {
        const topic = "/stop"
        const objStop = {
            IDstop: us.IDclient,
        };
        const messageStop = JSON.stringify(objStop);
        console.log(messageStop)
        client.publish(topic, messageStop, (err) => {
            if (err) {
                console.error('Errore durante la pubblicazione del messaggio:', err);
            } else {
                console.log('Messaggio pubblicato con successo su', topic);
            }
        });
    }

    const sendLoc = async () => {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
        const posizione = {
            ID: IDclient,
            geolocation: [latitude, longitude],
        };
        const topic = "/location"
        const message = JSON.stringify(posizione);;
        console.log(message)
        console.log(message);
        client.publish(topic, message, (err) => {
            if (err) {
                console.error('Errore durante la pubblicazione del messaggio:', err);
            } else {
                console.log('Messaggio pubblicato con successo su', topic);
            }
        });
    }

    useEffect(() => {
        let intervalId;

        if (isSending) {

            intervalId = setInterval(() => {
                sendLoc();
            }, 3000); // Invia un messaggio ogni secondo
        }

        // Pulizia dell'intervallo quando il componente viene smontato o il pulsante viene premuto nuovamente
        return () => {
            if (intervalId) {
                sendStop();
                clearInterval(intervalId);
            }
        };
    }, [isSending]);

    const toggleSending = () => {
        setIsSending((prevIsSending) => !prevIsSending);
    };

    return (
        <body id="home">
            <div>
                <div>
                    <input type="button" class="x" value={"X"} onClick={navigaHome} />
                </div>

                <div class="center-container">
                    <input type="button" id="messaggio" value={isSending ? "smetti di inviare dati" : "invia"} onClick={toggleSending} />
                    
                        <h1 id="text">il tuo dispositivo è ID: {IDclient}</h1>
                    
                </div>

            </div>
        </body>
    );
}