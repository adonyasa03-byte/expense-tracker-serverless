async function run() {
  process.env.TABLE_NAME = "ExpenseTracker";
  const { handler } = await import("../dist/index.mjs");

  const response = await handler({
    requestContext: { http: { method: "GET" } },
    rawPath: "/health"
  });

  console.log(response.statusCode === 404 ? "Smoke test passed." : "Unexpected response.");
  console.log(response);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
