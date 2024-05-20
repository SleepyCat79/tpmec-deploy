"use client";
import "./product_detail.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Product_detail_description({ user_id, product_id }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [selectedOptionDelivery, setSelectedOptionDelivery] = useState("");
  const [index_option, setIndex_option] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Add this line
  const [option, setOption] = useState([]);
  const [seller, setSeller] = useState({});

  useEffect(() => {
    fetch(`/api/user/product?product_id=${product_id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data.product);
        setOption(data.options);
        setSeller(data.seller);
        setIsLoading(false); // Add this line
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [product_id]);
  useEffect(() => {
    console.log(product);
    console.log(option);
    console.log(seller);
  }, [product]);
  if (isLoading) {
    // Add this block
    return <div>Loading...</div>;
  }
  async function handleAddToCart() {
    const data = {
      product_id: product_id,
      user_id: user_id,
      option_number: index_option,
      quantity: quantity,
    };
    console.log(data);

    const response = await fetch("/api/user/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
      router.push(`/homepage/${encodeURIComponent(user_id)}/cart`);
    } else {
      console.error("Error:", response.statusText);
    }
  }

  function visitShop() {
    router.push(
      `/homepage/${encodeURIComponent(user_id)}/shop/${encodeURIComponent(
        seller.User_ID
      )}`
    );
  }
  return (
    <div className="product_detail">
      <p className="product_detail_product_name">{product.Product_title}</p>
      <div className="product_detail_seller">
        <div className="product_detail_seller_img_contaienr">
          <Image src={seller.Shop_image} alt="seller_img" fill="true" />
        </div>
        <div className="product_detail_seller_in4">
          <div>
            <Image
              src="/location_icon.png"
              height={15}
              width={15}
              alt="location icon"
            />
            <p>{seller.Shop_address}</p>
          </div>
          <button className="btn_visit_shop" onClick={visitShop}>
            <p className="product_detail_seller_name">{seller.Shop_name}</p>
          </button>
        </div>
      </div>
      <div className="option_container_product_detail">
        {option.map((option, index) => {
          return (
            <div
              key={index}
              className={
                index_option === index
                  ? "product_detail_option_active"
                  : "product_detail_option"
              }
              onClick={() => setIndex_option(index)}
            >
              <p>{option.Option_name}</p>
              <p>{option.Option_price}円</p>
            </div>
          );
        })}
      </div>
      <div className="product_detail_selection_number_product">
        <p>製品の数</p>
        <div>
          <button
            onClick={() => {
              quantity > 1 && setQuantity(quantity - 1);
            }}
          >
            <Image src="/minus_icon.png" fill="true" alt="minus icon" />
          </button>
          <p>{quantity}</p>
          <button
            onClick={() => {
              setQuantity(quantity + 1);
            }}
          >
            <Image src="/add_icon.png" fill="true" alt="add icon" />
          </button>
        </div>
      </div>
      {/* <div className="product_detail_delivery_company">
        <p>運送会社</p>
        <select
          value={selectedOptionDelivery}
          onChange={(e) => setSelectedOptionDelivery(e.target.value)}
        >
          {product.delivery_option.map((option, index) => {
            return (
              <option key={index} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div> */}
      <div className="product_detail_btn">
        <button
          className="product_detail_add_to_cart"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
      <div className="product_detail_description">
        <p className="description_title_product_detail">商品説明</p>
        <div>
          <p>{product.Product_description}</p>
        </div>
      </div>
    </div>
  );
}
