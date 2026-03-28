// --- 1. Search Function (Task 7 & 8) ---
function searchCondition() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = ''; 

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let foundResults = [];

            // 1. Handle "Country" or "Countries" keyword
            if (input.includes('country') || input.includes('countries')) {
                // This combines all cities from all countries into one list
                data.countries.forEach(country => {
                    foundResults = foundResults.concat(country.cities);
                });
            } 
            // 2. Handle specific country names (Japan, Australia, Brazil)
            else {
                const countryMatch = data.countries.find(item => 
                    input.includes(item.name.toLowerCase())
                );
                if (countryMatch) {
                    foundResults = countryMatch.cities;
                }
            }

            // 3. Handle Beaches/Temples (existing logic)
            if (foundResults.length === 0) {
                if (input.includes('beach')) foundResults = data.beaches;
                else if (input.includes('temple')) foundResults = data.temples;
            }

            // Display the results
            if (foundResults.length > 0) {
                displayResults(foundResults);
            } else {
                resultDiv.innerHTML = '<p style="color: white; padding: 20px;">No results found. Try "Japan" or "Country".</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}


// --- 2. Display Results Function (Task 10 - Timezones) ---
function displayResults(items) {
  const resultDiv = document.getElementById("results");

  // Mapping city names to timezones for Task 10
  const cityTimeZones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Kyoto",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo",
  };

  items.forEach((item) => {
    // TASK 10: Calculate Local Time
    const tz = cityTimeZones[item.name];
    let timeHTML = "";

    if (tz) {
      const options = {
        timeZone: tz,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const localTime = new Date().toLocaleTimeString("en-US", options);
      timeHTML = `<p style="color: #2a9d8f; font-weight: bold; margin-bottom: 5px;">Local Time: ${localTime}</p>`;
    }

    // Generate the Card HTML
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div style="padding: 20px;">
                <h3>${item.name}</h3>
                ${timeHTML}
                <p>${item.description}</p>
                <button class="btn-visit" style="margin-top: 15px;">Visit</button>
            </div>
        `;
    resultDiv.appendChild(card);
  });
}

// --- 3. Reset/Clear Functions (Task 9) ---
function clearResults() {
  const searchInput = document.getElementById("searchInput");
  const resultDiv = document.getElementById("results");

  if (searchInput) searchInput.value = "";
  if (resultDiv) resultDiv.innerHTML = "";

  console.log("Search results cleared.");
}

// Keep resetForm as an alias for clearResults if needed
function resetForm() {
  clearResults();
}

// Add this to the bottom of travel_recommendation.js
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the page from refreshing

    // Get the values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Basic check (though 'required' in HTML handles most of this)
    if (name && email && message) {
      console.log("Form Submitted:", { name, email, message });

      // Show a success alert to the user
      alert(`Thank you, ${name}! Your message has been sent successfully.`);

      // Clear the form
      contactForm.reset();
    } else {
      alert("Please fill out all fields before submitting.");
    }
  });
}
