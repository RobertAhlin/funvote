document.addEventListener("DOMContentLoaded", async () => {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const messageElement = document.getElementById("message");

    const response = await fetch("/results");
    const data = await response.json();
    questionElement.textContent = data.question;

    Object.keys(data.options).forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = async () => {
            const res = await fetch("/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ option })
            });
            const result = await res.json();
            messageElement.textContent = result.message;
        };
        optionsElement.appendChild(button);
    });
});
