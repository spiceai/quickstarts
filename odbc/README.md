# ODBC Data Connector

Follow these steps to get started with ODBC as a Data Connector.

This quickstart will use a demo instance of Postgres. Follow the quickstart to create a Postgres instance and get started with Postgres as an ODBC Data Connector.

## Preparation

- Install [Postgres](https://www.postgresql.org/download/). Uppon downloading, you should be able to successfully run the following commands:

```bash
createdb --help
psql --help
```

- Start postgres server (note: this is an insecure postgres, only use for testing).

```bash
docker run --name postgres -e POSTGRES_HOST_AUTH_METHOD=trust  -d -p 5432:5432 postgres
```

- Configure postgres settings

```bash
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
```

- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).

- Install the [Postgres ODBC driver](https://odbc.postgresql.org/) for your operating system.

## Steps

**Step 1.** Create a Postgres database for testing.

Create an empty database `spice_demo` in local Postgres.

```bash
createdb spice_demo
```

Verify the creation of `spice_demo` by opening it with the psql CLI.

```bash
psql spice_demo
```

**Step 2.** Download test data.

This quickstart uses the `taxi_trips` data, loaded into Postgres in CSV format. Download the file using `curl`:

```
curl -o taxi_trips.csv https://spiceai-demo-datasets.s3.amazonaws.com/taxi_trips_csv/2024/yellow_tripdata_2024-01.csv
```

**Step 3.** Insert data into Postgres.

Open the database with the psql CLI.

```bash
psql spice_demo
```

In the CLI, run this SQL to prepare a table for the data.

```sql
CREATE TABLE taxi_trips (
VendorID varchar(50),
tpep_pickup_datetime timestamp without time zone,
tpep_dropoff_datetime timestamp without time zone,
passenger_count float,
trip_distance float,
RatecodeID float,
store_and_fwd_flag char(1),
PULocationID varchar(50),
DOLocationID varchar(50),
payment_type varchar(5),
fare_amount float,
extra float,
mta_tax float,
tip_amount float,
tolls_amount float,
improvement_surcharge float,
total_amount float,
congestion_surcharge float,
Airport_fee float);
```

With the table created, run this SQL to copy the downloaded data:

```sql
\copy taxi_trips from 'taxi_trips.csv' with delimiter ',' csv header;
```

If successfully copied, the psql CLI should output `COPY 2964624` identifying the number of rows copied.

**Step 4.** Configure ODBC connection.

On Unix systems, ODBC creates a configuration file in `/etc/odbcinst.ini` identifying the available ODBC installations.

If your Postgres ODBC driver is installed correctly, the following config should appear in the file:

```
[PostgreSQL Unicode]
Description=PostgreSQL ODBC driver (Unicode version)
Driver=psqlodbcw.so
Setup=libodbcpsqlS.so
Debug=0
CommLog=1
UsageCount=1
```

If this config does not appear in the file, confirm your Postgres ODBC driver is installed and create the config manually if required.

**Step 5.** Initialize a Spice app.

```bash
spice init odbc-demo
cd odbc-demo
```

In the new `spicepod.yml`, configure your ODBC connection like the following spicepod definition:

```yaml
version: v1beta1
kind: Spicepod
name: odbc-demo
datasets:
- from: odbc:taxi_trips
  name: taxi_trips
  mode: read
  params:
    odbc_connection_string: Driver={PostgreSQL Unicode};Server=localhost;Port=5432;Database=spice_demo;Uid=postgres
```

**Step 6.** Start the Spice Runtime

```bash
spice run
```

**Step 7.** Query the `taxi_trips` data

Run the Spice REPL.

```bash
spice sql
```

Execute a query to retrieve the `taxi_trips` data.

```sql
select * from taxi_trips limit 10;
```

```bash
sql> select * from taxi_trips limit 10;
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| vendorid | tpep_pickup_datetime | tpep_dropoff_datetime | passenger_count | trip_distance | ratecodeid | store_and_fwd_flag | pulocationid | dolocationid | payment_type | fare_amount | extra | mta_tax | tip_amount | tolls_amount | improvement_surcharge | total_amount | congestion_surcharge | airport_fee |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
| 2        | 2024-01-01T00:57:55  | 2024-01-01T01:17:43   | 1.0             | 1.72          | 1.0        | N                  | 186          | 79           | 2            | 17.7        | 1.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 22.7         | 2.5                  | 0.0         |
| 1        | 2024-01-01T00:03:00  | 2024-01-01T00:09:36   | 1.0             | 1.8           | 1.0        | N                  | 140          | 236          | 1            | 10.0        | 3.5   | 0.5     | 3.75       | 0.0          | 1.0                   | 18.75        | 2.5                  | 0.0         |
| 1        | 2024-01-01T00:17:06  | 2024-01-01T00:35:01   | 1.0             | 4.7           | 1.0        | N                  | 236          | 79           | 1            | 23.3        | 3.5   | 0.5     | 3.0        | 0.0          | 1.0                   | 31.3         | 2.5                  | 0.0         |
| 1        | 2024-01-01T00:36:38  | 2024-01-01T00:44:56   | 1.0             | 1.4           | 1.0        | N                  | 79           | 211          | 1            | 10.0        | 3.5   | 0.5     | 2.0        | 0.0          | 1.0                   | 17.0         | 2.5                  | 0.0         |
| 1        | 2024-01-01T00:46:51  | 2024-01-01T00:52:57   | 1.0             | 0.8           | 1.0        | N                  | 211          | 148          | 1            | 7.9         | 3.5   | 0.5     | 3.2        | 0.0          | 1.0                   | 16.1         | 2.5                  | 0.0         |
| 1        | 2024-01-01T00:54:08  | 2024-01-01T01:26:31   | 1.0             | 4.7           | 1.0        | N                  | 148          | 141          | 1            | 29.6        | 3.5   | 0.5     | 6.9        | 0.0          | 1.0                   | 41.5         | 2.5                  | 0.0         |
| 2        | 2024-01-01T00:49:44  | 2024-01-01T01:15:47   | 2.0             | 10.82         | 1.0        | N                  | 138          | 181          | 1            | 45.7        | 6.0   | 0.5     | 10.0       | 0.0          | 1.0                   | 64.95        | 0.0                  | 1.75        |
| 1        | 2024-01-01T00:30:40  | 2024-01-01T00:58:40   | 0.0             | 3.0           | 1.0        | N                  | 246          | 231          | 2            | 25.4        | 3.5   | 0.5     | 0.0        | 0.0          | 1.0                   | 30.4         | 2.5                  | 0.0         |
| 2        | 2024-01-01T00:26:01  | 2024-01-01T00:54:12   | 1.0             | 5.44          | 1.0        | N                  | 161          | 261          | 2            | 31.0        | 1.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 36.0         | 2.5                  | 0.0         |
| 2        | 2024-01-01T00:28:08  | 2024-01-01T00:29:16   | 1.0             | 0.04          | 1.0        | N                  | 113          | 113          | 2            | 3.0         | 1.0   | 0.5     | 0.0        | 0.0          | 1.0                   | 8.0          | 2.5                  | 0.0         |
+----------+----------------------+-----------------------+-----------------+---------------+------------+--------------------+--------------+--------------+--------------+-------------+-------+---------+------------+--------------+-----------------------+--------------+----------------------+-------------+
```