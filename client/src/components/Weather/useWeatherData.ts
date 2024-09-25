import { useState, useEffect } from "react";
import { fetchWeatherData } from "../../API/weatherAPI";
import { useLocation } from "./useLocation";
import { WeatherData } from "../../types/weather";

export const useWeatherData = (isOpen: boolean) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
  } = useLocation(isOpen);

  useEffect(() => {
    if (isOpen && location && !isLocationLoading && !locationError) {
      setIsLoading(true);
      setError(null);
      fetchWeatherData(location.nx, location.ny)
        .then(setWeatherData)
        .catch((err) => {
          console.error("날씨 데이터 가져오기 실패:", err);
          setError(
            err.message ||
              "날씨 데이터를 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요."
          );
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, location, isLocationLoading, locationError]);

  return { weatherData, isLoading, error };
};
