document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/results");
    const data = await response.json();
    const ctx = document.getElementById("resultsChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(data.options),
            datasets: [{
                data: Object.values(data.options),
                backgroundColor: ["#4facfe", "#00f2fe", "#36a2eb"],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    grid: {
                        drawBorder: true, // Behåller bottenlinjen
                        drawOnChartArea: false, // Ser till att bara bottenlinjen visas
                        drawTicks: false,
                        color: "#ccc" // Bottenlinjen blir ljusgrå
                    },
                    ticks: {
                        font: { size: 16, weight: "bold" },
                        color: "#333"
                    }
                },
                y: {
                    grid: {
                        drawBorder: false, // Tar bort vänstra linjen
                        drawOnChartArea: false, // Tar bort horisontella linjer
                        drawTicks: false
                    },
                    ticks: { display: true } // Visar siffrorna på y-axeln
                }
            }
        }
    });
});
