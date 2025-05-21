// MapView.jsx
import React, {useRef, useImperativeHandle, forwardRef, useEffect, useState, useMemo,} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapView = React.memo(
  forwardRef((props, ref) => {
    const { courts, onMarkerClick, selectedCourtIndex } = props;
    const mapRef = useRef();
    const markerRefs = useRef([]);
    const [mapCenter, setMapCenter] = useState([37.0902, -95.7129]);

    // Attempt to get user location on mount
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
          },
          (err) => {
            console.warn('Geolocation failed or denied:', err.message);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
      }
    }, []);

    // Bounce animation on selected marker
    useEffect(() => {
      if (
        selectedCourtIndex !== null &&
        markerRefs.current[selectedCourtIndex]
      ) {
        const marker = markerRefs.current[selectedCourtIndex];
        const latLng = marker.getLatLng();

        // Fly to and open popup
        marker.openPopup();
        mapRef.current?.flyTo(latLng, 16, { duration: 1.2 });

        // Simulate bounce animation: nudge the marker up and down quickly
        let bounceCount = 0;
        const bounce = setInterval(() => {
          const offset = bounceCount % 2 === 0 ? 0.0003 : -0.0003;
          const newLatLng = L.latLng(latLng.lat + offset, latLng.lng);
          marker.setLatLng(newLatLng);
          bounceCount++;
          if (bounceCount > 5) {
            marker.setLatLng(latLng); // reset
            clearInterval(bounce);
          }
        }, 80);
      }
    }, [selectedCourtIndex]);

    // Expose flyToCourt from parent
    useImperativeHandle(
      ref,
      () => ({
        flyToCourt: (lat, lng) => {
          if (mapRef.current && !isNaN(lat) && !isNaN(lng)) {
            mapRef.current.flyTo([lat, lng], 16, { duration: 1.25 });
          }
        },
      }),
      []
    );

    // Memoized markers
    const courtMarkers = useMemo(() => {
      markerRefs.current = []; // reset refs
      return courts.map((court, index) => {
        const lat = parseFloat(court.Address.Latitude);
        const lng = parseFloat(court.Address.Longitude);
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker
            key={index}
            position={[lat, lng]}
            ref={(el) => (markerRefs.current[index] = el)}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
              click: () => onMarkerClick(index),
            }}
          >
            <Popup>
              <strong>{court.ClubDetails?.Name}</strong>
              <br />
              {court.Address?.Location}
            </Popup>
          </Marker>
        );
      });
    }, [courts, onMarkerClick]);

    return (
      <MapContainer
        center={mapCenter}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          L.control.zoom({ position: 'bottomleft' }).addTo(mapInstance);
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>{courtMarkers}</MarkerClusterGroup>
      </MapContainer>
    );
  })
);

export default MapView;