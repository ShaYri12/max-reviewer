import React from "react";

const Rating = () => {
  const ratingValue = 4.87; // Example rating

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFullStar = star <= Math.floor(ratingValue); // Full stars
        const isPartialStar = star === Math.ceil(ratingValue); // Partial star
        const partialWidth = (ratingValue % 1) * 100; // Percentage for partial star

        return (
          <svg
            key={star}
            className="w-[26px] h-[26px]"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Star Outline */}
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill="#E0E0E0" // Gray for background
            />

            {/* Full or Partial Star */}
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
