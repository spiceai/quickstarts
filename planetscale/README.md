### Follow these steps to get started with Planetscale as a Data Connector.

**Step 1.** From a Planetscale project dashboard select `Connect`.

**Step 2.** Select `New password` and select desirable brunch to connect to. Confirm via `Create password`.

**Step 3.** Select `General` in the `Connect with` dropdown.

**Step 4.** Edit the `spicepod.yaml` file in this directory and replace `[remote_table_path]` with the path to the Planetscale table to be accelerated, `[local_table_name]` with your desired name for the locally accelerated table, and the params section with the connection parameters from the `General` section of `Connecting to your database` modal.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options and [MySQL Data Connector](https://docs.spiceai.org/data-connectors/mysql) for more options on configuring a MySQL Data Connector.

To securely store your Planetscale password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 5.** Run the Spice runtime with `spice run` from this directory.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice runtime.

**Step 6.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 7.** Execute the query `select * from [local_table_name];` to see the Planetscale table accelerated locally.
