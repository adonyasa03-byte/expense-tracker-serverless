const API_BASE_URL = "https://0si66es362.execute-api.us-west-1.amazonaws.com";

const expenseForm = document.getElementById("expense-form");
const formStatus = document.getElementById("form-status");
const expensesList = document.getElementById("expenses-list");
const monthInput = document.getElementById("month-input");
const monthlyTotal = document.getElementById("monthly-total");
const monthlySummary = document.getElementById("monthly-summary");
const refreshExpensesButton = document.getElementById("refresh-expenses");
const loadMonthlyTotalButton = document.getElementById("load-monthly-total");

const today = new Date();
document.getElementById("expenseDate").value = today.toISOString().slice(0, 10);
monthInput.value = today.toISOString().slice(0, 7);

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "Saving expense...";

  const payload = {
    expenseDate: document.getElementById("expenseDate").value,
    category: document.getElementById("category").value.trim(),
    amount: Number(document.getElementById("amount").value),
    note: document.getElementById("note").value.trim()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save expense.");
    }

    expenseForm.reset();
    document.getElementById("expenseDate").value = today.toISOString().slice(0, 10);
    formStatus.textContent = "Expense saved.";
    await Promise.all([loadExpenses(), loadMonthlyTotal()]);
  } catch (error) {
    formStatus.textContent = error.message;
  }
});

refreshExpensesButton.addEventListener("click", () => {
  void loadExpenses();
});

loadMonthlyTotalButton.addEventListener("click", () => {
  void loadMonthlyTotal();
});

async function loadExpenses() {
  expensesList.textContent = "Loading expenses...";

  try {
    const response = await fetch(`${API_BASE_URL}/expenses`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load expenses.");
    }

    if (!data.items.length) {
      expensesList.textContent = "No expenses yet.";
      return;
    }

    expensesList.innerHTML = data.items
      .map(
        (item) => `
          <article class="expense-item">
            <div class="expense-topline">
              <span>${escapeHtml(item.category)}</span>
              <span>$${Number(item.amount).toFixed(2)}</span>
            </div>
            <div>${escapeHtml(item.expenseDate)}</div>
            <div>${escapeHtml(item.note || "No note")}</div>
          </article>
        `
      )
      .join("");
  } catch (error) {
    expensesList.textContent = error.message;
  }
}

async function loadMonthlyTotal() {
  monthlySummary.textContent = "Loading monthly total...";
  const month = monthInput.value;

  try {
    const response = await fetch(`${API_BASE_URL}/expenses/monthly-total?month=${encodeURIComponent(month)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load monthly total.");
    }

    monthlyTotal.textContent = `$${Number(data.total).toFixed(2)}`;
    monthlySummary.textContent = `${data.count} expense(s) found for ${data.month}.`;
  } catch (error) {
    monthlySummary.textContent = error.message;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

void Promise.all([loadExpenses(), loadMonthlyTotal()]);
