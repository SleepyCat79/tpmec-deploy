"use client";
import "./checkout.css";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
export default function CheckoutPage({ params }) {
  const route = useRouter();

  const user_id_encode = params.user_id_encode;
  const user_id = decodeURIComponent(user_id_encode);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState("");

  const [user_information, setUserInformation] = useState({
    user_name: "",
    user_phone: "",
    user_address: [],
  });
  /// use userID to get the data that user have checkout
  const [cart, setCart] = useState({});
  useEffect(() => {
    async function fetchCheckout() {
      const response = await fetch(
        `/api/user/cart?user_id=${encodeURIComponent(user_id)}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const checkoutShops = data.checkout.map((item) => ({
          shop_id: item.Seller_ID,
          shop_name: item.Shop_name,
          product: [
            {
              product_id: item.Product_ID,
              product_name: item.Product_Name,
              price: item.Option_price,
              quantity: item.Quantity,
              Option_number: item.Option_number,
              total: item.Quantity * parseFloat(item.Option_price),
              product_img: item.Image_url,
              type: item.Product_Type,
            },
          ],
          note: "",
          delivery_company: item.Delivery_Company,
        }));
        setCart({ shop: checkoutShops });
      } else {
        console.error("Error:", response.statusText);
      }
    }
    async function fetchUserInformation() {
      const response = await fetch(
        `/api/user/information?user_id=${encodeURIComponent(user_id)}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserInformation({
          user_name: data.user.FName + " " + data.user.LName,
          user_phone: data.user.Phone_Number,
          user_address: data.address.map((item) => item.Address),
        });
        setAddress(data.address[0].Address);
      } else {
        console.error("Error:", response.statusText);
      }
    }

    fetchCheckout();
    fetchUserInformation();
  }, [user_id]);
  async function handleBack() {
    for (let shop of cart.shop) {
      for (let product of shop.product) {
        const data = {
          operation: "updateIsChecked",
          product_id: product.product_id,
          user_id: user_id,
          option_number: product.Option_number,
          isChecked: 0,
        };

        const response = await fetch("/api/user/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          alert(`Failed to update product ${product.product_id}`);
        }
      }
    }
    // Redirect to the previous page or any other page
    route.push(`/homepage/${encodeURIComponent(user_id)}/cart`);
  }
  function calculateTotalPrice() {
    let total = 0;
    if (cart.shop && Array.isArray(cart.shop)) {
      cart.shop.map((shop) => {
        total += shop.product.reduce((a, b) => a + b.total, 0);
      });
    }
    return total;
  }
  const totalPrice = calculateTotalPrice();
  async function handle_checkout() {
    let new_cart = { ...cart };
    console.log(new_cart);

    for (let shop of new_cart.shop) {
      let Product_list = [];
      shop.product.forEach((product) => {
        Product_list.push({
          Product_ID: product.product_id,
          Option_number: product.Option_number,
          Quantity: product.quantity,
          Discount_percentage: product.Discount_percentage,
          Original_price: product.price,
          Final_price: product.price * product.quantity,
        });
      });

      if (Product_list.length > 0) {
        const data = {
          Seller_ID: shop.shop_id, // Seller_ID is obtained from the first checked product
          Customer_ID: user_id, // Replace with actual Customer_ID
          Address: address, // Replace with actual Address
          Shipping_company: shop.delivery_company, // Replace with actual Shipping_company
          Total_quantity: Product_list.length,
          Product_list,
        };

        // Make API request to server
        const response = await fetch("/api/user/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          alert("Checkout failed");
          return;
        }
        for (let product of Product_list) {
          console.log(product);
          const deleteResponse = await fetch("/api/user/cart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: product.Product_ID,
              user_id: user_id,
              option_number: product.Option_number,
            }),
          });

          if (!deleteResponse.ok) {
            alert(`Failed to remove product ${product.Product_ID} from cart`);
          }
        }
      }
    }

    alert("Order has been placed");
    route.push(`/homepage/${encodeURIComponent(user_id)}/order_managment`);
  }
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
          {isEditing ? (
            <select
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            >
              {user_information.user_address.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          ) : (
            <p>{address}</p>
          )}
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Xong" : "Thay doi"}
          </button>
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
      {cart.shop &&
        Array.isArray(cart.shop) &&
        cart.shop.map((shop, index) => {
          return (
            <div className="shop_checkout" key={index}>
              <div className="shop_checkout_header">
                <p className="checkout_shop_name">{shop.shop_name}</p>
              </div>
              {shop.product.map((product, productIndex) => {
                return (
                  <div className="product_checkout" key={productIndex}>
                    <div className="product_checkout_left_section">
                      <Image
                        src={product.product_img}
                        alt="product_img"
                        width={100}
                        height={100}
                      />
                      <div className="product_information_checkout">
                        <p>{product.product_name}</p>
                        <p>{product.type}</p>
                      </div>
                    </div>
                    <div className="product_checkout_right_section">
                      <div>
                        <p>{product.price} 円</p>
                      </div>
                      <div>
                        <p>{product.quantity}</p>
                      </div>
                      <div>
                        <p>{product.total} 円</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="checkout_information_shipping">
                <div>
                  <p>Ghi chu</p>
                  <textarea placeholder="lời nhắn cho người bán"></textarea>
                </div>
                <div>
                  <p>Đơn vị vận chuyển</p>
                  <p>{shop.delivery_company}</p>
                </div>
              </div>
              <div>
                <p>
                  Tổng cộng: {shop.product.reduce((a, b) => a + b.total, 0)} 円
                </p>
              </div>
            </div>
          );
        })}
      <div className="checkout_final_step">
        <div>
          <p>Tong tien hang: </p> <p>{totalPrice} 円</p>
        </div>

        <button onClick={handle_checkout}>Dat hang</button>
        <button className="back-button" onClick={handleBack}>
          Quay lại
        </button>
      </div>
    </div>
  );
}
