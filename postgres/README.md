# PostgreSQL Data Accelerator

This quickstart will use a demo instance of Postgres. Follow the quickstart to create Postgres instance and get started with Postgres as a Data Accelerator.

**Preparation**

- Install [Postgres](https://www.postgresql.org/download/). Uppon downloading, you should be able to successfully run the following commands:

```bash
createdb --help
psql --help
```

- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).

- [Login](https://docs.spiceai.org/cli/reference/login) to Spice, since this quickstart is using [Spice.ai Data Connector](https://docs.spiceai.org/data-connectors/spiceai).

```bash
spice login
```

**Step 1.** Create a Postgres database for testing.

Create an empty database `spice_demo` in local Postgres.

```bash
createdb spice_demo
```

Verify the creation of `spice_demo` by openning it with psql CLI.

```bash
psql spice_demo
```

**Step 2.** Initialize a Spice app.

```bash
spice init postgres-demo
cd postgres-demo
```

**Step 3.** Start the Spice runtime.

```bash
spice run
```

The Spice runtime terminal will show that Spice Runtime is running.

```
Spice.ai runtime starting...
2024-05-07T01:01:40.566270Z  INFO spiced: Metrics listening on 127.0.0.1:9000
2024-05-07T01:01:40.566873Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
2024-05-07T01:01:40.566960Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
2024-05-07T01:01:40.568738Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:3000
```

**Step 4.** Configure the dataset to use Postgres as data accelerator. Copy and paste the configuration below to `spicepod.yaml` in the Spice app.

```yaml
version: v1beta1
kind: Spicepod
name: postgres-demo
datasets:
  - from: spice.ai/eth.recent_blocks
    name: eth_recent_blocks
    acceleration:
      enabled: true
      refresh_mode: full
      refresh_check_interval: 10s
      engine: postgres
      params:
        pg_host: localhost
        pg_port: 5432
        pg_db: spice_demo
        pg_sslmode: disable
```

Save the changes to `spicepod.yaml`. The Spice runtime terminal will show that the dataset has been loaded:

```
2024-05-07T23:56:44.094995Z  INFO runtime: Loaded dataset eth_recent_blocks
2024-05-07T23:56:44.095902Z  INFO runtime::accelerated_table: [refresh] Loading data for dataset eth_recent_blocks
```

Follow the [quickstart guide](https://docs.spiceai.org/getting-started) to get started with the Spice.ai runtime.

See the [datasets reference](https://docs.spiceai.org/reference/spicepod/datasets) for more dataset configuration options.

**Step 5.** Run queries against the dataset using the Spice SQL REPL.

In a new terminal, start the Spice SQL REPL

```bash
spice sql
```

You can now now query `eth_recent_blocks` in the runtime.

```sql
select number, "timestamp", hash, transaction_count, gas_used from eth_recent_blocks order by number desc limit 10;
+----------+------------+--------------------------------------------------------------------+-------------------+----------+
| number   | timestamp  | hash                                                               | transaction_count | gas_used |
+----------+------------+--------------------------------------------------------------------+-------------------+----------+
| 19821622 | 1715126387 | 0x12753e72914d0fdf2343eda982a0a1a55776def2826e009ebbfbb67e11bef6cd | 153               | 29996777 |
| 19821621 | 1715126375 | 0x8fd0d25335b3c012fa956c67717feeb7c8cc616711382398c8b4647b742c5c4b | 130               | 12823433 |
| 19821620 | 1715126363 | 0x257887a5f15e0f5f623afe46722a531b20c52b83681329fbcbcf4ba6049b74cc | 148               | 28440691 |
| 19821619 | 1715126351 | 0xc3045f7610ceecabfed863cb784f85a18e8b0b38ea5ba7b92a30a8581a419b0e | 157               | 11860723 |
| 19821618 | 1715126339 | 0x9a55f7892e610ac917cf1145a7f31d42dbe8fa9ea1b391c5b925f5a5f2b3ae30 | 94                | 7387668  |
| 19821617 | 1715126327 | 0xaef4a6f08d0ea3a85e6107f3855f15fa4a7e8b1c0713a8fc3b7606a77c344599 | 101               | 25220694 |
| 19821616 | 1715126315 | 0xfe583d5247d08a958a4d4f68b178c12fe45cf039d78697553e708a3e17419b3b | 167               | 13190115 |
| 19821615 | 1715126303 | 0xdc7757f24aaf2af21133841829aa31841a34cfc659dc9ac1311433435ed0a85b | 88                | 5630252  |
| 19821614 | 1715126291 | 0x900fe2fc90ef7592bca360dec1aa9b4137e8c9feb13107fb807592e9e50f684c | 73                | 7385049  |
| 19821613 | 1715126279 | 0xcb847f33e7f5a16af099dcc42c4b1dc47949eb709c5dc062d0e7e21689cfde80 | 167               | 17745429 |
+----------+------------+--------------------------------------------------------------------+-------------------+----------+
```

For more information on using `spice sql`, see the [CLI reference](https://docs.spiceai.org/cli/reference/sql).
