document.addEventListener("DOMContentLoaded", () => {
  const quotes = [
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
        document.getElementById("quoteText").value = "";
        document.getElementById("quoteCategory").value = "";
        alert("Quote added successfully!");
      }
    });
    container.appendChild(form);
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  showRandomQuote();
});
