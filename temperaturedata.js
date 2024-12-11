document.addEventListener("DOMContentLoaded", () => {
    const citySelect = document.getElementById("citySelect");
    const searchBtn = document.getElementById("searchBtn");
    const tempDisplay = document.getElementById("temp");
    const humidityDisplay = document.getElementById("humidity");
    const rainfallDisplay = document.getElementById("rainfall");
    const windspeedDisplay = document.getElementById("windspeed");

    let lineChart = null;

    const cityIds = {
        "서울": "108",
        "부산": "159",
        "인천": "112",
        "대구": "143",
        "광주": "156"
    };

    searchBtn.addEventListener("click", () => {
        const city = citySelect.value;
        if (city && cityIds[city]) {
            fetchWeatherData(city);
        } 
    });

    function getYesterdayDate() {
        const now = new Date();
        now.setDate(now.getDate() - 1); 
        return now.toISOString().split('T')[0].replace(/-/g, '');
    }

    function fetchWeatherData(city) {
        const cityId = cityIds[city];
        const yesterday = getYesterdayDate();

        const url = `https://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList`;
        const serviceKey = `dbXskZIbi2s80pFXM%2BtjJW%2BIjZoGolDZw1Sx4FbEmm86VR0GJcF1tgpxBwGROZTitGqKByf2Duim7WoCWlDERA%3D%3D`;
        const queryParams = `?serviceKey=${serviceKey}&numOfRows=24&pageNo=1&dataCd=ASOS&dateCd=HR&stnIds=${cityId}&startDt=${yesterday}&startHh=00&endDt=${yesterday}&endHh=23&dataType=JSON`;

        console.log("Request URL:", url+queryParams);

        fetch(url + queryParams)
            .then(response => response.json())
            .then(data => {
                if (data.response && data.response.header.resultCode === "00") {
                    const items = data.response.body.items.item;
                    if (items.length > 0) {
                        const latestData = items[items.length - 1];
                        updateWeatherInfo(latestData);
                        updateLineChart(items);
                    }
                }
            });
            
    }

    function updateWeatherInfo(latestData) {
        tempDisplay.textContent = latestData.ta;
        humidityDisplay.textContent = latestData.hm;
        windspeedDisplay.textContent = latestData.ws; 

        const rainfall = parseFloat(latestData.rn);
        rainfallDisplay.textContent = (rainfall && rainfall > 0) ? `${rainfall} mm` : "0";
    }

    function updateLineChart(data) {
        const labels = [];
        const temp = [];
        const humidity = [];

        const now = new Date();
        const currentHour = now.getHours();

        const filteredData = data.filter(item => {
            const hour = parseInt(item.tm.split(" ")[1].split(":")[0], 10);
            return hour <= currentHour;
        });
        filteredData.forEach(item => {
            labels.push(item.tm.split(" ")[1]);
            temp.push(parseFloat(item.ta));
            humidity.push(parseFloat(item.hm));
        });

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
                        fill: false
                    },
                    {
                        label: "Humidity (%)",
                        data: humidity,
                        borderColor: "blue",
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Time (00:00 ~ Now)"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Values"
                        }
                    }
                }
            }
        });
    }
    
});
