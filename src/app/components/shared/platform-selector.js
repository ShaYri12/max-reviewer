const PlatformSelector = ({ id, value, onChange, platforms }) => (
  <div className={`space-y-2 ${id ? "pointer-events-none opacity-50" : ""}`}>
    <p className="text-sm text-gray-600">
      Elige la plataforma que quieres configurar
    </p>
    <select
      name="platform"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border text-black border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent bg-white"
      disabled={id}
    >
      {platforms.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);

export default PlatformSelector;
