# Temporal Refresh Data Window Quickstart

`refresh_data_window` is a duration param that filters dataset refresh source queries to recent data (duration into past from now). Requires `time_column` and `time_format`(optional) to also be configured. Only supported for `full` refresh mode datasets.

Check below for `refresh_data_window` in action.

**Step 1.** Initialize and start Spice

```bash
spice init refresh-data-window-quickstart
cd refresh-data-window-quickstart
```

**Step 2.** Add a new dataset

```bash
version: v1beta1
kind: Spicepod
name: refresh-data-window-quickstart
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

Run `spice sql` to check the number of rows and the 5 earliest records sorted by `tpep_pickup_datetime`

```sql
spice sql

Welcome to the Spice.ai SQL REPL! Type 'help' for help.

show tables; -- list available tables
sql> select count(1) from taxi_trips;
+-----------------+
| COUNT(Int64(1)) |
+-----------------+
| 2964624         |
+-----------------+

Time: 0.012826375 seconds. 1 rows.

sql> select * from taxi_trips order by tpep_pickup_datetime limit 5;
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| VendorID | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | RatecodeID | store_and_fwd_flag | PULocationID | DOLocationID | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | Airport_fee |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| 2        | 2002-12-31T22:59:39  | 2002-12-31T23:05:41   | 1               | 0.63          | 1          | N                  | 170          | 170          | 3            | -6.5        | 0.0   | -0.5    | 0.0        | 0.0          | -1.0                  | -10.5        | -2.5                 | 0.0         |
| 2        | 2002-12-31T22:59:39  | 2002-12-31T23:05:41   | 1               | 0.63          | 1          | N                  | 170          | 170          | 3            | 6.5         | 0.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 10.5         | 2.5                  | 0.0         |
| 2        | 2009-01-01T00:24:09  | 2009-01-01T01:13:00   | 2               | 10.88         | 1          | N                  | 138          | 264          | 2            | 50.6        | 9.25  | 0.5     | 0.0        | 6.94         | 1.0                   | 68.29        | 0.0                  | 0.0         |
| 2        | 2009-01-01T23:30:39  | 2009-01-02T00:01:39   | 1               | 10.99         | 1          | N                  | 237          | 264          | 2            | 45.0        | 3.5   | 0.5     | 0.0        | 0.0          | 1.0                   | 50.0         | 0.0                  | 0.0         |
| 2        | 2009-01-01T23:58:40  | 2009-01-02T00:01:40   | 1               | 0.46          | 1          | N                  | 137          | 264          | 2            | 4.4         | 3.5   | 0.5     | 0.0        | 0.0          | 1.0                   | 9.4          | 0.0                  | 0.0         |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+

Time: 0.036439333 seconds. 5 rows.
```

**Step 4.** Edit spicepod.yaml to add `refresh_data_window`

```bash
version: v1beta1
kind: Spicepod
name: refresh-data-window-quickstart
datasets:
  - from: s3://spiceai-demo-datasets/taxi_trips/2024/
    name: taxi_trips
    time_column: tpep_pickup_datetime
    acceleration:
      enabled: true
      refresh_data_window: 35040h # 4 years, this will evict 5 rows of data from the dataset
```

Check if dataset has been reloaded

```bash
2024-04-26T04:52:52.817130Z  INFO runtime: Hot reloading accelerated dataset: taxi_trips...
2024-04-26T04:52:54.313989Z  INFO runtime::accelerated_table: [refresh] Refreshing data for taxi_trips
2024-04-26T04:53:13.355254Z  INFO runtime: Accelerated table for dataset taxi_trips is ready
2024-04-26T04:53:13.355293Z  INFO runtime: Loaded dataset: taxi_trips

```

Check the number of rows again, and it shows 5 rows difference. The previous 5 earliest records are excluded after reloading.

```sql
sql> select count(1) from taxi_trips;
+-----------------+
| COUNT(Int64(1)) |
+-----------------+
| 2964619         |
+-----------------+

Time: 0.010782792 seconds. 1 rows.

sql> select * from taxi_trips order by tpep_pickup_datetime limit 1;
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| VendorID | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | RatecodeID | store_and_fwd_flag | PULocationID | DOLocationID | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | Airport_fee |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| 2        | 2023-12-31T23:39:17  | 2023-12-31T23:42:00   | 2               | 0.47          | 1          | N                  | 90           | 68           | 1            | 5.1         | 1.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 10.1         | 2.5                  | 0.0         |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+

Time: 0.052626208 seconds. 1 rows.
```

