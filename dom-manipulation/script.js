document.addEventListener("DOMContentLoaded", () => {
  const quotes = JSON.parse(localStorage.getItem("quotes")) || [
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

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const container = document.body;

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerText = "No quotes available. Please add one.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerHTML = `<p>"${quotes[randomIndex].text}"</p><p><em>- ${quotes[randomIndex].category}</em></p>`;
  }

  function createAddQuoteForm() {
    const form = document.createElement("form");
    form.innerHTML = `
            <input type="text" id="quoteText" placeholder="Enter quote" required>
            <input type="text" id="quoteCategory" placeholder="Enter category" required>
            <button type="submit">Add Quote</button>
        `;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const quoteText = document.getElementById("quoteText").value.trim();
      const quoteCategory = document
        .getElementById("quoteCategory")
        .value.trim();
      if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        document.getElementById("quoteText").value = "";
        document.getElementById("quoteCategory").value = "";
        alert("Quote added successfully!");
      }
    });
    container.appendChild(form);
  }
  document
    .getElementById("exportQuotes")
    .addEventListener("click", function () {
      const dataStr = JSON.stringify(quotes, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  document
    .getElementById("importFile")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const importedQuotes = JSON.parse(e.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          alert("Quotes imported successfully!");
          showRandomQuote();
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    });

  newQuoteBtn.addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  showRandomQuote();
});
