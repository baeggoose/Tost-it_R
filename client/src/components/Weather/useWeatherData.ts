import { useState, useEffect } from "react";
import { fetchWeatherData } from "../../API/weatherAPI";
import { useLocation } from "./useLocation";
import { WeatherData } from "../../types/weather";

export const useWeatherData = (isOpen: boolean) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation(isOpen);

  useEffect(() => {
    if (isOpen && location) {
      setIsLoading(true);
      setError(null);
      fetchWeatherData(location.nx, location.ny)
        .then(setWeatherData)
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, location]);

  return { weatherData, isLoading, error };
};
