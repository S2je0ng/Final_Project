
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

