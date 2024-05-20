"use client";
import React from "react";
import Image from "next/image";

import "./page.css";
import { useState, useEffect } from "react";
import Product_cart from "@/components/product_cart/product_cart";
export default function Seller_shop({ params }) {
  const { user_id_encode, seller_id_encode } = params;
  const user_id = decodeURIComponent(user_id_encode);
  const seller_id = decodeURIComponent(seller_id_encode);
  const [products, setProducts] = useState([]);
  const [shopInfor, setShopInfor] = useState({}); // Add state for shop name

  useEffect(() => {
    fetch(`/api/user/shop?seller_id=${seller_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const transformedData = data.products.map((item) => ({
          productImg: item.First_Image,
          sellerImg: "/user_icon.png", // replace with actual data if available
          sellerName: item.Shop_name, // replace with actual data if available
          productName: item.Product_title,
          location: "北海道日高地方", // replace with actual data if available
          price: item.First_Option_Price,
          unit: "1袋1kg", // replace with actual data if available
          product_id: item.Product_ID,
          isDiscount: false, // replace with actual data if available
          percentage: 0, // replace with actual data if available
        }));
        setProducts(transformedData);
        setShopInfor(data.shop_in4);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="listProductOfShopContainer">
      <div className="shopNameContainerShopScreen">
        <div className="imageSellerContainer">
          <Image src={shopInfor.Shop_image} fill="true" alt="shop image" />
        </div>
        <div className="textContainerShopScreen">
          <h2>{shopInfor.Shop_name}</h2>
          <span>Ho Chi Minh city, Viet Nam</span>
          <p>農産物の卸売・小売を行う専門店です。 全国発送</p>
        </div>
      </div>
      <div className="productList">
        {products.map((product, index) => (
          <Product_cart key={index} product={product} userID={user_id} />
        ))}
      </div>
    </div>
  );
}
