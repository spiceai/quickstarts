### Follow these steps to get started with Supabase as a Data Accelerator.

**Step 1.** From a Supabase project select `Project Settings` from the sidebar navigation.

**Step 2.** Navigate to `Database` under `Configuration`.

**Step 3.** Find the `Connection parameters` section.
![Connection parameters](https://imagedelivery.net/HyTs22ttunfIlvyd6vumhQ/02a30c41-072c-49cc-cba3-e29f35ca6800/public)

**Step 4.** Edit the `spicepod.yaml` file in this directory and replace `[remote_table_path]` with the path to the Supabase table to be accelerated, `[local_table_name]` with your desired name for the locally accelerated table, and the params section with the connection parameters from the Supabase project.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options and [PostgreSQL Data Connector](https://docs.spiceai.org/data-connectors/postgres) for more options on configuring a PostgreSQL Data Connector.

To securely store your Supabase password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 5.** Run the Spice runtime with `spice run` from this directory.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice runtime.

**Step 6.** Navigate to the `Table Editor` in the Supabase project to verify the creation of the `eth_recent_blocks` table. The Supabase `SQL Editor` can then be used to run queries against the table, with data updated in realtime.