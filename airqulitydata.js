document.addEventListener("DOMContentLoaded", () => {
    const citySelect = document.getElementById("citySelect");
    const districtSelect = document.getElementById("districtSelect");
    const searchBtn = document.getElementById("searchBtn");

    let barChart1 = null;
    let barChart2 = null;
    let doughnutChart1 = null;
    let doughnutChart2 = null;

    const pm25ValueSpan = document.getElementById("pm25Value");
    const emojiContainer = document.getElementById("emojiContainer"); 

    const locations = {
        "서울": ["강남구", "동대문구", "마포구", "서대문구", "송파구", "종로구"],
        "부산": ["용호동", "온천동", "대연동", "연산동", "부곡동", "부산항"],
        "대구": ["지산동", "수창동", "대명동", "내당동", "이곡동", "호림동"],
        "인천": ["석모리", "송도", "울도", "영흥", "연평도", "주안"],
        "광주": ["서석동", "노대동", "유촌동", "두암동", "운암동", "일곡동"]
    };

    citySelect.addEventListener("change", () => {
        const city = citySelect.value;
        districtSelect.innerHTML = `<option value="">Choose a district</option>`;
        if (city && locations[city]) {
            locations[city].forEach(district => {
                const option = document.createElement("option");
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;
        } else {
            districtSelect.disabled = true;
        }
        checkSearchButtonState();
    });

    districtSelect.addEventListener("change", checkSearchButtonState);

    function checkSearchButtonState() {
        searchBtn.disabled = !(citySelect.value && districtSelect.value);
    }

    searchBtn.addEventListener("click", () => {
        const sidoName = citySelect.value;
        const cityName = districtSelect.value;
        if (sidoName && cityName) {
            fetchAirPollutantData(sidoName, cityName);
        }
    });

    function fetchAirPollutantData(sidoName, stationName) {
        const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty`;
        const serviceKey = `dbXskZIbi2s80pFXM%2BtjJW%2BIjZoGolDZw1Sx4FbEmm86VR0GJcF1tgpxBwGROZTitGqKByf2Duim7WoCWlDERA%3D%3D`;
        const queryParams = `?serviceKey=${serviceKey}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodeURIComponent(sidoName)}&ver=1.0`;

        const requestUrl = url + queryParams;

        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                if (data.response && data.response.body && data.response.body.items) {
                    const filteredData = data.response.body.items.filter(item => item.stationName === stationName);

                    if (filteredData.length > 0) {
                        updateAirPollutantCharts(filteredData[0]);
                    }
                }
            })
            
    }

    function updateAirPollutantCharts(data) {
        const particulateValues = [
            parseFloat(data.pm25Value) || 0,
            parseFloat(data.pm10Value) || 0
        ];

        const gasValues = [
            parseFloat(data.no2Value) || 0,
            parseFloat(data.so2Value) || 0,
            parseFloat(data.o3Value) || 0,
            parseFloat(data.coValue) || 0
        ];

        const pm25 = parseFloat(data.pm25Value) || 0;
        const pm10 = parseFloat(data.pm10Value) || 0;
        const no2 = parseFloat(data.no2Value) || 0;
        const so2 = parseFloat(data.so2Value) || 0;
        const o3 = parseFloat(data.o3Value) || 0;
        const co = parseFloat(data.coValue) || 0;


        document.getElementById("pm25Value").textContent = pm25;
        document.getElementById("pm10Value").textContent = pm10;
        document.getElementById("no2Value").textContent = no2;
        document.getElementById("so2Value").textContent = so2;
        document.getElementById("o3Value").textContent = o3;
        document.getElementById("coValue").textContent = co;

        pm25ValueSpan.textContent = `${pm25} ㎍/㎥`;
        updateEmoji(pm25);

        const ctxBar1 = document.getElementById("barChart1").getContext("2d");
        if (barChart1) barChart1.destroy();
        barChart1 = new Chart(ctxBar1, {
            type: "bar",
            data: {
                labels: ["PM2.5 (㎍/㎥)", "PM10 (㎍/㎥)"],
                datasets: [{
                    label: "Air Pollutants (PM)",
                    data: particulateValues,
                    backgroundColor: ["pink", "gray"]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Concentration (㎍/㎥)" }
                    }
                }
            }
        });

        const ctxBar2 = document.getElementById("barChart2").getContext("2d");
        if (barChart2) barChart2.destroy();
        barChart2 = new Chart(ctxBar2, {
            type: "bar",
            data: {
                labels: ["NO₂ (ppm)", "SO₂ (ppm)", "O₃ (ppm)", "CO (ppm)"],
                datasets: [{
                    label: "Air Pollutants",
                    data: gasValues,
                    backgroundColor: ["green", "skyblue", "purple", "orange"]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Concentration (ppm)"
                        }
                    }
                }
            }
        });


        const ctxDoughnut1 = document.getElementById("doughnutChart1").getContext("2d");
        if (doughnutChart1) doughnutChart1.destroy();
        doughnutChart1 = new Chart(ctxDoughnut1, {
            type: "doughnut",
            data: {
                labels: ["PM2.5 (㎍/㎥)", "PM10 (㎍/㎥)"],
                datasets: [{
                    data: particulateValues,
                    backgroundColor: ["pink", "gray"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                cutout: "70%", 
            }
        });

        const ctxDoughnut2 = document.getElementById("doughnutChart2").getContext("2d");
        if (doughnutChart2) doughnutChart2.destroy();
        doughnutChart2 = new Chart(ctxDoughnut2, {
            type: "doughnut",
            data: {
                labels: ["NO₂ (ppm)", "SO₂ (ppm)", "O₃ (ppm)", "CO (ppm)"],
                datasets: [{
                    data: gasValues,
                    backgroundColor: ["green", "skyblue", "purple", "orange"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
            }
        });
    }

    function updateEmoji(pm25) {
        if (pm25 >= 0 && pm25 <= 15) {
            emojiContainer.innerHTML = `<span>😊</span>`;
        } else if (pm25 >= 16 && pm25 <= 35) {
            emojiContainer.innerHTML = `<span>😐</span>`;
        } else if (pm25 > 35) {
            emojiContainer.innerHTML = `<span>😷</span>`;
        }
    }
});
