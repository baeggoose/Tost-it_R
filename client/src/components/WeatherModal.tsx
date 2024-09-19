import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faMapMarkerAlt,
  faThermometerHalf,
  faTint,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ nx: number; ny: number } | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const { nx, ny } = convertToGridCoords(latitude, longitude);
          setLocation({ nx, ny });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("위치를 가져올 수 없습니다.");
        }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && location) {
      fetchWeather(location.nx, location.ny);
    }
  }, [isOpen, location]);

  const fetchWeather = async (nx: number, ny: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

      if (!apiKey) {
        throw new Error("API 키가 설정되지 않았습니다.");
      }

      const today = new Date();
      const hour = today.getHours();
      let formattedTime = hour.toString().padStart(2, "0") + "00";
      const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, "");

      const baseUrl =
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
      const queryParams = `numOfRows=10&pageNo=1&base_date=${formattedDate}&base_time=${formattedTime}&nx=${nx}&ny=${ny}&dataType=JSON`;

      const url = `${baseUrl}?serviceKey=${apiKey}&${queryParams}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.response && data.response.body && data.response.body.items) {
        const items = data.response.body.items.item;
        const processedData = processWeatherData(items);
        setWeatherData(processedData);
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

  const processWeatherData = (items: any[]) => {
    const processed: any = {};
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

  const convertToGridCoords = (lat: number, lon: number) => {
    return { nx: 55, ny: 127 };
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">현재 날씨</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
        <span>현재 위치 기준</span>
        {isLoading ? (
          <p>날씨 데이터를 불러오는 중...</p>
        ) : error ? (
          <p className="text-red-500">오류: {error}</p>
        ) : weatherData ? (
          <div>
            <div className="flex justify-between gap-2 mt-2">
              <div className="flex-grow basis-0 bg-blue-100 p-3 rounded-lg">
                <FontAwesomeIcon
                  icon={faThermometerHalf}
                  className="mr-2 text-blue-500"
                />
                <span className="font-bold">{weatherData.temperature}°C</span>
              </div>
              <div className="flex-grow basis-0 bg-blue-100 p-3 rounded-lg">
                <FontAwesomeIcon icon={faTint} className="mr-2 text-blue-500" />
                <span className="font-bold">{weatherData.humidity}%</span>
              </div>
              <div className="flex-grow basis-0 bg-blue-100 p-3 rounded-lg">
                <FontAwesomeIcon icon={faWind} className="mr-2 text-blue-500" />
                <span className="font-bold">{weatherData.windSpeed}m/s</span>
              </div>
              {weatherData.rainfall > 0 && (
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FontAwesomeIcon
                    icon={faTint}
                    className="mr-2 text-blue-500"
                  />
                  <span className="font-bold">{weatherData.rainfall} mm</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>날씨 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default WeatherModal;
