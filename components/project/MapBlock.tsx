'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import LuxuryButton from '@/components/ui/LuxuryButton';
import LazyMap from '@/components/ui/LazyMap';
import { getDeveloperName } from '../../lib/utils/localization';

type ProjectPin = {
  lat: number;
  lon: number;
  title?: string;
  price?: string;
  image?: string;
  slug?: string;
  developer?: string;
  category?: string;
};

type POI = {
  lat: number;
  lon: number;
  name: { ar?: string; en?: string };
  category?: string;
  distance?: string;
};

type Props = {
  lat?: number;
  lon?: number;
  zoom?: number;
  markers?: ProjectPin[];
  pois?: POI[];
  showFilters?: boolean;
  locale?: 'ar' | 'en';
};

export default function MapBlock({ 
  lat, 
  lon, 
  zoom = 14, 
  markers = [], 
  pois = [],
  showFilters = false,
  locale = 'en'
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const poisLayerRef = useRef<any>(null);
  const radiusLayerRef = useRef<any>(null);
  
  const [selectedPin, setSelectedPin] = useState<ProjectPin | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showPOIs, setShowPOIs] = useState(true);
  const [showRadius, setShowRadius] = useState(false);

  // Filter options
  const filterOptions = [
    { key: 'all', label: { en: 'All Projects', ar: 'جميع المشاريع' } },
    { key: 'apartments', label: { en: 'Apartments', ar: 'شقق' } },
    { key: 'villas', label: { en: 'Villas', ar: 'فلل' } },
    { key: 'townhouses', label: { en: 'Townhouses', ar: 'تاون هاوس' } },
  ];

  // Custom golden pin icon
  const createCustomIcon = (isProject = true, isSelected = false) => {
    const color = isProject ? (isSelected ? '#f59e0b' : '#eab308') : '#6b7280';
    const size = isSelected ? 40 : 30;
    
    return `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(245, 217, 122, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #000;
        font-size: ${size/3}px;
        transform: translate(-50%, -100%);
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        ${isProject ? '🏢' : '📍'}
      </div>
    `;
  };

  useEffect(() => {
    let cancelled = false;

    if (!containerRef.current) return;
    containerRef.current.style.minHeight = '480px';

    (async () => {
      const L = await import('leaflet');

      if (cancelled) return;

      if (!mapRef.current && containerRef.current) {
        mapRef.current = L.map(containerRef.current, {
          zoomControl: true,
          attributionControl: false,
          preferCanvas: true,
        });

        // Dark theme map tiles
        layerRef.current = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          { 
            maxZoom: 19, 
            attribution: '© OpenStreetMap contributors, © CARTO',
            subdomains: 'abcd'
          }
        ).addTo(mapRef.current);

        markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
        poisLayerRef.current = L.layerGroup().addTo(mapRef.current);
        radiusLayerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const center = [
        typeof lat === 'number' ? lat : 25.2048,
        typeof lon === 'number' ? lon : 55.2708,
      ] as [number, number];

      mapRef.current.setView(center, zoom);

      // Clear existing markers
      markerLayerRef.current.clearLayers();
      poisLayerRef.current.clearLayers();
      radiusLayerRef.current.clearLayers();

      // Filter markers based on active filter
      const filteredMarkers = markers.filter(marker => {
        if (activeFilter === 'all') return true;
        return marker.category?.toLowerCase().includes(activeFilter);
      });

      // Add project markers
      filteredMarkers.forEach((marker, index) => {
        const isSelected = selectedPin?.slug === marker.slug;
        const customIcon = L.divIcon({
          html: createCustomIcon(true, isSelected),
          className: 'custom-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const projectMarker = L.marker([marker.lat, marker.lon], { icon: customIcon })
          .addTo(markerLayerRef.current);

        // Click handler for project pins
        projectMarker.on('click', () => {
          setSelectedPin(marker);
        });

        // Hover effects
        projectMarker.on('mouseover', () => {
          projectMarker.bindTooltip(
            marker.title || 'Project',
            { 
              direction: 'top',
              className: 'luxury-tooltip',
              permanent: false
            }
          ).openTooltip();
        });

        // Add radius circle if enabled
        if (showRadius) {
          const circle = L.circle([marker.lat, marker.lon], {
            radius: 400, // 400 meters radius
            fillColor: '#fbbf24',
            color: '#f59e0b',
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.1
          }).addTo(radiusLayerRef.current);
        }
      });

      // Add POI markers if enabled
      if (showPOIs && pois.length > 0) {
        pois.forEach((poi) => {
          if (poi.lat && poi.lon) {
            const poiIcon = L.divIcon({
              html: createCustomIcon(false),
              className: 'custom-poi-marker',
              iconSize: [25, 25],
              iconAnchor: [12, 25],
            });

            const poiMarker = L.marker([poi.lat, poi.lon], { icon: poiIcon })
              .addTo(poisLayerRef.current);

            poiMarker.bindTooltip(
              poi.name[locale] || poi.name.en || 'POI',
              { 
                direction: 'top',
                className: 'poi-tooltip'
              }
            );
          }
        });
      }

      setTimeout(() => mapRef.current?.invalidateSize(), 50);
    })();

    return () => {
      cancelled = true;
    };
  }, [lat, lon, zoom, markers, pois, activeFilter, showPOIs, showRadius, selectedPin, locale]);

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center justify-between p-4 liquid-glass rounded-xl">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <LuxuryButton
                key={option.key}
                variant={activeFilter === option.key ? "primary" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(option.key)}
                className="rounded-full text-sm font-medium"
              >
                {option.label[locale]}
              </LuxuryButton>
            ))}
          </div>
          
          <LuxuryButton
            variant={showPOIs ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowPOIs(!showPOIs)}
            className="rounded-full text-sm font-medium"
          >
            {locale === 'ar' ? 'نقاط الاهتمام' : 'Points of Interest'}
          </LuxuryButton>
          
          <LuxuryButton
            variant={showRadius ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowRadius(!showRadius)}
            className="rounded-full text-sm font-medium"
          >
            {locale === 'ar' ? 'دائرة المنطقة' : 'Area Radius'}
          </LuxuryButton>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-yellow-400/30 shadow-2xl">
        <LazyMap className="h-[480px] w-full">
          <div ref={containerRef} className="h-[480px] w-full bg-black/30" />
        </LazyMap>
        
        {/* Selected Pin Card */}
        {selectedPin && (
          <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 liquid-glass p-4 rounded-xl border border-yellow-400/30">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold gold-gradient">
                {selectedPin.title}
              </h3>
              <LuxuryButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedPin(null)}
                className="w-8 h-8 p-0 text-xl flex items-center justify-center"
              >
                ×
              </LuxuryButton>
            </div>
            
            {selectedPin.image && (
              <img
                src={selectedPin.image}
                alt={selectedPin.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            
            <div className="space-y-2 text-sm">
              {selectedPin.developer && (
                <p className="text-yellow-400">
                  {locale === 'ar' ? 'المطور:' : 'Developer:'} {getDeveloperName(selectedPin.developer, locale)}
                </p>
              )}
              {selectedPin.price && (
                <p className="text-white font-semibold">
                  {selectedPin.price}
                </p>
              )}
              {selectedPin.slug && (
                <a
                  href={`/${locale}/projects/${selectedPin.slug}`}
                  className="inline-block mt-3 px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-medium hover:bg-yellow-300 transition-colors"
                >
                  {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
