import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThermometerHalf,
  faTint,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

interface WeatherDisplayProps {
  weatherData: any;
  isLoading: boolean;
  error: string | null;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weatherData,
  isLoading,
  error,
}) => {
  if (isLoading) return <p>날씨 데이터를 불러오는 중...</p>;
  if (error) return <p className="text-red-500">오류: {error}</p>;
  if (!weatherData) return <p>날씨 데이터가 없습니다.</p>;

  return (
    <div className="flex justify-between gap-2 mt-2">
      <WeatherItem
        icon={faThermometerHalf}
        value={`${weatherData.temperature}°C`}
      />
      <WeatherItem
        icon={faTint}
        value={
          weatherData.rainfall > 0
            ? `${weatherData.humidity} % ${weatherData.rainfall} mm`
            : `${weatherData.humidity} %`
        }
      />
      <WeatherItem icon={faWind} value={`${weatherData.windSpeed} m/s`} />
    </div>
  );
};

const WeatherItem: React.FC<{ icon: any; value: string }> = ({
  icon,
  value,
}) => (
  <div className="flex items-center justify-center flex-grow basis-0 bg-blue-100 p-3 rounded-lg">
    <FontAwesomeIcon icon={icon} className="mr-2 text-blue-500" />
    <span className="font-bold">{value}</span>
  </div>
);

export default WeatherDisplay;
