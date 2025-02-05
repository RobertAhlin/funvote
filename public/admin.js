document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
});

// Hämta aktuell status och uppdatera UI
async function loadData() {
    const response = await fetch("/results");
    const data = await response.json();

    // Uppdatera lås-knappen och status
    const lockButton = document.getElementById("lockButton");
    lockButton.textContent = data.isLocked ? "Lås upp omröstning" : "Lås omröstning";
    lockButton.style.backgroundColor = data.isLocked ? "#e74c3c" : "#3498db"; // Röd vid låst, blå vid öppen
    lockButton.style.color = "white";

    document.getElementById("lockStatus").textContent = data.isLocked ? "Omröstningen är LÅST" : "Omröstningen är ÖPPEN";

    // Uppdatera frågefältet
    document.getElementById("questionInput").value = data.question;

    // Uppdatera listan med svarsalternativ
    const optionsList = document.getElementById("optionsList");
    optionsList.innerHTML = "";

    Object.keys(data.options).forEach(option => {
        const li = document.createElement("li");
        li.textContent = option;
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.backgroundColor = "#f8f9fa";
        li.style.padding = "10px";
        li.style.margin = "5px 0";
        li.style.borderRadius = "5px";

        // Skapa en "ta bort"-knapp med bättre design
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.style.background = "lightblue";
        deleteBtn.style.color = "white";
        deleteBtn.style.border = "none";
        deleteBtn.style.padding = "5px 10px";
        deleteBtn.style.fontSize = "16px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.borderRadius = "5px";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.style.transition = "background 0.3s ease";
        deleteBtn.style.maxWidth = "40px"; // Begränsar knappens bredd
        deleteBtn.style.minWidth = "30px"; // Sätter en minsta bredd
        deleteBtn.style.textAlign = "center"; // Centrerar ikonen i knappen

        // Hover-effekt
        deleteBtn.onmouseover = () => deleteBtn.style.background = "#c0392b";
        deleteBtn.onmouseout = () => deleteBtn.style.background = "lightblue";

        deleteBtn.onclick = () => removeOption(option);

        li.appendChild(deleteBtn);
        optionsList.appendChild(li);
    });
}

// Växla låsstatus
async function toggleLock() {
    const password = document.getElementById("password").value;

    // Uppdatera knappen direkt innan vi gör API-anropet
    const lockButton = document.getElementById("lockButton");
    lockButton.textContent = "Uppdaterar...";
    lockButton.style.backgroundColor = "#f39c12"; // Tillfällig gul färg medan vi väntar

    const response = await fetch("/admin/toggle-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const data = await response.json();
    document.getElementById("lockStatus").textContent = data.message;

    await loadData(); // Uppdatera UI efter att svaret kommit tillbaka
}

// Uppdatera frågan
async function updateQuestion() {
    const password = document.getElementById("password").value;
    const newQuestion = document.getElementById("questionInput").value;

    const response = await fetch("/admin/update-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, question: newQuestion })
    });

    const data = await response.json();
    document.getElementById("adminMessage").textContent = data.message;

    await loadData();
}

// Lägg till ett nytt svarsalternativ
async function addOption() {
    const password = document.getElementById("password").value;
    const newOption = document.getElementById("newOption").value;

    const response = await fetch("/admin/add-option", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, option: newOption })
    });

    const data = await response.json();
    document.getElementById("adminMessage").textContent = data.message;

    await loadData();
}

// Ta bort ett svarsalternativ
async function removeOption(option) {
    const password = document.getElementById("password").value;

    const response = await fetch("/admin/remove-option", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, option })
    });

    const data = await response.json();
    document.getElementById("adminMessage").textContent = data.message;

    await loadData();
}

// Återställ röster
async function resetVotes() {
    const password = document.getElementById("password").value;

    const response = await fetch("/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const data = await response.json();
    document.getElementById("adminMessage").textContent = data.message;

    await loadData();
}
