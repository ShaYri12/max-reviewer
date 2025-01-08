"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Footer from "../components/shared/footer";

const InputField = ({ label, type, name, value, onChange, placeholder }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6DC1E6]"
    />
  </div>
);

const PasswordField = ({
  showPassword,
  setShowPassword,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg focus:outline-none focus:border-[#6DC1E6]"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
);

const SignupForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Por favor, ingresa una dirección de correo válida.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    const payload = {
      firstName: formData.companyName.split(" ")[0],
      lastName: formData.companyName.split(" ")[1] || "",
      email: formData.email,
      password: formData.password,
      status: 1,
    };

    try {
      const simulatedResponse = {
        data: {
          status: "OK",
          data: { id: "12345", ...payload },
        },
      };

      if (
        simulatedResponse.data?.status === "OK" &&
        simulatedResponse.data?.data
      ) {
        toast.success("¡Cuenta creada exitosamente!");
        router.push("/login");
      } else {
        toast.error("Error al crear la cuenta. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "No se pudo completar el registro. Por favor, verifica tus datos."
      );
    }
  };

  return (
    <div className="h-dvh bg-[#17375F] flex items-start justify-center px-4 overflow-hidden">
      <div className="relative w-full flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3 p-6">
            <img src="/logo.png" />
          </div>
          <h1 className="text-[#F18D19] text-2xl font-bold mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-white text-center text-sm">
            Para configurar tu producto{" "}
            <span className="text-[#6DC1E6] font-bold">MaxReviewer</span> crea
            una cuenta y accede a funciones exclusivas.
          </p>
        </div>
        <div className="bg-white rounded-t-3xl px-5 py-6 h-4/6 md:h-[60%] lg:h-[67%] fixed bottom-0  overflow-y-auto ">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <InputField
              label="Nombre de la empresa*"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Nombre de la empresa*"
            />
            <InputField
              label="Email*"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email*"
            />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center px-3 bg-[#6DC1E6] text-white rounded-l-lg">
                +52
              </div>
              <input
                type="number"
                name="phone"
                placeholder="Teléfono a 10 digitos*"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6DC1E6]"
              />
            </div>
            <PasswordField
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
            />
            <PasswordField
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
            />
            <button
              type="submit"
              className="w-full bg-[#253368] text-white py-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Registrarte
            </button>
          </form>
          <div className="mt-6 flex items-center gap-2 justify-center text-center text-sm">
            <p className="text-gray-600">¿Ya tienes una cuenta? </p>
            <button
              onClick={() => router.push("/login")}
              className="text-[#6DC1E6] font-bold"
            >
              Inicia sesión
            </button>
          </div>
          <div className="flex mt-8 justify-center">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
