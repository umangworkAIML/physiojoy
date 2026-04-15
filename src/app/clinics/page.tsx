"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Star, Search, Navigation } from "lucide-react";
import { isGoogleMapsAvailable } from "@/components/ClinicMap";

/**
 * Dynamically import ClinicMap to avoid SSR issues with Google Maps.
 * Also means the heavy SDK bundle is only loaded on the clinics page.
 */
const ClinicMap = dynamic(() => import("@/components/ClinicMap"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-blue-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string | null;
  latitude: number;
  longitude: number;
  description?: string | null;
  services: string[];
  rating: number;
  timings: string;
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Clinic | null>(null);
  const mapsAvailable = isGoogleMapsAvailable();

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/clinics?${params}`);
      const data = await res.json();
      setClinics(data.clinics || []);
    } catch {
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-border/50">
        <div className="container-custom py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Nearby Clinics</h1>
          <p className="text-muted-foreground">Discover top-rated physiotherapy clinics in Ahmedabad</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchClinics();
            }}
            className="mt-6 flex gap-3 max-w-lg"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clinics by name or area..."
                className="input pl-11"
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-24">
              {mapsAvailable ? (
                /* ── Google Maps interactive map ── */
                <ClinicMap
                  clinics={clinics}
                  selectedClinic={selected}
                  onSelectClinic={setSelected}
                />
              ) : (
                /* ── Static fallback (no API key) ── */
                <div className="aspect-[16/10] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center relative">
                  <div className="text-center p-8">
                    <Navigation className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">Interactive Map</h3>
                    <p className="text-blue-700/60 text-sm max-w-sm mx-auto">
                      Configure your Google Maps API key in the environment variables to enable the interactive clinic map.
                    </p>
                  </div>

                  {/* Clinic markers preview */}
                  {clinics.slice(0, 5).map((clinic, i) => (
                    <button
                      key={clinic.id}
                      onClick={() => setSelected(clinic)}
                      className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform hover:scale-125 ${
                        selected?.id === clinic.id
                          ? "bg-primary scale-125"
                          : "bg-blue-500"
                      }`}
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${15 + i * 18}%`,
                      }}
                      title={clinic.name}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}

              {selected && (
                <div className="p-4 border-t border-border animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{selected.name}</h3>
                      <p className="text-sm text-muted-foreground">{selected.address}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{selected.rating}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clinic List */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              {loading ? "Loading..." : `${clinics.length} clinics found`}
            </p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border p-5">
                    <div className="h-5 w-48 skeleton mb-2" />
                    <div className="h-4 w-full skeleton mb-2" />
                    <div className="h-4 w-32 skeleton" />
                  </div>
                ))}
              </div>
            ) : clinics.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">No clinics found</h3>
                <p className="text-sm text-muted-foreground">Try a different search</p>
              </div>
            ) : (
              clinics.map((clinic, i) => (
                <motion.button
                  key={clinic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(clinic)}
                  className={`w-full text-left bg-card rounded-2xl border p-5 card-hover ${
                    selected?.id === clinic.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{clinic.name}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{clinic.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground flex items-start gap-1.5 mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {clinic.address}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {clinic.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {clinic.timings}
                    </span>
                  </div>

                  {clinic.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {clinic.services.slice(0, 3).map((s) => (
                        <span key={s} className="badge badge-primary">{s}</span>
                      ))}
                    </div>
                  )}
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
