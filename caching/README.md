# In-Memory Results Caching

> Spice.ai OSS supports in-memory caching of query results.
> Results caching can help improve performance for bursts of requests and for non-accelerated results such as refresh data returned [on zero results](https://docs.spiceai.org/data-accelerators/data-refresh#behavior-on-zero-results).
>
> [Spice.ai OSS Docs: Results Caching](https://docs.spiceai.org/features/caching)

The quickstart will use [TPC-H Benchmark Sample Data](https://github.com/spiceai/quickstarts/tree/trunk/tpc-h), but instead of using local acceleration, we will leverage in-memory caching to boost query performance.

**Step 1.** Initialize and start Spice

```bash
spice init cache-quickstart
```

```bash
cd cache-quickstart
spice run
```

**Step 2.** Add the TPC-H Benchmark pod

```bash
spice add spiceai/tpch
```

The following output is shown in the Spice runtime terminal:

```bash
2024-05-23T21:50:44.372314Z  INFO spiced: Metrics listening on 127.0.0.1:9000
2024-05-23T21:50:44.372986Z  INFO runtime: Initialized results cache; max size: 128.00 MiB, item ttl: 1s
2024-05-23T21:50:45.861161Z  INFO runtime: Registered dataset customer
2024-05-23T21:50:47.283554Z  INFO runtime: Registered dataset lineitem
2024-05-23T21:51:02.082094Z  INFO runtime: Registered dataset nation
2024-05-23T21:51:03.318695Z  INFO runtime: Registered dataset orders
2024-05-23T21:51:04.800068Z  INFO runtime: Registered dataset part
2024-05-23T21:51:06.165243Z  INFO runtime: Registered dataset partsupp
2024-05-23T21:51:08.075131Z  INFO runtime: Registered dataset region
2024-05-23T21:51:09.332552Z  INFO runtime: Registered dataset supplier
```

Notice the following line confirming the default cache configuration with cached items expiration time of 1 second is loaded.

```bash
2024-05-23T21:50:44.372986Z  INFO runtime: Initialized query results cache; max size: 128.00 MiB, item expire duration: 1s
```

**Step 3.** Increase the cached items' expiration time

Stop Spice and use a text editor to open the `spicepod.yaml` file. Add a custom in-memory caching configuration below to increase the cached items' duration to `5 minutes`. Read [Spice.ai OSS Docs: Results Caching](https://docs.spiceai.org/features/caching) to learn more on configuration parameters.

Before:
```
version: v1beta1
kind: Spicepod
name: cache-quickstart
dependencies:
- spiceai/tpch
```
After:
```
version: v1beta1
kind: Spicepod
name: cache-quickstart

runtime:
  results_cache:
    enabled: true
    cache_max_size: 128MiB
    eviction_policy: lru 
    item_ttl: 5m

dependencies:
- spiceai/tpch
```

Run Spice
```bash
spice run
```

The following output is shown in the Spice runtime terminal, confirming the updated in-memory caching settings (`300s`):

```bash
2024-05-23T22:02:36.899534Z  INFO spiced: Metrics listening on 127.0.0.1:9000
2024-05-23T22:02:36.900280Z  INFO runtime: Initialized results cache; max size: 128.00 MiB, item ttl: 300s
2024-05-23T22:02:38.683392Z  INFO runtime: Registered dataset customer
2024-05-23T22:02:40.054125Z  INFO runtime: Registered dataset lineitem
2024-05-23T22:02:41.194782Z  INFO runtime: Registered dataset nation
2024-05-23T22:02:42.459436Z  INFO runtime: Registered dataset orders
2024-05-23T22:02:43.806835Z  INFO runtime: Registered dataset part
2024-05-23T22:02:45.081951Z  INFO runtime: Registered dataset partsupp
2024-05-23T22:02:46.261342Z  INFO runtime: Registered dataset region
2024-05-23T22:02:47.533180Z  INFO runtime: Registered dataset supplier
```

**Step 3.** Run queries against the dataset using the Spice SQL REPL.

In a new terminal, start the Spice SQL REPL.

```bash
spice sql
```

Run *Pricing Summary Report Query (Q1)*. More information about TPC-H and all the queries involved can be found in the official [TPC Benchmark H Standard Specification](https://www.tpc.org/tpc_documents_current_versions/pdf/tpc-h_v2.17.1.pdf).

```sql
select
	l_returnflag,
	l_linestatus,
	sum(l_quantity) as sum_qty,
	sum(l_extendedprice) as sum_base_price,
	sum(l_extendedprice * (1 - l_discount)) as sum_disc_price,
	sum(l_extendedprice * (1 - l_discount) * (1 + l_tax)) as sum_charge,
	avg(l_quantity) as avg_qty,
	avg(l_extendedprice) as avg_price,
	avg(l_discount) as avg_disc,
	count(*) as count_order
from
	lineitem
where
	l_shipdate <= date '1998-12-01' - interval '110' day
group by
	l_returnflag,
	l_linestatus
order by
	l_returnflag,
	l_linestatus
;
```
Output:
```sql
+--------------+--------------+-------------+-----------------+-------------------+---------------------+-----------+--------------+----------+-------------+
| l_returnflag | l_linestatus | sum_qty     | sum_base_price  | sum_disc_price    | sum_charge          | avg_qty   | avg_price    | avg_disc | count_order |
+--------------+--------------+-------------+-----------------+-------------------+---------------------+-----------+--------------+----------+-------------+
| A            | F            | 37734107.00 | 56586554400.73  | 53758257134.8700  | 55909065222.827692  | 25.522005 | 38273.129734 | 0.049985 | 1478493     |
| N            | F            | 991417.00   | 1487504710.38   | 1413082168.0541   | 1469649223.194375   | 25.516471 | 38284.467760 | 0.050093 | 38854       |
| N            | O            | 73416597.00 | 110112303006.41 | 104608220776.3836 | 108796375788.183317 | 25.502437 | 38249.282778 | 0.049996 | 2878807     |
| R            | F            | 37719753.00 | 56568041380.90  | 53741292684.6040  | 55889619119.831932  | 25.505793 | 38250.854626 | 0.050009 | 1478870     |
+--------------+--------------+-------------+-----------------+-------------------+---------------------+-----------+--------------+----------+-------------+

Time: 4.178523666 seconds. 4 rows.
```

Execute the same query again and observe a significant reduction in query execution time, from **4.178523666** to **0.004944792** seconds, due to the result being retrieved from the in-memory cache. The cached item will expire 5 minutes after the initial query execution. 

```
+--------------+--------------+-------------+-----------------+-------------------+---------------------+-----------+--------------+----------+-------------+
| l_returnflag | l_linestatus | sum_qty     | sum_base_price  | sum_disc_price    | sum_charge          | avg_qty   | avg_price    | avg_disc | count_order |
+--------------+--------------+-------------+-----------------+-------------------+---------------------+-----------+--------------+----------+-------------+
| A            | F            | 37734107.00 | 56586554400.73  | 53758257134.8700  | 55909065222.827692  | 25.522005 | 38273.129734 | 0.049985 | 1478493     |
| N            | F            | 991417.00   | 1487504710.38   | 1413082168.0541   | 1469649223.194375   | 25.516471 | 38284.467760 | 0.050093 | 38854       |
| N            | O            | 73416597.00 | 110112303006.41 | 104608220776.3836 | 108796375788.183317 | 25.502437 | 38249.282778 | 0.049996 | 2878807     |
| R            | F            | 37719753.00 | 56568041380.90  | 53741292684.6040  | 55889619119.831932  | 25.505793 | 38250.854626 | 0.050009 | 1478870     |
+--------------+--------------+-------------+-----------------+-------------------+---------------------+-----------+--------------+----------+-------------+

Time: 0.004944792 seconds. 4 rows.

```
