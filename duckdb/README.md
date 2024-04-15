# DuckDB Data Connector

Follow these steps to get started with DuckDB (v0.10.1) as a Data Connector.

**Step 1.** Edit the `spicepod.yaml` file in this directory. Replace the `open` params in the `duckdb_quickstart` dataset with the path to your DuckDB persistent File. Edit `[local_table_name]` to your desired name for the table and `[database].[schema].[table]` to the name of the table in your DuckDB instance.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

**Step 2.** Run the Spice runtime with `spice run` from this directory.

**Step 3.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 4.** Execute the query `select * from [local_table_name];` to see the DuckDB table accelerated locally.
