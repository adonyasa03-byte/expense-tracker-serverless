# Serverless Personal Expense Tracker

A serverless web application for tracking personal spending, built on AWS using Amazon S3, API Gateway, AWS Lambda, and DynamoDB. The app supports adding expenses, viewing transaction history, and calculating monthly spending totals through a simple browser-based interface.

## Project Summary

Built a serverless personal expense tracker using Amazon S3 for static hosting, API Gateway for HTTP endpoints, AWS Lambda for backend processing, and DynamoDB for expense storage and monthly total calculations.

## Overview

This project was designed to demonstrate a practical serverless architecture using AWS managed services. The goal was to build a small but complete application that shows how a frontend, API layer, compute layer, and database can work together without relying on a traditional always-on backend server.

By using managed AWS services, the application stays lightweight while still reflecting common cloud design patterns used in production environments.

## Features

- Add a new expense
- View all recorded expenses
- Calculate spending totals by month
- Host a static frontend in AWS
- Process backend requests through a serverless API architecture

## Architecture

The application is built with the following AWS services:

- **Amazon S3** for hosting the static frontend
- **Amazon API Gateway** for exposing backend HTTP endpoints
- **AWS Lambda** for request handling and business logic
- **Amazon DynamoDB** for storing expense records

## Application Flow

1. The frontend is served from Amazon S3.
2. User actions in the browser trigger HTTP requests to API Gateway.
3. API Gateway routes those requests to a Lambda function.
4. Lambda processes the request and interacts with DynamoDB.
5. The response is returned to the frontend and displayed in the UI.

This architecture follows a widely used serverless pattern that reduces infrastructure management while remaining scalable and cost-conscious.

## Design Rationale

This project uses a serverless approach to keep the architecture simple and focused. Each service has a clear responsibility:

- **S3** delivers the frontend as static web content
- **API Gateway** provides a clean interface between the browser and backend
- **Lambda** runs application logic only when requests are made
- **DynamoDB** stores structured expense data in a managed NoSQL database

This design made it possible to build and deploy a complete cloud application while gaining hands-on experience with service integration, request flow, and AWS resource configuration.

## Backend Functionality

The backend is organized around three core operations:

- `POST /expenses` to add a new expense
- `GET /expenses` to retrieve all expenses
- `GET /expenses/monthly-total` to calculate monthly totals

Each expense record can include:

- expense date
- category
- amount
- note

The monthly total endpoint retrieves expenses for a selected month and calculates the aggregate amount before returning the result to the frontend.

## Key Takeaways

This project strengthened my understanding of:

- serverless application design on AWS
- API-driven communication between frontend and backend systems
- request handling with AWS Lambda
- data storage and retrieval patterns in DynamoDB
- IAM-based permissions between AWS services
- CORS configuration for browser-to-API communication
- how managed cloud services reduce operational overhead

It also provided a strong practical example of how AWS services can be combined into a functional full-stack application.

## Future Improvements

Planned enhancements for future iterations include:

- editing existing expenses
- deleting expenses
- filtering transactions by category
- adding attributes such as merchant, payment method, tags, or recurring status
- visualizing spending with charts and summaries
- introducing user authentication with Amazon Cognito
- deploying infrastructure with AWS SAM or Terraform
- serving the frontend through CloudFront for improved delivery and caching

## Repository Purpose

This repository showcases a serverless AWS project built to demonstrate cloud architecture fundamentals, managed service integration, and end-to-end application design in a practical portfolio setting.
