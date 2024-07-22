# Spice.ai Cloud Platform Catalog Connector

The Spice.ai Cloud Platform Catalog Connector makes querying datasets in the Spice.ai Cloud Platform simple including to the [200+ built-in community datasets](https://docs.spice.ai/building-blocks/datasets).

## Prerequisites

- A Spice.ai Cloud Platform account (sign up at https://spice.ai)
- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).

## Step 1. Create a Spice.ai Cloud Platform account

Sign up for a Spice.ai Cloud Platform account at https://spice.ai.

## Step 2. Create a new directory and initialize a Spicepod

```bash
mkdir spice-catalog-demo
cd spice-catalog-demo
spice init
```

## Step 3. Login to the Spice.ai Cloud Platform with `spice login`

Using the Spice CLI, login to the Spice.ai Cloud Platform. A window will open in your browser to authenticate. Ensure you are in the `spice-catalog-demo` directory.

```bash
spice login
```

The API Key and token required to communicate with the Spice.ai Cloud Platform will be stored in a `.env` file in the directory where `spice login` was run, which will be `spice-catalog-demo` in this case. The Spice runtime automatically reads the `.env` file in the current working directory to load environment variables.

## Step 4. Add the Spice.ai Cloud Platform Catalog Connector to `spicepod.yaml`

Add the following configuration to your `spicepod.yaml`:

```yaml
catalogs:
  - name: spiceai
    from: spiceai
```

## Step 5. Start the Spice runtime

```bash
spice run
```

## Step 6. Query a dataset

```bash
spice sql
```

```sql
SELECT * FROM spiceai.tpch.lineitem LIMIT 10;
```

## Step 7. Explore the available datasets

Use `show tables` in the Spice SQL REPL to see the available datasets.

```bash
sql> show tables
+---------------+--------------+----------------------------------------------------------------+------------+
| table_catalog | table_schema | table_name                                                     | table_type |
+---------------+--------------+----------------------------------------------------------------+------------+
| spiceai       | tpch         | region                                                         | BASE TABLE |
| spiceai       | tpch         | orders                                                         | BASE TABLE |
| spiceai       | tpch         | part                                                           | BASE TABLE |
| spiceai       | tpch         | supplier                                                       | BASE TABLE |
| spiceai       | tpch         | customer                                                       | BASE TABLE |
| spiceai       | tpch         | partsupp                                                       | BASE TABLE |
| spiceai       | tpch         | lineitem                                                       | BASE TABLE |
| spiceai       | tpch         | nation                                                         | BASE TABLE |
| spiceai       | ens          | domains                                                        | BASE TABLE |
| spiceai       | spiceai      | datasets_tpch_partsupp                                         | BASE TABLE |
| spiceai       | spiceai      | datasets_tpch_nation                                           | BASE TABLE |
| spiceai       | spiceai      | datasets_eth_aave_v2_collateral_updates                        | BASE TABLE |
| spiceai       | spiceai      | datasets_eth_sushiswap_pool_stats_detailed                     | BASE TABLE |
| spiceai       | spiceai      | datasets_tpch_orders                                           | BASE TABLE |
... (truncated)
| spiceai       | goerli       | wallet_lst_balances                                            | BASE TABLE |
| spice         | runtime      | query_history                                                  | BASE TABLE |
+---------------+--------------+----------------------------------------------------------------+------------+

Time: 0.007676958 seconds. 249 rows.
```

## Step 8. Filter the included tables with `include`

Specify an `include` filter to limit the tables registered in the catalog.

```yaml
catalogs:
  - name: spiceai
    from: spiceai
    include:
      - tpch.*
```

```bash
sql> show tables
+---------------+--------------+---------------+------------+
| table_catalog | table_schema | table_name    | table_type |
+---------------+--------------+---------------+------------+
| spiceai       | tpch         | region        | BASE TABLE |
| spiceai       | tpch         | part          | BASE TABLE |
| spiceai       | tpch         | customer      | BASE TABLE |
| spiceai       | tpch         | lineitem      | BASE TABLE |
| spiceai       | tpch         | partsupp      | BASE TABLE |
| spiceai       | tpch         | supplier      | BASE TABLE |
| spiceai       | tpch         | nation        | BASE TABLE |
| spiceai       | tpch         | orders        | BASE TABLE |
| spice         | runtime      | query_history | BASE TABLE |
+---------------+--------------+---------------+------------+

Time: 0.001866958 seconds. 9 rows.
```