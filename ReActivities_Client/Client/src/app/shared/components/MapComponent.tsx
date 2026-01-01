import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {useEffect} from "react";


type Props = {
    position: [number, number];
    venue: string
}

function ResizeMap() {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    return null;
}

export default function MapComponent({position, venue} : Props) {
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: "100%",
            width: "100%",
            borderRadius: 12,}}>
                <ResizeMap />
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        {venue}
                    </Popup>
                </Marker>
        </MapContainer>
    )
}
