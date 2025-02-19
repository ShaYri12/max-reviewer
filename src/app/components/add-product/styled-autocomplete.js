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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.name) {
        onPlaceSelect(place);
      }
    }
    setIsDropdownOpen(false);
  };

  const closeDropdown = useCallback(() => {
    if (autocompleteRef.current && isDropdownOpen) {
      autocompleteRef.current.setTypes([]);
      setIsDropdownOpen(false);
    }
  }, [isDropdownOpen, autocompleteRef]);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    const handleScroll = (event) => {
      if (isMobile && isDropdownOpen) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const isVisible =
          inputRect.top >= 0 &&
          inputRect.left >= 0 &&
          inputRect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          inputRect.right <=
            (window.innerWidth || document.documentElement.clientWidth);
        if (!isVisible) {
          closeDropdown();
        }
      } else if (!isMobile && !containerRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [closeDropdown, isMobile, isDropdownOpen]);

  const handleLoad = (ref) => {
    autocompleteRef.current = ref;
    setError(null);
  };

  const handleError = () => {
    setError("Failed to load Google Maps API. Please try again later.");
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing the dropdown to allow for item selection
    setTimeout(() => {
      if (!isDropdownOpen) return;
      closeDropdown();
    }, 150);
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
          onBlur={handleInputBlur}
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
