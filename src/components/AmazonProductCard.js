import React from "react";
import Image from "next/image";

const AmazonProductCard = ({ product }) => {
  // Destructure product properties for easier access
  const { name, imageUrl, productUrl } = product;

  return (
    <div
      className="bg-gray-700 rounded-lg shadow-md overflow-hidden max-w-sm flex flex-col justify-between h-full"
      id="amazon-product-card"
    >
      {/* Product name container */}
      <div className="p-4" id="product-name-container">
        <h3 className="text-lg font-semibold" title={name} id="product-name">
          {name}
        </h3>
      </div>

      {/* Product image and buy button container */}
      <div className="mt-auto">
        <div className="h-48 overflow-hidden" id="product-image-container">
          <Image
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            id="product-image"
            width={50}
            height={50}
          />
        </div>

        {/* Buy now button container */}
        <div className="p-4" id="buy-button-container">
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center py-2 px-4 rounded text-gray-800 font-semibold transition duration-300"
            id="buy-now-button"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default AmazonProductCard;
