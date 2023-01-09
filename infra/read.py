import boto3
import os
from dotenv import load_dotenv, find_dotenv
import datetime


load_dotenv()

ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
CLUSTER_URL = os.getenv('CLUSTER_URL')
BUCKET_LABEL = os.getenv('BUCKET_LABEL')
FRONTEND_DIR = os.getenv('FRONTEND_DIR')

print(BUCKET_LABEL)

linode_obj_config = {
    "aws_access_key_id": ACCESS_KEY,
    "aws_secret_access_key": SECRET_KEY,
    "endpoint_url":CLUSTER_URL,
}

client = boto3.client("s3", **linode_obj_config)

files = client.list_objects(Bucket=BUCKET_LABEL)


for file in files["Contents"]:
    print("File: " + file["Key"])
    for key in file:
        print(key)
        print(file[key])
        print()
print()

# for file in files["Contents"]:
#   print(file["Key"])
#   client.delete_object(
#     Bucket=BUCKET_LABEL,
#     Key=file["Key"])
 
