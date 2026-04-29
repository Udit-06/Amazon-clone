import "./Subtotal.css";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { useNavigate } from "react-router-dom";

function Subtotal() {
  const navigate = useNavigate();
  const [{ basket }] = useStateValue();

  const total = getBasketTotal(basket);

  const formatCurrency = (number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(number);
  };

  return (
    <div className="subtotal">
      <p>
        Subtotal ({basket?.length} items):{" "}
        <strong>{formatCurrency(total)}</strong>
      </p>

      <small className="subtotal__gift">
        <input type="checkbox" /> This order contains a gift
      </small>

      <button onClick={() => navigate("/payment")}>
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Subtotal;