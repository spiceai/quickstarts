# DuckDB Data Connector

Follow these steps to get started with DuckDB (v0.10.1) as a Data Connector.

**Preparation** Install [DuckDB CLI](https://duckdb.org/docs/installation/?version=stable&environment=cli&platform=macos&download_method=package_manager). Create a persistent file-based DuckDB database by Providing a path to database file when starting DuckDB. DuckDB will create the database if there's no database file existing at the specified file path.

```bash
duckdb /data/myawesomedb.db
```

Run the following queries in DuckDB to generate TPC-H data with DuckDB's [TCPH extension](https://duckdb.org/docs/extensions/tpch.html)

```SQL
INSTALL tpch;
LOAD tpch;
CALL dbgen(sf = 1);
```

Run the following query to check the tables generated.

```SQL
SHOW TABLES;
```

**Step 1.** Edit the `spicepod.yaml` file in this directory. Replace the `open` params in the `duckdb_quickstart` dataset with the path to your DuckDB persistent File. Edit `[local_table_name]` to your desired name for the table and `[database].[schema].[table]` to the name of the table in your DuckDB instance.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

**Step 2.** Run the Spice runtime with `spice run` from this directory.

**Step 3.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 4.** Execute the query `select * from [local_table_name];` to query the DuckDB table through Spice.

If using the DuckDB created following the **Preparation** instruction, check TPC-H table data from Spice SQL with following sample queries.

```SQL
SELECT * FROM customer LIMIT 10;
SELECT * FROM lineitem LIMIT 10;
```
