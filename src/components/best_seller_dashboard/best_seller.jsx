"use client";
import { useState } from "react";
import "./best_seller.css";
import Image from "next/image";
export default function BestSeller({ productId }) {
  const [productData, setProductData] = useState({});
  // useEffect(() => {
  //   // get product data by productId
  //   // setProductData
  // }, [productId]);
  return (
    <div className="best_seller_tag">
      <div className="best_seller_tag_img">
        <Image src="/product_1.webp" fill="true" alt="img product" />
      </div>
      <div className="best_seller_tag_in4">
        <p>Apple Red </p>
        <p>10 YEN</p>
      </div>
      <div className="best_seller_tag_sale_in4">
        <p>200 YEN</p>
        <p>20 sales</p>
      </div>
    </div>
  );
}
