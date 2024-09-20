import { WeatherData } from "../types/weather";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";

export const fetchWeatherData = async (nx: number, ny: number) => {
  if (!API_KEY) {
    console.error("API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.");
    throw new Error("API 키가 설정되지 않았습니다.");
  }

  const today = new Date();
  const hour = today.getHours();
  const formattedTime = hour.toString().padStart(2, "0") + "00";
  const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, "");

  const endpoint = "/getUltraSrtNcst";
  const queryParams = `serviceKey=${API_KEY}&numOfRows=10&pageNo=1&base_date=${formattedDate}&base_time=${formattedTime}&nx=${nx}&ny=${ny}&dataType=JSON`;

  const url = `${BASE_URL}${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log("API Response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("JSON 파싱 오류:", error);
      throw new Error("API 응답을 JSON으로 파싱할 수 없습니다.");
    }

    if (data.response && data.response.body && data.response.body.items) {
      const items = data.response.body.items.item;
      return processWeatherData(items);
    } else {
      console.error("예상치 못한 API 응답 구조:", data);
      throw new Error("예상치 못한 API 응답 구조");
    }
  } catch (error) {
    console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

const processWeatherData = (items: any[]) => {
  const processed: WeatherData = {
    temperature: 0,
    rainfall: 0,
    humidity: 0,
    windSpeed: 0,
  };
  items.forEach((item) => {
    switch (item.category) {
      case "T1H":
        processed.temperature = parseFloat(item.obsrValue);
        break;
      case "RN1":
        processed.rainfall = parseFloat(item.obsrValue);
        break;
      case "REH":
        processed.humidity = parseFloat(item.obsrValue);
        break;
      case "WSD":
        processed.windSpeed = parseFloat(item.obsrValue);
        break;
    }
  });
  return processed;
};
