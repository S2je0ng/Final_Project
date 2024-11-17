
var xhr = new XMLHttpRequest();
var url = 'http://apis.data.go.kr/6260000/AirQualityInfoService/getAirQualityInfoClassifiedByStation'; // API URL
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'dbXskZIbi2s80pFXM%2BtjJW%2BIjZoGolDZw1Sx4FbEmm86VR0GJcF1tgpxBwGROZTitGqKByf2Duim7WoCWlDERA%3D%3D'; // Replace with your actual service key
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); // 페이지 번호
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); // 한 페이지 결과 수
queryParams += '&' + encodeURIComponent('resultType') + '=' + encodeURIComponent('json'); // JSON 형식
queryParams += '&' + encodeURIComponent('areaIndex') + '=' + encodeURIComponent('측정소코드'); // 측정소 코드
queryParams += '&' + encodeURIComponent('controlnumber') + '=' + encodeURIComponent('측정시간'); // 측정 시간

console.log(url+queryParams);

xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) { // 요청이 완료되었을 때
        if (xhr.status === 200) { // 성공적으로 응답을 받았을 때
            console.log('Response:', JSON.parse(xhr.responseText)); // JSON 데이터를 콘솔에 출력
        } else { // 에러가 발생했을 때
            console.error('Error:', xhr.status, xhr.statusText);
        }
    }
};
xhr.send();

// Update Dashboard Data and Charts
function updateDashboard(data) {
    // Update Table
    document.getElementById('so2').textContent = data.so2 || 'N/A';
    document.getElementById('no2').textContent = data.no2 || 'N/A';
    document.getElementById('o3').textContent = data.o3 || 'N/A';
    document.getElementById('co').textContent = data.co || 'N/A';
    document.getElementById('pm25').textContent = data.pm25 || 'N/A';
    document.getElementById('pm10').textContent = data.pm10 || 'N/A';

    // Update Charts
    createBarChart(data);
    createDoughnutChart(data);
}

// Create Bar Chart
function createBarChart(data) {
    var ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['SO2', 'NO2', 'O3', 'CO', 'PM2.5', 'PM10'],
            datasets: [{
                label: 'Pollutant Levels',
                data: [data.so2, data.no2, data.o3, data.co, data.pm25, data.pm10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Create Doughnut Chart
function createDoughnutChart(data) {
    var ctx = document.getElementById('doughnutChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['SO2', 'NO2', 'O3', 'CO', 'PM2.5', 'PM10'],
            datasets: [{
                data: [data.so2, data.no2, data.o3, data.co, data.pm25, data.pm10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Event Listener for Region Selection
document.getElementById('regionSelect').addEventListener('change', function (event) {
    const stationCode = event.target.value;
    if (stationCode) {
        fetchData(stationCode); // Fetch data when a region is selected
    }
});