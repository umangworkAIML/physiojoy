"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Star } from "lucide-react";

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

/** Default center: Ahmedabad, Gujarat */
const DEFAULT_CENTER = { lat: 23.0225, lng: 72.5714 };
const DEFAULT_ZOOM = 12;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string | null;
  latitude: number;
  longitude: number;
  description?: string | null;
  rating: number;
  timings: string;
  services: string[];
}

interface ClinicMapProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onSelectClinic: (clinic: Clinic | null) => void;
}

export default function ClinicMap({ clinics, selectedClinic, onSelectClinic }: ClinicMapProps) {
  const [infoWindowClinic, setInfoWindowClinic] = useState<Clinic | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_KEY,
  });

  const onMapLoad = useCallback(() => {
    // Map loaded successfully
  }, []);

  // Error state — render graceful fallback
  if (loadError) {
    return <MapFallback message="Failed to load Google Maps. Showing clinic list only." />;
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-blue-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Compute center based on selected clinic or default
  const center = selectedClinic
    ? { lat: selectedClinic.latitude, lng: selectedClinic.longitude }
    : clinics.length > 0
      ? { lat: clinics[0].latitude, lng: clinics[0].longitude }
      : DEFAULT_CENTER;

  return (
    <div className="aspect-[16/10] rounded-2xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={selectedClinic ? 15 : DEFAULT_ZOOM}
        options={mapOptions}
        onLoad={onMapLoad}
        onClick={() => {
          setInfoWindowClinic(null);
          onSelectClinic(null);
        }}
      >
        {clinics.map((clinic) => (
          <Marker
            key={clinic.id}
            position={{ lat: clinic.latitude, lng: clinic.longitude }}
            title={clinic.name}
            onClick={() => {
              setInfoWindowClinic(clinic);
              onSelectClinic(clinic);
            }}
            icon={
              selectedClinic?.id === clinic.id
                ? {
                    url: "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0f766e"/><circle cx="12" cy="9" r="3" fill="white"/></svg>'
                      ),
                    scaledSize: new google.maps.Size(36, 36),
                  }
                : undefined
            }
          />
        ))}

        {infoWindowClinic && (
          <InfoWindow
            position={{
              lat: infoWindowClinic.latitude,
              lng: infoWindowClinic.longitude,
            }}
            onCloseClick={() => setInfoWindowClinic(null)}
          >
            <div className="p-1 max-w-[200px]">
              <h4 className="font-semibold text-sm mb-1">{infoWindowClinic.name}</h4>
              <p className="text-xs text-gray-600 mb-1">{infoWindowClinic.address}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{infoWindowClinic.rating}</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

/** Static fallback when Google Maps API key is not configured */
function MapFallback({ message }: { message?: string }) {
  return (
    <div className="aspect-[16/10] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-blue-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-blue-900 mb-2">Interactive Map</h3>
        <p className="text-blue-700/60 text-sm max-w-sm mx-auto">
          {message ||
            "Configure your Google Maps API key in the environment variables to enable the interactive clinic map."}
        </p>
      </div>
    </div>
  );
}

/** Exported so the clinics page can check availability */
export function isGoogleMapsAvailable(): boolean {
  return GOOGLE_MAPS_KEY.length > 0;
}
