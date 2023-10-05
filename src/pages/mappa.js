import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import React, { useEffect, useState, View } from "react";
import { Icon, marker } from "leaflet";
import { useNavigate } from "react-router-dom";
import "../App.css"
import "leaflet/dist/leaflet.css"
const mqtt = require('mqtt/dist/mqtt');

document.title = 'Trova il tuo dispositivo'

const us = {
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

const topics = ['/location', '/stop'];

// Sottoscrivi a ciascun topic
topics.forEach((topic) => {
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Errore durante la sottoscrizione a ${topic}: ${err}`);
        } else {
            console.log(`Sottoscrizione a ${topic} riuscita`);
        }
    });
});
client.on("connect", () => {
    console.log('Connesso al broker MQTT');
})
const icon = new Icon({
    iconUrl: require("../image/pin.png"),
    iconSize: [38, 38]
})

export const Mappa = () => {
    const [Markers, setMarkers] = useState([]);
    const navigate = useNavigate()


    const navigaHome = async () => {
        navigate("/");
    }

    client.on('message', (receivedTopic, message) => {
        if (receivedTopic === "/location") {
            const localizzazione = JSON.parse(message.toString());
            const idDaCercare = localizzazione.ID
            if (Markers.find((loc) => loc.ID === idDaCercare)) {
                const indiceOggettoDaCambiare = Markers.findIndex((oggetto) => oggetto.ID === idDaCercare);
                Markers[indiceOggettoDaCambiare] = localizzazione;
                setMarkers([...Markers]);
            } else { setMarkers([...Markers, localizzazione]); }


        } else {
            const ObjId = JSON.parse(message.toString());
            const idDaCercare = ObjId.IDstop
            console.log(ObjId.IDstop)
            if (Markers.find((stop) => stop.ID === idDaCercare)) {
                const indiceOggettoDaRimuovere = Markers.findIndex((oggetto) => oggetto.ID === idDaCercare);
                Markers.splice(indiceOggettoDaRimuovere, 1);
            }
            setMarkers([...Markers])
        }
    })



    return (
        <body id="bodyMap">
            <div>
                <input type="button" class="x" value={"X"} onClick={navigaHome} />
                < MapContainer center={[48.8566, 2.3522]} zoom={13}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    {
                        Markers.map(marker => (
                            <Marker position={marker.geolocation} icon={icon} ><Popup><h2>{marker.ID} </h2></Popup>
                            </Marker>))
                    }
                </MapContainer>
                <h1>
                    Lista dispositivi attivi  ({Markers.length})
                </h1>
                {Markers.map((marker) => (
                    <div id="disp">
                        <h2>
                            dispositivo:{marker.ID}
                        </h2>
                    </div>
                ))
                }


            </div>
        </body>
    );
}