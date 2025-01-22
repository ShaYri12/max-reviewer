"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/shared/navbar";
import QRScanner from "../components/add-product/qr-scanner";
import PlatformSelector from "../components/shared/platform-selector";
import withAuth from "../utils/with-authenticated";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import StyledAutocomplete from "../components/add-product/styled-autocomplete";

const platforms = [
  { value: "google", label: "Google Reviews" },
  { value: "yelp", label: "Yelp" },
  { value: "tripadvisor", label: "TripAdvisor" },
];

const libraries = ["places"];

const AddProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isProductIdFromQR, setIsProductIdFromQR] = useState(false);
  const [isBusinessNameSelected, setIsBusinessNameSelected] = useState(false);
  const apiKey = "api-key"; // Replace with your Google Maps API key

  const [formData, setFormData] = useState({
    productId: "",
    businessName: "",
    platform: platforms[0].value,
    profileLink: "",
  });

  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (id) {
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
            const response = await axios.get(`/api/establishment`);
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

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setFormData((prev) => ({
        ...prev,
        businessName: place.name || prev.businessName, // Retain previous name if none is selected
      }));
    }
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
        response = await axios.post("/api/establishment", formData);
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
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      toast.error(
        "No se pudo guardar el producto. Por favor, inténtalo de nuevo."
      );
    }
  };

  const handlePlaceSelect = (place) => {
    setFormData((prev) => ({
      ...prev,
      businessName: place.name || prev.businessName,
    }));
    setIsBusinessNameSelected(true);
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <div className="h-dvh bg-[#17375F] overflow-y-hidden">
        <Navbar />
        <div className="fixed inset-x-4 top-[80px] bottom-0">
          <div className="h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
            <main className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg text-[#6C7278] font-semibold">
                  {id ? "Editar Producto" : "Configura tu Producto"}
                </h2>
                <button
                  onClick={() => router.back()}
                  className="text-[#6DC1E6]"
                >
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
                    autocomplete: true, // Indicates this field supports autocomplete
                  },
                  {
                    label: "Link del perfil",
                    name: "profileLink",
                    value: formData.profileLink,
                    type: "text",
                  },
                ].map(({ label, name, value, type, autocomplete }) => (
                  <div key={name} className="space-y-1">
                    <p className="text-sm text-gray-600">{label}</p>
                    {autocomplete ? (
                      <StyledAutocomplete
                        value={formData.businessName}
                        onChange={handleInputChange}
                        name="businessName"
                        onPlaceSelect={(place) => {
                          handlePlaceSelect(place);
                          setIsBusinessNameSelected(true); // Disable field after selection
                        }}
                        autocompleteRef={autocompleteRef}
                        disabled={isBusinessNameSelected}
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
                        disabled={
                          name === "productId" && (id || isProductIdFromQR)
                        }
                      />
                    )}
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
    </LoadScript>
  );
};

export default withAuth(AddProductPage);
