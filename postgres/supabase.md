### Follow these steps to get started with Supabase as a Data Accelerator.

**Step 1.** Create a Supabase account and project [https://supabase.com/](https://supabase.com/). Supabase will set up a new database as part of the account/project creation. Refer to the [Supabase Documentation](https://supabase.com/docs/guides/database/overview) for creating new databases in an existing project.

**Step 2.** Open the newly created Supabase project and select `Project Settings` from the sidebar navigation.

**Step 3.** Navigate to `Database` under `Configuration`.

**Step 4.** Find the `Connection parameters` section.
![Connection parameters](https://imagedelivery.net/HyTs22ttunfIlvyd6vumhQ/02a30c41-072c-49cc-cba3-e29f35ca6800/public)

**Step 5.** Edit the `spicepod.yaml` file in this directory and replace the params in the `eth_recent_blocks` dataset with the connection parameters from the Supabase project. Run the Spice.ai runtime with `spice run` from this directory.

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options and [PostgreSQL Data Accelerator](https://docs.spiceai.org/data-accelerators/postgres) for more options on configuring PostgreSQL as a Data Accelerator.

To securely store your Supabase password, see [Secret Stores](https://docs.spiceai.org/secret-stores)

**Step 6.** Navigate to the `Table Editor` in the Supabase project to verify the creation of the `eth_recent_blocks` table. The Supabase `SQL Editor` can then be used to run queries against the table, with data updated in realtime.