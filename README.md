# 🚛 Driver Route Planner with ELD Logs

A full-stack web application that allows drivers to plan trips, visualize routes, and generate compliant Electronic Logging Device (ELD) logs.

---

## 🌐 Live Features

- 📍 Real-time route generation using OpenRouteService API
- 🗺️ Interactive map with:
  - Pickup & Dropoff locations
  - Fuel stops ⛽
  - Rest break stops ☕
- 📊 Trip Summary (distance, hours, fuel stops)
- 📝 Professional ELD Log Sheet (DOT-compliant style)
- 📅 Multi-day trip support with date selection
- 📋 Route instructions auto-generated

---

## ⚙️ Tech Stack

### Backend
- Django (REST API)
- Python
- OpenRouteService API (Routing)
- OpenStreetMap (Geocoding)

### Frontend
- React.js
- Leaflet.js (Map visualization)
- CSS (Custom UI styling)

---

## 📥 Inputs

- Current Location
- Pickup Location
- Dropoff Location
- Cycle Hours Used

---

## 📤 Outputs

- Optimized driving route
- Distance & estimated driving hours
- Fuel stops (every 1000 miles rule)
- Rest breaks (after 8 driving hours)
- Daily ELD log sheets
- Route instructions

---

## 🚚 Assumptions

- Property-carrying driver (70 hours / 8 days)
- Maximum 11 driving hours per day
- 30-minute break after 8 hours of driving
- Fueling required every 1000 miles
- 1 hour pickup + 1 hour dropoff

---

## 🛠️ Setup (Local)

### Backend

```bash
cd Backend
pip install -r requirements.txt
python manage.py runserver