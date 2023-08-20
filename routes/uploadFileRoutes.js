const keys = require('../config/keys');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

module.exports = (app) => {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: keys.accessKeyId,
      secretAccessKey: keys.secretAccessKey,
    },
    region: 'eu-central-1',
  });

  app.get('/api/upload', (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'my-node-advanced-app',
        ContentType: 'jpeg',
        Key: key,
      },
      (err, url) => {
        return res.send({ url, key });
      }
    );
  });
};
