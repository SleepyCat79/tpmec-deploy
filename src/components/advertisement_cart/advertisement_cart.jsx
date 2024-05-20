"use client";
import Image from "next/image";
import "./advertisement.css";
import { useRouter } from "next/navigation";
export default function AdvertisementCart({ advertisement, user_id }) {
  const router = useRouter();
  function showDetails() {
    router.push(`/homepage/${user_id}/shop/${advertisement.User_ID}`);
  }
  return (
    <div className="advertisement_cart_container">
      <Image
        src={advertisement.Shop_image}
        fill="true"
        alt="advertisement_image"
      />
      <div className="shopNameAdvertisementCart">
        <h3>{advertisement.Shop_name}</h3>
      </div>

      <div className="overlay">
        <button className="detail-button" onClick={showDetails}>
          Visit this shop
        </button>
      </div>
    </div>
  );
}
