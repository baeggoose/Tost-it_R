import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useWeatherData } from "./useWeatherData";
import WeatherDisplay from "./WeatherDisplay";
import { useReverseGeocoding } from "./useReverseGeocoding";
import { useLocation } from "./useLocation";

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose }) => {
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
  } = useLocation(isOpen);
  const {
    weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeatherData(isOpen);

  const address = useReverseGeocoding(
    location?.latitude ?? 0,
    location?.longitude ?? 0
  );

  useEffect(() => {
    console.log("Location:", location);
    console.log("Address:", address);
  }, [location, address]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full xs:p-4 mb:p-5 sm:p-6 xs:max-w-xs mb:max-w-sm sm:max-w-sm">
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
        <span>
          {isLocationLoading || !location
            ? "위치 불러오는 중..."
            : locationError
            ? locationError
            : address
            ? address
            : "주소를 가져올 수 없습니다"}
        </span>
        <WeatherDisplay
          weatherData={weatherData}
          isLoading={isWeatherLoading}
          error={weatherError}
        />
      </div>
    </div>
  );
};

export default WeatherModal;
