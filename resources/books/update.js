
'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#book': 'book',
      '#publisher': 'publisher',
      '#author': 'author',
      '#publishedOn': 'publishedOn',
    },
    ExpressionAttributeValues: {
      ':book': data.book,
      ':publisher': data.publisher,
      ':author': data.author,
      ':publishedOn': data.publishedOn,
    },
    UpdateExpression: 'SET #book = :book, #publisher = :publisher, #author = :author, #publishedOn = :publishedOn',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the book item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};