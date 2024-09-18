import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faTimes } from "@fortawesome/free-solid-svg-icons";

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose }) => {
  const [weatherData, setWeatherData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const apiKey =
          "vk4aWLTlPOiSCrGPCqW9+RPDwCEbd2qZroyXnqkjhfKAQM15ca8W2DHua28iBIE0OaNWNEPaaAR2suzllAcotg==";
        const encodedKey = encodeURIComponent(apiKey);

        const today = new Date();
        const formattedDate = today
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const formattedTime =
          today.getHours().toString().padStart(2, "0") + "00";

        const baseUrl =
          "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
        const queryParams = `numOfRows=10&pageNo=1&base_date=${formattedDate}&base_time=${formattedTime}&nx=55&ny=127&dataType=JSON`;

        const url = `${baseUrl}?serviceKey=${encodedKey}&${queryParams}`;

        const response = await fetch(url);
        const text = await response.text();
        // console.log("API Response:", text);

        if (text.includes("<OpenAPI_ServiceResponse>")) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");
          const errMsg = xmlDoc.querySelector("errMsg")?.textContent;
          const returnAuthMsg =
            xmlDoc.querySelector("returnAuthMsg")?.textContent;
          throw new Error(`API 오류: ${errMsg || ""} (${returnAuthMsg || ""})`);
        }

        const data = JSON.parse(text);

        if (data.response && data.response.body && data.response.body.items) {
          setWeatherData(data.response.body.items.item);
        } else {
          throw new Error("예상치 못한 API 응답 구조");
        }
      } catch (error) {
        console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) {
      fetchWeather();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">현재 날씨</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {isLoading ? (
          <p>날씨 데이터를 불러오는 중...</p>
        ) : error ? (
          <p className="text-red-500">오류: {error}</p>
        ) : weatherData && weatherData.length > 0 ? (
          weatherData.map((item: any) => (
            <div
              key={item.category}
              className="mb-2 p-2 bg-gray-100 rounded-lg shadow-sm"
            >
              <p className="font-medium">카테고리: {item.category}</p>
              <p>관측값: {item.obsrValue}</p>
              {/* <p>도시: {item.name}</p>
              <p>온도: {item.main.temp}°C</p>
              <p>날씨: {item.weather[0].description}</p> */}
            </div>
          ))
        ) : (
          <p>날씨 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default WeatherModal;
