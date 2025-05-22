// components/loader/ProductsSkeletonCard.jsx
const ProductsSkeletonCard = () => {
  return (
    <div className="flex flex-col gap-4 p-4 shimmer border border-gray-200 rounded-lg shadow">
      <div className="bg-gray-300 shimmer h-48 w-full rounded-md"></div>
      <div className="bg-gray-300 h-4 w-3/4 rounded-md"></div>
      <div className="bg-gray-300 h-4 w-1/2 rounded-md"></div>
      <div className="bg-gray-300 h-6 w-1/4 rounded-md"></div>
    </div>
  );
};

export default ProductsSkeletonCard;
