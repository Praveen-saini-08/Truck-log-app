import math

AVERAGE_SPEED = 55
MAX_DRIVING_HOURS = 11
BREAK_AFTER_HOURS = 8
FUEL_INTERVAL = 1000
PICKUP_DROPOFF_TIME = 1


def generate_trip_plan(distance_miles, cycle_used):
    total_driving_hours = distance_miles / AVERAGE_SPEED
    remaining_hours = total_driving_hours

    logs = []
    stops = []
    instructions = []
    day = 1
    miles_done = 0

    instructions.append("Start trip from pickup location.")

    while remaining_hours > 0:
        driving_hours = min(MAX_DRIVING_HOURS, remaining_hours)
        miles_today = driving_hours * AVERAGE_SPEED

        day_stops = []

        if driving_hours >= BREAK_AFTER_HOURS:
            day_stops.append({
                "type": "rest_break",
                "duration_minutes": 30,
                "description": f"Take 30-minute rest break on Day {day}"
            })

            instructions.append(
                f"Day {day}: Drive 8 hours, then take a required 30-minute rest break."
            )

        if distance_miles >= FUEL_INTERVAL and miles_done < FUEL_INTERVAL <= miles_done + miles_today:
            day_stops.append({
                "type": "fuel_stop",
                "duration_minutes": 20,
                "description": f"Fuel stop required on Day {day}"
            })

            instructions.append(
                f"Day {day}: Fuel stop required because trip exceeds 1,000 miles."
            )

        logs.append({
            "day": day,
            "driving_hours": round(driving_hours, 2),
            "on_duty_not_driving": PICKUP_DROPOFF_TIME,
            "rest_hours": round(24 - driving_hours - PICKUP_DROPOFF_TIME, 2),
            "miles": round(miles_today, 2),
            "fuel_stop": any(stop["type"] == "fuel_stop" for stop in day_stops)
        })

        instructions.append(
            f"Day {day}: Drive approximately {round(miles_today, 1)} miles."
        )

        stops.extend(day_stops)
        miles_done += miles_today
        remaining_hours -= driving_hours
        day += 1

    instructions.append("Spend 1 hour at pickup and 1 hour at dropoff.")
    instructions.append("Complete trip at dropoff location.")

    return {
        "distance_miles": round(distance_miles, 2),
        "estimated_hours": round(total_driving_hours, 2),
        "fuel_stops": math.floor(distance_miles / FUEL_INTERVAL),
        "logs": logs,
        "trip_stops": stops,
        "instructions": instructions
    }