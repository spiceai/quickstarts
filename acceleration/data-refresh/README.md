# Advanced Data Refresh Quickstart

Data refresh for accelerated datasets can be configured and tuned for specific scenarios.

Follow this quickstart to dynamically refresh specific data at runtime by programmatically updating `refresh_sql` and triggering data refreshes.

_Tip: Open and refer to the [Refresh Data](https://docs.spiceai.org/data-accelerators/data-refresh) documentation while completing this quickstart._

## Step 1. Initialize the Spice app

First ensure the Spice CLI is installed. If not, follow the Spice [Getting Started](https://docs.spiceai.org/getting-started) guide to install.

```bash
mkdir spice-data-refresh
cd spice-data-refresh

# Add the spiceai/quickstart Spicepod
spice add spiceai/quickstart

# Start the Spice runtime
spice run
```

The Spice runtime will start and the `taxi_trips` dataset included in the `spiceai/quickstart` Spicepod will be loaded.

**In a new terminal window**, run `spice sql` to start the Spice SQL REPL.

In the REPL, enter:

```sql
select avg(passenger_count) from taxi_trips
```

Note the output is:

```bash
+---------------------------------+
| AVG(taxi_trips.passenger_count) |
+---------------------------------+
| 1.3392808966805005              |
+---------------------------------+
```

## Step 2. Filter the refresh data

In a code or text editor, open `spicepods/spiceai/quickstart/spicepod.yaml`.

In the `acceleration` section:

1. Add Refresh SQL below the `refresh_mode` setting to filter the dataset to a passenger_count of two.
2. Remove the line `refresh_check_interval: 10s` to prevent automated refreshes.

The `spicepod.yaml` should be as below:

```yaml
version: v1beta1
kind: Spicepod
name: quickstart
datasets:
  - from: s3://spiceai-demo-datasets/taxi_trips/2024/
    name: taxi_trips
    description: taxi trips in s3
    acceleration:
      enabled: true
      refresh_mode: full
      refresh_sql: select * from taxi_trips where passenger_count = 2
```

Save the file, swap to the Spice SQL REPL and enter:

```sql
select avg(passenger_count) from taxi_trips
```

Note, the output is now:

```bash
+---------------------------------+
| AVG(taxi_trips.passenger_count) |
+---------------------------------+
| 2.0                             |
+---------------------------------+
```

The dataset was refreshed with data filtered to trips with a passenger count of 2.

## Step 3. Programmatically update the refresh SQL

In addition to editing the `spicepod.yaml` directly, the Refresh SQL can be updated by API.

Run the following cURL command to update it:

```bash
curl -i -X PATCH \
     -H "Content-Type: application/json" \
     -d '{
           "refresh_sql": "SELECT * FROM taxi_trips WHERE passenger_count = 3"
         }' \
     localhost:3000/v1/datasets/taxi_trips/acceleration
```

The updated `refresh_sql` will be applied on the _next_ refresh (as determined by `refresh_check_interval`).

Make an additional call to trigger a refresh now:

```bash
curl -i -X POST localhost:3000/v1/datasets/taxi_trips/acceleration/refresh
```

Swap to the Spice SQL REPL and enter:

```sql
select avg(passenger_count) from taxi_trips
```

Note, the output is now:

```bash
+---------------------------------+
| AVG(taxi_trips.passenger_count) |
+---------------------------------+
| 3.0                             |
+---------------------------------+
```

## Summary

This quickstart demonstrated how to dynamically refresh specific data at runtime by updating the `refresh_sql` in `spicepod.yaml` and programmatically via API calls. This provides control over what data is queried and fetched from remote data sources and when it happens.
