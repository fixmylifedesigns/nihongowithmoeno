// File: src/app/amazonProducts.js
"use client"
import React, { useState, useMemo } from "react";
import AmazonProductCard from "../../components/AmazonProductCard"; // Assuming you have this component
import amazonProducts from "../../data/amazonProducts.json"; // Assuming you have this data file

const AmazonFinds = () => {
  // State for selected product type
  const [selectedProductType, setSelectedProductType] = useState("All");

  // Extract unique product types from amazon products
  const productTypes = useMemo(() => {
    const uniqueTypes = new Set(
      amazonProducts.products.map((product) => product.productType)
    );
    return ["All", ...uniqueTypes];
  }, []);

  // Filter products based on selected product type
  const filteredProducts = useMemo(() => {
    return selectedProductType === "All"
      ? amazonProducts.products
      : amazonProducts.products.filter(
          (product) => product.productType === selectedProductType
        );
  }, [selectedProductType]);

  return (
    <div id="amazon-finds-container" className="p-8 pt-32 bg-grey text-white">
      <h2 className="text-4xl font-bold mb-12 text-center">Learning Material</h2>
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-center">
          {/* Product type filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="product-type-filter" className="text-gray-300">
              Filter by type:
            </label>
            <select
              id="product-type-filter"
              value={selectedProductType}
              onChange={(e) => setSelectedProductType(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Display filtered products */}
      <div
        id="product-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto"
      >
        {filteredProducts.map((product) => (
          <AmazonProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Display message if no products match the filter */}
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-400 mt-8">
          No products found for the selected type.
        </p>
      )}
    </div>
  );
};

export default AmazonFinds;
