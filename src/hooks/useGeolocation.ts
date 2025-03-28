import { useState, useEffect } from "react";

type Location = {
  latitude: number;
  longitude: number;
};

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      }
    );
  }, []);

  return { location, error };
}

export function encodeGeohash(lat: number, lng: number): string {
  const base32 = "0123456789bcdefghjkmnpqrstuvwxyz";
  let bits = 0;
  let ch = 0;
  let geohash = "";
  let isEven = true;
  let latMin = -90;
  let latMax = 90;
  let lngMin = -180;
  let lngMax = 180;

  while (geohash.length < 8) {
    if (isEven) {
      const lngMid = (lngMin + lngMax) / 2;
      if (lng >= lngMid) {
        ch |= 1 << (4 - bits);
        lngMin = lngMid;
      } else {
        lngMax = lngMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (lat >= latMid) {
        ch |= 1 << (4 - bits);
        latMin = latMid;
      } else {
        latMax = latMid;
      }
    }

    isEven = !isEven;
    bits++;

    if (bits === 5) {
      geohash += base32[ch];
      bits = 0;
      ch = 0;
    }
  }

  return geohash;
}
