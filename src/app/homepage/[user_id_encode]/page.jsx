"use client";
import React, { useRef } from "react";
import AdvertisementCart from "@/components/advertisement_cart/advertisement_cart";
import Product_cart from "@/components/product_cart/product_cart";
import CategoryCart from "@/components/category_cart/category_cart";
import "./homepage.css";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Page({ params }) {
  const { user_id_encode } = params;
  const productBestSellerListRef = useRef();
  const productSaleListRef = useRef();
  const advetisementListRef = useRef();

  const user_id = decodeURIComponent(user_id_encode);
  const [advertisements, setAdvertisement] = useState([]);
  const advertisements2 = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
  ]; // replace with your actual image sources

  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % advertisements2.length);
  };
  const prevImage = () => {
    setCurrentImage(
      (prevImage) =>
        (prevImage - 1 + advertisements2.length) % advertisements2.length
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer); // Clean up on component unmount
  }, []);
  useEffect(() => {
    fetch("/api/user/products") // replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        // transform the data into the format you need

        const transformedData = data.map((item) => ({
          productImg: item.First_Image,
          sellerImg: item.Shop_image, // replace with actual data if available
          sellerName: item.Shop_name, // replace with actual data if available
          productName: item.Product_title,
          location: "北海道日高地方", // replace with actual data if available
          price: item.First_Option_Price,
          unit: "1袋1kg", // replace with actual data if available
          product_id: item.Product_ID,
          isDiscount: false, // replace with actual data if available
          percentage: 0, // replace with actual data if available
        }));

        setBestSellerProducts(transformedData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  useEffect(() => {
    fetch("/api/user/advertisement") // replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setAdvertisement(data);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const [saleProducts, setSaleProducts] = useState({
    productImg: "/product_2.webp",
    sellerImg: "/user_icon.png",
    sellerName: "野比のび太",
    productName: "赤いリンゴ",
    location: "北海道日高地方",
    price: "100円",
    unit: "1袋1kg",
    product_id: "product_id",
    isDiscount: true,
    percentage: 50,
  });

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft - 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft + 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };
  const scrollLeftAd = () => {
    console.log("scroll left");
    if (advetisementListRef.current) {
      advetisementListRef.current.scrollTo({
        left: advetisementListRef.current.scrollLeft - 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRightAd = () => {
    if (advetisementListRef.current) {
      advetisementListRef.current.scrollTo({
        left: advetisementListRef.current.scrollLeft + 400, // adjust this as needed
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="homepage_container">
      <div className="big_advertisement_container">
        <button onClick={scrollLeftAd}>
          <Image
            src="/icon_arr_left.png"
            alt="left_arrow"
            width={30}
            height={50}
          />
        </button>
        <div className="advertisement_container" ref={advetisementListRef}>
          {advertisements.map((advertisement, index) => (
            <AdvertisementCart
              key={index}
              advertisement={advertisement}
              user_id={user_id}
            />
          ))}
        </div>
        <button onClick={scrollRightAd}>
          <Image
            src="/icon_arr_right.png"
            alt="left_arrow"
            width={30}
            height={50}
          />
        </button>
      </div>
      <div className="best_seller_container">
        <p className="best_seller_title">ベストセラー</p>
        <div className="big_best_seller_container">
          <button
            onClick={() => scrollLeft(productBestSellerListRef)}
            className="scroll_btn"
          >
            <Image
              src="/icon_arr_left.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
          <div className="product_list" ref={productBestSellerListRef}>
            {bestSellerProducts.map((product, index) => (
              <Product_cart key={index} product={product} userID={user_id} />
            ))}
          </div>
          <button
            onClick={() => {
              scrollRight(productBestSellerListRef);
            }}
            className="scroll_btn"
          >
            <Image
              src="/icon_arr_right.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
        </div>
      </div>
      <div className="best_seller_container">
        <p className="best_seller_title">割引商品</p>
        <div className="big_advertisement_container">
          <button onClick={prevImage}>
            <Image
              src="/icon_arr_left.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
          <div
            className="advertisement_container"
            ref={advetisementListRef}
            style={{
              display: "flex",
              overflowX: "hidden",
              width: "90%",
              justifyContent: "center",
            }}
          >
            {[...advertisements2, ...advertisements2]
              .slice(currentImage, currentImage + 3)
              .map((imageName, index) => (
                <div
                  key={index}
                  style={{
                    width: "400px",
                    height: "400px",
                    overflow: "hidden",
                    flexShrink: 0,
                    margin: "40px",
                  }}
                >
                  <img
                    src={`/${imageName}`}
                    alt={`Advertisement ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
          </div>
          <button onClick={nextImage}>
            <Image
              src="/icon_arr_right.png"
              alt="left_arrow"
              width={30}
              height={50}
            />
          </button>
        </div>
      </div>
      {/* <div className="category_container">
        <p className="category_title">Shop by category</p>
        <div className="category_list">
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
          <CategoryCart
            category={{ img: "/fish.jpeg", name: "Fish" }}
            userID={user_id}
          />
        </div>
      </div> */}
    </div>
  );
}
