"use client";
import "../../checkout/checkout.css";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CheckoutPage({ params }) {
  const user_id_encode = params.user_id_encode;
  const [orderDetails, setOrderDetails] = useState(null);
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const [address, setAddress] = useState("");
  const Order_ID = pathParts[pathParts.length - 1];
  const [user_information, setUserInformation] = useState({
    user_name: "",
    user_phone: "",
    user_address: [],
  });
  useEffect(() => {
    async function fetchUserInformation() {
      const response = await fetch(
        `/api/user/information?user_id=${encodeURIComponent(user_id_encode)}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserInformation({
          user_name: data.user.FName + " " + data.user.LName,
          user_phone: data.user.Phone_Number,
          user_address: data.address.map((item) => item.Address),
        });
      } else {
        console.error("Error:", response.statusText);
      }
    }
    fetch(`/api/user/order?order_id=${Order_ID}`)
      .then((response) => response.json())
      .then((data) => {
        const orderData = data.body.order;
        setAddress(data.body.order.Address);
        const orderItems = data.body.order_items;
        const productPromises = orderItems.map((item) =>
          fetch(`/api/user/product?product_id=${item.Product_ID}`).then(
            (response) => response.json()
          )
        );
        return Promise.all(productPromises).then((productData) => {
          const enrichedOrderData = orderItems.map((item, index) => ({
            ...item,
            productDetails: productData[index],
          }));
          setOrderDetails({
            ...orderData,
            orderItems: enrichedOrderData,
          });
          console.log(enrichedOrderData);
        });
      })
      .catch((error) => console.error(error));
    fetchUserInformation();
  }, [Order_ID]);

  function calculateTotalPrice() {
    let total = 0;
    if (orderDetails && orderDetails.orderItems) {
      total = orderDetails.orderItems.reduce(
        (acc, order) => acc + Number(order.Final_price),
        0
      );
    }
    return total;
  }

  const totalPrice = calculateTotalPrice();
  return (
    <div className="checkout_page_container">
      <div className="address_checkout_page">
        <div className="header_address_checkout">
          <Image
            src="/location_checkout.png"
            alt="location icon"
            width={20}
            height={20}
          />
          <p>Dia chi nhan hang</p>
        </div>
        <div className="information_address_checkout">
          <p>
            {user_information.user_name} {user_information.user_phone}
          </p>
          <p>{address}</p>
        </div>
      </div>
      <div className="field_bar_checkout">
        <div>
          <p>San Pham</p>
        </div>
        <div>
          <p>Don gia</p>
          <p>So luong</p>
          <p>Thanh tien</p>
        </div>
      </div>
      {orderDetails?.orderItems?.map((order, index) => {
        return (
          <div className="product_checkout" key={index}>
            <div className="product_checkout_left_section">
              <Image
                src={order.productDetails.images[0].Image_url}
                alt="product_img"
                width={100}
                height={100}
              />
              <div className="product_information_checkout">
                <p>{order.productDetails.product.Product_title}</p>
                <p>
                  {
                    order.productDetails.options[order.Option_number]
                      .Option_name
                  }
                </p>
              </div>
            </div>
            <div className="product_checkout_right_section">
              <div>
                <p>{order.Original_price} 円</p>
              </div>
              <div>
                <p>{order.Quantity}</p>
              </div>
              <div>
                <p>{order.Final_price} 円</p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="checkout_final_step">
        <div>
          <p>Tong tien hang: </p> <p>{totalPrice} 円</p>
        </div>
      </div>
    </div>
  );
}
