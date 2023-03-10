import boto3
import os
from dotenv import load_dotenv
import datetime


load_dotenv()

ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
CLUSTER_URL = os.getenv('CLUSTER_URL')
BUCKET_LABEL = os.getenv('BUCKET_LABEL')

linode_obj_config = {
    "aws_access_key_id": ACCESS_KEY,
    "aws_secret_access_key": SECRET_KEY,
    "endpoint_url":CLUSTER_URL,
}

client = boto3.client("s3", **linode_obj_config)


ct = datetime.datetime.now()

# ts store timestamp of current time
ts = ct.timestamp()
stamp = round(ts)
filename = "daily_" + str(stamp) + ".txt"
print(filename)
f = open("data/" + filename, "x")
f.write('{"temp":80}')
f.close()

# print(client.list_objects(
#     Bucket=BUCKET_LABEL,)["Contents"])

# client.put_object()

client.upload_file(
    Filename='data/' +filename,
    Bucket=BUCKET_LABEL,
    Key=filename,
    ExtraArgs={'ACL':'public-read'})