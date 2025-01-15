"use client";

import { useState } from "react";

const ProductBox = ({
  product,
  handleReviews,
  handleDelete,
  handleEditProduct,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const openDeleteConfirmation = () => setShowDeleteConfirmation(true);
  const closeDeleteConfirmation = () => setShowDeleteConfirmation(false);

  const confirmDelete = () => {
    handleDelete(product.id);
    closeDeleteConfirmation();
  };

  return (
    <>
      <div className="flex mt-3 w-full gap-3 border-[#71C9ED] border-[3px] rounded-lg p-3">
        <img
          src="/scan.svg"
          className="w-[50px] h-[50px] my-auto object-contain overflow-hidden"
        />
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-[#6C7278] mb-1">
              {product.establishmentName}
            </h3>
            <p className="text-sm text-gray-600">
              Escaneos: {product.timesVisited}
            </p>
            <p className="text-sm text-gray-600">Código: {product.cardCode}</p>
            <p className="text-sm text-gray-600">
              Plataforma: {product.cardType}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleEditProduct(product.cardId)}
              className="text-[#6DC1E6]"
            >
              <img
                src="/clipboard.svg"
                className="w-[20px] h-[20px] my-1 object-contain overflow-hidden"
              />
            </button>
            <button onClick={openDeleteConfirmation} className="text-[#6DC1E6]">
              <img
                src="/chart.svg"
                className="w-[20px] h-[20px] my-1 object-contain overflow-hidden"
              />
            </button>
            <button onClick={handleReviews} className="text-[#6DC1E6]">
              <img
                src="/bin.svg"
                className="w-[20px] h-[20px] my-1 object-contain overflow-hidden"
              />
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeDeleteConfirmation}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-600">
              ¿Estás seguro?
            </h2>
            <p className="mb-6 text-gray-600">
              Esta acción no se puede deshacer. ¿Realmente quieres eliminar este
              producto?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBox;
