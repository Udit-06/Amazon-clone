import './Order.css';
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";

function Order({ order }) {

  const formatCurrency = (number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(number);
  };

  return (
    <div className='order'>
      <h2>Order</h2>

      <p>
        {moment.unix(order?.data?.created).format("MMMM Do YYYY, h:mma")}
      </p>

      <p className="order__id">
        <small>{order?.id}</small>
      </p>

      {order?.data?.basket?.map((item) => (
        <CheckoutProduct
          key={item.id}   // ✅ important
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          rating={item.rating}
          hideButton
        />
      ))}

      <h3 className="order__total">
        Order Total: {formatCurrency(order?.data?.amount / 100)}
      </h3>
    </div>
  );
}

export default Order;