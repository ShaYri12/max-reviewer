const ProductBox = ({ product }) => {
  return (
    <div className="flex mt-3 w-full gap-3 border-[#71C9ED] border-[3px] rounded-lg p-3">
      <img
        src="/scan.svg"
        className="w-[50px] h-[50px] my-auto object-contain overflow-hidden"
      />
      <div className="flex-1 flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-[#6C7278] mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600">Escaneos: {product.scans}</p>
          <p className="text-sm text-gray-600">Código: {product.code}</p>
          <p className="text-sm text-gray-600">
            Plataforma: {product.platform}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="text-[#6DC1E6]">
            <img
              src="/clipboard.svg"
              className="w-[20px] h-[20px] my-1 object-contain overflow-hidden"
            />
          </button>
          <button className="text-[#6DC1E6]">
            <img
              src="/chart.svg"
              className="w-[20px] h-[20px] my-1 object-contain overflow-hidden"
            />
          </button>
          <button className="text-[#6DC1E6]">
            <img
              src="/bin.svg"
              className="w-[20px] h-[20px] my-1 object-contain overflow-hidden"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
