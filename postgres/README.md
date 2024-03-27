### Follow these steps to get started with PostgreSQL as a Data Accelerator.

**Step 1.** Edit the `spicepod.yaml` file in this directory and replace the params in the `eth_recent_blocks` dataset with the connection parameters for your PostgreSQL instance.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options and [PostgreSQL Data Accelerator](https://docs.spiceai.org/data-accelerators/postgres) for more options on configuring PostgreSQL as a Data Accelerator.

To securely store your PostgreSQL password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 2.** Run the Spice runtime with `spice run` from this directory.

**Step 3.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 4.** Execute the query `select * from eth_recent_blocks;` to see the `eth_recent_blocks` dataset accelerated in your PostgreSQL instance.