# GitHub Data Connector

This quickstart will use [spiceai/spiceai](https://github.com/spiceai/spiceai) repo for a demo.

## Pre-requisites

- Spice is installed (see the [Getting Started](https://docs.spiceai.org/getting-started) documentation).
- GitHub personal access token, [Learn more](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) how to create one.

**Step 1.** Copy the `.env.example` file into a new `.env` file in this directory, and set the `GITHUB_TOKEN` environment variable to your personal access token.

```env
GITHUB_TOKEN=<your_github_token>
```

**Setp 2.** Run the Spice runtime with `spice run` from the directory with the `spicepod.yaml` file.

```console
cd <path/to/quickstarts/github>

spice run
Checking for latest Spice runtime release...
Spice.ai runtime starting...
2024-09-02T16:54:18.608286Z  INFO runtime::flight: Spice Runtime Flight listening on 127.0.0.1:50051
2024-09-02T16:54:18.608420Z  INFO runtime::metrics_server: Spice Runtime Metrics listening on 127.0.0.1:9090
2024-09-02T16:54:18.608727Z  INFO runtime::http: Spice Runtime HTTP listening on 127.0.0.1:8090
2024-09-02T16:54:18.610603Z  INFO runtime::opentelemetry: Spice Runtime OpenTelemetry listening on 127.0.0.1:50052
2024-09-02T16:54:18.803357Z  INFO runtime: Initialized results cache; max size: 128.00 MiB, item ttl: 1s
2024-09-02T16:54:19.213824Z  INFO runtime: Dataset spiceai.files registered (github:github.com/spiceai/spiceai/files/v0.17.2-beta), acceleration (arrow), results cache enabled.
2024-09-02T16:54:19.214975Z  INFO runtime::accelerated_table::refresh_task: Loading data for dataset spiceai.files
2024-09-02T16:54:19.472261Z  INFO runtime: Dataset spiceai.commits registered (github:github.com/spiceai/spiceai/commits), acceleration (arrow), results cache enabled.
2024-09-02T16:54:19.473454Z  INFO runtime::accelerated_table::refresh_task: Loading data for dataset spiceai.commits
2024-09-02T16:54:20.356043Z  INFO runtime: Dataset spiceai.issues registered (github:github.com/spiceai/spiceai/issues), acceleration (arrow), results cache enabled.
2024-09-02T16:54:20.357300Z  INFO runtime::accelerated_table::refresh_task: Loading data for dataset spiceai.issues
2024-09-02T16:54:21.388544Z  INFO runtime: Dataset spiceai.pulls registered (github:github.com/spiceai/spiceai/pulls), acceleration (arrow), results cache enabled.
2024-09-02T16:54:21.389815Z  INFO runtime::accelerated_table::refresh_task: Loading data for dataset spiceai.pulls
```

```console
...
2024-09-02T16:54:22.576036Z  INFO runtime::accelerated_table::refresh_task: Loaded 66 rows (369.35 kiB) for dataset spiceai.files in 3s 361ms.
2024-09-02T16:54:35.370411Z  INFO runtime::accelerated_table::refresh_task: Loaded 749 rows (4.47 MiB) for dataset spiceai.issues in 15s 13ms.
2024-09-02T16:54:36.901489Z  INFO runtime::accelerated_table::refresh_task: Loaded 1,558 rows (3.87 MiB) for dataset spiceai.commits in 17s 428ms.
2024-09-02T16:56:01.276622Z  INFO runtime::accelerated_table::refresh_task: Loaded 1,706 rows (8.57 MiB) for dataset spiceai.pulls in 1m 39s 886ms.
```

Wait until all datasets are loaded

**Step 3.** Run `spice sql` in a new terminal to start an interactive SQL query session against the Spice runtime.

Get top 10 recent issues:

```console
sql> select number, title, state, labels, updated_at from spiceai.issues order by updated_at desc limit 10
+--------+------------------------------------------------------------------------+--------+--------------------+----------------------+
| number | title                                                                  | state  | labels             | updated_at           |
+--------+------------------------------------------------------------------------+--------+--------------------+----------------------+
| 2455   | v0.17.3-beta endgame                                                   | OPEN   | [endgame]          | 2024-09-02T15:49:21Z |
| 2147   | Enhancement: Native schema inference for Data Connectors               | OPEN   | [kind/enhancement] | 2024-09-02T12:40:31Z |
| 2460   | Clickhouse Native Schema Inference                                     | CLOSED | [kind/task]        | 2024-09-02T12:40:30Z |
| 2464   | ODBC Native Scheme Inference                                           | CLOSED | [kind/task]        | 2024-09-02T12:39:51Z |
| 2465   | Snowflake Native Schema Inference                                      | OPEN   | [kind/task]        | 2024-09-02T07:21:02Z |
| 2463   | Sqlite Native Schema Inference                                         | OPEN   | [kind/task]        | 2024-09-02T07:20:28Z |
| 2462   | PostgreSQL Native Schema Inference                                     | OPEN   | [kind/task]        | 2024-09-02T07:20:11Z |
| 2461   | DuckDB Native Schema Inference                                         | OPEN   | [kind/task]        | 2024-09-02T07:19:59Z |
| 1852   | Warn if `endpoint` param for `s3` data connector ends in `/`           | CLOSED | [kind/bug]         | 2024-09-02T07:12:29Z |
| 2349   | Accelerator queries with date ranges in where clause return no columns | CLOSED | [kind/bug]         | 2024-09-02T06:50:56Z |
+--------+------------------------------------------------------------------------+--------+--------------------+----------------------+

Time: 0.017607167 seconds. 10 rows.
```

Get top 10 merged pull requests:

```console
sql> select number, title, state, merged_at from spiceai.pulls where state = 'MERGED' order by merged_at desc limit 10
+--------+--------------------------------------------------------------------------------+--------+----------------------+
| number | title                                                                          | state  | merged_at            |
+--------+--------------------------------------------------------------------------------+--------+----------------------+
| 2475   | Remove non existing updated_at from github.pulls dataset                       | MERGED | 2024-09-02T16:40:15Z |
| 2474   | Fix LLMs health check; Add `updatedAt` field to GitHub connector               | MERGED | 2024-09-02T15:34:50Z |
| 2468   | List GitHub connector in readme                                                | MERGED | 2024-09-02T12:55:25Z |
| 2466   | Native clickhouse schema inference                                             | MERGED | 2024-09-02T12:40:29Z |
| 2467   | Add `assignees` and `labels` fields to github issues and github pulls datasets | MERGED | 2024-09-02T11:45:52Z |
| 2459   | Add `accelerated_refresh` to `task_history` table                              | MERGED | 2024-09-02T08:07:49Z |
| 2458   | Trim trailing `/` for S3 data connector                                        | MERGED | 2024-09-02T07:12:28Z |
| 2456   | Bump `datafusion` version to the latest                                        | MERGED | 2024-09-02T06:50:55Z |
| 2452   | GitHub connector: convert `labels` and `hashes` to primitive arrays            | MERGED | 2024-09-02T06:12:25Z |
| 2457   | task: Disable and update federation                                            | MERGED | 2024-09-02T05:33:34Z |
+--------+--------------------------------------------------------------------------------+--------+----------------------+

Time: 0.010307125 seconds. 10 rows.
```

Get top 10 commits:

```console
sql> select message_head_line, author_name, sha from spiceai.commits order by committed_date desc limit 10
+--------------------------------------------------------------------------+------------------+------------------------------------------+
| message_head_line                                                        | author_name      | sha                                      |
+--------------------------------------------------------------------------+------------------+------------------------------------------+
| Remove non existing updated_at from github.pulls dataset (#2475)         | Evgenii Khramkov | eeb94605ce737d779ae99e4617329164ce95c357 |
| Fix LLMs health check; Add `updatedAt` field to GitHub connector (#2474) | Evgenii Khramkov | e63fecb86657b97352d772247a12c357cde354c4 |
| List GitHub connector in readme (#2468)                                  | Evgenii Khramkov | 4fa914c95185290d6cbc20e108d575a22d33119b |
| Native clickhouse schema inference (#2466)                               | Phillip LeBlanc  | 2d8d9b573213d10bbd39c90e786b086d61166dae |
| Add `assignees` and `labels` fields to github issues and github pulls…   | Evgenii Khramkov | 582e702c53320975143b83330f3ae9cae3fc7241 |
| Add `accelerated_refresh` to `task_history` table (#2459)                | Phillip LeBlanc  | 2187f711364ddc3cd0ab635e414c682643347109 |
| Trim trailing `/` for S3 data connector (#2458)                          | Phillip LeBlanc  | 81260ed4583ec11547bac43a331cc46037f16bce |
| Bump datafusion to the latest (#2456)                                    | Sergei Grebnov   | 2e9db2b33154992c30603d46d5949ba456f9b2f6 |
| GitHub connector: convert `labels` and `hashes` to primitive arrays (…   | Sergei Grebnov   | 4f6ffb8728a2a9293ae120f384e19f61aba187b8 |
| task: Disable and update federation (#2457)                              | peasee           | 0358a11dd1c2ce4c15b949c7265cd70e2351d615 |
+--------------------------------------------------------------------------+------------------+------------------------------------------+

Time: 0.009864666 seconds. 10 rows.
```

Get non-alpha release notes files:

```console
sql> select name, path, download_url from spiceai.files where path like 'docs/release_notes/v0%'
+-----------------+------------------------------------+---------------------------------------------------------------------------------------------------+
| name            | path                               | download_url                                                                                      |
+-----------------+------------------------------------+---------------------------------------------------------------------------------------------------+
| v0.17.0-beta.md | docs/release_notes/v0.17.0-beta.md | https://raw.githubusercontent.com/spiceai/spiceai/v0.17.2-beta/docs/release_notes/v0.17.0-beta.md |
| v0.17.1-beta.md | docs/release_notes/v0.17.1-beta.md | https://raw.githubusercontent.com/spiceai/spiceai/v0.17.2-beta/docs/release_notes/v0.17.1-beta.md |
| v0.17.2-beta.md | docs/release_notes/v0.17.2-beta.md | https://raw.githubusercontent.com/spiceai/spiceai/v0.17.2-beta/docs/release_notes/v0.17.2-beta.md |
+-----------------+------------------------------------+---------------------------------------------------------------------------------------------------+
```
