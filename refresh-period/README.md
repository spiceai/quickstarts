# Temporal Refresh Period Quickstart


**Step 1.** Initialize and start Spice

```bash
spice init refresh-period-quickstart
cd refresh-period-quickstart
```

**Step 2.** Add a new dataset

```bash
version: v1beta1
kind: Spicepod
name: refresh-period-quickstart
datasets:
  - from: s3://spiceai-demo-datasets/taxi_trips/2024/
    name: taxi_trips
    time_column: tpep_pickup_datetime
    acceleration:
      enabled: true
```

**Step 3.** Run spice and check number of rows in `taxi_trips`

```bash
2024-04-26T04:52:27.387126Z  INFO runtime: Loaded dataset: taxi_trips
2024-04-26T04:52:27.387255Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
2024-04-26T04:52:27.387706Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
2024-04-26T04:52:27.388588Z  INFO runtime::accelerated_table: [refresh] Refreshing data for taxi_trips
2024-04-26T04:52:27.392075Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:3000
```

Run `spice sql` to check number of rows

```sql
spice sql

Welcome to the interactive Spice.ai SQL Query Utility! Type 'help' for help.

show tables; -- list available tables
sql> select count(1) from taxi_trips;
+-----------------+
| COUNT(Int64(1)) |
+-----------------+
| 2964624         |
+-----------------+

Query took: 0.012826375 seconds. 1/1 rows displayed.
```

**Step 4.** Editing spicepod.yaml to add refresh_period

```bash
version: v1beta1
kind: Spicepod
name: refresh-period-quickstart
datasets:
  - from: s3://spiceai-demo-datasets/taxi_trips/2024/
    name: taxi_trips
    time_column: tpep_pickup_datetime
    acceleration:
      enabled: true
      refresh_period: 35040h # 4 years, this will evict 5 rows of data from the dataset
```

See printed logs:

```bash
2024-04-26T04:52:52.817130Z  INFO runtime: Hot reloading accelerated dataset: taxi_trips...
2024-04-26T04:52:54.313989Z  INFO runtime::accelerated_table: [refresh] Refreshing data for taxi_trips
2024-04-26T04:53:13.355254Z  INFO runtime: Accelerated table for dataset taxi_trips is ready
2024-04-26T04:53:13.355293Z  INFO runtime: Loaded dataset: taxi_trips

```

Check number of rows again

```sql
sql> select count(1) from taxi_trips;
+-----------------+
| COUNT(Int64(1)) |
+-----------------+
| 2964619         |
+-----------------+

Query took: 0.010782792 seconds. 1/1 rows displayed.

sql> select * from taxi_trips order by tpep_pickup_datetime limit 1;
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| VendorID | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | RatecodeID | store_and_fwd_flag | PULocationID | DOLocationID | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | Airport_fee |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| 2        | 2023-12-31T23:39:17  | 2023-12-31T23:42:00   | 2               | 0.47          | 1          | N                  | 90           | 68           | 1            | 5.1         | 1.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 10.1         | 2.5                  | 0.0         |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+

Query took: 0.052626208 seconds. 1/1 rows displayed.
```

