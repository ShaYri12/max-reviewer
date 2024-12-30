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

const data = [
  { month: "Ene", value: 115 },
  { month: "Feb", value: 140 },
  { month: "Mar", value: 100 },
];

export default function MonthlyChart() {
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
  };

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        data: data.map((item) => item.value),
        borderColor: "#FFD700",
        backgroundColor: "white", // This ensures the line connecting points is not filled
        pointBackgroundColor: "white", // This makes the points hollow
        pointBorderColor: "#FFD700", // This is the color of the point's border
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        borderWidth: 2,
        tension: 0,
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
        tension: 0,
      },
      point: {
        radius: 6,
        borderWidth: 2,
        backgroundColor: "white", // This makes the inside of the circle white (hollow)
        borderColor: "#FFD700", // This is the color of the circle's border
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
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-[#6C7278] text-base"
                    onClick={() => handleOptionSelect("Últimos 3 meses")}
                  >
                    Últimos 3 meses
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-[#6C7278] text-base"
                    onClick={() => handleOptionSelect("Últimos 6 meses")}
                  >
                    Últimos 6 meses
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-[#6C7278] text-base"
                    onClick={() => handleOptionSelect("Último año")}
                  >
                    Último año
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Graph */}
        <div className="h-[260px] -mx-2">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
