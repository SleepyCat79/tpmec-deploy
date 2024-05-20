import "./dashboard_tag.css";
import Image from "next/image";
export default function Dashboard_tag({
  name,
  rateOfChange,
  totalValue,
  isUp,
  compareWithTime,
}) {
  return (
    <div className="tag_of_dasboard_container">
      <div>
        <p>{name}</p>
      </div>
      <div className="tag_dashboard_value">
        <div>
          <Image
            src={isUp ? "/tag_up_icon.png" : "/tag_down_icon.png"}
            width={40}
            height={40}
            alt="tag_icon"
          />
          {totalValue}
        </div>
      </div>
    </div>
  );
}
