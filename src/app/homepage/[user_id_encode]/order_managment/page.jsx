"use client";
import { useState, useEffect } from "react";
import "./order_managment.css";
import { useRouter } from "next/navigation";
export default function Page({ params }) {
  const route = useRouter();
  const { user_id_encode } = params;
  const user_id = decodeURIComponent(user_id_encode);
  const [orders, setOrders] = useState([]);
  const [shopNames, setShopNames] = useState({});

  useEffect(() => {
    fetch(`/api/user/orders?customer_id=${encodeURIComponent(user_id)}`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        data.forEach((order) => fetchUserInformation(order.Seller_ID));
      })
      .catch((error) => console.error(error));
  }, []);
  async function fetchUserInformation(Seller_ID) {
    const response = await fetch(
      `/api/user/information?user_id=${encodeURIComponent(Seller_ID)}`
    );
    if (response.ok) {
      const data = await response.json();
      // Assuming the response data has a 'shopname' field
      setShopNames((prevShopNames) => ({
        ...prevShopNames,
        [Seller_ID]: data.user.Shop_name,
      }));
    } else {
      console.error("Error:", response.statusText);
    }
  }
  return (
    <div className="order_management_page_container">
      <h3>Order management</h3>
      <div className="order_management_in4">
        <div className="field_bar_order_management">
          <div>Created date</div>
          <div>Seller Name</div>
          <div>Total Price</div>
          <div>Quantity of items</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {orders.map((item, index) => (
          <div className="field_bar_order_management" key={index}>
            <div>{new Date(item.Order_date).toISOString().split("T")[0]}</div>
            <div>{shopNames[item.Seller_ID]}</div>
            <div>{item.Total_price}</div>
            <div>{item.Total_quantity}</div>
            <div>{item.Status}</div>
            <div>
              <button
                onClick={() => {
                  route.push(
                    `/homepage/${encodeURIComponent(user_id)}/order_managment/${
                      item.Order_ID
                    }`
                  );
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
