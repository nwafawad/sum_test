# NYC Yellow Taxi Analytics Dashboard

A full-stack data analytics application for exploring NYC Yellow Taxi trip data (January 2019). The app runs a Python/Flask backend serving a SQLite database, and a vanilla JS frontend with interactive charts and a map.

---

## Project Structure

```
.
├── yellow_tripdata_2019-01.csv      # Raw trip data (download separately)
├── taxi_zone_lookup.csv             # Zone ID → name/borough lookup
├── taxi_zones/                      # Shapefile for NYC taxi zones
│   ├── taxi_zones.shp
│   └── ...
│
├── data_pipeline/                   # ETL pipeline
│   ├── pipeline.py                  # Main entry point – runs the full pipeline
│   ├── loader.py                    # Loads CSV + shapefile, merges zones
│   ├── cleaner.py                   # Removes invalid / outlier rows
│   ├── normalizer.py                # Normalises column types & formats
│   ├── feature_engineering.py       # Adds derived columns (speed, duration, etc.)
│   ├── exclusion_log.py             # Tracks rows dropped during cleaning
│   └── output/                      # Generated output files
│       ├── processed_trips.csv
│       ├── processed_zones.geojson
│       └── exclusion_log.csv
│
├── database/                        # Database setup
│   ├── schema.sql                   # CREATE TABLE statements & indexes
│   ├── load_data.py                 # Loads processed CSV → SQLite (taxi_data.db)
│   ├── test_database.py             # Sanity-check queries
│   └── taxi_data.db                 # Generated SQLite database (created at runtime)
│
├── backend/
│   └── API.py                       # Flask API server + serves the frontend
│
└── frontend/                        # Static frontend
    ├── index.html
    ├── css/styles.css
    └── js/
        ├── app.js                   # App bootstrap
        ├── charts.js                # Chart.js chart definitions
        ├── config.js                # API base URL & shared config
        ├── dataLoader.js            # Fetch helpers for every API endpoint
        ├── filters.js               # UI filter controls
        ├── kpi.js                   # KPI cards
        ├── map.js                   # Leaflet choropleth map
        ├── routes.js                # Client-side routing
        └── state.js                 # Shared application state
```

---

## Requirements

- Python 3.9+
- The raw trip data file `yellow_tripdata_2019-01.csv` placed in the project root (download from [NYC TLC Trip Record Data](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page))

### Install Python dependencies

```bash
pip install pandas geopandas flask
```

---

## How to Run

Follow these **three steps in order**. Each step must complete successfully before moving to the next.

---

### Step 1 — Run the Data Pipeline

This reads the raw CSV and shapefile, cleans and enriches the data, and exports processed files to `data_pipeline/output/`.

```bash
# From the project root
python -m data_pipeline.pipeline
```

**Output files created:**
- `data_pipeline/output/processed_trips.csv`
- `data_pipeline/output/processed_zones.geojson`
- `data_pipeline/output/exclusion_log.csv` (rows dropped with reasons)

---

### Step 2 — Build the Database

This loads the processed CSV files into a SQLite database.

```bash
cd database
python load_data.py
```

**Output file created:**
- `database/taxi_data.db`

To verify the database is working correctly:

```bash
python test_database.py
```

---

### Step 3 — Start the Flask API Server

```bash
cd backend
python API.py
```

The server starts on **http://localhost:5000**

Open that URL in your browser to see the dashboard.

---

## API Endpoints

All endpoints return JSON and are served under `/api/`.

| Endpoint | Description |
|---|---|
| `GET /api/summary` | Overall KPIs (total trips, avg fare, avg distance, avg speed) |
| `GET /api/trips-by-hour` | Trip count grouped by hour of day (0–23) |
| `GET /api/trips-by-day` | Trip count grouped by day of week |
| `GET /api/peak-hours` | Top 5 hours by trip volume with revenue stats |
| `GET /api/weekday-vs-weekend` | Weekday vs weekend comparison |
| `GET /api/zone-stats` | Per-zone pickup stats joined with zone names |
| `GET /api/top-pickup-zones?limit=10` | Top N pickup zones |
| `GET /api/top-dropoff-zones?limit=10` | Top N drop-off zones |
| `GET /api/borough-stats` | Aggregated stats per NYC borough |
| `GET /api/avg-fare-by-borough` | Average fare, total, cost-per-mile & tip % by borough |
| `GET /api/fare-vs-distance` | Random 2 000-row sample for scatter plot |
| `GET /api/tolls-and-fees` | Tolls, extras & congestion surcharge by hour |
| `GET /api/top-routes?limit=15` | Top N pickup → drop-off zone pairs |
| `GET /api/demand-by-hour-borough` | Trip count by hour × borough heatmap |
| `GET /api/demand-weekday-weekend-by-zone` | Weekday vs weekend demand per zone |
| `GET /api/geojson` | Zone GeoJSON enriched with trip stats (used by map) |

---

## Database Schema

### `zones` table
| Column | Description |
|---|---|
| `zone_id` | Primary key |
| `borough` | NYC borough name |
| `zone_name` | Taxi zone name |
| `service_zone` | Service zone category |

### `trips` table
Raw fields plus engineered features:

| Column | Description |
|---|---|
| `trip_duration_min` | Duration in minutes |
| `speed_mph` | Average speed in mph |
| `cost_per_mile` | Total amount ÷ distance |
| `tip_percentage` | Tip as % of fare |
| `pickup_hour` | Hour extracted from pickup datetime |
| `pickup_day_of_week` | Day name extracted from pickup datetime |
| `pu_borough` / `do_borough` | Pickup / drop-off borough names |
| `pu_zone` / `do_zone` | Pickup / drop-off zone names |

---

## Troubleshooting

**`FileNotFoundError` for `yellow_tripdata_2019-01.csv`**
Download the January 2019 Yellow Taxi dataset from the NYC TLC website and place it in the project root.

**`taxi_data.db` not found when starting the API**
Make sure Step 2 completed successfully. The database file must exist at `database/taxi_data.db`.

**`processed_zones.geojson` not found**
Make sure Step 1 completed successfully before running Step 2 or the API.
