"use client";

const Sidebar = ({ isOpen, onClose }) => {
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
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 bg-[#6DC1E6] text-white"
        >
          <img
            src="/dashboard.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Mi dashboard</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2C4A72] transition-colors"
        >
          <img
            src="/settings.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Configuración</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2C4A72] transition-colors"
        >
          <img
            src="/lock.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Contraseña</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2C4A72] transition-colors"
        >
          <img
            src="/tag.svg"
            className="w-[20px] h-[20px] object-contain overflow-hidden"
          />
          <span>Planes</span>
        </a>
      </nav>

      <button className="absolute bottom-8 left-0 right-0 mx-4 flex items-center justify-center gap-3 px-4 py-3 bg-[#6DC1E6] text-white rounded-lg">
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
