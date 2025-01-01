"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/shared/navbar";
import Footer from "../components/shared/footer";
import Rating from "../components/reviews/rating";
import withAuth from "../utils/with-authenticated";
import MonthlyChart from "../components/reviews/monthly-chart";

const ReviewPage = () => {
  const router = useRouter();
  const [reviewData, setReviewData] = useState({
    totalReviews: 355,
    averageRating: 4.87,
    ratings: [
      { stars: 5, percentage: 90 },
      { stars: 4, percentage: 7 },
      { stars: 3, percentage: 2 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 0 },
    ],
  });

  const handleDataChange = (newData) => {
    setReviewData({
      totalReviews: newData.totalReviews,
      averageRating: newData.averageRating,
      ratings: newData.ratings,
    });
  };

  return (
    <div className="min-h-screen bg-[#17375F]">
      <Navbar />

      <div className="fixed inset-x-4 top-[80px] bottom-0">
        <div className="h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
          <div className="overflow-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg text-[#6C7278] font-semibold">
                Reviews totales: {reviewData.totalReviews}
              </h1>
              <button onClick={() => router.back()} className="text-[#6DC1E6]">
                <img src="/close.svg" alt="Close" width={20} height={20} />
              </button>
            </div>
            <div className="flex gap-5 ">
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
              <div className="flex flex-col  items-center justify-center text-center w-[35%] mt-[-6px]">
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

            <MonthlyChart onDataChange={handleDataChange} />
          </div>

          {/* Footer */}
          <footer className="mt-auto p-4 text-center">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ReviewPage);
