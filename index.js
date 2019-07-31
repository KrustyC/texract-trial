import 'dotenv/config';
import AWS from 'aws-sdk';


console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-1',
});

const textract = new AWS.Textract({ apiVersion: '2018-06-27' });

const params = {
  DocumentLocation: {
    S3Object: {
      Bucket: 'll-textract-summative-assessments',
      Name: 'page-15.pdf'
    }
  },
  FeatureTypes: ['TABLES'],
  NotificationChannel: {
    RoleArn: process.env.TEXTRACTER_ROLE,
    SNSTopicArn: process.env.SNS_TOPIC,
  }
};

textract.startDocumentAnalysis(params, (err, data) => {
  if (err)  {
    console.log('Error:', err, err.stack)
  }
  else {
    console.log(data);
  }
});