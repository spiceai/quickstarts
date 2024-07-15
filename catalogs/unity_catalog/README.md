# Unity Catalog Connector

The Unity Catalog Connector makes querying tables in a Unity Catalog with Spice simple.

Note: This quickstart applies to the [open-source version of Unity Catalog](https://www.unitycatalog.io/). To get started with the Databricks Unity Catalog Connector, see the [Databricks Unity Catalog Connector quickstart](../databricks/README.md).

## Prerequisites

- Access to an open-source Unity Catalog server with 1+ tables. (see the [Unity Catalog documentation](https://github.com/unitycatalog/unitycatalog)).
- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).

## Step 1. Create a new directory and initialize a Spicepod

```bash
mkdir uc-catalog-demo
cd uc-catalog-demo
spice init
```

## Step 2. Add the Unity Catalog Connector to `spicepod.yaml`

Add the following configuration to your `spicepod.yaml`:

```yaml
catalogs:
  - name: unity_catalog:https://<unity_catalog_host>/api/2.1/unity-catalog/catalogs/<catalog_name>
    from: uc
```

The Unity Catalog connector only supports Delta Lake tables and requires specifying the object store credentials to connect to the Delta Lake tables.

Visit the documentation for more information configuring the [Unity Catalog Connector](https://docs.spiceai.org/components/catalogs/unity-catalog).

## Step 3. Configure the object store credentials

Using the Spice CLI, set the credentials needed to connect to the Delta Lake tables provided by the Unity Catalog Connector.

### Using Delta Lake directly against AWS S3
`spice login delta_lake --aws-region <aws-region> --aws-access-key-id <aws-access-key-id> --aws-secret-access-key <aws-secret-access-key>`

### Using Delta Lake directly against Azure Blob Storage
`spice login delta_lake --azure-storage-account-name <account-name> --azure-storage-access-key <access-key>`

### Using Delta Lake directly against Google Cloud Storage
`spice login delta_lake --google-service-account-path /path/to/service-account.json`

## Step 5. Start the Spice runtime

```bash
spice run
```

## Step 6. Query a dataset

```bash
spice sql
```

```sql
SELECT * FROM uc.<SCHEMA_NAME>.<TABLE_NAME> LIMIT 10;
```

Example: 
```bash
sql> select trace_id, block_number from db_uc.default.traces limit 10
+-------------------------------------------------------------------------------+--------------+
| trace_id                                                                      | block_number |
+-------------------------------------------------------------------------------+--------------+
| call_0x0e981c555b68e4f7847155e348e75de70729d06a5f3f238dd4e7d4e062a62eed_      | 16876417     |
| call_0xf2e97e476aaba415ad6793e5d09e82d7ef52d7d595db956306c44dc4e08d1f72_      | 16876417     |
| call_0x79be0ec50306a78a79eed5c368a38d17ff7d3d51d0c8331e36914b95d8635ef3_5     | 16876417     |
| call_0x79be0ec50306a78a79eed5c368a38d17ff7d3d51d0c8331e36914b95d8635ef3_5_0   | 16876417     |
| call_0x7997d1a4ea8a7ece16d3a306c1e820de66744b7f340e7a51b78a35fad5d789d0_      | 16876417     |
| call_0x7997d1a4ea8a7ece16d3a306c1e820de66744b7f340e7a51b78a35fad5d789d0_0     | 16876417     |
| call_0x7997d1a4ea8a7ece16d3a306c1e820de66744b7f340e7a51b78a35fad5d789d0_0_0   | 16876417     |
| call_0x7997d1a4ea8a7ece16d3a306c1e820de66744b7f340e7a51b78a35fad5d789d0_0_0_0 | 16876417     |
| call_0x7997d1a4ea8a7ece16d3a306c1e820de66744b7f340e7a51b78a35fad5d789d0_0_1   | 16876417     |
| call_0x7997d1a4ea8a7ece16d3a306c1e820de66744b7f340e7a51b78a35fad5d789d0_0_2   | 16876417     |
+-------------------------------------------------------------------------------+--------------+

Time: 1.5179735 seconds. 10 rows.
```