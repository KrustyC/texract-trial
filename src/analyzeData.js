import textract from './Textract'

const params = {
  DocumentLocation: {
    S3Object: {
      Bucket: "ll-textract-summative-assessments",
      Name: "page-15.pdf"
    }
  },
  FeatureTypes: ["TABLES"],
  NotificationChannel: {
    RoleArn: TEXTRACTER_ROLE,
    SNSTopicArn: SNS_TOPIC
  }
};

const analyzeData = () => {
  textract.startDocumentAnalysis(params, (err, data) => {
    if (err) {
      console.log("Error:", err, err.stack);
    } else {
      console.log('Success!', data)
    }
  });
}

export default analyzeData
