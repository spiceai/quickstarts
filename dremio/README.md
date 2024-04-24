
## Spice.ai Quickstart Tutorial using Dremio

This quickstart will use a demo instance of Dremio with a sample dataset.  No need to set up a Dremio instance, but the same steps can be used to connect to any Dremio instance available. 

**Step 1.** Set the login credentials that the Spice runtime will use when accessing Dremio.

```bash
spice login dremio -u demo -p demo1234
```

**Step 2.** Initialize a Spice project and start the runtime:

```bash
spice init dremio-demo
```

```bash
cd dremio-demo
spice run
```

**Step 3.** Configure the dataset to connect to Dremio:

```bash
spice dataset configure
```

Enter the name of the dataset:

```bash
dataset name: (dremio-demo)  taxi_trips
```

Enter the description of the dataset:

```
description: taxi trips data in Dremio
```

Specify the location of the dataset:

```bash
from: dremio:datasets.taxi_trips
```

Specify the Dremio endpoint:

```bash
endpoint: grpc://20.163.171.8:32010
```

Select "y" when prompted whether to locally accelerate the dataset:

```bash
Locally accelerate (y/n)? y
```

The CLI will confirm the dataset has been configured with the following output:

```bash
Dataset settings written to `datasets/dremio-demo/dataset.yaml`!
```

And the content of dataset.yaml is the following:

```yaml
from: dremio:datasets.taxi_trips
name: taxi_trips
description: dremio taxi trips
params:
  endpoint: grpc://20.163.171.8:32010
acceleration:
  enabled: true
  refresh_check_interval: 10s
  refresh_mode: full
```

The Spice runtime terminal will show that the dataset has been loaded:

```
2024-03-27T05:36:38.106740Z  INFO runtime: Loaded dataset: taxi_trips
2024-03-27T05:36:38.107138Z  INFO runtime::dataconnector: Refreshing data for taxi_trips
```

**Step 4.** Run queries against the dataset using the Spice SQL REPL.

In a new terminal, start the Spice SQL REPL

```bash
spice sql
```

You can now now query `taxi_trips` in the runtime.

```sql
sql> select avg(total_amount), avg(tip_amount), count(1), passenger_count from taxi_trips group by passenger_count order by passenger_count asc;
+------------------------------+----------------------------+-----------------+-----------------+
| AVG(taxi_trips.total_amount) | AVG(taxi_trips.tip_amount) | COUNT(Int64(1)) | passenger_count |
+------------------------------+----------------------------+-----------------+-----------------+
| 23.2                         | 3.8666666666666667         | 3               | 0               |
| 15.394881909237048           | 1.9225555830345078         | 80870           | 1               |
| 17.714222499449633           | 1.9679687385337923         | 13627           | 2               |
| 17.441359661495056           | 1.7930070521861776         | 3545            | 3               |
| 17.219515789473682           | 1.345394736842105          | 1900            | 4               |
| 21.122631578947367           | 1.36                       | 38              | 5               |
| 22.401176470588236           | 2.764705882352941          | 17              | 6               |
+------------------------------+----------------------------+-----------------+-----------------+

Query took: 0.03832875 seconds
```

**Next Steps**
This quickstart accelerates query performance using [Spice Data Accelerators](https://docs.spiceai.org/data-accelerators).  Experiment with different acceleration options by editing the dataset.yaml file or removing acceleration altogether to have the Spice runtime query the Dremio instance directly.