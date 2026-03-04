"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Booking, geocodeLocation, updateBooking } from "@/store/slices/bookingSlice";

const containerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "500px",
    borderRadius: "0.75rem"
};

const defaultCenter = {
    lat: 37.7749, // San Francisco
    lng: -122.4194
};

export function MapTracking() {
    const dispatch = useAppDispatch();
    const { bookings } = useAppSelector((state) => state.booking);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    // Geocode bookings that don't have lat/lng client-side on-the-fly
    useEffect(() => {
        const geocodeMissing = async () => {
            for (const b of bookings) {
                if (!b.booking_lat || !b.booking_lng) {
                    if (b.pickup_location) {
                        try {
                            const coords = await geocodeLocation(b.pickup_location);
                            if (coords) {
                                // Dispatch an update to save the coords back to the db/store
                                dispatch(updateBooking({ id: b.id, updates: { booking_lat: coords.lat, booking_lng: coords.lng } }));
                            }
                        } catch (e) {
                            console.error("Failed to geocode", b.pickup_location);
                        }
                    }
                }
            }
        };

        if (isLoaded) {
            geocodeMissing();
        }
    }, [bookings, isLoaded, dispatch]);

    const filteredBookings = useMemo(() => {
        if (!searchQuery) return bookings;
        const q = searchQuery.toLowerCase();
        return bookings.filter(b =>
            b.guest_name.toLowerCase().includes(q) ||
            b.car_name.toLowerCase().includes(q) ||
            b.pickup_location.toLowerCase().includes(q)
        );
    }, [bookings, searchQuery]);

    // Auto fit bounds
    useEffect(() => {
        if (mapRef.current && filteredBookings.length > 0 && window.google) {
            const bounds = new window.google.maps.LatLngBounds();
            let hasValidCoords = false;
            filteredBookings.forEach(b => {
                if (b.booking_lat && b.booking_lng) {
                    bounds.extend({ lat: b.booking_lat, lng: b.booking_lng });
                    hasValidCoords = true;
                }
            });
            if (hasValidCoords) {
                mapRef.current.fitBounds(bounds);
                // Don't zoom in too close for a single marker
                const listener = window.google.maps.event.addListener(mapRef.current, 'idle', () => {
                    const zoom = mapRef.current?.getZoom();
                    if (zoom && zoom > 14) mapRef.current?.setZoom(14);
                    window.google.maps.event.removeListener(listener);
                });
            }
        }
    }, [filteredBookings]);

    const getMarkerIcon = (status: string) => {
        let color = "#EAB308"; // pending (yellow)
        if (status === "confirmed") color = "#22C55E"; // green
        if (status === "completed") color = "#3B82F6"; // blue
        if (status === "cancelled") color = "#111827"; // black

        return {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#ffffff",
            scale: 1.5,
            anchor: isLoaded ? new window.google.maps.Point(12, 24) : undefined,
        };
    };

    if (loadError) return <div className="p-6 text-red-500">Error loading maps.</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg text-gray-900 font-semibold">Live Map Tracking</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Guest, Car, or Location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-80 pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Map Container */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden min-h-[500px]">
                {!isLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={defaultCenter}
                        zoom={5}
                        onLoad={map => { mapRef.current = map; }}
                        onClick={() => setSelectedBooking(null)}
                        options={{
                            disableDefaultUI: false,
                            zoomControl: true,
                            mapTypeControl: false,
                            scaleControl: true,
                            streetViewControl: false,
                            rotateControl: false,
                            fullscreenControl: true,
                            styles: [
                                {
                                    featureType: "poi",
                                    elementType: "labels",
                                    stylers: [{ visibility: "off" }]
                                }
                            ]
                        }}
                    >
                        {filteredBookings.map(b => {
                            if (!b.booking_lat || !b.booking_lng) return null;
                            return (
                                <Marker
                                    key={b.id}
                                    position={{ lat: b.booking_lat, lng: b.booking_lng }}
                                    icon={getMarkerIcon(b.status)}
                                    onClick={() => setSelectedBooking(b)}
                                />
                            );
                        })}

                        {selectedBooking && selectedBooking.booking_lat && selectedBooking.booking_lng && (
                            <InfoWindow
                                position={{ lat: selectedBooking.booking_lat, lng: selectedBooking.booking_lng }}
                                onCloseClick={() => setSelectedBooking(null)}
                            >
                                <div className="p-1 max-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedBooking.status === 'confirmed' ? 'bg-green-500' : selectedBooking.status === 'pending' ? 'bg-yellow-500' : selectedBooking.status === 'completed' ? 'bg-blue-500' : 'bg-black'}`} />
                                        <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm">{selectedBooking.car_name}</h3>
                                    <p className="text-xs text-gray-600 mt-1">{selectedBooking.guest_name}</p>
                                    <p className="text-xs text-gray-500">{selectedBooking.guest_phone}</p>
                                    <div className="mt-2 text-[11px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                                        {selectedBooking.pickup_date} <br /> to {selectedBooking.return_date}
                                    </div>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Pending</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" /> Confirmed</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /> Completed</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-900" /> Cancelled</div>
            </div>
        </div>
    );
}
