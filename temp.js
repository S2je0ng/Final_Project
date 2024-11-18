document.addEventListener("DOMContentLoaded", () => {
    const citySelect = document.getElementById("citySelect");

    citySelect.addEventListener("change", () => {
        const city = citySelect.value;
        if (city) {
            fetchData(city);
        }
    });

    let lineChart = null;

    const cityIds = {
        "서울": "108",
        "부산": "159",
        "인천": "112",
        "대구": "143",
        "광주": "156"
    };

    // fetch data
    function fetchData(city) {
        const cityId = cityIds[city];

        const url = `https://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList`;
        const serviceKey = `dbXskZIbi2s80pFXM%2BtjJW%2BIjZoGolDZw1Sx4FbEmm86VR0GJcF1tgpxBwGROZTitGqKByf2Duim7WoCWlDERA%3D%3D`;
        const queryParams = `?serviceKey=${serviceKey}&numOfRows=24&pageNo=1&dataCd=ASOS&dateCd=HR&stnIds=${cityId}&startDt=20241116&startHh=00&endDt=20241117&endHh=23&dataType=JSON`;

        console.log(url + queryParams);

        fetch(url + queryParams)
            .then(response => response.json())
            .then(data => {
                if (data.response && data.response.body && data.response.body.items) {
                    const items = data.response.body.items.item;
                    weatherData(items);
                }
            })
    }

    function weatherData(data) {
        const labels = [];
        const temp = [];
        const humidities = [];

        data.forEach(item => {
            const time = item.tm.split(' ')[1]; 
            labels.push(time);
            temp.push(parseFloat(item.ta)); // 온도
            humidities.push(parseFloat(item.hm)); // 습도
        });

        updateLineChart(labels, temp, humidities);
    }

    function updateLineChart(labels, temp, humidities) {
        const ctx = document.getElementById("lineChart").getContext("2d");

        if (lineChart) {
            lineChart.destroy();
        }

        lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Temperature (°C)",
                        data: temp,
                        borderColor: "red",
                        borderWidth: 2,
                        yAxisID: "y1",
                    },
                    {
                        label: "Humidity (%)",
                        data: humidities,
                        borderColor: "blue",
                        borderWidth: 2,
                        yAxisID: "y2",
                    }
                ]
            },

            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Time",
                        }
                    },
                    y1: {
                        type: "linear",
                        position: "left",
                        title: {
                            display: true,
                            text: "Temperature (°C)"
                        }
                    },
                    y2: {
                        type: "linear",
                        position: "right",
                        title: {
                            display: true,
                            text: "Humidity (%)"
                        }
                    }
                }
            }
        });
    }

});
