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

const chartData = {
  "Últimos 3 meses": {
    data: [
      { month: "Ene", value: 115 },
      { month: "Feb", value: 140 },
      { month: "Mar", value: 100 },
    ],
    totalReviews: 355, // Corrected total
    averageRating: 4.87,
    ratings: [
      { stars: 5, percentage: 90 },
      { stars: 4, percentage: 7 },
      { stars: 3, percentage: 2 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 0 },
    ],
  },
  "Últimos 6 meses": {
    data: [
      { month: "Oct", value: 90 },
      { month: "Nov", value: 105 },
      { month: "Dic", value: 125 },
      { month: "Ene", value: 115 },
      { month: "Feb", value: 140 },
      { month: "Mar", value: 100 },
    ],
    totalReviews: 675, // Corrected total
    averageRating: 4.5,
    ratings: [
      { stars: 5, percentage: 80 },
      { stars: 4, percentage: 15 },
      { stars: 3, percentage: 3 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 1 },
    ],
  },
  "Último año": {
    data: [
      { month: "Abr", value: 80 },
      { month: "May", value: 95 },
      { month: "Jun", value: 110 },
      { month: "Jul", value: 130 },
      { month: "Ago", value: 145 },
      { month: "Sep", value: 135 },
      { month: "Oct", value: 90 },
      { month: "Nov", value: 105 },
      { month: "Dic", value: 125 },
      { month: "Ene", value: 115 },
      { month: "Feb", value: 140 },
      { month: "Mar", value: 100 },
    ],
    totalReviews: 1275, // Corrected total
    averageRating: 4.63,
    ratings: [
      { stars: 5, percentage: 90 },
      { stars: 4, percentage: 7 },
      { stars: 3, percentage: 2 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 0 },
    ],
  },
};

export default function MonthlyChart({ onDataChange }) {
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
    onDataChange(chartData[option]);
  };

  const currentChartData = {
    labels: chartData[selectedOption].data.map((item) => item.month),
    datasets: [
      {
        data: chartData[selectedOption].data.map((item) => item.value),
        borderColor: "#FFD700",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        pointBorderColor: "#FFD700",
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        min: 0,
        max: 150,
        ticks: {
          stepSize: 25,
          font: {
            size: 10,
          },
          color: "#6C7278",
        },
        grid: {
          color: "#71C9EDD9",
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
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 6,
        borderWidth: 2,
        backgroundColor: "white",
        borderColor: "#FFD700",
        hoverBackgroundColor: "#FFD700",
        hoverBorderColor: "#FFD700",
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
  };

  return (
    <div className="w-full">
      <div className="rounded-[20px] border-[4px] border-[#71C9ED] bg-white px-5 py-8">
        {/* Dropdown Button */}
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

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                <div className="py-1">
                  {Object.keys(chartData).map((option) => (
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

        {/* Graph */}
        <div className="h-[260px] -mx-2">
          <Line data={currentChartData} options={options} />
        </div>
      </div>
    </div>
  );
}
