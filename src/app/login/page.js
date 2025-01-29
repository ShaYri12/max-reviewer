"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Footer from "../components/shared/footer";
import Link from "next/link";

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

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    const isRemembered = localStorage.getItem("rememberMe") === "true";

    if (rememberedEmail && rememberedPassword && isRemembered) {
      setFormData({
        email: rememberedEmail,
        password: rememberedPassword,
      });
      setRememberMe(true);
    }
  }, []);

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
        const user = response.data?.data?.user;
        setToken(receivedToken);
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", user);

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
          localStorage.setItem("rememberedPassword", formData.password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
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

  return (
   <div className="relative">
     <div className="h-dvh fixed bg-[#17375F] w-full flex items-center justify-between px-6 overflow-hidden">
      <div className="w-full max-w-md mx-auto h-full">
        <div className="flex flex-col items-center md:mb-8 mb-4">
          <div className="flex items-center gap-2 md:mb-3 px-6 pt-6 md:pb-6 pb-4">
            <img src="/logo.png" className="md:w-auto w-[300px]" />
          </div>
          <h1 className="text-[#F18D19] text-2xl font-bold mb-2">
            Inicia sesión
          </h1>
        </div>
        <div className="fixed inset-x-4 md:top-[200px] top-[140px] bottom-0">
          <div className="relative h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
            <div className="bg-white flex flex-col justify-between rounded-t-3xl h-full px-5 py-6 overflow-hidden">
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
                  <div className="flex flex-wrap gap-1 items-center justify-between text-sm">
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
                  <p className="text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      href="/signup"
                      className="text-[#6DC1E6] font-bold inline-flex"
                    >
                      Regístrate
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
    </div>
   </div>
  );
};

export default LoginForm;
