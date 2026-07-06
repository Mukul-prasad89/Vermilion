const EARTH_RADIUS_KM = 6371;

export function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function isValidLat(lat) {
  return typeof lat === "number" && lat >= -90 && lat <= 90;
}

export function isValidLng(lng) {
  return typeof lng === "number" && lng >= -180 && lng <= 180;
}

export function degradeCoordinate(coord) {
  return Math.round(coord * 1000) / 1000;
}

export function estimateEtaMinutes(distanceKm, speedKmh = 25) {
  if (speedKmh <= 0) return null;
  return Math.round((distanceKm / speedKmh) * 60);
}