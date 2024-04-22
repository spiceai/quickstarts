# Quickstart for retention policies on accelerated dataset

**Step 1.** Initialize and start Spice

```bash
spice init retention-quickstart
cd retention-quickstart
```

**Step 2.** Add a dataset with retention policies by editing spicepod.yaml

```bash
version: v1beta1
kind: Spicepod
name: retention-quickstart
datasets:
  - from: s3://spiceai-demo-datasets/taxi_trips/2024/
    name: taxi_trips
    time_column: tpep_pickup_datetime
    acceleration:
      retention_enabled: true
      enabled: true
      refresh_interval: 10m
      retention_check_interval: 60s
      retention_period: 35040h # 4 years, this will eliminate 5 rows of bad data in the public dataset
```

**Step 3.** Run spice and see the retention policy in action

When dataset is being refreshed, the retention policy won't evict any data as 0 rows are loaded.
```bash
2024-04-22T04:17:24.374905Z  INFO runtime: Loaded dataset: taxi_trips
2024-04-22T04:17:24.375694Z  INFO runtime::accelerated_table: [retention] Evicting data for taxi_trips where tpep_pickup_datetime < 2020-04-23T04:17:24+00:00...
2024-04-22T04:17:24.376073Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:3000
2024-04-22T04:17:24.376110Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
2024-04-22T04:17:24.376393Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
2024-04-22T04:17:24.377709Z  INFO runtime::accelerated_table: Refreshing data for taxi_trips
2024-04-22T04:17:24.382154Z  INFO runtime::accelerated_table: [retention] Evicted 0 records for taxi_trips
```

**Step 4.** Run queries against the dataset using the Spice SQL REPL after the dataset is loaded and before the next retention check interval
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
sql> select * from taxi_trips order by tpep_pickup_datetime limit 5;
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| VendorID | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | RatecodeID | store_and_fwd_flag | PULocationID | DOLocationID | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | Airport_fee |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| 2        | 2002-12-31T22:59:39  | 2002-12-31T23:05:41   | 1               | 0.63          | 1          | N                  | 170          | 170          | 3            | 6.5         | 0.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 10.5         | 2.5                  | 0.0         |
| 2        | 2002-12-31T22:59:39  | 2002-12-31T23:05:41   | 1               | 0.63          | 1          | N                  | 170          | 170          | 3            | -6.5        | 0.0   | -0.5    | 0.0        | 0.0          | -1.0                  | -10.5        | -2.5                 | 0.0         |
| 2        | 2009-01-01T00:24:09  | 2009-01-01T01:13:00   | 2               | 10.88         | 1          | N                  | 138          | 264          | 2            | 50.6        | 9.25  | 0.5     | 0.0        | 6.94         | 1.0                   | 68.29        | 0.0                  | 0.0         |
| 2        | 2009-01-01T23:30:39  | 2009-01-02T00:01:39   | 1               | 10.99         | 1          | N                  | 237          | 264          | 2            | 45.0        | 3.5   | 0.5     | 0.0        | 0.0          | 1.0                   | 50.0         | 0.0                  | 0.0         |
| 2        | 2009-01-01T23:58:40  | 2009-01-02T00:01:40   | 1               | 0.46          | 1          | N                  | 137          | 264          | 2            | 4.4         | 3.5   | 0.5     | 0.0        | 0.0          | 1.0                   | 9.4          | 0.0                  | 0.0         |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+

Query took: 0.053698917 seconds. 5/5 rows displayed.
```

**Step 5.** Wait for the next retention check interval and see the retention policy evict data

```bash
2024-04-22T04:18:24.378312Z  INFO runtime::accelerated_table: [retention] Evicting data for taxi_trips where tpep_pickup_datetime < 2020-04-23T04:18:24+00:00...
2024-04-22T04:18:24.395165Z  INFO runtime::accelerated_table: [retention] Evicted 5 records for taxi_trips
```

**Step 6.** Run queries against the dataset using the Spice SQL REPL again to check the outdated data has been evicted
```sql
sql> select count(1) from taxi_trips;
+-----------------+
| COUNT(Int64(1)) |
+-----------------+
| 2964619         |
+-----------------+

Query took: 0.008739667 seconds. 1/1 rows displayed.
sql> select * from taxi_trips order by tpep_pickup_datetime limit 5;
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| VendorID | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | RatecodeID | store_and_fwd_flag | PULocationID | DOLocationID | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | Airport_fee |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| 2        | 2023-12-31T23:39:17  | 2023-12-31T23:42:00   | 2               | 0.47          | 1          | N                  | 90           | 68           | 1            | 5.1         | 1.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 10.1         | 2.5                  | 0.0         |
| 2        | 2023-12-31T23:41:02  | 2023-12-31T23:48:03   | 1               | 0.4           | 1          | N                  | 246          | 246          | 2            | 7.2         | 1.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 12.2         | 2.5                  | 0.0         |
| 2        | 2023-12-31T23:47:28  | 2023-12-31T23:57:07   | 2               | 1.44          | 1          | N                  | 68           | 137          | 1            | 10.7        | 1.0   | 0.5     | 3.14       | 0.0          | 1.0                   | 18.84        | 2.5                  | 0.0         |
| 2        | 2023-12-31T23:49:12  | 2024-01-01T00:04:32   | 1               | 3.14          | 1          | N                  | 234          | 237          | 1            | 17.0        | 1.0   | 0.5     | 6.6        | 0.0          | 1.0                   | 28.6         | 2.5                  | 0.0         |
| 2        | 2023-12-31T23:54:27  | 2024-01-01T00:13:12   | 1               | 7.7           | 1          | N                  | 229          | 244          | 1            | 33.1        | 1.0   | 0.5     | 7.62       | 0.0          | 1.0                   | 45.72        | 2.5                  | 0.0         |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+

Query took: 0.050874208 seconds. 5/5 rows displayed.
```
