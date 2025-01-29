document.addEventListener("DOMContentLoaded", () => {
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    {
      text: "The best way to predict the future is to create it.",
      category: "Motivation",
    },
    {
      text: "Life is 10% what happens to us and 90% how we react to it.",
      category: "Life",
    },
    {
      text: "Do what you can, with what you have, where you are.",
      category: "Inspiration",
    },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categoryFilter = document.getElementById("categoryFilter");
  const syncStatus = document.getElementById("syncStatus");

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function populateCategories() {
    const categories = ["All", ...new Set(quotes.map((q) => q.category))];
    categoryFilter.innerHTML = categories
      .map((cat) => `<option value="${cat}">${cat}</option>`)
      .join("");

    const savedCategory = localStorage.getItem("selectedCategory") || "All";
    categoryFilter.value = savedCategory;
    filterQuotes();
  }

  function showRandomQuote() {
    const filteredQuotes =
      categoryFilter.value === "All"
        ? quotes
        : quotes.filter((q) => q.category === categoryFilter.value);

    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
  }

  function filterQuotes() {
    localStorage.setItem("selectedCategory", categoryFilter.value);
    showRandomQuote();
  }

  function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (!text || !category)
      return alert("Please enter both quote and category.");

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }

  function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  // Use async and await for the fetch function
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      ); // Mock API endpoint
      const serverQuotes = await response.json();

      const serverQuoteTexts = new Set(serverQuotes.map((q) => q.title));

      // Conflict Resolution: Server data takes precedence
      const mergedQuotes = [
        ...quotes,
        ...serverQuotes.filter((q) => !serverQuoteTexts.has(q.title)),
      ];

      if (mergedQuotes.length !== quotes.length) {
        quotes = mergedQuotes;
        saveQuotes();
        showSyncNotification(
          "Data synced with the server, local changes updated."
        );
      }

      populateCategories();
      showRandomQuote();
    } catch {
      showSyncNotification("Failed to sync with the server. Using local data.");
    }
  }

  function showSyncNotification(message) {
    syncStatus.textContent = message;
    setTimeout(() => {
      syncStatus.textContent = "";
    }, 5000);
  }

  // Sync every 10 seconds (simulation of periodic syncing)
  setInterval(fetchQuotesFromServer, 10000);

  newQuoteBtn.addEventListener("click", showRandomQuote);
  categoryFilter.addEventListener("change", filterQuotes);
  document
    .getElementById("importFile")
    .addEventListener("change", importFromJsonFile);
  document
    .querySelector("button[onclick='addQuote()']")
    .addEventListener("click", addQuote);
  document
    .querySelector("button[onclick='exportQuotes()']")
    .addEventListener("click", exportQuotes);

  populateCategories();
  showRandomQuote();
  fetchQuotesFromServer();
});
