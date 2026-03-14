# Serverless Personal Expense Tracker

A serverless web application for tracking personal expenses on AWS. The app allows users to add expenses, view transaction history, calculate monthly totals, and delete saved expenses through a browser-based interface backed by managed AWS services.

## Project Summary

Built a serverless personal expense tracker using Amazon S3 for static frontend hosting, API Gateway for HTTP endpoints, AWS Lambda for backend logic, and DynamoDB for storing and managing expense data.

## Overview

This project was built to demonstrate a practical AWS serverless architecture through a simple but complete full-stack application. The goal was to connect a static frontend, API layer, serverless compute, and managed database into a working system that handles real user actions end to end.

The application is designed around common cloud patterns used in modern web development, with AWS handling the infrastructure instead of relying on a traditional always-on backend server.

## Features

- Add a new expense
- View all recorded expenses
- Calculate monthly spending totals
- Delete an existing expense
- Host the frontend as a static site in Amazon S3
- Deploy backend logic through AWS Lambda

## Architecture

This application uses the following AWS services:

- **Amazon S3** for static website hosting
- **Amazon API Gateway** for exposing backend endpoints
- **AWS Lambda** for request handling and business logic
- **Amazon DynamoDB** for expense storage

## Application Flow

1. The frontend is loaded from Amazon S3.
2. User actions in the browser send requests to API Gateway.
3. API Gateway routes those requests to a Lambda function.
4. Lambda processes the request and interacts with DynamoDB.
5. The response is returned to the frontend and displayed to the user.

This architecture follows a standard serverless pattern that reduces infrastructure management while still supporting a complete web application workflow.

## API Functionality

The backend currently supports four main operations:

- `POST /expenses` to create a new expense
- `GET /expenses` to return all saved expenses
- `GET /expenses/monthly-total` to calculate spending totals for a selected month
- `DELETE /expenses` to remove an existing expense

Each expense record includes data such as:

- expense date
- category
- amount
- note
- generated expense ID
- generated expense key for lookup and deletion

## Technical Notes

The application uses a DynamoDB table keyed to support both listing expenses and deleting specific records. The monthly total feature works by querying expenses for a given month and summing the matching amounts. The delete feature works by sending the selected expense key from the frontend to the backend, which then removes the matching item from DynamoDB.

The frontend is connected to the backend through API Gateway, and the project is set up so GitHub-based updates can deploy changes to the frontend and backend automatically.

## What I Learned

This project strengthened my understanding of:

- serverless application design on AWS
- API-driven communication between frontend and backend systems
- request handling with AWS Lambda
- querying and deleting data in DynamoDB
- configuring API routes and CORS in API Gateway
- IAM permissions between AWS services
- managing deployment workflows for cloud-hosted applications

It also gave me hands-on experience debugging service integration issues across the frontend, API, Lambda, and database layers.

## Future Improvements

Planned enhancements include:

- editing existing expenses
- filtering expenses by category
- adding merchant, payment method, tags, or recurring expense fields
- adding charts for monthly spending trends
- introducing user authentication with Amazon Cognito
- moving to infrastructure-as-code with AWS SAM or Terraform
- serving the frontend through CloudFront for improved caching and delivery

## Repository Purpose

This repository showcases a serverless AWS project built to demonstrate cloud architecture, service integration, API design, and practical full-stack development in a portfolio-ready format.
