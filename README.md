# Personal Expense Tracker on AWS

This project gives you a beginner-friendly serverless expense tracker:

- Frontend: static HTML, CSS, and JavaScript hosted on Amazon S3
- Backend: Amazon API Gateway + AWS Lambda
- Database: Amazon DynamoDB

## 1. What you are building

The app has three features:

- Add an expense
- View all expenses
- View a monthly total

The request flow is:

1. The browser loads the static site from S3.
2. The frontend sends API requests to API Gateway.
3. API Gateway invokes Lambda.
4. Lambda reads and writes expense data in DynamoDB.
5. Lambda returns JSON to the frontend.

## 2. Project structure

```text
expense-tracker/
  backend/
    index.mjs
    package.json
    smoke-test.mjs
  frontend/
    index.html
    script.js
    styles.css
  package.json
```

## 3. Prerequisites

Before you touch AWS, make sure you have:

- An AWS account
- Access to sign into the AWS Management Console
- A region selected, such as `us-east-1`
- Node.js 20 or newer installed on your computer
- An IAM user or role you are allowed to use for Lambda, API Gateway, DynamoDB, and S3

Keep everything in one AWS region while building the project. Do not mix regions.

## 4. Local setup

Open a terminal in this folder:

```bash
cd "/Users/adonyasargaw/Documents/New project/expense-tracker"
```

Install the Lambda dependencies:

```bash
npm run build:lambda
```

That command creates `lambda.zip`, which you will upload to AWS Lambda.

## 5. Create the DynamoDB table

1. Sign into the AWS Console.
2. In the search bar, type `DynamoDB`.
3. Open the DynamoDB service.
4. Click `Create table`.
5. For `Table name`, enter `ExpenseTracker`.
6. For `Partition key`, enter `ownerId` and select `String`.
7. For `Sort key`, enter `expenseKey` and select `String`.
8. Leave the table on the default capacity mode unless your school or lab specifically requires something else.
9. Click `Create table`.
10. Wait for the table status to become `Active`.

Why this schema:

- `ownerId` is a constant like `me` for your personal app
- `expenseKey` starts with the month, so monthly totals can be queried efficiently

## 6. Create the Lambda execution role

1. In the AWS Console search bar, type `IAM`.
2. Open IAM.
3. Click `Roles`.
4. Click `Create role`.
5. Choose `AWS service`.
6. Choose `Lambda`.
7. Click `Next`.
8. Attach these policies:
   - `AWSLambdaBasicExecutionRole`
9. Click `Next`.
10. Name the role `ExpenseTrackerLambdaRole`.
11. Click `Create role`.

Now add DynamoDB permissions:

1. Open the new role.
2. Click `Add permissions`.
3. Click `Create inline policy`.
4. Choose the JSON editor.
5. Paste this policy, replacing `REGION` and `ACCOUNT_ID`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/ExpenseTracker"
    }
  ]
}
```

6. Click `Next`.
7. Name the policy `ExpenseTrackerDynamoAccess`.
8. Save it.

## 7. Create the Lambda function

1. In the AWS Console search bar, type `Lambda`.
2. Open Lambda.
3. Click `Create function`.
4. Choose `Author from scratch`.
5. Function name: `ExpenseTrackerHandler`
6. Runtime: `Node.js 20.x`
7. Architecture: leave default unless you specifically need ARM.
8. Under permissions, choose `Use an existing role`.
9. Select `ExpenseTrackerLambdaRole`.
10. Click `Create function`.

Now configure the function:

1. Open the function.
2. In `Code source`, click `Upload from`.
3. Choose `.zip file`.
4. Upload `lambda.zip` from this project folder.
5. In `Runtime settings`, set the handler to `index.handler`.
6. Open `Configuration`.
7. Open `Environment variables`.
8. Add:
   - `TABLE_NAME` = `ExpenseTracker`
   - `OWNER_ID` = `me`
9. Save.
10. Click `Deploy`.

## 8. Create the API Gateway HTTP API

Use an HTTP API because it is simpler and cheaper for this project.

1. In the AWS Console search bar, type `API Gateway`.
2. Open API Gateway.
3. Click `Create API`.
4. Under `HTTP API`, click `Build`.
5. Choose `Add integration`.
6. Select `Lambda`.
7. Pick the `ExpenseTrackerHandler` function.
8. Click `Next`.
9. Create these routes:
   - `POST /expenses`
   - `GET /expenses`
   - `GET /expenses/monthly-total`
10. Click `Next`.
11. For the stage name, use `$default` for the easiest URL setup.
12. Click `Next`.
13. Review and create the API.

Now enable CORS:

1. Open your API.
2. Click `CORS`.
3. Configure:
   - Allowed origins: `*` while building, or your S3 website URL later
   - Allowed methods: `GET`, `POST`, `OPTIONS`
   - Allowed headers: `Content-Type`
4. Save.

Copy the invoke URL. It will look similar to:

```text
https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

## 9. Connect the frontend to the API

Open [script.js](/Users/adonyasargaw/Documents/New project/expense-tracker/frontend/script.js) and replace:

```js
const API_BASE_URL = "REPLACE_WITH_API_BASE_URL";
```

with your real API Gateway invoke URL.

Example:

```js
const API_BASE_URL = "https://abc123xyz.execute-api.us-east-1.amazonaws.com";
```

## 10. Create the S3 bucket for the frontend

1. In the AWS Console search bar, type `S3`.
2. Open S3.
3. Click `Create bucket`.
4. Enter a globally unique bucket name, such as `yourname-expense-tracker-site`.
5. Choose the same AWS region you used for Lambda and DynamoDB.
6. Leave `ACLs disabled`.
7. For Block Public Access:
   - Uncheck `Block all public access`
   - Confirm the warning
8. Create the bucket.

Upload the frontend files:

1. Open the bucket.
2. Click `Upload`.
3. Upload these files from the `frontend/` folder:
   - `index.html`
   - `styles.css`
   - `script.js`
4. Complete the upload.

Turn on static website hosting:

1. Open the bucket.
2. Go to `Properties`.
3. Scroll to `Static website hosting`.
4. Click `Edit`.
5. Enable it.
6. Set `Index document` to `index.html`.
7. Save.

Add a bucket policy so the site can be read publicly. Replace `BUCKET_NAME`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::adonyas-expense-tracker-site/*"
    }
  ]
}
```

To add the policy:

1. Open the bucket.
2. Go to `Permissions`.
3. Scroll to `Bucket policy`.
4. Paste the policy with your bucket name.
5. Save.

Then copy the S3 website endpoint URL and open it in your browser.

## 11. Test the app

Test in this order:

1. Open the S3 website URL.
2. Add one expense.
3. Click `Refresh List`.
4. Confirm the new expense appears.
5. Select the same month as the expense date.
6. Click `Load Total`.
7. Confirm the monthly total matches the amount you entered.
8. Add a second expense in the same month.
9. Reload the monthly total.
10. Confirm the total is the sum of both entries.

## 12. Test the API directly

You can also test with curl after replacing the API URL:

Create an expense:

```bash
curl -X POST "https://YOUR_API_ID.execute-api.REGION.amazonaws.com/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "expenseDate": "2026-03-14",
    "category": "Groceries",
    "amount": 42.75,
    "note": "Weekend shopping"
  }'
```

Get all expenses:

```bash
curl "https://YOUR_API_ID.execute-api.REGION.amazonaws.com/expenses"
```

Get a monthly total:

```bash
curl "https://YOUR_API_ID.execute-api.REGION.amazonaws.com/expenses/monthly-total?month=2026-03"
```

## 13. Common problems and fixes

If the frontend loads but API calls fail:

- Check the API URL in [script.js](/Users/adonyasargaw/Documents/New project/expense-tracker/frontend/script.js)
- Check API Gateway CORS settings
- Check Lambda logs in CloudWatch

If Lambda says it cannot access DynamoDB:

- Check the Lambda role
- Check the table name in the `TABLE_NAME` environment variable
- Check the inline IAM policy resource ARN

If the site returns `403 Forbidden`:

- Check the S3 bucket policy
- Check public access settings
- Make sure you are opening the website endpoint, not the bucket object URL

If the handler fails:

- Confirm the Lambda handler is `index.handler`
- Confirm the zip contains `index.mjs` at the root of the zip

## 14. Suggested project improvements

After the base version works, improve it with:

- Delete an expense
- Edit an expense
- Filter by category
- Add Amazon Cognito login
- Use CloudFront instead of direct S3 website hosting
- Use AWS SAM or Terraform so infrastructure is reproducible

## 15. Resume wording

You can use a line like this:

Built a serverless expense tracking web app using Amazon S3, API Gateway, AWS Lambda, and DynamoDB to record expenses, list transactions, and calculate monthly spending totals.
