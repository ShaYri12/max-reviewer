"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/shared/navbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../components/shared/footer";
import ProductBox from "../components/product/product-box";
import withAuth from "../utils/with-authenticated";
import toast from "react-hot-toast";

const Interface = () => {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const customerId = "mockCustomerId";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const mockData = [
          {
            cardId: "1",
            cardCode: "64IV9",
            cardType: "Google Review",
            establishmentId: 1,
            establishmentName: "Café Córdoba",
            timesVisited: 2359,
          },
        ];

        setProducts(mockData);

        const response = await axios.get(`/api/cards/customer/${customerId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [customerId]);

  const handleReviews = () => {
    router.push("/reviews");
  };

  const handleEditProduct = (productId) => {
    router.push(`/add-product?id=${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`/api/cards/product/${productId}`);
      if (response.status === 200) {
        router.reload();
      } else {
        toast.error(
          "No se pudo eliminar el producto. Por favor, inténtalo de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);

      toast.error("Ocurrió un error al eliminar el producto.");
    }
  };

  return (
    <div className="relative">
      <div className="h-dvh fixed bg-[#17375F] w-full flex items-center justify-between px-6 overflow-hidden">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        <div className="bg-white top-[80px] fixed max-w-md mx-auto bottom-0 right-4 left-4 rounded-t-xl">
          <main className="px-4 py-6 h-full">
            <div className="overflow-y-auto h-full flex flex-col justify-between">
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="/qr-code.svg"
                      className="w-[20px] h-[20px] object-contain overflow-hidden"
                    />
                    <h2 className="text-lg font-semibold text-[#6C7278]">
                      Tus productos ({products.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => router.push("/add-product")}
                    className="text-[#6DC1E6]"
                  >
                    <img
                      src="/plus.svg"
                      className="w-[30px] h-[30px] object-contain overflow-hidden"
                    />
                  </button>
                </div>

                {loading ? (
                  <p className="text-center text-gray-600">Loading...</p>
                ) : products.length === 0 ? (
                  <p className="text-center text-gray-600">
                    No products found.
                  </p>
                ) : (
                  products.map((product) => (
                    <ProductBox
                      key={product.cardId}
                      product={product}
                      handleReviews={handleReviews}
                      handleDelete={handleDelete}
                      handleEditProduct={handleEditProduct}
                    />
                  ))
                )}
                <div className="h-[25px]"></div>
              </div>
            </div>
            <footer className="absolute bottom-3 left-0 w-full text-center bg-white px-4 pt-2">
              <Footer />
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Interface);
