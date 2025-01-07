"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Footer from "../components/shared/footer";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [token, setToken] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!validateEmail(formData.email)) {
      toast.error("Por favor, ingresa una dirección de correo válida.");
      setLoading(false);
      return;
    }

    const payload = {
      username: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post("/auth/login", payload);

      if (response.status === 200 || response.status === 201) {
        const receivedToken = response.data?.data?.token;
        setToken(receivedToken);

        if (rememberMe) {
          localStorage.setItem("token", receivedToken);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.setItem("token", receivedToken);
          localStorage.removeItem("rememberMe");
        }

        toast.success("Inicio de sesión exitoso");
        router.push("/interface");
      } else {
        toast.error("Error inesperado. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "No se pudo iniciar sesión. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestToken = "guest12345";
    setToken(guestToken);
    localStorage.setItem("token", guestToken);
    toast.success("Inicio de sesión como invitado exitoso");
    router.push("/interface");
  };

  return (
    <div className="h-screen bg-[#17375F] flex items-center justify-between px-6 overflow-hidden">
      <div className="w-full min-h-screen flex flex-col justify-between max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3 p-6">
            <img src="/logo.png" alt="MaxReviewer Logo" />
          </div>
          <h1 className="text-[#F18D19] text-2xl font-bold mb-2">
            Inicia sesión
          </h1>
        </div>
        <div className="bg-white flex-1 flex flex-col justify-between rounded-t-3xl h-full px-5 py-6 overflow-hidden">
          {/* This div is scrollable */}
          <div className="h-full overflow-y-auto">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg focus:outline-none focus:border-[#6DC1E6]"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
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
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="rounded border-gray-300"
                  />
                  Recuérdame
                </label>
                <a href="#" className="text-[#6DC1E6]">
                  Olvidé mi contraseña
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#253368] text-white py-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Ingresar"}
              </button>
            </form>
            <div className="mt-6 flex items-center gap-2 justify-center text-center text-sm">
              <p className="text-gray-600">¿No tienes una cuenta? </p>
              <button
                onClick={() => router.push("/signup")}
                className="text-[#6DC1E6] font-bold"
              >
                Regístrate
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={handleGuestLogin}
                className="text-[#6DC1E6] font-medium"
              >
                Iniciar sesión como invitado
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
