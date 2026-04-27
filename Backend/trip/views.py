from rest_framework.views import APIView
from rest_framework.response import Response
from .utils import generate_trip_plan
import requests


def get_coordinates(location):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location,
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "trip-planner-app"
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    if data:
        return {
            "lat": float(data[0]["lat"]),
            "lng": float(data[0]["lon"])
        }

    return None


class TripPlannerAPIView(APIView):
    def post(self, request):
        current_location = request.data.get("current_location")
        pickup_location = request.data.get("pickup_location")
        dropoff_location = request.data.get("dropoff_location")
        cycle_used = float(request.data.get("cycle_used", 0))

        pickup_coords = get_coordinates(pickup_location)
        dropoff_coords = get_coordinates(dropoff_location)

        if not pickup_coords or not dropoff_coords:
            return Response({"error": "Invalid locations"}, status=400)

        ors_key = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImVmYWU5MWZjYzgxNTQ3ZGZiNjcwNmQ2NTQ5YWEwMGI1IiwiaCI6Im11cm11cjY0In0="

        url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"

        headers = {
            "Authorization": ors_key,
            "Content-Type": "application/json"
        }

        body = {
            "coordinates": [
                [pickup_coords["lng"], pickup_coords["lat"]],
                [dropoff_coords["lng"], dropoff_coords["lat"]]
            ]
        }

        route_response = requests.post(url, json=body, headers=headers)

        if route_response.status_code != 200:
            print("ORS ERROR:", route_response.text)
            return Response({"error": "Route API failed"}, status=400)

        data = route_response.json()
        route = data["features"][0]

        distance_miles = route["properties"]["summary"]["distance"] * 0.000621371

        route_coordinates = [
            {"lat": c[1], "lng": c[0]}
            for c in route["geometry"]["coordinates"]
        ]

        trip_plan = generate_trip_plan(distance_miles, cycle_used)

        fuel_stops = []
        rest_stops = []

        if trip_plan["fuel_stops"] > 0 and route_coordinates:
            mid_index = len(route_coordinates) // 2
            fuel_stops.append({
                "lat": route_coordinates[mid_index]["lat"],
                "lng": route_coordinates[mid_index]["lng"],
                "label": "Fuel Stop"
            })

        if any(stop["type"] == "rest_break" for stop in trip_plan["trip_stops"]) and route_coordinates:
            rest_index = len(route_coordinates) // 3
            rest_stops.append({
                "lat": route_coordinates[rest_index]["lat"],
                "lng": route_coordinates[rest_index]["lng"],
                "label": "Required 30-minute Rest Break"
            })

        return Response({
            "inputs": {
                "current_location": current_location,
                "pickup_location": pickup_location,
                "dropoff_location": dropoff_location,
                "cycle_used": cycle_used
            },
            "route_summary": trip_plan,
            "map_points": {
                "pickup": pickup_coords,
                "dropoff": dropoff_coords,
                "fuel_stops": fuel_stops,
                "rest_stops": rest_stops,
                "route_path": route_coordinates
            }
        })