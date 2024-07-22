# GraphQL Data Connector

Follow these steps to get started with GraphQL as a Data Connector.

**Step 1.** Edit the `spicepod.yaml` file in this directory and replace the `graphql_quickstart` dataset params with the connection parameters for your GraphQL instance, where `[local_table_name]` is your desired name for the federated table, `[graphql_endpoint]` is the url to your GraphQL endpoint, `[graphql_query]` is the query to execute, and `[json_pointer]` is the pointer to the data in the GraphQL response.

For authentication options see [GraphQL Data Connector docs](https://docs.spiceai.org/data-connectors/graphql#configuration)

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

To securely store GraphQL auth params, see [Secret Stores](https://docs.spiceai.org/components/secret-stores)

**Step 2.** Run the Spice runtime with `spice run` from this directory.

**Step 3.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).

**Step 4.** Execute the query `select * from [local_table_name];` to see GraphQL response accelerated locally.
