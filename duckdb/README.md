# DuckDB Data Connector

This quickstart will use a demo instance of DuckDB with a sample TCPH dataset. Follow the quickstart to create DuckDB instance and get started with DuckDB as a Data Connector.

**Preparation**

- Install [DuckDB CLI](https://duckdb.org/docs/installation/?version=stable&environment=cli&platform=macos&download_method=package_manager).
- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).

**Step 1.** Initialize a Spice app.

```bash
spice init duckdb-demo
cd duckdb-demo
```

**Step 2.** Create a persistent file-based DuckDB database in Spice app.

```bash
duckdb ./tpch.db
```

Run the following queries in DuckDB CLI to generate TPC-H data with DuckDB's [TCPH extension](https://duckdb.org/docs/extensions/tpch.html).

```SQL
INSTALL tpch;
LOAD tpch;
CALL dbgen(sf = 1);
```

Run the following query to check the tables generated.

```SQL
SHOW TABLES;
```

Quit DuckDB CLI after the data generation.

**Step 3.** Configure the dataset to connect to DuckDB. Copy and paste the configuration below to `spicepod.yaml` in the Spice app.

```yaml
version: v1beta1
kind: Spicepod
name: duckdb_quickstart
datasets:
  - from: duckdb:customer
    name: tpch_customer
    params:
      open: ./tpch.db
```

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

**Step 4.** Start the Spice runtime.

```bash
spice run
```

The Spice runtime terminal will show that the dataset has been loaded:

```
Spice.ai runtime starting...
2024-04-29T18:23:18.055782Z  INFO spiced: Metrics listening on 127.0.0.1:9000
2024-04-29T18:23:18.059972Z  INFO runtime: Loaded dataset: tpch_customer
2024-04-29T18:23:18.060005Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
2024-04-29T18:23:18.062230Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:3000
2024-04-29T18:23:18.062249Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
```

**Step 5.** Run queries against the dataset using the Spice SQL REPL.

In a new terminal, start the Spice SQL REPL

```bash
spice sql
```

You can now now query `customer` in the runtime.

```sql
select c_name, c_address, c_acctbal, c_mktsegment from tpch_customer limit 10;
+--------------------+---------------------------------------+-----------+--------------+
| c_name             | c_address                             | c_acctbal | c_mktsegment |
+--------------------+---------------------------------------+-----------+--------------+
| Customer#000000001 | j5JsirBM9PsCy0O1m                     | 711.56    | BUILDING     |
| Customer#000000002 | 487LW1dovn6Q4dMVymKwwLE9OKf3QG        | 121.65    | AUTOMOBILE   |
| Customer#000000003 | fkRGN8nY4pkE                          | 7498.12   | AUTOMOBILE   |
| Customer#000000004 | 4u58h fqkyE                           | 2866.83   | MACHINERY    |
| Customer#000000005 | hwBtxkoBF qSW4KrIk5U 2B1AU7H          | 794.47    | HOUSEHOLD    |
| Customer#000000006 |  g1s,pzDenUEBW3O,2 pxu0f9n2g64rJrt5E  | 7638.57   | AUTOMOBILE   |
| Customer#000000007 | 8OkMVLQ1dK6Mbu6WG9 w4pLGQ n7MQ        | 9561.95   | AUTOMOBILE   |
| Customer#000000008 | j,pZ,Qp,qtFEo0r0c 92qobZtlhSuOqbE4JGV | 6819.74   | BUILDING     |
| Customer#000000009 | vgIql8H6zoyuLMFNdAMLyE7 H9            | 8324.07   | FURNITURE    |
| Customer#000000010 | Vf mQ6Ug9Ucf5OKGYq fsaX AtfsO7,rwY    | 2753.54   | HOUSEHOLD    |
+--------------------+---------------------------------------+-----------+--------------+

Time: 0.003510375 seconds. 10 rows.
```

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).
