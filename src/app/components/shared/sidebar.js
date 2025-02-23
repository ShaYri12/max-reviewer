"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const userId = user ? user._id : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signup");
  };

  const handlePlansClick = (e) => {
    e.preventDefault();
    toast("Aún no implementado.", {
      icon: "ℹ️",
    });
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-[#17375F] transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-40`}
    >
      <div className="flex items-center py-6 px-3 gap-3">
        <button className="text-white" onClick={onClose}>
          <img
            src="/bars.svg"
            className="w-[30px] h-[30px] object-contain overflow-hidden"
          />
        </button>
        <img src="/logo.png" alt="MaxReviewer Logo" className="h-8" />
      </div>

      <nav className="py-4">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 ${
            pathname === "/reviews" || pathname === "/dashboard"
              ? "bg-[#6DC1E6] text-white"
              : "text-white hover:bg-[#2C4A72]"
          }`}
        >
          <img
            src="/dashboard.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Mi dashboard</span>
        </Link>

        <Link
          href={`/configuration?id=${userId}`}
          className={`flex items-center gap-3 px-4 py-3 ${
            pathname === "/interface"
              ? "bg-[#6DC1E6] text-white"
              : "text-white hover:bg-[#2C4A72]"
          }`}
        >
          <img
            src="/settings.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Configuración</span>
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2C4A72] transition-colors"
        >
          <img
            src="/lock.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Contraseña</span>
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2C4A72] transition-colors"
          onClick={handlePlansClick}
        >
          <img
            src="/tag.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Planes</span>
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="absolute bottom-8 left-0 right-0 mx-4 flex items-center justify-center gap-3 px-4 py-3 bg-[#6DC1E6] text-white rounded-lg"
      >
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
