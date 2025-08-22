import { useEffect, useState } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const socket = io("http://localhost:5000");

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    console.log("Recenter: moving map to", lat, lng);
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function BusMap({ busId }) {
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    if (!busId) return; 

    console.log("Connecting to bus room:", busId);
    socket.emit("joinBus", busId.toUpperCase());

    socket.on("locationUpdate", (data) => {
      console.log("Received locationUpdate from server:", data);
      setLocation({ lat: data.lat, lng: data.lng });
    });

    return () => {
      console.log("Disconnecting from bus room:", busId);
      socket.off("locationUpdate");
    };
  }, [busId]);

  useEffect(() => {
    console.log("Location state updated:", location);
  }, [location]);

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={15}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]}>
        <Popup>Bus {busId}</Popup>
      </Marker>
      <Recenter lat={location.lat} lng={location.lng} />
    </MapContainer>
  );
}
