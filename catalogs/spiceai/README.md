# Spice.ai Cloud Platform Catalog Connector

The Spice.ai Cloud Platform Catalog Connector enables you to start querying the 200+ built-in datasets available in the Spice.ai Cloud Platform.

## Prerequisites

- A Spice.ai Cloud Platform account (sign up at https://spice.ai)
- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).

## Step 1. Create a Spice.ai Cloud Platform account

Sign up for a Spice.ai Cloud Platform account at https://spice.ai.

## Step 2. Login to the Spice.ai Cloud Platform with `spice login`

Using the Spice CLI, login to the Spice.ai Cloud Platform. A window will open in your browser to authenticate.

```bash
spice login
```

## Step 3. Create a new directory and initialize a Spicepod

```bash
mkdir spice-catalog-demo
cd spice-catalog-demo
spice init
```

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

```sql
show tables;
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
