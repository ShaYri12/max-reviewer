"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Footer from "../components/shared/footer";
import Link from "next/link";

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

const ResetPasswordForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const customerId = "mockCustomerId";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/customers/${customerId}/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }
      );

      if (response.data?.status === "OK") {
        toast.success("Contraseña cambiada exitosamente!");
        router.push("/login");
      } else {
        toast.error("Error al cambiar la contraseña. Inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "No se pudo completar la solicitud. Por favor, verifica tus datos."
      );
    }
  };

  return (
    <div className="h-dvh bg-[#17375F] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md h-full">
        <div className="flex flex-col items-center md:mb-8 mb-4">
          <div className="flex items-center gap-2 md:mb-3 px-6 pt-6 md:pb-6 pb-4">
            <img src="/logo.png" className="md:w-auto w-[300px]" />
          </div>
          <h1 className="text-[#F18D19] text-2xl font-bold mb-2">
            Cambiar Contraseña
          </h1>
          <p className="text-white text-center text-sm">
            Ingresa tu contraseña actual y una nueva contraseña para actualizar
            el acceso a tu cuenta.
          </p>
        </div>
        <div className="fixed inset-x-4 md:top-[240px] top-[200px] bottom-0">
          <div className="relative h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
            <div className="bg-white rounded-t-3xl px-5 py-6 h-full overflow-y-auto">
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <PasswordField
                  showPassword={showOldPassword}
                  setShowPassword={setShowOldPassword}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Contraseña Actual"
                />
                <PasswordField
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Nueva Contraseña"
                />
                <PasswordField
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma Nueva Contraseña"
                />
                <button
                  type="submit"
                  className="w-full bg-[#253368] text-white py-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Cambiar Contraseña
                </button>
              </form>
              <div className="mt-6 flex items-center gap-2 justify-center text-center text-sm">
                <p className="text-gray-600">
                  ¿Recuerdas tu contraseña?{" "}
                  <Link
                    href="/login"
                    className="text-[#6DC1E6] font-bold inline-flex"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="mt-8 fixed bottom-4 md:static">
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
