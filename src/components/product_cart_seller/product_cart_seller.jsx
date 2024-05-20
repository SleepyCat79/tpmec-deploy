import Image from "next/image";
import { useRouter } from "next/navigation";
import "./product_cart_seller.css";
export default function Product_cart_seller({
  product,
  userIdEncode,
  sellerIdEncode,
}) {
  const router = useRouter();
  function show_details() {
    router.push(
      `/seller_mode/${userIdEncode}/${sellerIdEncode}/product_list/${product.product_id}`
    );
  }

  return (
    <div className="product_cart_container">
      <div className="product_cart_image_container">
        <Image src={product.productImg} fill="true" alt="product image" />
      </div>
      <div className="product_cart_info_container">
        <div className="seller_in4_product_cart">
          <div className="seller_img_product_cart">
            <Image src={product.sellerImg} fill="true" alt="Seller Image" />
          </div>
          <p>{product.sellerName}</p>
        </div>
        <div className="product_in4_in_cart">
          <p className="product_name_cart">{product.productName}</p>
          <div className="location_product_cart">
            <Image
              src={"/location_icon.png"}
              height={15}
              width={15}
              alt="Location Icon"
            />
            <p>{product.location}</p>
          </div>
          <div className="price_container_cart">
            <div>
              <p>{product.unit}</p>
            </div>
            <div>
              <p>{product.price}</p>
            </div>
          </div>
        </div>
        {product.isDiscount && (
          <div className="discount_container_cart">
            <p>{product.percentage}% OFF</p>
          </div>
        )}
      </div>

      <button className="like_btn_cart_product">
        <Image src={"/heart_icon.png"} height={20} width={20} alt="Like Icon" />
      </button>
      <div className="overlay_cart_product">
        <button className="detail-button_cart_product" onClick={show_details}>
          View Detail
        </button>
      </div>
    </div>
  );
}
