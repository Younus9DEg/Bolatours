import { useEffect, useState } from "react";
import { Map, Mountain } from "lucide-react";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

type MapStop = {
  name: string;
  tag: string;
  lat: number;
  lng: number;
  days: number;
  district?: string;
};

type MapMode = "flat" | "terrain";

function MovingRouteCar({ stops }: { stops: MapStop[] }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const carIcon = divIcon({
    className: "animated-car-icon",
    html: "<span>🚗</span>",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  useEffect(() => {
    if (!stops.length) {
      setPosition(null);
      return;
    }
    if (stops.length === 1) {
      setPosition([stops[0].lat, stops[0].lng]);
      return;
    }
    let segment = 0;
    let progress = 0;
    const move = () => {
      const from = stops[segment];
      const to = stops[(segment + 1) % stops.length];
      progress += 0.0025;
      if (progress >= 1) {
        progress = 0;
        segment = (segment + 1) % stops.length;
      }
      setPosition([
        from.lat + (to.lat - from.lat) * progress,
        from.lng + (to.lng - from.lng) * progress,
      ]);
    };
    setPosition([stops[0].lat, stops[0].lng]);
    const timer = window.setInterval(move, 60);
    return () => window.clearInterval(timer);
  }, [stops]);

  return position ? <Marker position={position} icon={carIcon} zIndexOffset={1000} /> : null;
}

export default function SriLankaMap({
  stops,
  selected,
  onToggle,
}: {
  stops: MapStop[];
  selected: string[];
  onToggle: (name: string) => void;
}) {
  const [mode, setMode] = useState<MapMode>("terrain");
  const chosen = stops.filter((stop) => selected.includes(stop.name));

  return (
    <div className={`real-map-shell ${mode === "terrain" ? "terrain-mode" : ""}`}>
      <div className="map-mode-control" aria-label="Map view">
        {[
          { value: "flat", label: "Map", icon: Map },
          { value: "terrain", label: "Terrain", icon: Mountain },
        ].map(({ value, label, icon: Icon }) => (
          <button
            className={mode === value ? "active" : ""}
            key={value}
            onClick={() => setMode(value as MapMode)}
            aria-pressed={mode === value}
            title={`${label} view`}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <MapContainer
        className="real-sri-lanka-map"
        center={[7.8731, 80.7718]}
        zoom={7.7}
        minZoom={7}
        maxZoom={11}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {chosen.length > 1 && (
          <>
            <Polyline
              positions={chosen.map((stop) => [stop.lat, stop.lng] as [number, number])}
              pathOptions={{ color: "#ffd21f", weight: 4, opacity: 0.9, dashArray: "8 8" }}
            />
            <MovingRouteCar stops={chosen} />
          </>
        )}
        {stops.map((stop) => (
          <CircleMarker
            key={stop.name}
            center={[stop.lat, stop.lng]}
            radius={selected.includes(stop.name) ? 10 : 7}
            pathOptions={{
              color: "#111",
              weight: 3,
              fillColor: selected.includes(stop.name) ? "#ffd21f" : "#fff",
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onToggle(stop.name) }}
          >
            <Popup>
              <strong>{stop.name}</strong>
              <br />
              {stop.tag}
              <br />
              <button className="map-popup-action" onClick={() => onToggle(stop.name)}>
                {selected.includes(stop.name) ? "Remove from route" : "Add to route"}
              </button>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
