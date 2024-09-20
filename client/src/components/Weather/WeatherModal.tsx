import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useWeatherData } from "./useWeatherData";
import WeatherDisplay from "./WeatherDisplay";

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose }) => {
  const { weatherData, isLoading, error } = useWeatherData(isOpen);

  if (!isOpen) return null;

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
        <WeatherDisplay
          weatherData={weatherData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default WeatherModal;
