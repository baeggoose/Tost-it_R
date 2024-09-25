import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface PomodoroTimerProps {
  onClose: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onClose }) => {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isTimerEnded, setIsTimerEnded] = useState<boolean>(false);
  const [resetColor, setResetColor] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<{
    hours: number;
    minutes: number;
  }>({
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
        const currentTime = minutes * 60 + seconds;
        const newProgress = (currentTime / totalTime) * 100;
        setProgress(newProgress);
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      setIsActive(false);
      setIsTimerEnded(true);
      // 시간이 끝나면 원의 색깔이 리셋 버튼과 같은 색이 되지만 시간은 계속 +되어 측정이 가능하다
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, totalTime]);

  const handleStart = () => {
    setTotalTime(selectedTime.hours * 3600 + selectedTime.minutes * 60);
    setIsActive(true);
    setIsTimerEnded(false);
    setResetColor(false);
  };
  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setMinutes(selectedTime.hours * 60 + selectedTime.minutes);
    setSeconds(0);
    setIsActive(false);
    setIsTimerEnded(false);
    setProgress(100);
    setResetColor(true);
  };

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: "hour" | "minute"
  ) => {
    const value = Number(event.target.value);
    if (type === "hour") {
      setSelectedTime((prev) => ({ ...prev, hours: value }));
      setMinutes(value * 60 + selectedTime.minutes);
    } else {
      setSelectedTime((prev) => ({ ...prev, minutes: value }));
      setMinutes(selectedTime.hours * 60 + value);
    }
    setSeconds(0);
    // setTotalTime(selectedTime.hours * 3600 + selectedTime.minutes * 60);
    setProgress(100);
    setIsTimerEnded(false);
    setResetColor(false);
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Pomodoro Timer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#e0e0e0"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={resetColor ? "#f87171" : isActive ? "#3b82f6" : "#eab308"}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </div>
        </div>

        {isTimerEnded && (
          <div className="mt-4 text-red-500 text-center">
            타이머가 종료되었습니다!
          </div>
        )}

        <div className="mt-6 space-y-2">
          <label htmlFor="timeSelect" className="block text-sm font-medium">
            시간 설정:
          </label>
          <div className="flex space-x-2">
            <select
              id="hourSelect"
              onChange={(e) => handleTimeChange(e, "hour")}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md"
            >
              {[...Array(24)].map((_, hour) => (
                <option key={hour} value={hour}>
                  {hour}시간
                </option>
              ))}
            </select>
            <select
              id="minuteSelect"
              onChange={(e) => handleTimeChange(e, "minute")}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md"
            >
              {[...Array(60)].map((_, min) => (
                <option key={min} value={min}>
                  {min}분
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={handleStart}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
          >
            Start
          </button>
          <button
            onClick={handlePause}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition"
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
