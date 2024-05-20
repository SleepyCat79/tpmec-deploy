"use client";

import { useEffect, useState } from "react";
import Product_cart_seller from "@/components/product_cart_seller/product_cart_seller";
import "./product_list.css";
export default function Page({ params }) {
  const { user_id_encode, seller_id_encode } = params;
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch(`/api/seller/products?seller_id=${seller_id_encode}`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  return (
    <div className="product_list_seller_big_container">
      <div className="product_list_container">
        <div className="product_list_header_seller">
          <h2>Products of shop</h2>

          <h4>Your shop currently have : {products.length} </h4>
        </div>
        <div className="product_list_tag_container">
          {products.map((product, index) => (
            <Product_cart_seller
              key={index}
              product={{
                productImg: product.Image_url,
                sellerImg: "/user_icon.png",
                sellerName: "Seller Name", // Replace with actual seller name
                productName: product.Product_title,
                location: "Location", // Replace with actual location
                price: "Price", // Replace with actual price
                unit: "Unit", // Replace with actual unit
                product_id: product.Product_ID,
                isDiscount: false, // Replace with actual discount status
                percentage: 0, // Replace with actual discount percentage
              }}
              userIdEncode={user_id_encode}
              sellerIdEncode={seller_id_encode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
