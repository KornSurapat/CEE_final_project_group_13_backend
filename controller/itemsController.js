const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

// Get items from DynamoDB
exports.getItems = async (req, res) => {
  const params = {
    TableName: process.env.aws_items_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    // console.log(data);
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Add an item to DynamoDB
exports.addItem = async (req, res) => {
  const item_id = uuidv4();
  const created_date = Date.now();
  const item = { item_id: item_id, ...req.body, created_date: created_date };

  const params = {
    TableName: process.env.aws_items_table_name,
    Item: item
  }
  try {
    const data = await docClient.send(new PutCommand(params));
    res.send(data);
  } catch(err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Delete an item from DynamDB
exports.deleteItem = async (req, res) => {
  const item_id = req.params.item_id;

  const params = {
    TableName: process.env.aws_items_table_name,
    Key: {
      item_id: item_id
    }
  }
  try {
    const data = await docClient.send(new DeleteCommand(params));
    res.send(data);
  } catch(err) {
    console.error(err);
    res.status(500).send(err);
  }
};
