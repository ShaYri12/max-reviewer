"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/shared/navbar";
import QRScanner from "../components/add-product/qr-scanner";
import PlatformSelector from "../components/shared/platform-selector";
import withAuth from "../utils/with-authenticated";

const platforms = [
  { value: "google", label: "Google Reviews" },
  { value: "yelp", label: "Yelp" },
  { value: "tripadvisor", label: "TripAdvisor" },
];

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    productId: "",
    businessName: "",
    platform: platforms[0].value,
    profileLink: "",
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScan = (productId) => {
    setFormData((prev) => ({ ...prev, productId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    router.push("reviews");
  };

  return (
    <div className="min-h-screen bg-[#17375F]">
      <Navbar />
      <div className="fixed inset-x-4 top-[80px] bottom-0">
        <div className="h-full bg-white max-w-md mx-auto rounded-t-xl flex flex-col">
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-[#6C7278] font-semibold">
                Configura tu producto
              </h2>
              <button onClick={() => router.back()} className="text-[#6DC1E6]">
                <img src="/close.svg" alt="Close" width={20} height={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <QRScanner onScan={handleScan} />
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#71C9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9ED] focus:border-transparent"
                  />
                </div>
              ))}

              <PlatformSelector
                value={formData.platform}
                onChange={handleInputChange}
                platforms={platforms}
              />
            </form>
          </main>
          <footer className="p-6">
            {/* <Button onClick={handleSubmit}>Guardar</Button> */}
            <button
              onClick={() => router.push("/reviews")}
              type="submit"
              className="w-full py-3 px-4 bg-[#17375F] hover:bg-[#17375F]/90 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17375F] transition-colors"
            >
              Guardar
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AddProductPage);
