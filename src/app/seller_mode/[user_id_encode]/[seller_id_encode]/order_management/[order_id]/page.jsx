"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CheckoutPage({ params }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const path = window.location.pathname;
  const pathParts = path.split("/");
  const Order_ID = pathParts[pathParts.length - 1];
  useEffect(() => {
    fetch(`/api/user/order?order_id=${Order_ID}`)
      .then((response) => response.json())
      .then((data) => {
        const orderData = data.body.order;
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
  }, [Order_ID]);

  const user_information = {
    user_name: "Nguyen Viet Hung",
    user_phone: "0798944343",
    user_address: [
      "13/19 , Khu Phố 6, Phường Tam Hiệp, Phường Tam Hiệp, Thành Phố Biên Hòa, Đồng Nai",
      "79/38A tổ 21 khu phố 1 phường Tân Hiệp Biên Hoà Dồng Nai Việt Nam",
    ],
  };

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
          <p>{user_information.user_address[0]}</p>
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
