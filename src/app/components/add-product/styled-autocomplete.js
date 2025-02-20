"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Autocomplete } from "@react-google-maps/api";

const StyledAutocomplete = ({
  value,
  onChange,
  name,
  onPlaceSelect,
  autocompleteRef,
  disabled,
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.name) {
        onPlaceSelect(place);
      }
    }
  };

  const closeDropdown = useCallback(() => {
    if (autocompleteRef.current) {
      // Force close the dropdown
      autocompleteRef.current.setOptions({ types: [] });
      autocompleteRef.current.set("place", null);
    }
    // Hide the pac-container
    const pacContainer = document.querySelector(".pac-container");
    if (pacContainer) {
      pacContainer.style.visibility = "hidden";
    }
    // Blur the input
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [autocompleteRef]);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        closeDropdown();
      }, 100);
    };

    const handleTouchMove = (e) => {
      if (!inputRef.current.contains(e.target)) {
        handleScroll();
      }
    };

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    // Delay adding scroll listeners to avoid interference with initial focus
    const timer = setTimeout(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }, 500);

    document.addEventListener("click", handleClickOutside);

    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [closeDropdown]);

  const handleLoad = (ref) => {
    autocompleteRef.current = ref;
    setError(null);
  };

  const handleError = () => {
    setError("Failed to load Google Maps API. Please try again later.");
  };

  const handleInputFocus = () => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setOptions({
        types: ["establishment"],
        fields: ["name", "formatted_address"],
      });
    }
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    inputRef.current.focus();
  };

  if (error) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="Enter a location"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <Autocomplete
        onLoad={handleLoad}
        onError={handleError}
        onPlaceChanged={handlePlaceChanged}
        options={{
          types: ["establishment"],
          fields: ["name", "formatted_address"],
        }}
      >
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          disabled={disabled}
          placeholder="Search for a place"
          className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
        />
      </Autocomplete>
      <style jsx global>{`
        .pac-container {
          border-radius: 0.5rem;
          margin-top: 4px;
          border: 1px solid #71c9ed;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          background-color: white;
          font-family: inherit;
        }

        .pac-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-family: inherit;
          border-top: 1px solid #e5e7eb;
        }

        .pac-item:first-child {
          border-top: none;
        }

        .pac-item:hover {
          background-color: #f3f9fb;
        }

        .pac-item-query {
          font-size: 0.875rem;
          color: #17375f;
          font-weight: 500;
        }

        .pac-matched {
          color: #17375f;
          font-weight: 600;
        }

        .pac-icon {
          display: none;
        }

        .pac-item-selected {
          background-color: #f3f9fb;
        }

        .pac-description {
          font-size: 0.75rem;
          color: #6c7278;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default StyledAutocomplete;
