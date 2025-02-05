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
                backgroundColor: ["#4facfe", "#00f2fe", "#36a2eb", "#ffcd56"],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }, // Tar bort lilla blåa rutan (legend)
                tooltip: { enabled: true } // Visar info när man hovrar över staplarna
            },
            scales: {
                x: {
                    grid: { display: false }, // Tar bort horisontella streck
                    ticks: {
                        font: { size: 18, weight: "bold" }, // Större och fetare text
                        color: "#333"
                    }
                },
                y: {
                    grid: { display: false }, // Tar bort vertikala streck
                    ticks: { display: false } // Döljer siffrorna på y-axeln
                }
            }
        }
    });
});
