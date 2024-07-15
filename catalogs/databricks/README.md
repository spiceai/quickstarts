# Databricks Unity Catalog Connector

The Databricks Unity Catalog Connector makes querying Databricks Unity Catalog tables in Spice simple.

## Prerequisites

- A Databricks account with a Unity Catalog configured with 1+ tables. (see the [Databricks documentation](https://docs.databricks.com/en/data-governance/unity-catalog/index.html) for more information).
- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).

## Step 1. Create a Databricks API token

Create a Databricks personal access token by following the [Databricks documentation](https://docs.databricks.com/en/dev-tools/auth/index.html).

## Step 2. Create a new directory and initialize a Spicepod

```bash
mkdir databricks-catalog-demo
cd databricks-catalog-demo
spice init
```

## Step 3. Add the Databricks Unity Catalog Connector to `spicepod.yaml`

Add the following configuration to your `spicepod.yaml`:

```yaml
catalogs:
  - name: databricks:<CATALOG_NAME>
    from: db_uc
    params:
      endpoint: <instance-id>.cloud.databricks.com
      mode: spark_connect # or delta_lake
      databricks_cluster_id: 0711-151224-1rh2uz8m
```

For `mode` you can choose between `spark_connect` or `delta_lake`. `spark_connect` is the default mode and requires an [All-Purpose Compute Cluster](https://docs.databricks.com/en/compute/index.html) to be available. `delta_lake` mode queries directly against Delta Lake tables in object storage, and requires Spice to have the necessary permissions to access the object storage directly.

Visit the documentation for more information configuring the [Databricks Unity Catalog Connector](https://docs.spiceai.org/components/catalogs/databricks).

## Step 4. Login to Databricks with `spice login`

Using the Spice CLI, set the credentials needed to connect to Databricks.

### Using Spark Connect
`spice login databricks --token <access-token>`

### Using Delta Lake directly against AWS S3
`spice login databricks --token <access-token> --aws-region <aws-region> --aws-access-key-id <aws-access-key-id> --aws-secret-access-key <aws-secret-access-key>`

### Using Delta Lake directly against Azure Blob Storage
`spice login databricks --token <access-token> --azure-storage-account-name <account-name> --azure-storage-access-key <access-key>`

### Using Delta Lake directly against Google Cloud Storage
`spice login databricks --token <access-token> --google-service-account-path /path/to/service-account.json`

## Step 5. Start the Spice runtime

```bash
spice run
```

## Step 6. Query a dataset

```bash
spice sql
```

```sql
SELECT * FROM db_uc.<SCHEMA_NAME>.<TABLE_NAME> LIMIT 10;
```