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
  const [isAndroidChrome, setIsAndroidChrome] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.name) {
        onPlaceSelect(place);
      }
    }
  };

  const closeDropdown = useCallback(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setTypes([]); // Close the dropdown
    }
    if (isMobile) {
      // On mobile, we need to blur the input to close the keyboard
      inputRef.current?.blur();
    }
  }, [autocompleteRef, isMobile]);

  useEffect(() => {
    setIsAndroidChrome(
      /Android/i.test(navigator.userAgent) &&
        /Chrome/i.test(navigator.userAgent)
    );
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    const handleScroll = () => {
      closeDropdown();
    };

    const handleTouchMove = (e) => {
      closeDropdown();
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [closeDropdown, isAndroidChrome, isMobile]);

  const handleLoad = (ref) => {
    autocompleteRef.current = ref;
    setError(null);
  };

  const handleError = () => {
    setError("Failed to load Google Maps API. Please try again later.");
  };

  const handleInputFocus = () => {
    // Ensure the dropdown is open when the input is focused
    if (autocompleteRef.current) {
      autocompleteRef.current.setTypes(["establishment"]);
    }
  };

  const handleTouchStart = (e) => {
    // Prevent default behavior for touch events on mobile
    if (isMobile) {
      e.preventDefault();
    }
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
          onTouchStart={handleTouchStart}
          disabled={disabled}
          placeholder="Search for a place"
          className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
        />
      </Autocomplete>
      <style jsx global>{`
        /* ... (styles remain unchanged) ... */
      `}</style>
    </div>
  );
};

export default StyledAutocomplete;
