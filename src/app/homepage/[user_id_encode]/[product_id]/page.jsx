"use client";
import "./product_detail.css";
import Product_detail_img from "@/components/product_detail_image/product_detail_img";
import Product_detail_description from "@/components/product_detail_description/product_detail";
import { useEffect } from "react";
export default function Page({ params }) {
  const { user_id_encode, product_id } = params;
  const user_id = decodeURIComponent(user_id_encode);

  return (
    <div className="product_detail_page">
      <div className="product_detail_content">
        <div className="left_section_product_detail">
          <Product_detail_img product_id={product_id} />
        </div>
        <div className="right_section_product_detail">
          <Product_detail_description
            product_id={product_id}
            user_id={user_id}
          />
        </div>
      </div>
    </div>
  );
}
