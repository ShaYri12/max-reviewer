"use client";

import { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ChevronDown } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function MonthlyChart({ initialData, onPeriodChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Últimos 3 meses");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onPeriodChange(option);
  };

  const currentChartData = {
    labels: initialData.data.map((item) =>
      selectedOption === "Últimos años" ? item.year : item.month
    ),
    datasets: [
      {
        data: initialData.data.map((item) => item.value),
        borderColor: "#FFD700",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        pointBorderColor: "#FFD700",
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 20,
        left: 10,
        right: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: "bold",
          },
          color: "#6C7278",
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => (value > -1 ? value.toFixed(0) : ""),
          font: {
            size: 10,
          },
          color: (context) =>
            context.tick.value > -1 ? "#6C7278" : "rgba(0,0,0,0)",
          padding: 10,
        },
        grid: {
          color: (context) =>
            context.tick.value > -1 ? "#71C9EDD9" : "rgba(0,0,0,0)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        displayColors: false,
      },
    },
  };

  const updateYAxisOptions = () => {
    const values = initialData.data.map((item) => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = Math.max(maxValue - minValue, 1);
    const padding = Math.max(range * 0.2, 1);

    const desiredSteps = 5;
    const rawStepSize = (range + 2 * padding) / desiredSteps;
    const stepSize = Math.max(Math.ceil(rawStepSize), 1);

    const adjustedMin = -padding; // Allow negative values for padding
    const adjustedMax = Math.ceil(maxValue + padding);

    options.scales.y.min = adjustedMin;
    options.scales.y.max =
      adjustedMax + (stepSize - ((adjustedMax - adjustedMin) % stepSize));
    options.scales.y.ticks.stepSize = stepSize;
  };

  updateYAxisOptions();

  useEffect(() => {
    updateYAxisOptions();
  }, [initialData, selectedOption]);

  return (
    <div className="w-full">
      <div className="rounded-[20px] border-[4px] border-[#71C9ED] bg-white px-5 py-8">
        <div className="px-2">
          <div className="relative mb-8" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between rounded-[12px] border-[2.5px] border-[#71C9ED] px-3 py-2 text-[#6C7278] text-[16px] font-[600]"
            >
              <span className="leading-[25px]">{selectedOption}</span>
              <ChevronDown
                strokeWidth={2.5}
                className={`w-7 h-7 transition-transform text-[#6C7278] ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                <div className="py-1">
                  {[
                    "Últimos 3 meses",
                    "Últimos 6 meses",
                    "Último año",
                    "Últimos años",
                  ].map((option) => (
                    <button
                      key={option}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 text-[#6C7278] text-base"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-[260px] -mx-2">
          <Line data={currentChartData} options={options} />
        </div>
      </div>
    </div>
  );
}
