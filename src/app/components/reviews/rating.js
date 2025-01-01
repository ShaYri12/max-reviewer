import React from "react";

const Rating = ({ averageReview }) => {
  // Function to adjust the averageReview based on the conditions
  const adjustAverageReview = (review) => {
    const decimalPart = review % 1;

    if (decimalPart > 0.8 && decimalPart < 0.99) {
      return Math.floor(review) + decimalPart - 0.2; // Subtract 0.15 if decimal is between 0.80 and 0.99
    } else if (decimalPart > 0.7 && decimalPart < 0.8) {
      return Math.floor(review) + decimalPart - 0.12; // Subtract 0.10 if decimal is between 0.70 and 0.80
    } else if (decimalPart > 0.6 && decimalPart < 0.7) {
      return Math.floor(review) + decimalPart - 0.08; // Subtract 0.05 if decimal is between 0.50 and 0.60
    } else if (decimalPart > 0.5 && decimalPart < 0.6) {
      return Math.floor(review) + decimalPart - 0.03; // Subtract 0.05 if decimal is between 0.50 and 0.60
    }

    return review; // Return original if no conditions are met
  };

  const adjustedReview = adjustAverageReview(averageReview);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFullStar = star <= Math.floor(adjustedReview); // Full stars
        const isPartialStar =
          star === Math.ceil(adjustedReview) && adjustedReview % 1 !== 0; // Partial star
        const partialWidth = (adjustedReview % 1) * 100; // Percentage for partial star

        return (
          <svg
            key={star}
            className="w-[26px] h-[26px]"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Full Star Outline (always present and fully created) */}
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill="#6c72788a" // Gray for outline
            />

            {/* Full or Partial Star (yellow for filled part) */}
            {(isFullStar || isPartialStar) && (
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                fill="#FEDA00" // Yellow for filled part
                clipPath={isPartialStar ? `url(#partial-${star})` : ""}
              />
            )}

            {/* ClipPath for Partial Star */}
            {isPartialStar && (
              <defs>
                <clipPath id={`partial-${star}`}>
                  <rect x="0" y="0" width={`${partialWidth}%`} height="20" />
                </clipPath>
              </defs>
            )}
          </svg>
        );
      })}
    </div>
  );
};

export default Rating;
