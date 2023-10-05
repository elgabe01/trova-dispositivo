import { useNavigate } from "react-router-dom";

document.title = 'Trova il tuo dispositivo'

export const HomePage = () => {
    const navigate = useNavigate();

    const navigaDispositivo = async () => {
        navigate("/Invio-dati");
    }

    const navigaMappa = async () => {
        navigate("/Mappa");
    }

    return (
        <body id="home">
        <div class="center-container">
        
            <div>
                <input type="button" value="dispositivo" id="invio-dati" onClick={navigaDispositivo} />
                <input type="button" value="applicazione" id="mappa" onClick={navigaMappa} />
            </div>
        </div>
        </body>
    );
}