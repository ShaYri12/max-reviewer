// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Autocomplete } from "@react-google-maps/api";

// const StyledAutocomplete = ({
//   value,
//   onChange,
//   name,
//   onPlaceSelect,
//   autocompleteRef,
//   disabled,
// }) => {
//   const inputRef = useRef(null);
//   const [error, setError] = useState(null);
//   const containerRef = useRef(null);

//   const handlePlaceChanged = () => {
//     if (autocompleteRef.current) {
//       const place = autocompleteRef.current.getPlace();
//       if (place.name) {
//         onPlaceSelect(place);
//       }
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target)
//       ) {
//         if (event.target !== inputRef.current) {
//           inputRef.current?.blur();
//         }
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (inputRef.current) {
//         inputRef.current.blur();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const handleLoad = (autocomplete) => {
//     if (autocompleteRef && typeof autocompleteRef === "object") {
//       autocompleteRef.current = autocomplete;
//     }
//     setError(null);
//   };

//   const handleError = () => {
//     setError("Failed to load Google Maps API. Please try again later.");
//   };

//   const handleInputTouch = (event) => {
//     event.stopPropagation();
//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 100);
//   };

//   if (error) {
//     return (
//       <div className="space-y-2">
//         <input
//           type="text"
//           name={name}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           placeholder="Enter a location"
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//         <div
//           className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//           role="alert"
//         >
//           <strong className="font-bold">Error!</strong>
//           <span className="block sm:inline"> {error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative" ref={containerRef} onTouchEnd={handleInputTouch}>
//       <Autocomplete
//         onLoad={handleLoad}
//         onError={handleError}
//         onPlaceChanged={handlePlaceChanged}
//         options={{
//           types: ["establishment"],
//           fields: ["name", "formatted_address"],
//         }}
//       >
//         <input
//           ref={inputRef}
//           type="text"
//           name={name}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           placeholder="Search for a place"
//           className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
//         />
//       </Autocomplete>
//       <style jsx global>{`
//         .pac-container {
//           border-radius: 0.5rem;
//           margin-top: 4px;
//           border: 1px solid #71c9ed;
//           box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
//           background-color: white;
//           font-family: inherit;
//         }
//         .pac-item {
//           padding: 0.75rem 1rem;
//           cursor: pointer;
//           font-family: inherit;
//           border-top: 1px solid #e5e7eb;
//         }
//         .pac-item:first-child {
//           border-top: none;
//         }
//         .pac-item:hover {
//           background-color: #f3f9fb;
//         }
//         .pac-item-query {
//           font-size: 0.875rem;
//           color: #17375f;
//           font-weight: 500;
//         }
//         .pac-matched {
//           color: #17375f;
//           font-weight: 600;
//         }
//         .pac-icon {
//           display: none;
//         }
//         .pac-item:focus {
//           @apply bg-primary/10 outline-none;
//         }
//         .pac-item-selected {
//           background-color: #f3f9fb;
//         }
//         .pac-description {
//           font-size: 0.75rem;
//           color: #6c7278;
//           margin-top: 0.25rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StyledAutocomplete;

"use client";

import { useEffect, useRef, useState } from "react";
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
  const autocompleteInstance = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ensureFocus = () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    };

    inputRef.current?.addEventListener("touchend", ensureFocus);

    return () => {
      inputRef.current?.removeEventListener("touchend", ensureFocus);
    };
  }, []);

  // Modified scroll behavior: opacity and pointer-events
  useEffect(() => {
    let scrollTimeout;
    const hideSuggestionsOnScroll = () => {
      if (autocompleteInstance.current) {
        // Clear any existing timeout
        clearTimeout(scrollTimeout);

        // Get the current place predictions panel
        const predictionsPanel = document.querySelector(".pac-container");
        if (predictionsPanel) {
          // Hide the predictions panel using opacity and pointer-events
          predictionsPanel.style.opacity = "0";
          predictionsPanel.style.pointerEvents = "none";
        }

        // Show predictions panel again after scroll stops
        scrollTimeout = setTimeout(() => {
          if (predictionsPanel) {
            predictionsPanel.style.opacity = "1";
            predictionsPanel.style.pointerEvents = "auto";
          }
        }, 100);
      }
    };

    window.addEventListener("scroll", hideSuggestionsOnScroll);

    return () => {
      window.removeEventListener("scroll", hideSuggestionsOnScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleLoad = (autocomplete) => {
    autocompleteInstance.current = autocomplete;
    if (autocompleteRef && typeof autocompleteRef === "object") {
      autocompleteRef.current = autocomplete;
    }
    setError(null);
  };

  const handleError = () => {
    setError("Failed to load Google Maps API. Please try again later.");
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.name) {
        onPlaceSelect(place);
      }
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
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
          disabled={disabled}
          placeholder="Search for a place"
          className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
        />
      </Autocomplete>
    </div>
  );
};

export default StyledAutocomplete;
