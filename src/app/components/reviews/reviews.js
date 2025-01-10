"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";
import Rating from "./rating";
import withAuth from "../../utils/with-authenticated";
import MonthlyChart from "./monthly-chart";

const generateMockData = () => {
  const mockData = { totalReviews: 0, overallRating: 0, starCounts: {} };
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dailyReviewCount = Math.floor(Math.random() * 4) + 2;

    for (let j = 0; j < dailyReviewCount; j++) {
      const weights = [0.05, 0.1, 0.15, 0.3, 0.4];
      const random = Math.random();
      let rating = 1;
      let sum = 0;

      for (let k = 0; k < weights.length; k++) {
        sum += weights[k];
        if (random <= sum) {
          rating = k + 1;
          break;
        }
      }

      const key = `review_${i}_${j}`;
      mockData.starCounts[key] = {
        Rating: rating.toString(),
        day: date.toISOString().split("T")[0],
      };
    }
  }

  return mockData;
};

const processReviewsData = (data, monthsToFilter) => {
  const currentDate = new Date();
  const filterDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - monthsToFilter + 1,
    1
  );

  const filteredReviews = Object.entries(data.starCounts).filter(
    ([_, review]) => {
      const reviewDate = new Date(review.day);
      return reviewDate >= filterDate && reviewDate <= currentDate;
    }
  );

  const totalReviews = filteredReviews.length;

  const ratingStats = filteredReviews.reduce(
    (acc, [_, review]) => {
      const rating = Number(review.Rating);
      acc.sum += rating;
      acc.counts[rating] = (acc.counts[rating] || 0) + 1;
      return acc;
    },
    { sum: 0, counts: {} }
  );

  const averageRating = ratingStats.sum / totalReviews;

  const ratings = Object.entries(ratingStats.counts)
    .map(([stars, count]) => ({
      stars: Number(stars),
      percentage: Math.round((count / totalReviews) * 100),
    }))
    .sort((a, b) => b.stars - a.stars);

  const allRatings = [1, 2, 3, 4, 5]
    .map((stars) => ({
      stars,
      percentage: ratings.find((r) => r.stars === stars)?.percentage || 0,
    }))
    .sort((a, b) => b.stars - a.stars);

  const monthlyReviews = filteredReviews.reduce((acc, [_, review]) => {
    const date = new Date(review.day);
    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = {
        count: 0,
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
      };
    }

    acc[monthYear].count++;
    return acc;
  }, {});

  const chartData = [];
  for (let i = monthsToFilter - 1; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const monthName = date.toLocaleString("default", { month: "short" });

    chartData.push({
      month: monthName,
      value: monthlyReviews[monthYear]?.count || 0,
      year: date.getFullYear(),
    });
  }

  const chartTotal = chartData.reduce((sum, month) => sum + month.value, 0);
  if (chartTotal !== totalReviews) {
    console.error("Review count mismatch:", { chartTotal, totalReviews });
  }

  return {
    totalReviews,
    averageRating: isNaN(averageRating) ? 0 : averageRating,
    ratings: allRatings,
    data: chartData,
  };
};

const ReviewPage = ({ dashboard = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [reviewData, setReviewData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/reviews");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.data?.starCounts) {
          throw new Error("Invalid data structure received from API");
        }
        setRawData(data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(true);

        const mockData = generateMockData();
        setRawData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (rawData) {
      const processedData = processReviewsData(rawData, selectedPeriod);
      setReviewData(processedData);
    }
  }, [selectedPeriod, rawData]);

  useEffect(() => {
    let timer;
    if (loading || !reviewData) {
      timer = setTimeout(() => {
        setShowError(true);
      }, 3000); // 30 seconds
    } else {
      setShowError(false);
    }

    return () => clearTimeout(timer); // Clean up the timer
  }, [loading, !reviewData]);

  const periodOptions = {
    "Últimos 3 meses": 3,
    "Últimos 6 meses": 6,
    "Último año": 12,
  };

  return (
    <div className="h-dvh bg-[#17375F] overflow-y-hidden">
      <Navbar />

      <div className="fixed inset-x-4 top-[80px] bottom-0">
        <div className="relative h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
          {error && showError && (
            <div className="absolute inset-0 z-[99] flex items-center justify-center bg-white bg-opacity-40 rounded-t-xl px-4">
              <p className="text-red-500 text-lg font-bold text-center">
                Something went wrong. Please try again later.
              </p>
            </div>
          )}
          <div className="p-6 space-y-8 h-full overflow-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-lg text-[#6C7278] font-semibold flex items-center gap-[6px]">
                Reviews totales:{" "}
                {loading || !reviewData ? (
                  <div className="h-5 w-8 bg-gray-200 animate-pulse rounded-sm"></div>
                ) : (
                  <span>{reviewData.totalReviews}</span>
                )}
              </h1>
              {!dashboard && (
                <button
                  onClick={() => router.back()}
                  className="text-[#6DC1E6] relative z-[999]"
                >
                  <img src="/close.svg" alt="Close" width={20} height={20} />
                </button>
              )}
            </div>

            <div className="flex gap-5">
              <div className="space-y-2 w-[60%]">
                {(loading || !reviewData
                  ? Array.from({ length: 5 })
                  : reviewData.ratings
                ).map((item, index) =>
                  loading || !reviewData ? (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-2 text-xs font-[400] text-[#6C7278]">
                        {5 - index}
                      </span>
                      <div className="h-1 flex-1 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ) : (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="w-2 text-xs font-[400] text-[#6C7278]">
                        {item.stars}
                      </span>
                      <div className="flex-1 h-[4px] bg-[#D9D9D9] overflow-hidden">
                        <div
                          className="h-full bg-[#FFDD4C] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-col items-center justify-center text-center w-[35%] mt-[-6px]">
                <div className="text-[21px] text-[#6C7278] font-light">
                  Calificación
                </div>
                {loading || !reviewData ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 mb-2 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-6xl font-[500] text-[#6C7278]">
                      {reviewData.averageRating.toFixed(2)}
                    </div>
                    <div className="flex justify-center gap-1 mt-[2px]">
                      <Rating averageReview={reviewData.averageRating} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loading || !reviewData ? (
              <div className="rounded-[20px] border-[4px] border-[#71C9ED] bg-white px-5 py-8">
                <div className="px-2">
                  <div className="h-[48px] w-full bg-gray-200 animate-pulse rounded mx-auto mb-8"></div>
                </div>
                <div className="h-[200px] w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : (
              <MonthlyChart
                initialData={reviewData}
                onPeriodChange={(period) =>
                  setSelectedPeriod(periodOptions[period])
                }
              />
            )}
            <div className="min-h-[5px] h-[5px] w-full flex"></div>
          </div>
          <footer className="absolute bottom-0 left-0 p-4 bg-white w-full text-center">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ReviewPage);
