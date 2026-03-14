import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "node:crypto";

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.TABLE_NAME;
const OWNER_ID = process.env.OWNER_ID || "me";

const ddbClient = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true
  }
});

export const handler = async (event) => {
  try {
    if (!TABLE_NAME) {
      return json(500, { message: "TABLE_NAME environment variable is missing." });
    }

    const method = event?.requestContext?.http?.method || event?.httpMethod;
    const rawPath = event?.rawPath || event?.path || "/";

    if (method === "POST" && rawPath === "/expenses") {
      return await createExpense(event);
    }

    if (method === "GET" && rawPath === "/expenses") {
      return await listExpenses();
    }

    if (method === "GET" && rawPath === "/expenses/monthly-total") {
      return await getMonthlyTotal(event);
    }

    return json(404, { message: "Route not found." });
  } catch (error) {
    console.error("Unhandled error:", error);
    return json(500, {
      message: "Internal server error.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

async function createExpense(event) {
  const body = parseJson(event?.body);

  const amount = Number(body?.amount);
  const category = String(body?.category || "").trim();
  const note = String(body?.note || "").trim();
  const expenseDate = String(body?.expenseDate || "").trim();

  if (!Number.isFinite(amount) || amount <= 0) {
    return json(400, { message: "Amount must be a number greater than 0." });
  }

  if (!category) {
    return json(400, { message: "Category is required." });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(expenseDate)) {
    return json(400, { message: "expenseDate must be in YYYY-MM-DD format." });
  }

  const expenseId = crypto.randomUUID();
  const expenseMonth = expenseDate.slice(0, 7);
  const expenseKey = `${expenseMonth}#${expenseDate}#${expenseId}`;

  const item = {
    ownerId: OWNER_ID,
    expenseKey,
    expenseId,
    amount,
    category,
    note,
    expenseDate,
    expenseMonth,
    createdAt: new Date().toISOString()
  };

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    })
  );

  return json(201, { message: "Expense created.", item });
}

async function listExpenses() {
  const response = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "ownerId = :ownerId",
      ExpressionAttributeValues: {
        ":ownerId": OWNER_ID
      },
      ScanIndexForward: false
    })
  );

  return json(200, { items: response.Items || [] });
}

async function getMonthlyTotal(event) {
  const month = getMonthParam(event);

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return json(400, { message: "Query parameter month must be in YYYY-MM format." });
  }

  const response = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "ownerId = :ownerId AND begins_with(expenseKey, :monthPrefix)",
      ExpressionAttributeValues: {
        ":ownerId": OWNER_ID,
        ":monthPrefix": `${month}#`
      }
    })
  );

  const items = response.Items || [];
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return json(200, {
    month,
    total,
    count: items.length,
    items
  });
}

function parseJson(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "object") {
    return body;
  }

  return JSON.parse(body);
}

function getMonthParam(event) {
  if (event?.queryStringParameters?.month) {
    return event.queryStringParameters.month;
  }

  if (event?.rawQueryString) {
    const params = new URLSearchParams(event.rawQueryString);
    return params.get("month") || "";
  }

  return "";
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    },
    body: JSON.stringify(body)
  };
}
