// Sample data for demonstration (You can replace it with real-time data fetching)
const data = {
    temperature: 25,
    humidity: 45,
    pm25: 30,
    pm10: 50,
    nox: 15,
    co2: 400,
    so2: 20,
    voc: 10
};

// Update data values on page load
document.getElementById("temperature").textContent = `${data.temperature}°C`;
document.getElementById("humidity").textContent = `${data.humidity}%`;
document.getElementById("pm25").textContent = `${data.pm25} µg/m³`;

// Line Chart for Temperature and Humidity
const ctxLine = document.getElementById("lineChart").getContext("2d");
new Chart(ctxLine, {
    type: "line",
    data: {
        labels: ["1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM"],
        datasets: [
            {
                label: "Temperature (°C)",
                data: [22, 23, 24, 25, 26, 27],
                borderColor: "rgba(255, 99, 132, 1)",
                fill: false,
            },
            {
                label: "Humidity (%)",
                data: [40, 42, 45, 43, 44, 46],
                borderColor: "rgba(54, 162, 235, 1)",
                fill: false,
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Time" }},
            y: { title: { display: true, text: "Value" }}
        }
    }
});

// Bar Chart for Pollutant Levels
const ctxBar = document.getElementById("barChart").getContext("2d");
new Chart(ctxBar, {
    type: "bar",
    data: {
        labels: ["PM2.5", "PM10", "NOx", "CO2", "SO2", "VOC"],
        datasets: [
            {
                label: "Pollutant Level",
                data: [data.pm25, data.pm10, data.nox, data.co2, data.so2, data.voc],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)"
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)"
                ],
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Pollutants" }},
            y: { title: { display: true, text: "Level (ppb/µg/m³)" }}
        }
    }
});
