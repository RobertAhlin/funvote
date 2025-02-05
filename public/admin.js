document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
});

// Ladda aktuell fråga och svarsalternativ
async function loadData() {
    const response = await fetch("/results");
    const data = await response.json();

    document.getElementById("questionInput").value = data.question;

    const optionsList = document.getElementById("optionsList");
    optionsList.innerHTML = "";

    Object.keys(data.options).forEach(option => {
        const li = document.createElement("li");
        li.textContent = option;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.onclick = () => removeOption(option);

        li.appendChild(deleteBtn);
        optionsList.appendChild(li);
    });
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
