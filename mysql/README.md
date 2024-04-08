# MySQL Data Connector

Follow these steps to get started with MySQL as a Data Connector.

**Step 1.** Edit the `spicepod.yaml` file in this directory and replace the params in the `mysql_quickstart` dataset with the connection parameters for your MySQL instance, where is `[local_table_name]` is your desired name for the federated table and `[remote_table_path]` is the name of the table in your MySQL instance.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

To securely store your MySQL password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 2.** Run the Spice runtime with `spice run` from this directory.

**Step 3.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 4.** Execute the query `select * from [local_table_name];` to see the MySQL table accelerated locally.
