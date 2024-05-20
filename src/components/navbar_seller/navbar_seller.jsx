"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./navbar_seller.css";
import Image from "next/image";
export default function NavbarSeller({ user_id_encode, seller_id_encode }) {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState("dashboard");
  function onClickDashboard() {
    if (activeMode !== "dashboard") {
      setActiveMode("dashboard");
      //navigtasge to dashboard
      router.push(
        `/seller_mode/${user_id_encode}/${seller_id_encode}/dashboard`
      );
    }
  }
  function onClickProduct() {
    if (activeMode !== "product") {
      setActiveMode("product");
      //navigate to product
      router.push(
        `/seller_mode/${user_id_encode}/${seller_id_encode}/product_list`
      );
    }
  }
  function onClickOrder() {
    if (activeMode !== "order") {
      setActiveMode("order");
      //navigate to order
      router.push(
        `/seller_mode/${user_id_encode}/${seller_id_encode}/order_management`
      );
    }
  }
  function onClickProfile() {
    if (activeMode !== "profile") {
      setActiveMode("profile");
      //navigate to profile
      router.push(`/seller_mode/${user_id_encode}/${seller_id_encode}/profile`);
    }
  }
  function onClickWaitingConfirm() {
    if (activeMode !== "waiting_confirm") {
      setActiveMode("waiting_confirm");
      //navigate to profile
      router.push(
        `/seller_mode/${user_id_encode}/${seller_id_encode}/waiting_confirm_order`
      );
    }
  }
  function onClickUploadProduct() {
    if (activeMode !== "upload_product") {
      setActiveMode("upload_product");
      //navigate to profile
      router.push(
        `/seller_mode/${user_id_encode}/${seller_id_encode}/upload_product`
      );
    }
  }
  return (
    <div className="Navbar_user_left_container">
      <div className="left_section_navbar_container">
        <button
          onClick={() =>
            router.push(`/homepage/${encodeURIComponent(user_id_encode)}`)
          }
        >
          <h1>TPM</h1>
        </button>
      </div>
      <div className="Navbar_user_left_btn_container">
        <button
          className={
            activeMode === "dashboard" ? "Navbar_user_active_button" : ""
          }
          onClick={onClickDashboard}
        >
          <Image
            src={
              activeMode === "dashboard"
                ? "/home_active_seller.png"
                : "/home_seller.png"
            }
            width={20}
            height={20}
            alt="icon"
          />
          Dashboard
        </button>
        <button
          className={
            activeMode === "product" ? "Navbar_user_active_button" : ""
          }
          onClick={onClickProduct}
        >
          <Image
            src={
              activeMode === "product"
                ? "/product_active_seller.png"
                : "/product_seller.png"
            }
            width={20}
            height={20}
            alt="icon"
          />
          Products
        </button>
        <button
          className={activeMode === "order" ? "Navbar_user_active_button" : ""}
          onClick={onClickOrder}
        >
          <Image
            src={
              activeMode === "order"
                ? "/order_active_seller.png"
                : "/order_seller.png"
            }
            width={20}
            height={20}
            alt="icon"
          />
          Orders
        </button>
        <button
          className={
            activeMode === "waiting_confirm" ? "Navbar_user_active_button" : ""
          }
          onClick={onClickWaitingConfirm}
        >
          <Image
            src={
              activeMode === "waiting_confirm"
                ? "/user_active_seller.png"
                : "/user_seller.png"
            }
            width={20}
            height={20}
            alt="icon"
          />
          Wating for confirm order
        </button>

        <button
          className={
            activeMode === "upload_product" ? "Navbar_user_active_button" : ""
          }
          onClick={onClickUploadProduct}
        >
          <Image
            src={
              activeMode === "upload_product"
                ? "/upload_active_seller.png"
                : "/upload_seller.png"
            }
            width={20}
            height={20}
            alt="icon"
          />
          Upload product
        </button>
      </div>
    </div>
  );
}
