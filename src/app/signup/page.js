"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Footer from "../components/shared/footer";
import Link from "next/link";
import Navbar from "../components/shared/navbar";

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

const SignupForm = ({ userData, onSubmit }) => {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        companyName: userData.companyName,
        email: userData.email,
        phone: userData.phone,
        password: "",
        confirmPassword: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (value.length > 10) return;
    }

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

    if (formData.phone.length !== 10) {
      toast.error("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    const fullPhone = `+52${formData.phone}`;

    const payload = {
      firstName: formData.companyName.split(" ")[0],
      lastName: formData.companyName.split(" ")[1] || "",
      email: formData.email,
      phone: fullPhone,
      password: formData.password,
      status: 1,
    };

    try {
      setLoading(true);
      const response = await axios.post("/api/customers", payload);

      if (response.data?.status === "OK" && response.data?.data) {
        toast.success("Cuenta creada exitosamente!");
        router.push("/login");
      } else {
        toast.error("Error al crear la cuenta. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "No se pudo completar el registro. Por favor, verifica tus datos."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Por favor, ingresa una dirección de correo válida.");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    const fullPhone = `+52${formData.phone}`;

    const payload = {
      firstName: formData.companyName.split(" ")[0],
      lastName: formData.companyName.split(" ")[1] || "",
      email: formData.email,
      phone: fullPhone,
    };

    try {
      setLoading(true);
      const response = await axios.put(`/api/customers/${userData.id}`, payload);

      if (response.data?.status === "OK" && response.data?.data) {
        toast.success("Cuenta actualizada exitosamente!");
        router.push("/add-product");
      } else {
        toast.error("Error al actualizar la cuenta. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "No se pudo completar la actualización. Por favor, verifica tus datos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh fixed w-full top-0 bg-[#17375F] overflow-y-hidden">
      {userData && (
        <div className="fixed top-0 w-full z-50">
          <Navbar />
        </div>
      )}

      <div className=" bg-[#17375F] flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-md h-full mt-16 md:mt-0">
          <div className="flex flex-col items-center md:mb-8 mb-4">
            <div className="flex items-center gap-2 md:mb-3 px-6 pt-6 md:pb-6 pb-4">
              {userData ? (
                <div className="md:mt-14 mt-10"></div>
              ) : (
                <img src="/logo.png" className="md:w-auto w-[300px]" />
              )}
            </div>
            <h1 className="text-[#F18D19] text-2xl font-bold mb-2">
              {userData ? "Actualizar tu cuenta" : "Crea tu cuenta"}
            </h1>
            <p className="text-white text-center text-sm">
              Para configurar tu producto{" "}
              <span className="text-[#6DC1E6] font-bold">MaxReviewer</span> crea
              una cuenta y accede a funciones exclusivas.
            </p>
          </div>
          <div className="fixed inset-x-4 md:top-[240px] top-[260px] bottom-0">
            <div className="relative h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
              <div className="bg-white rounded-t-3xl px-5 py-6 h-full overflow-y-auto">
                <form
                  className="space-y-4"
                  onSubmit={userData ? handleUpdate : handleSubmit}
                  noValidate
                >
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
                      max={10}
                    />
                  </div>
                  {!userData && (
                    <>
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
                    </>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-[#253368] text-white py-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : userData ? "Actualizar" : "Registrarte"}
                  </button>
                </form>
                {!userData && (
                  <div className="mt-6 flex items-center gap-2 justify-center text-center text-sm">
                    <p className="text-gray-600">
                      ¿Ya tienes una cuenta?{" "}
                      <Link
                        href="/login"
                        className="text-[#6DC1E6] font-bold inline-flex"
                      >
                        Inicia sesión
                      </Link>
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <div className="mt-8  bottom-4 md:static">
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
