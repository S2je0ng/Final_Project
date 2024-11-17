document.addEventListener("DOMContentLoaded", () => {
    const citySelect = document.getElementById("citySelect");
    const districtSelect = document.getElementById("districtSelect");
    const districtsByCity = {
        "서울": ["강남구", "동대문구", "마포구", "서초구", "송파구", "종로구"],
        "부산": ["전포동", "온천동", "대연동", "연산동", "부곡동", "광안동"],
        "인천": ["석모리", "덕적도", "백령도", "영흥", "연평도", "구월동"],
        "대구": ["지산동", "수창동", "서호동", "시지동", "이곡동", "호림동"],
        "광주": ["서석동", "노대동", "유촌동", "두암동", "운암동", "일곡동"]
    };

    let barChartInstance = null;
    let doughnutChartInstance = null;

    citySelect.addEventListener("change", () => {
        const city = citySelect.value;
        if (city && districtsByCity[city]) {
            districtSelect.innerHTML = `<option value="">Select a district</option>`;
            districtsByCity[city].forEach(district => {
                const option = document.createElement("option");
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;

        } else {
            districtSelect.innerHTML = `<option value="">Select a district</option>`;
            districtSelect.disabled = true;
        }
    });

    districtSelect.addEventListener("change", () => {
        const city = citySelect.value;
        const district = districtSelect.value;
        if (city && district) {
            fetchData(city, district);
        }
    });

    function fetchData(city, district) {
        const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty`;
        const serviceKey = 'dbXskZIbi2s80pFXM%2BtjJW%2BIjZoGolDZw1Sx4FbEmm86VR0GJcF1tgpxBwGROZTitGqKByf2Duim7WoCWlDERA%3D%3D'; // Replace with your actual service key
        const queryParams = `?serviceKey=${serviceKey}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodeURIComponent(city)}&ver=1.0`;

        fetch(url + queryParams)
            .then(response => response.json())
            .then(data => {
                if (data.response.body && data.response.body.items) {
                    const filteredData = data.response.body.items.filter(item => item.stationName === district);
                    if (filteredData.length > 0) {
                        updateCharts(filteredData[0]);
                    } 
                } 
            })
    }

    function updateCharts(data) {
        updateBarChart(data);
        updateDoughnutChart(data);
    }

    function updateBarChart(data) {
        const ctx = document.getElementById("barChart").getContext("2d");
        if (barChartInstance) {
            barChartInstance.destroy();
        }
        barChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["PM2.5", "PM10", "NO₂", "CO", "SO₂"],
                datasets: [{
                    label: "Pollutant Levels",
                    data: [data.pm25Value, data.pm10Value, data.no2Value, data.coValue, data.so2Value],

                    backgroundColor: [ "pink", "grey","green", "skyblue","purple"]
                }]
            },
        });
    }

    function updateDoughnutChart(data) {
        const ctx = document.getElementById("doughnutChart").getContext("2d");
        if (doughnutChartInstance) {
            doughnutChartInstance.destroy();
        }
        doughnutChartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["PM2.5", "PM10", "NO₂", "CO", "SO₂"],
                datasets: [{
                    data: [data.pm25Value, data.pm10Value, data.no2Value, data.coValue, data.so2Value],
                    backgroundColor: [ "pink", "grey","green", "skyblue","purple"]
                }]
            },
        });
    }
});
