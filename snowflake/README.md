# Quickstart for Snowflake Data Connector

>[Snowflake](https://www.snowflake.com/) is a leading cloud-based data warehousing service that enables users to store, compute, and analyze vast amounts of data in real-time.

The guide demonstrates how to configure [Spice with Snowflake Data Connector](https://docs.spiceai.org/data-connectors/snowflake) to access a Snowflake database.

The guide requires a Snowflake account. Start [free trial](https://signup.snowflake.com/) if needed.

**Step 1.** Create [Snowflake TPC-H Sample Dataset](https://docs.snowflake.com/en/user-guide/sample-data-tpch)

1. **Sign in** to [Snowflake](https://app.snowflake.com/)
1. Select **Projects** » **Worksheets** 
1. Execute the following SQL statements with the **ACCOUNTADMIN role** active. Refer to [Using the Sample Database](https://docs.snowflake.com/en/user-guide/sample-data-using) for more details

```sql
-- Create a database from the share.
CREATE DATABASE IF NOT EXISTS SNOWFLAKE_SAMPLE_DATA FROM SHARE SFC_SAMPLES.SAMPLE_DATA;

-- Grant the PUBLIC role access to the database.
-- Optionally change the role name to restrict access to a subset of users.
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE_SAMPLE_DATA TO ROLE PUBLIC;
```

**Step 2.** Configure Spice Snowflake access

1. Get [Snowflake account identifier](https://docs.snowflake.com/en/user-guide/admin-account-identifier#finding-the-organization-and-account-name-for-an-account)

1. Run `spice login snowflake -a <account-identifier> -u <username> -p <password>`

**Step 3.** Initialize and start Spice 

```bash
spice init snowflake-app
cd snowflake-app
spice run
```

The following output is shown in the Spice runtime terminal:

```bash
Spice.ai runtime starting...
2024-05-03T06:16:38.263784Z  INFO spiced: Metrics listening on 127.0.0.1:9000
2024-05-03T06:16:38.267184Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:3000
2024-05-03T06:16:38.267212Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
2024-05-03T06:16:38.267277Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
```

**Step 4.** Configure Snowflake Dataset

Use text editor add **snowflake_sample_data.tpch_sf1** dataset to `spicepod.yaml`. The configuration below uses default warehouse and user role. Uncomment `params` section to specify desired warehouse or role to use.

```yaml
version: v1beta1
kind: Spicepod
name: snowflake-app
datasets:
- from: snowflake:SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.LINEITEM
  name: lineitem
#  params: 
#     snowflake_role: public
#     snowflake_warehouse: COMPUTE_WH
```

The following output is shown in the Spice runtime terminal:

```bash
2024-05-03T06:17:08.225248Z  INFO runtime: Loaded dataset lineitem
```

**Step 5.** Run queries against the dataset using the Spice SQL REPL.

In a new terminal, start the Spice SQL REPL.

```bash
spice sql
```

Check that TPC-H lineitem tables exist:

```sql
show tables;

sql> show tables;sho
+------------+------------+
| table_name | table_type |
+------------+------------+
| lineitem   | BASE TABLE |
+------------+------------+
```

Run *Pricing Summary Report Query (Q1)*. More information about TPC-H and all the queries involved can be found in the official [TPC Benchmark H Standard Specification](https://www.tpc.org/tpc_documents_current_versions/pdf/tpc-h_v2.17.1.pdf).

```sql
SELECT
       "L_RETURNFLAG",
       "L_LINESTATUS",
       SUM("L_QUANTITY") AS "SUM_QTY",
       SUM("L_EXTENDEDPRICE") AS "SUM_BASE_PRICE",
       SUM("L_EXTENDEDPRICE" * (1-"L_DISCOUNT")) AS "SUM_DISC_PRICE",
       SUM("L_EXTENDEDPRICE" * (1-"L_DISCOUNT") * (1+"L_TAX")) AS "SUM_CHARGE",
       AVG("L_QUANTITY") AS "AVG_QTY",
       AVG("L_EXTENDEDPRICE") AS "AVG_PRICE",
       AVG("L_DISCOUNT") AS "AVG_DISC",
       COUNT(*) AS "COUNT_ORDER"
FROM
       lineitem
WHERE
       "L_SHIPDATE" <= DATE '1998-12-01'
GROUP BY
       "L_RETURNFLAG",
       "L_LINESTATUS"
ORDER BY
       "L_RETURNFLAG",
       "L_LINESTATUS";
;
```
Output:
```
+--------------+--------------+----------+----------------+----------------+--------------+--------------------+--------------------+----------------------+-------------+
| L_RETURNFLAG | L_LINESTATUS | SUM_QTY  | SUM_BASE_PRICE | SUM_DISC_PRICE | SUM_CHARGE   | AVG_QTY            | AVG_PRICE          | AVG_DISC             | COUNT_ORDER |
+--------------+--------------+----------+----------------+----------------+--------------+--------------------+--------------------+----------------------+-------------+
| A            | F            | 37734107 | 56586577106    | 56586577106    | 56586577106  | 25.522005853257337 | 38273.12973462167  | 0.049985295838397614 | 1478493     |
| N            | F            | 991417   | 1487505208     | 1487505208     | 1487505208   | 25.516471920522985 | 38284.4677608483   | 0.0500934266742163   | 38854       |
| N            | O            | 76633518 | 114935258407   | 114935258407   | 114935258407 | 25.50201963528761  | 38248.015609058646 | 0.05000025956756044  | 3004998     |
| R            | F            | 37719753 | 56568064200    | 56568064200    | 56568064200  | 25.50579361269077  | 38250.85462609966  | 0.05000940583012707  | 1478870     |
+--------------+--------------+----------+----------------+----------------+--------------+--------------------+--------------------+----------------------+-------------+

Time: 0.5212925 seconds. 4 rows.
```

**Step6 (Optional)** Enable [Data Acceleration](https://docs.spiceai.org/data-accelerators)

Use text editor to update `spicepod.yaml`

Before:

```yaml
version: v1beta1
kind: Spicepod
name: snowflake-app
datasets:
- from: snowflake:snowflake_sample_data.tpch_sf1.lineitem
  name: lineitem
#  params: 
#     snowflake_role: public
#     snowflake_warehouse: COMPUTE_WH
```
After:
```yaml
version: v1beta1
kind: Spicepod
name: test
datasets:
- from: snowflake:snowflake_sample_data.tpch_sf1.lineitem
  name: lineitem
#  params: 
#     snowflake_role: public
#     snowflake_warehouse: COMPUTE_WH
  acceleration:
    enabled: true
    refresh_sql: |
      SELECT * FROM lineitem WHERE "L_SHIPDATE" <= DATE '1998-12-01'
```
Note: we use `refresh_sql` parameter in this example to specify exact data we require local (specific date interval).

The following output is shown in the Spice runtime terminal confirming new configuration is applied.
```bash
2024-05-03T06:24:59.474301Z  INFO runtime: Unloaded dataset lineitem
2024-05-03T06:24:59.623574Z  INFO runtime: Loaded dataset lineitem
2024-05-03T06:25:06.272827Z  INFO runtime: Updating accelerated dataset lineitem...
2024-05-03T06:25:06.441558Z  INFO runtime::accelerated_table: [refresh] Loading data for dataset lineitem
2024-05-03T06:25:14.601966Z  INFO runtime: Loaded dataset lineitem
```

Run *Pricing Summary Report Query* using the Spice SQL REPL. 

```sql
SELECT
       "L_RETURNFLAG",
       "L_LINESTATUS",
       SUM("L_QUANTITY") AS "SUM_QTY",
       SUM("L_EXTENDEDPRICE") AS "SUM_BASE_PRICE",
       SUM("L_EXTENDEDPRICE" * (1-"L_DISCOUNT")) AS "SUM_DISC_PRICE",
       SUM("L_EXTENDEDPRICE" * (1-"L_DISCOUNT") * (1+"L_TAX")) AS "SUM_CHARGE",
       AVG("L_QUANTITY") AS "AVG_QTY",
       AVG("L_EXTENDEDPRICE") AS "AVG_PRICE",
       AVG("L_DISCOUNT") AS "AVG_DISC",
       COUNT(*) AS "COUNT_ORDER"
FROM
       lineitem
WHERE
       "L_SHIPDATE" <= DATE '1998-12-01'
GROUP BY
       "L_RETURNFLAG",
       "L_LINESTATUS"
ORDER BY
       "L_RETURNFLAG",
       "L_LINESTATUS";
;
```
Output:
```
+--------------+--------------+------------+----------------+-----------------+------------------+--------------------+--------------------+-------------------+-------------+
| L_RETURNFLAG | L_LINESTATUS | SUM_QTY    | SUM_BASE_PRICE | SUM_DISC_PRICE  | SUM_CHARGE       | AVG_QTY            | AVG_PRICE          | AVG_DISC          | COUNT_ORDER |
+--------------+--------------+------------+----------------+-----------------+------------------+--------------------+--------------------+-------------------+-------------+
| A            | F            | 3773410700 | 5658655440073  | -22624317218527 | -113179099334294 | 2552.2005853257338 | 3827312.973462167  | 4.998529583839761 | 1478493     |
| N            | F            | 99141700   | 148750471038   | -595474952221   | -2994727549668   | 2551.647192052298  | 3828446.7760848305 | 5.009342667421629 | 38854       |
| N            | O            | 7663351800 | 11493521040919 | -45962664076261 | -229888761122852 | 2550.201963528761  | 3824801.560905864  | 5.000025956756044 | 3004998     |
| R            | F            | 3771975300 | 5656804138090  | -22610682824870 | -112931255676827 | 2550.5793612690773 | 3825085.462609966  | 5.000940583012706 | 1478870     |
+--------------+--------------+------------+----------------+-----------------+------------------+--------------------+--------------------+-------------------+-------------+

Time: 0.06030275 seconds. 4 rows.
```
Observe query execution time decreased from **0.5212925** to **0.06030275** seconds using local acceleration.
