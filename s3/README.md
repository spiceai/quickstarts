# Spice.ai Quickstart Tutorials using S3

## For public S3 bucket

**Step 1.** If you haven't already initialized a new project, you need to do so. Then, start the Spice Runtime.

```bash
spice init s3-demo-project
```

```bash
cd s3-demo-project
spice run
```

**Step 2.** We now configure the dataset from S3:

```bash
spice dataset configure
```

Enter the name of the dataset:

```bash
dataset name: (s3-demo-project)  taxi_trips
```

Enter the description of the dataset:

```
description: taxi trips in s3
```

Specify the location of the dataset:

```bash
from: s3://spiceai-demo-datasets/taxi_trips/2024/
```

**LIMITATION:** Spice.ai currently does not support discovering nested directories in S3. Please ensure that the parquet files are in the root of the specified S3 path.


Select "y" when prompted whether to locally accelerate the dataset:

```bash
Locally accelerate (y/n)? y
```

We should now see the following output:

```
Dataset settings written to `datasets/taxi_trips/dataset.yaml`!
```

You also should see the following in the Spice runtime terminal :

```
2024-03-26T22:18:02.062394Z  INFO runtime: Loaded dataset: taxi_trips
2024-03-26T22:18:02.062462Z  INFO runtime::dataconnector: Refreshing data for taxi_trips
```

**Step 3.** Run queries against the dataset using the Spice SQL REPL.

In a new terminal, start the Spice SQL REPL

```bash
spice sql
```

Check the taxi_trips table exists:

```sql
sql> show tables;

+---------------+--------------------+-------------+------------+
| table_catalog | table_schema       | table_name  | table_type |
+---------------+--------------------+-------------+------------+
| datafusion    | public             | taxi_trips  | BASE TABLE |
| datafusion    | information_schema | tables      | VIEW       |
| datafusion    | information_schema | views       | VIEW       |
| datafusion    | information_schema | columns     | VIEW       |
| datafusion    | information_schema | df_settings | VIEW       |
+---------------+--------------------+-------------+------------+
```

You can now now query `taxi_trips` in the runtime.

```sql
sql> select avg(total_amount), avg(tip_amount), count(1), passenger_count from taxi_trips group by passenger_count order by passenger_count asc;

+------------------------------+----------------------------+-----------------+-----------------+
| AVG(taxi_trips.total_amount) | AVG(taxi_trips.tip_amount) | COUNT(Int64(1)) | passenger_count |
+------------------------------+----------------------------+-----------------+-----------------+
| 25.32781693945655            | 3.072259971396792          | 31465           | 0               |
| 26.205230445475053           | 3.3712622884680097         | 2188739         | 1               |
| 29.520659930930112           | 3.7171302113290707         | 405103          | 2               |
| 29.13830904429029            | 3.5370455392167552         | 91262           | 3               |
| 30.877266710278338           | 3.466037634201714          | 51974           | 4               |
| 26.269129111204002           | 3.379707813525932          | 33506           | 5               |
| 25.80118328635979            | 3.3440987786874237         | 22353           | 6               |
| 57.735                       | 8.370000000000001          | 8               | 7               |
| 95.66803921568626            | 11.972156862745098         | 51              | 8               |
| 18.45                        | 3.05                       | 1               | 9               |
| 25.811736633324347           | 1.545956750046378          | 140162          |                 |
+------------------------------+----------------------------+-----------------+-----------------+

Query took: 0.015628708 seconds
```

## For private S3 bucket

**LIMITATION:** Spice.ai currently only supports authentication with AWS S3 using `aws_access_key_id` and `aws_secret_access_key`. Please [submit an issue](https://github.com/spiceai/spiceai/issues/new?template=feature_request.md) if you would like to see support for other authentication methods.

**Step 1.** Prepare S3 bucket
  - Create a new AWS S3 bucket `yourcompany-bucketname-datasets`.
  - Create a path `tax_trips` in the above bucket.
  - Download [taxi_trips dataset](https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2024-01.parquet) parquet, and upload it into `taxi_trips` path in the bucket.

**Step 2.** Prepare AWS IAM user
  - Create a new IAM user with the following inline policy:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
  			         	"s3:ListBucket"
  			         ],
                "resource": "arn:aws:s3:::yourcompany-bucketname-datasets"
            },
            {
                "Effect": "Allow",
                "Action": [
  			         	"s3:GetObject"
  			         ],
                "resource": "arn:aws:s3:::yourcompany-bucketname-datasets/*"
            }
        ]
    }
    ```
  - Create access key contains `aws_access_key_id` and `aws_secret_access_key` for the IAM user under `Security credentials` tab.

**Step 3.** Log into S3 using the Spice CLI.
```
spice login s3 -k <aws_access_key_id> -s <aws_secret_access_key>
```

You should see the following output:

```
Successfully logged in to s3
```

**Step 4.** If you haven't already initialized a new project, you need to do so. Then, start the Spice Runtime.

```bash
spice init s3-demo-project
```

```bash
cd s3-demo-project
spice run
```

**Step 5.** We now configure the dataset from S3:

```bash
spice dataset configure
```

Enter the name of the dataset:

```bash
dataset name: (s3-demo-project)  taxi_trips
```

Enter the description of the dataset:

```
description: taxi trips in s3
```

Specify the location of the dataset:

```bash
from: s3://yourcompany-bucketname-datasets/taxi_trips/
```

Select "y" when prompted whether to locally accelerate the dataset:

```bash
Locally accelerate (y/n)? y
```

We should now see the following output:

```
Dataset settings written to `datasets/taxi_trips/dataset.yaml`!
```

If the login credentials were entered correctly, your dataset will have loaded into the runtime. You should see the following in the Spice runtime terminal :

```
2024-03-26T22:18:02.062394Z  INFO runtime: Loaded dataset: taxi_trips
2024-03-26T22:18:02.062462Z  INFO runtime::dataconnector: Refreshing data for taxi_trips
```

**Step 6.** Run queries against the dataset using the Spice SQL REPL. (see Step 3 above)
