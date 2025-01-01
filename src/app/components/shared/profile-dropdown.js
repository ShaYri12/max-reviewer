"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.push("signup");
    localStorage.removeItem("token");
  };

  return (
    <div className="relative z-[20]" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-white">
        <img
          src="/profile.svg"
          className={`w-[65px] h-[65px] rounded-t-lg p-4 object-contain overflow-hidden ${
            isOpen ? "hidden" : ""
          }`}
        />
        <img
          src="/profile-blue.svg"
          className={`${
            isOpen ? "" : "hidden"
          } w-[65px] h-[65px] bg-[#E6E6E6] text-[#17375F] rounded-t-lg p-4 object-contain overflow-hidden`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-16 bg-[#E6E6E6] rounded-tl-xl rounded-b-xl shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#6DC1E6] rounded-lg p-2 flex items-center justify-center w-[70px] h-[70px]">
                <img
                  src="/profile-blue.svg"
                  className="w-[65px] h-[65px] text-[#17375F] rounded-t-lg object-contain overflow-hidden"
                />
              </div>
              <div>
                <div className="text-[16px] text-[#767676] font-medium">
                  Nombre de usuario
                </div>
                <div className="text-[12px] text-[#767676]">
                  correo@emailserve.com
                </div>
              </div>
            </div>
          </div>

          <div className="py-2">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              <img
                src="/settings-gray.svg"
                className="w-[20px] h-[20px] object-contain overflow-hidden"
              />
              <span>Configuración</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              <img
                src="/logout.svg"
                className="w-[20px] h-[20px] object-contain overflow-hidden"
              />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
