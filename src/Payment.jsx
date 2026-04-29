import { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getBasketTotal } from "./reducer";
import axios from './axios';

// 🔥 Firebase v9
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  // 🔥 Currency formatter
  const formatCurrency = (number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(number);
  };

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios({
        method: 'post',
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`
      });

      setClientSecret(response.data.clientSecret);
    };

    if (basket.length > 0) {
      getClientSecret();
    }
  }, [basket]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (payload.error) {
      setError(payload.error.message);
      setProcessing(false);
    } else {
      const paymentIntent = payload.paymentIntent;

      // 🔥 Firebase v9 write
      await setDoc(
        doc(db, "users", user.uid, "orders", paymentIntent.id),
        {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created
        }
      );

      setSucceeded(true);
      setError(null);
      setProcessing(false);

      dispatch({
        type: 'EMPTY_BASKET'
      });

      navigate('/orders');
    }
  };

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className='payment'>
      <div className='payment__container'>
        <h1>
          Checkout (
          <Link to="/checkout">{basket?.length} items</Link>
          )
        </h1>

        {/* Address */}
        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Delivery Address</h3>
          </div>
          <div className='payment__address'>
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>India</p>
          </div>
        </div>

        {/* Items */}
        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Review items</h3>
          </div>
          <div className='payment__items'>
            {basket?.map((item) => (
              <CheckoutProduct
                key={item.id}   // ✅ important
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className='payment__section'>
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>

          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className='payment__priceContainer'>
                <h3>
                  Order Total: {formatCurrency(getBasketTotal(basket))}
                </h3>

                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? "Processing..." : "Buy Now"}</span>
                </button>
              </div>

              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;