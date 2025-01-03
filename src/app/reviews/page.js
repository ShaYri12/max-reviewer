"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/shared/navbar";
import Footer from "../components/shared/footer";
import Rating from "../components/reviews/rating";
import withAuth from "../utils/with-authenticated";
import MonthlyChart from "../components/reviews/monthly-chart";

// Generate mock data for 12 months
const generateMockData = () => {
  const mockData = { totalReviews: 0, overallRating: 0, starCounts: {} };
  const today = new Date();

  // Generate data for last 12 months
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate 2-5 reviews per day with random ratings
    const dailyReviewCount = Math.floor(Math.random() * 4) + 2;

    for (let j = 0; j < dailyReviewCount; j++) {
      // Weight ratings towards higher scores (more realistic)
      const weights = [0.05, 0.1, 0.15, 0.3, 0.4]; // 5% 1-star, 40% 5-star
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

// Helper function to process reviews data
const processReviewsData = (data, monthsToFilter) => {
  const currentDate = new Date();
  const filterDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - monthsToFilter + 1,
    1
  );

  // Filter reviews based on date range
  const filteredReviews = Object.entries(data.starCounts).filter(
    ([_, review]) => {
      const reviewDate = new Date(review.day);
      return reviewDate >= filterDate && reviewDate <= currentDate;
    }
  );

  // Calculate total reviews directly from filtered reviews
  const totalReviews = filteredReviews.length;

  // Calculate rating statistics from filtered reviews
  const ratingStats = filteredReviews.reduce(
    (acc, [_, review]) => {
      const rating = Number(review.Rating);
      acc.sum += rating;
      acc.counts[rating] = (acc.counts[rating] || 0) + 1;
      return acc;
    },
    { sum: 0, counts: {} }
  );

  // Calculate average rating
  const averageRating = ratingStats.sum / totalReviews;

  // Convert rating counts to percentages
  const ratings = Object.entries(ratingStats.counts)
    .map(([stars, count]) => ({
      stars: Number(stars),
      percentage: Math.round((count / totalReviews) * 100),
    }))
    .sort((a, b) => b.stars - a.stars);

  // Fill in any missing ratings with 0%
  const allRatings = [1, 2, 3, 4, 5]
    .map((stars) => ({
      stars,
      percentage: ratings.find((r) => r.stars === stars)?.percentage || 0,
    }))
    .sort((a, b) => b.stars - a.stars);

  // Group reviews by month and year for chart data
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

  // Generate chart data ensuring all months are included
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

  // Verify total reviews matches sum of monthly reviews
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

const ReviewPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(3); // Default to 3 months
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/reviews"); // Replace with your API endpoint

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate data structure
        if (!data.data?.starCounts) {
          throw new Error("Invalid data structure received from API");
        }
        setRawData(data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.message);

        // Use mock data as fallback
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17375F] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-[#17375F] flex items-center justify-center">
        <div className="text-white">No data available</div>
      </div>
    );
  }

  const periodOptions = {
    "Últimos 3 meses": 3,
    "Últimos 6 meses": 6,
    "Último año": 12,
  };

  return (
    <div className="min-h-screen bg-[#17375F]">
      <Navbar />

      <div className="fixed inset-x-4 top-[80px] bottom-0">
        <div className="h-full overflow-auto bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
          {error && (
            <div className="px-6 py-2 bg-yellow-50 text-yellow-700 text-sm">
              Using sample data due to API error
            </div>
          )}
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg text-[#6C7278] font-semibold">
                Reviews totales: {reviewData.totalReviews}
              </h1>
              <button onClick={() => router.back()} className="text-[#6DC1E6]">
                <img src="/close.svg" alt="Close" width={20} height={20} />
              </button>
            </div>

            <div className="flex gap-5">
              <div className="space-y-2 w-[60%]">
                {reviewData.ratings.map(({ stars, percentage }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-2 text-xs font-[400] text-[#6C7278]">
                      {stars}
                    </span>
                    <div className="flex-1 h-[4px] bg-[#D9D9D9] overflow-hidden">
                      <div
                        className="h-full bg-[#FFDD4C] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center text-center w-[35%] mt-[-6px]">
                <div className="text-[21px] text-[#6C7278] font-light">
                  Calificación
                </div>
                <div className="text-6xl font-[500] text-[#6C7278]">
                  {reviewData.averageRating.toFixed(2)}
                </div>
                <div className="flex justify-center gap-1 mt-[2px]">
                  <Rating averageReview={reviewData.averageRating} />
                </div>
              </div>
            </div>

            <MonthlyChart
              initialData={reviewData}
              onPeriodChange={(period) =>
                setSelectedPeriod(periodOptions[period])
              }
            />
          </div>

          <footer className="mt-auto p-4 bg-none text-center">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ReviewPage);
