import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

export type MapPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Pin fill. */
  color: string;
  /** Shown under the name in the popup. */
  detail?: string;
};

export type LeafletMapProps = {
  pins: MapPin[];
  center: [number, number];
  zoom: number;
  /** Called when a pin's "Open map" button is used. */
  onOpen?: (id: string) => void;
  /** Refit the view to the pins whenever they change — used while filtering. */
  fitToPins?: boolean;
  className?: string;
};

/*
  OpenStreetMap tiles, not Google or Mapbox: both of those need an account and
  a key in the build, and this page has to work the moment it is deployed. OSM
  asks for attribution and light traffic, both of which we honour below.

  Leaflet is driven imperatively rather than through react-leaflet — one
  dependency instead of two, and the only React-shaped thing this needs is
  "rebuild the markers when the filter changes".
*/

/** A teardrop marker drawn as SVG, so pin colour comes from our own palette. */
const pinIcon = (color: string) =>
  L.divIcon({
    className: 'dre-pin',
    html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 33S25 21.5 25 13A12 12 0 1 0 1 13c0 8.5 12 20 12 20z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="13" cy="13" r="4.5" fill="white"/>
    </svg>`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
  });

export const LeafletMap = ({
  pins,
  center,
  zoom,
  onOpen,
  fitToPins = false,
  className,
}: LeafletMapProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  /* Popups are plain HTML, so the "Open map" button inside one cannot be a
     React handler. The map is delegated a single click listener instead, and
     the callback is held in a ref so it never goes stale. */
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  // ------------------------------------------------------------ create once
  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;

    const map = L.map(hostRef.current, {
      center,
      zoom,
      // the page scrolls; a wheel that zooms the map instead would trap it
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const host = hostRef.current;
    const onClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-open-map]');
      if (!target) return;
      const id = target.getAttribute('data-open-map');
      if (id) onOpenRef.current?.(id);
    };
    host.addEventListener('click', onClick);

    return () => {
      host.removeEventListener('click', onClick);
      map.remove();
      mapRef.current = null;
    };
    // center/zoom are the *initial* view only; refitting is handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------- markers follow props
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    pins.forEach((pin) => {
      L.marker([pin.lat, pin.lng], { icon: pinIcon(pin.color), title: pin.name })
        .bindPopup(
          `<div style="min-width:150px">
             <strong style="display:block;font-size:13px;line-height:1.3">${pin.name}</strong>
             ${pin.detail ? `<span style="display:block;margin-top:2px;font-size:12px;opacity:.7">${pin.detail}</span>` : ''}
             <button data-open-map="${pin.id}" type="button"
               style="margin-top:8px;width:100%;cursor:pointer;border:0;border-radius:8px;background:#0080c6;color:#fff;font:600 12px/1 inherit;padding:8px 10px">
               Open map
             </button>
           </div>`,
        )
        .addTo(layer);
    });

    if (fitToPins && pins.length > 0) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
    }
  }, [pins, fitToPins]);

  /* The map is created before the browser has finished laying the page out, so
     Leaflet can measure the container at the wrong size and leave grey gutters
     where tiles should be. Watching the box and re-measuring fixes it. */
  useEffect(() => {
    if (!hostRef.current) return;
    const ro = new ResizeObserver(() => mapRef.current?.invalidateSize());
    ro.observe(hostRef.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={hostRef} className={cn('h-full w-full', className)} />;
};
