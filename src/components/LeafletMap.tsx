"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  markers?: any[];
}

export default function LeafletMap({ center, zoom, markers = [] }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const propertyMarkersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Map initialization
      mapInstance.current = L.map(mapRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Geoapify Light theme tiles
      L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`, {
        maxZoom: 19,
        attribution: 'Powered by Geoapify | © OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      propertyMarkersRef.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update center, user marker and property markers when props change
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setView(center, mapInstance.current.getZoom(), {
        animate: true,
      });

      // Clear old user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      // Add custom dark user marker
      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #000000; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      userMarkerRef.current = L.marker(center, { icon: userIcon }).addTo(mapInstance.current);

      // Clear and update property markers
      if (propertyMarkersRef.current) {
        propertyMarkersRef.current.clearLayers();
        
        markers.forEach(property => {
          const propertyIcon = L.divIcon({
            className: 'property-marker',
            html: `<div style="background-color: #ffffff; width: 20px; height: 20px; border-radius: 4px; display: flex; items-center; justify-center; box-shadow: 0 2px 5px rgba(0,0,0,0.5); transform: rotate(45deg);"><div style="transform: rotate(-45deg); font-size: 10px;">🏠</div></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          if (property.lat && property.lng) {
            L.marker([property.lat, property.lng], { icon: propertyIcon })
              .bindPopup(`<b>${property.title}</b><br>${property.price}`)
              .addTo(propertyMarkersRef.current!);
          }
        });
      }
    }
  }, [center, markers]);

  return <div ref={mapRef} className="absolute inset-0 z-0" />;
}
