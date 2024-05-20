"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./cart.css";
export default function Page({ params }) {
  const route = useRouter();
  const { user_id_encode } = params;
  const user_id = decodeURIComponent(user_id_encode);
  const [cart, setCart] = useState({ shop: [] });
  useEffect(() => {
    async function fetchCart() {
      const response = await fetch(
        `/api/user/cart?user_id=${encodeURIComponent(user_id)}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const cartShops = data.cart.map((item) => ({
          sellerId: item.Seller_ID,
          check: false,
          product: [
            {
              ...item,
              check: false,
              total: item.Quantity * parseFloat(item.Option_price),
            },
          ],
        }));
        setCart({ shop: cartShops });
      } else {
        console.error("Error:", response.statusText);
      }
    }

    fetchCart();
  }, [user_id]);
  const [checkdedAllProduct, setCheckdedAllProduct] = useState(false);
  const [waiting_for_check, setWaiting_for_check] = useState(false);
  const [name_product_want_to_delete, setName_product_want_to_delete] =
    useState("");
  const [product_id_want_to_delete, setProduct_id_want_to_delete] =
    useState("");
  const [shop_index_delete, setShop_index_delete] = useState(-1);
  const [product_index_delete, setProduct_index_delete] = useState(-1);
  function check_product_item(shopIndex, productIndex) {
    let new_cart = { ...cart };
    new_cart.shop[shopIndex].product[productIndex].check =
      !new_cart.shop[shopIndex].product[productIndex].check;
    // Check if all products in the shop are checked
    const allProductsChecked = new_cart.shop[shopIndex].product.every(
      (product) => product.check
    );

    // Set the check property of the shop
    new_cart.shop[shopIndex].check = allProductsChecked;
    setCart(new_cart);
  }

  function check_shop_item(shopIndex) {
    let new_cart = { ...cart };
    new_cart.shop[shopIndex].check = !new_cart.shop[shopIndex].check;
    new_cart.shop[shopIndex].product.map((product) => {
      product.check = new_cart.shop[shopIndex].check;
    });
    setCart(new_cart);
  }

  async function add_quantity(shopIndex, productIndex) {
    let new_cart = { ...cart };
    new_cart.shop[shopIndex].product[productIndex].Quantity++;
    new_cart.shop[shopIndex].product[productIndex].total =
      new_cart.shop[shopIndex].product[productIndex].Quantity *
      new_cart.shop[shopIndex].product[productIndex].Option_price;

    const response = await fetch("/api/user/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "updateQuantity",
        product_id: new_cart.shop[shopIndex].product[productIndex].Product_ID,
        user_id: user_id_encode, // replace with actual user_id
        option_number:
          new_cart.shop[shopIndex].product[productIndex].Option_number, // replace with actual option_number
        quantity: new_cart.shop[shopIndex].product[productIndex].Quantity,
      }),
    });

    const data = await response.json();
    console.log(data.message);

    setCart(new_cart);
  }

  async function sub_quantity(shopIndex, productIndex) {
    let new_cart = { ...cart };
    if (new_cart.shop[shopIndex].product[productIndex].Quantity > 1) {
      new_cart.shop[shopIndex].product[productIndex].Quantity--;
    }
    new_cart.shop[shopIndex].product[productIndex].total =
      new_cart.shop[shopIndex].product[productIndex].Quantity *
      new_cart.shop[shopIndex].product[productIndex].Option_price;

    const response = await fetch("/api/user/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "updateQuantity",
        product_id: new_cart.shop[shopIndex].product[productIndex].Product_ID,
        user_id: user_id_encode, // replace with actual user_id
        option_number:
          new_cart.shop[shopIndex].product[productIndex].Option_number, // replace with actual option_number
        quantity: new_cart.shop[shopIndex].product[productIndex].Quantity,
      }),
    });

    const data = await response.json();
    console.log(data.message);

    setCart(new_cart);
  }

  async function delete_product(shopIndex, productIndex) {
    setWaiting_for_check(true);
    setName_product_want_to_delete(
      cart.shop[shopIndex].product[productIndex].Product_title
    );
    setProduct_id_want_to_delete(
      cart.shop[shopIndex].product[productIndex].Product_ID
    );
    setShop_index_delete(shopIndex);
    setProduct_index_delete(productIndex);

    const response = await fetch("/api/user/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: cart.shop[shopIndex].product[productIndex].Product_ID,
        user_id: user_id_encode, // replace with actual user_id
        option_number: cart.shop[shopIndex].product[productIndex].Option_number, // replace with actual option_number
      }),
    });

    const data = await response.json();
    console.log(data.message);
  }

  function handle_cancel() {
    setName_product_want_to_delete("");
    setWaiting_for_check(false);
    setProduct_id_want_to_delete("");
    setShop_index_delete(-1);
    setProduct_index_delete(-1);
  }

  function handle_delete() {
    setName_product_want_to_delete("");
    setWaiting_for_check(false);
    // make api request to delete product
    console.log(
      "Delete product with id: ",
      product_id_want_to_delete,
      "of user: ",
      user_id
    );
    /// delete in UI
    let new_cart = { ...cart };
    new_cart.shop[shop_index_delete].product.splice(product_index_delete, 1);
    if (new_cart.shop[shop_index_delete].product.length === 0) {
      new_cart.shop.splice(shop_index_delete, 1);
    }
    setCart(new_cart);
  }

  function calculateCheckedProducts() {
    let total = 0;
    cart.shop.forEach((shop) => {
      shop.product.forEach((product) => {
        if (product.check) {
          total += product.Quantity;
        }
      });
    });
    return total;
  }

  function calculateTotalPrice() {
    let total = 0;
    cart.shop.forEach((shop) => {
      shop.product.forEach((product) => {
        if (product.check) {
          total += product.total;
        }
      });
    });
    return total;
  }

  function checkAllProducts() {
    let new_cart = { ...cart };
    if (checkdedAllProduct) {
      new_cart.shop.forEach((shop) => {
        shop.check = false;
        shop.product.forEach((product) => {
          product.check = false;
        });
      });
      setCheckdedAllProduct(false);
      setCart(new_cart);
    } else {
      new_cart.shop.forEach((shop) => {
        shop.check = true;
        shop.product.forEach((product) => {
          product.check = true;
        });
      });
      setCheckdedAllProduct(true);
      setCart(new_cart);
    }
  }

  async function handle_checkout() {
    if (calculateCheckedProducts() === 0) {
      alert("Please choose at least 1 product to checkout");
      return;
    }
    let new_cart = { ...cart };

    for (let shop of new_cart.shop) {
      let Product_list = [];
      let Seller_ID = null;
      shop.product.forEach(async (product) => {
        if (product.check) {
          if (!Seller_ID) Seller_ID = product.Seller_ID;
          Product_list.push({
            Product_ID: product.Product_ID,
            Option_number: product.Option_number,
            Quantity: product.Quantity,
            Discount_percentage: product.Discount_percentage,
            Original_price: product.Option_price,
            Final_price: product.Option_price * product.Quantity,
          });

          const data = {
            Seller_ID, // Seller_ID is obtained from the first checked product
            Customer_ID: user_id, // Replace with actual Customer_ID
            Address: "your_address", // Replace with actual Address
            Shipping_company: "your_shipping_company", // Replace with actual Shipping_company
            Total_quantity: Product_list.length,
            Product_list,
          };

          // Make API request to server
          const response = await fetch("/api/user/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              operation: "updateIsChecked",
              product_id: product.Product_ID,
              user_id: user_id,
              option_number: product.Option_number,
              isChecked: product.check,
              ...data,
            }),
          });

          if (!response.ok) {
            alert("Checkout failed");
            return;
          }
        }
      });
    }

    // Redirect to checkout page
    route.push(`/homepage/${encodeURIComponent(user_id)}/checkout`);
  }
  const total_checked_products = calculateCheckedProducts();

  const total_checked_price = calculateTotalPrice();

  const total_product = cart.shop.reduce(
    (total, shop) => total + shop.product.length,
    0
  );
  return (
    <div className="cart_big_container">
      <div className="cart_header">
        <div className="cart_header_left_section">
          <input type="checkbox"></input>
          <p>San pham</p>
        </div>
        <div className="cart_header_right_section">
          <p>Đơn giá</p>
          <p>So luong</p>
          <p>Thanh tien</p>
          <p>Thao tac</p>
        </div>
      </div>
      {cart.shop.map((shop, shopIndex) => {
        return (
          <div className="cart_shop_container" key={shopIndex}>
            <div className="cart_shop_header">
              <input
                type="checkbox"
                checked={shop.check}
                onClick={() => check_shop_item(shopIndex)}
              ></input>
              <p>{shop.shop_name}</p>
            </div>
            {shop.product.map((product, productIndex) => {
              return (
                <div className="cart_product_container" key={productIndex}>
                  <div className="cart_prodcut_container_left_section">
                    <input
                      type="checkbox"
                      checked={product.check}
                      onClick={() =>
                        check_product_item(shopIndex, productIndex)
                      }
                    ></input>
                    <Image
                      src={product.Image_url}
                      alt="product_img"
                      width={100}
                      height={100}
                    ></Image>
                    <p>{product.Product_title}</p>
                  </div>
                  <div className="cart_prodcut_container_right_section">
                    <p>{product.Option_price}</p>
                    <div className="cart_quantity_container">
                      <button
                        onClick={() => sub_quantity(shopIndex, productIndex)}
                      >
                        <Image
                          src="/sub_icon.png"
                          width={20}
                          height={20}
                          alt="sub_icon"
                        />
                      </button>
                      <p>{product.Quantity}</p>
                      <button
                        onClick={() => {
                          add_quantity(shopIndex, productIndex);
                        }}
                      >
                        <Image
                          src="/plus_icon.png"
                          width={20}
                          height={20}
                          alt="plus icon"
                        />
                      </button>
                    </div>
                    <p className="total_price_cart">{product.total}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        delete_product(shopIndex, productIndex);
                      }}
                    >
                      <Image
                        src="/trash.png"
                        height={20}
                        width={20}
                        alt="delete_img"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="cart_checkout_container">
        <div className="cart_checkout_container_left">
          <input
            type="checkbox"
            checked={checkdedAllProduct}
            onClick={checkAllProducts}
          ></input>
          <p>Chon tat ca ({total_product}) san pham</p>
        </div>
        <div className="cart_checkout_container_right">
          <p>Tong thanh toan({total_checked_products} san pham):</p>
          <p className="total_price_cart_checkout">{total_checked_price}</p>
          <button onClick={handle_checkout}>Thanh toan</button>
        </div>
      </div>
      {waiting_for_check && (
        <div className="overlay_cart">
          <div className="checkbox_container_cart">
            <p>Delete {name_product_want_to_delete}?</p>
            <div>
              <button className="btn_cancel_cart_check" onClick={handle_cancel}>
                Cancel
              </button>
              <button className="btn_delete_cart_check" onClick={handle_delete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
