import AWS from "aws-sdk";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  TEXTRACTER_ROLE,
  SNS_TOPIC
} = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "eu-west-1"
});

const textract = new AWS.Textract({ apiVersion: "2018-06-27" });

export default textract
