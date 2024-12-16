# PostgreSQL Data Accelerator

Follow these steps to get started with PostgreSQL as a Data Accelerator.

This quickstart will use a demo instance of Postgres. Follow the quickstart to create Postgres instance and get started with Postgres as a Data Accelerator. With Postgres as a Data Accelerator, data sourced by Data Connectors can be **locally materialized and accelerated** into an attached Postgres instance. Unlike other Data Accelerators which are local to Spice, this enables other applications to query the accelerated data via a native integration with Postgres, which Spice keeps up-to-date automatically.

## Preparation

- Install [PostgresSQL](https://www.postgresql.org/download/). Once downloaded and installed, run the following commands:

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
- An account created with the [Spice.ai Cloud Platform](https://spice.ai).

## Quickstart

**Step 1.** Create a Postgres database for testing.

Create an empty database `spice_demo` in local Postgres.

```bash
createdb spice_demo
```

Verify the creation of `spice_demo` by openning it with psql CLI.

```bash
psql spice_demo
```

**Step 2.** Initialize a Spice app.

```bash
spice init postgres-demo
cd postgres-demo
```

**Step 3.** [Login](https://docs.spiceai.org/cli/reference/login) to use the [Spice.ai Data Connector](https://docs.spiceai.org/data-connectors/spiceai).

```bash
spice login
```

This will create a `.env` file with the Spice.ai API key in the `postgres-demo` directory.

Also, ensure the `PG_PASS` environment variable is set to the password for your Postgres instance. Environment variables can be specified on the command line when running the Spice runtime, or in the same `.env` file created in Step 3.

```bash
echo "PG_PASS=<password>" >> .env
```

**Step 4.** Start the Spice runtime.

```bash
spice run
```

The Spice runtime terminal will show that Spice Runtime is running.

```console
Spice.ai runtime starting...
2024-05-07T01:01:40.566270Z  INFO spiced: Metrics listening on 127.0.0.1:9090
2024-05-07T01:01:40.566873Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
2024-05-07T01:01:40.566960Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
2024-05-07T01:01:40.568738Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:8090
```

**Step 5.** Configure the dataset to use Postgres as data accelerator. Copy and paste the configuration below to `spicepod.yaml` in the Spice app.

```yaml
version: v1beta1
kind: Spicepod
name: postgres-demo
datasets:
  - from: spice.ai/spiceai/quickstart/datasets/taxi_trips
    name: taxi_trips
    acceleration:
      enabled: true
      refresh_mode: full
      refresh_check_interval: 10s
      engine: postgres
      params:
        pg_host: localhost
        pg_user: postgres
        pg_port: 5432
        pg_db: spice_demo
        pg_sslmode: disable
        pg_pass: ${env:PG_PASS}
```

Save the changes to `spicepod.yaml`. The Spice runtime terminal will show that the dataset has been loaded:

```console
2024-12-16T15:27:03.491509Z  INFO runtime::init::dataset: Dataset taxi_trips registered (spice.ai/spiceai/quickstart/datasets/taxi_trips), acceleration (postgres, 10s refresh), results cache enabled.
2024-12-16T15:27:03.492936Z  INFO runtime::accelerated_table::refresh_task: Loading data for dataset taxi_trips
2024-12-16T15:27:52.779071Z  INFO runtime::accelerated_table::refresh_task: Loaded 2,964,624 rows (8.41 GiB) for dataset taxi_trips in 49s 286ms.
```

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

**Step 6.** Run queries against the dataset using the Spice SQL REPL.

In a new terminal, start the Spice SQL REPL

```bash
spice sql
```

You can now now query `taxi_trips` in the runtime.

```sql
SELECT tpep_pickup_datetime, passenger_count, trip_distance FROM taxi_trips ORDER BY tpep_pickup_datetime LIMIT 10;
```
```shell
+----------------------+-----------------+---------------+
| tpep_pickup_datetime | passenger_count | trip_distance |
+----------------------+-----------------+---------------+
| 2002-12-31T22:59:39  | 1               | 0.63          |
| 2002-12-31T22:59:39  | 1               | 0.63          |
| 2009-01-01T00:24:09  | 2               | 10.88         |
| 2009-01-01T23:30:39  | 1               | 10.99         |
| 2009-01-01T23:58:40  | 1               | 0.46          |
| 2023-12-31T23:39:17  | 2               | 0.47          |
| 2023-12-31T23:41:02  | 1               | 0.4           |
| 2023-12-31T23:47:28  | 2               | 1.44          |
| 2023-12-31T23:49:12  | 1               | 3.14          |
| 2023-12-31T23:54:27  | 1               | 7.7           |
+----------------------+-----------------+---------------+

Time: 0.852775583 seconds. 10 rows.
```

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

`taxi_trips` is locally materialized in PostgreSQL, using `psql` to query the same table `taxi_trips` in PostgreSQL.

```sql
psql spice_demo
```

```sql
SELECT tpep_pickup_datetime, passenger_count, trip_distance FROM taxi_trips ORDER BY tpep_pickup_datetime LIMIT 10;
```
```shell
 tpep_pickup_datetime | passenger_count | trip_distance 
----------------------+-----------------+---------------
 2002-12-31 22:59:39  |               1 |          0.63
 2002-12-31 22:59:39  |               1 |          0.63
 2009-01-01 00:24:09  |               2 |         10.88
 2009-01-01 23:30:39  |               1 |         10.99
 2009-01-01 23:58:40  |               1 |          0.46
 2023-12-31 23:39:17  |               2 |          0.47
 2023-12-31 23:41:02  |               1 |           0.4
 2023-12-31 23:47:28  |               2 |          1.44
 2023-12-31 23:49:12  |               1 |          3.14
 2023-12-31 23:54:27  |               1 |           7.7
(10 rows)
```
