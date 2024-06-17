# Indexes on Accelerated Data

Indexes can be created on accelerated datasets (for supported engines) to improve query performance. This quickstart will demonstrate how to create an index and compare the performance on the same accelerated dataset without an index.

**Step 1.** Initialize Spice

```bash
spice init acceleration-indexes
```

**Step 2.** Download the large test dataset locally

Indexes only make a difference on large datasets. This dataset is 1.5GB bytes, decompressed into 7+GB in-memory.

```bash
wget https://public-data.spiceai.org/large_eth_traces.parquet
```

**Step 3.** Add the spicepod with indexes configured

Add the following to your `spicepod.yaml`. Be sure to replace `path/to/large_eth_traces.parquet` with the absolute path to the downloaded dataset.
```yaml
datasets:
- from: file://path/to/large_eth_traces.parquet
  name: traces
  acceleration:
    enabled: true
    engine: sqlite
    mode: file
    indexes:
      trace_id: enabled
- from: file://path/to/large_eth_traces.parquet
  name: traces_no_index
  acceleration:
    enabled: true
    engine: sqlite
    mode: file
```

**Step 4.** Start Spice

Spice will start and load the dataset into sqlite. **This may take several minutes.**

```bash
cd acceleration-indexes
spice run
```

**Step 5.** Run a query on the dataset without an index

Once the datasets have loaded, run the following query in the SQL REPL via `spice sql` to get a single row:

```sql
SELECT * FROM traces_no_index WHERE trace_id = 'call_0x22ba49176f15ec5524434d87c47fc9dbff6ef8f584889ab4f0fa830d76a678d4_7_3_2_0_0_0_0_0'
```

> Time: 4.823088584 seconds. 1 rows.

**Step 6.** Run a query on the dataset with an index

Repeat the query, but this time against the dataset with the index configured:

```sql
SELECT * FROM traces WHERE trace_id = 'call_0x22ba49176f15ec5524434d87c47fc9dbff6ef8f584889ab4f0fa830d76a678d4_7_3_2_0_0_0_0_0'
```

> Time: 0.003471583 seconds. 1 rows.

Much faster! Try exploring with indexes in different acceleration engines to get a sense of how they behave.