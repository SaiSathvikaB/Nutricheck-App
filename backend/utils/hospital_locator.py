import requests
import time

# -----------------------
# CONFIG
# -----------------------

GEOAPIFY_KEY = "8c55197ba2c14b7589c49a37cdb52eb5"
FOURSQUARE_KEY = "Q4NYUD4IFGAXSCKYVORQMDFY5AIKZEGZM2PC2UMJWCJSWHCX"

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
]

RADIUS_METERS = 2000
CACHE_TTL = 300  # 5 minutes

EXCLUDE_WORDS = [
    "eye", "dental", "dentist", "orthopedic",
    "orthopaedic", "ortho", "maternity", "ivf", "fertility"
]

# -----------------------
# CACHE STORAGE
# -----------------------
CACHE = {}

def cache_key(lat, lon, radius):
    return f"{round(lat,3)}_{round(lon,3)}_{radius}"


# -----------------------
# MAIN FUNCTION
# -----------------------
def get_nearby_hospitals(lat: float, lon: float, radius: int = RADIUS_METERS):

    key = cache_key(lat, lon, radius)

    # -----------------------
    # CHECK CACHE
    # -----------------------
    if key in CACHE:
        cached = CACHE[key]
        if time.time() - cached["time"] < CACHE_TTL:
            print("[CACHE] Returning cached hospitals")
            return cached["data"], None

    # -----------------------
# 2. GEOAPIFY (PRIMARY)
# -----------------------
    try:
        geo_url = f"https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:{lon},{lat},{radius}&limit=10&apiKey={GEOAPIFY_KEY}"

        res = requests.get(geo_url, timeout=8)
        res.raise_for_status()
        data = res.json()

        hospitals = []

        for f in data.get("features", []):
            props = f.get("properties", {})
            name = props.get("name", "Hospital")

            if any(word in name.lower() for word in EXCLUDE_WORDS):
                continue

            h_lat = props.get("lat")
            h_lon = props.get("lon")

            hospitals.append({
                "name": name,
                "distance": round(haversine(lat, lon, h_lat, h_lon), 2),
                "lat": h_lat,
                "lon": h_lon,
                "address": props.get("formatted"),
                "phone": props.get("phone"),
                "type": "Hospital"
            })

        if hospitals:
            hospitals.sort(key=lambda x: x["distance"])
            CACHE[key] = {"time": time.time(), "data": hospitals[:10]}
            print("[HospitalLocator] Geoapify success")
            return hospitals[:10], None

    except Exception as e:
        print("[HospitalLocator] Geoapify failed:", e)
    
    # -----------------------
# 3. FOURSQUARE
# -----------------------
    try:
        fsq_url = "https://api.foursquare.com/v3/places/search"

        headers = {
            "Authorization": FOURSQUARE_KEY
        }

        params = {
            "ll": f"{lat},{lon}",
            "radius": radius,
            "categories": "15014",  # hospitals
            "limit": 10
        }

        res = requests.get(fsq_url, headers=headers, params=params, timeout=8)
        res.raise_for_status()
        data = res.json()

        hospitals = []

        for place in data.get("results", []):
            name = place.get("name", "Hospital")

            if any(word in name.lower() for word in EXCLUDE_WORDS):
                continue

            geocodes = place.get("geocodes", {}).get("main", {})
            h_lat = geocodes.get("latitude")
            h_lon = geocodes.get("longitude")

            hospitals.append({
                "name": name,
                "distance": round(haversine(lat, lon, h_lat, h_lon), 2),
                "lat": h_lat,
                "lon": h_lon,
                "address": place.get("location", {}).get("formatted_address"),
                "phone": None,
                "type": "Hospital"
            })

        if hospitals:
            hospitals.sort(key=lambda x: x["distance"])
            CACHE[key] = {"time": time.time(), "data": hospitals[:10]}
            print("[HospitalLocator] Foursquare success")
            return hospitals[:10], None

    except Exception as e:
        print("[HospitalLocator] Foursquare failed:", e)
    # -----------------------
# 2. NOMINATIM (NEW)
# -----------------------
    try:
        nom_url = f"https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=10&bounded=1&viewbox={lon-0.02},{lat+0.02},{lon+0.02},{lat-0.02}"

        headers = {
            "User-Agent": "nutricheck-app" 
            # REQUIRED (very important)
        }

        res = requests.get(nom_url, headers=headers, timeout=8)
        res.raise_for_status()
        data = res.json()

        hospitals = []

        for place in data:
            name = place.get("display_name", "Hospital")

            if any(word in name.lower() for word in EXCLUDE_WORDS):
                continue

            h_lat = float(place.get("lat"))
            h_lon = float(place.get("lon"))
            if not h_lat or not h_lon:
                continue

            hospitals.append({
                "name": name.split(",")[0],
                "distance": round(haversine(lat, lon, h_lat, h_lon), 2),
                "lat": h_lat,
                "lon": h_lon,
                "address": place.get("display_name"),
                "phone": None,
                "type": "Hospital"
            })

        if hospitals:
            hospitals.sort(key=lambda x: x["distance"])
            CACHE[key] = {"time": time.time(), "data": hospitals[:10]}
            print("[HospitalLocator] Nominatim success")
            return hospitals[:10], None

    except Exception as e:
        print("[HospitalLocator] Nominatim failed:", e)
    # -----------------------
    # 3. OVERPASS (LAST)
    # -----------------------
    query = f"""
    [out:json][timeout:20];
    (
      node["amenity"="hospital"](around:{radius},{lat},{lon});
      way["amenity"="hospital"](around:{radius},{lat},{lon});
    );
    out center;
    """

    for url in OVERPASS_URLS:
        try:
            res = requests.post(url, data={"data": query}, timeout=18)
            res.raise_for_status()
            data = res.json()

            hospitals = []

            for el in data.get("elements", []):
                tags = el.get("tags", {})

                if el["type"] == "node":
                    h_lat = el.get("lat")
                    h_lon = el.get("lon")
                else:
                    center = el.get("center", {})
                    h_lat = center.get("lat")
                    h_lon = center.get("lon")

                if not h_lat or not h_lon:
                    continue

                name = tags.get("name", "Hospital")
                if any(word in name.lower() for word in EXCLUDE_WORDS):
                    continue

                hospitals.append({
                    "name": name,
                    "distance": round(haversine(lat, lon, h_lat, h_lon), 2),
                    "lat": h_lat,
                    "lon": h_lon,
                    "address": tags.get("name", "Address not available"),
                    "phone": tags.get("phone"),
                    "type": "Hospital"
                })

            if hospitals:
                hospitals.sort(key=lambda x: x["distance"])
                CACHE[key] = {"time": time.time(), "data": hospitals[:10]}
                print("[HospitalLocator] Overpass success")
                return hospitals[:10], None

        except Exception as e:
            print(f"[HospitalLocator] Overpass failed on {url}:", e)

    return [], "all_sources_failed"


# -----------------------
# HAVERSINE
# -----------------------
def haversine(lat1, lon1, lat2, lon2):
    from math import radians, sin, cos, sqrt, atan2

    R = 6371
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)

    a = (sin(d_lat / 2) ** 2 +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(d_lon / 2) ** 2)

    return R * 2 * atan2(sqrt(a), sqrt(1 - a))