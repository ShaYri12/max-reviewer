import React, { useEffect, useRef, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(true);
  const [error, setError] = useState(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.name) {
        onPlaceSelect(place);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) return;
      inputRef.current?.blur();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoad = (ref) => {
    autocompleteRef.current = ref;
    setIsLoaded(true);
    setError(null);
  };

  const handleError = () => {
    setIsLoaded(false);
    setError("Failed to load Google Maps API. Please try again later.");
  };

  // iOS में touch events को बेहतर handle करने के लिए नया function
  const handleFocus = (e) => {
    // Prevent zoom on iOS
    const viewportMeta = document.querySelector('meta[name=viewport]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
      document.head.appendChild(meta);
    } else {
      viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    }
    
    // Force input to receive focus
    e.target.focus();
  };

  if (!isLoaded || error) {
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
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
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
          onFocus={handleFocus}
          disabled={disabled}
          placeholder="Search for a place"
          className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
          style={{
            '-webkit-appearance': 'none',
            '-webkit-border-radius': '8px',
            'font-size': '16px', // Prevents iOS zoom
          }}
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
