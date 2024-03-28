### Follow these steps to get started using Spice to federate SQL queries across data sources.

**Step 1.** Clone the quickstarts repo locally and navigate to the `federation` directory.

```bash
git clone https://github.com/spiceai/quickstarts
cd quickstarts/federation
```

**Step 2.** Log into the demo Dremio instance:

```bash
spice login dremio -u demo -p demo1234
```

**Step 3.** Start the Spice runtime.

```bash
spice run
```

**Step 4.** In another terminal window, add the `spiceai/fed-demo` Spicepod from Spicerack.

```bash
spice add spiceai/fed-demo
```

**Step 6.** Start the Spice SQL REPL and perform the following SQL queries:

```bash
spice sql
```

```sql
--- Query from the federated S3 source
select * from s3_source;
-- Query from the accelerated S3 source
select * from s3_source_accelerated;
-- Query from the federated PostgreSQL source
select * from pg_source;
-- Query from the federated Dremio source
select * from dremio_source;
-- Query from the accelerated Dremio source
select * from dremio_source_accelerated;

-- Perform an aggregation query that combines data from the S3, PostgreSQL and Dremio sources
WITH all_sales AS (
  SELECT sales FROM pg_source 
  UNION ALL 
  SELECT sales FROM s3_source_accelerated
  UNION ALL
  select fare_amount+tip_amount as sales from dremio_source_accelerated
)

SELECT SUM(sales) as total_sales, 
       COUNT(*) AS total_transactions,
       MAX(sales) AS max_sale,
       AVG(sales) AS avg_sale
FROM all_sales
```