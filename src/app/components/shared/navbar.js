"use client";
import { useState } from "react";
import ProfileDropdown from "./profile-dropdown";
import Sidebar from "./sidebar";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div>
      <header className="flex z-50 justify-between items-center px-4 py-1">
        <div className="flex items-center gap-3">
          <button
            className="text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <img
              src="/bars.svg"
              className="w-[30px] h-[30px] object-contain overflow-hidden"
            />
          </button>
          <img src="/logo.png" alt="MaxReviewer Logo" className="h-8" />
        </div>
        <ProfileDropdown />
      </header>
      {isSidebarOpen && (
        <div
          id="backdrop"
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={handleBackdropClick}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default Navbar;
