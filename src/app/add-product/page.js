"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/shared/navbar";
import QRScanner from "../components/add-product/qr-scanner";
import PlatformSelector from "../components/shared/platform-selector";
import withAuth from "../utils/with-authenticated";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const platforms = [
  { value: "google", label: "Google Reviews" },
  { value: "yelp", label: "Yelp" },
  { value: "tripadvisor", label: "TripAdvisor" },
];

const AddProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isProductIdFromQR, setIsProductIdFromQR] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    businessName: "",
    platform: platforms[0].value,
    profileLink: "",
  });

  useEffect(() => {
    if (!!id) {
      if (id === "1") {
        const mockData = {
          productId: "1",
          businessName: "Café Córdoba",
          platform: "google",
          profileLink: "https://www.cafecordoba.com",
        };
        setFormData(mockData);
      } else {
        const fetchProductData = async () => {
          try {
            const response = await axios.get(`/api/cards/product/${id}`);
            setFormData(response.data);
          } catch (error) {
            console.error("Error fetching product data:", error);
          }
        };

        fetchProductData();
      }
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScan = (productId) => {
    setFormData((prev) => ({ ...prev, productId }));
    setIsProductIdFromQR(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (id) {
        response = await axios.put(`/api/cards/product/${id}`, formData);
      } else {
        response = await axios.post("/api/cards/product", formData);
      }

      if (response.status === 200) {
        toast.success(
          id
            ? "¡Producto actualizado con éxito!"
            : "¡Producto agregado con éxito!"
        );
        router.push("/reviews");
      } else {
        toast.error(
          "No se pudo actualizar el producto. Por favor, inténtalo de nuevo."
        );
        toast.success(
          id
            ? "No se pudo actualizar el producto. Por favor, inténtalo de nuevo."
            : "No se pudo agregar el producto. Por favor, inténtalo de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      toast.error(
        "No se pudo guardar el producto. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="h-dvh bg-[#17375F] overflow-y-hidden">
      <Navbar />
      <div className="fixed inset-x-4 top-[80px] bottom-0">
        <div className="h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-[#6C7278] font-semibold">
                {id ? "Editar Producto" : "Configura tu Producto"}
              </h2>
              <button onClick={() => router.back()} className="text-[#6DC1E6]">
                <img src="/close.svg" alt="Close" width={20} height={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <QRScanner id={Boolean(id)} onScan={handleScan} />
              {[
                {
                  label: "Número de producto",
                  name: "productId",
                  value: formData.productId,
                  type: "text",
                },
                {
                  label: "Nombre de la sucursal / negocio",
                  name: "businessName",
                  value: formData.businessName,
                  type: "text",
                },
                {
                  label: "Link del perfil",
                  name: "profileLink",
                  value: formData.profileLink,
                  type: "text",
                },
              ].map(({ label, name, value, type }) => (
                <div key={name} className="space-y-1">
                  <p className="text-sm text-gray-600">{label}</p>
                  <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={(e) => {
                      if (name === "productId") {
                        const regex = /^[A-Za-z0-9]{0,8}$/;
                        if (regex.test(e.target.value)) {
                          handleInputChange(e);
                        }
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
                    // disabled={name === "productId" && id ? true : false}
                    disabled={name === "productId" && isProductIdFromQR}
                  />
                </div>
              ))}

              <PlatformSelector
                id={Boolean(id)}
                value={formData.platform}
                onChange={handleInputChange}
                platforms={platforms}
              />
            </form>
          </main>
          <footer className="p-6">
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full py-3 px-4 bg-[#17375F] hover:bg-[#17375F]/90 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17375F] transition-colors"
            >
              {id ? "Actualizar Producto" : "Guardar"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AddProductPage);
