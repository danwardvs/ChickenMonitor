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

client.upload_file(
      Filename="index.html",
      Bucket=BUCKET_LABEL,
      Key="index2.html",
      ExtraArgs={'ACL':'public-read','ContentType':"text/html"})

# for file in files["Contents"]:
#   print(file["Key"])
#   client.delete_object(
#     Bucket=BUCKET_LABEL,
#     Key=file["Key"])
 
