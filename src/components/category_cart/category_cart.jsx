import "./category_cart.css";
import Image from "next/image";
export default function CategoryCart({ category, userID }) {
  return (
    <button className="category-cart">
      <div className="category-cart-image">
        <Image src={category.img} fill="true" />
      </div>
      <div className="category-cart__info">
        <h3>{category.name}</h3>
      </div>
    </button>
  );
}
