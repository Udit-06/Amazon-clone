import { useState, useEffect } from 'react';
import './Orders.css';
import { useStateValue } from "./StateProvider";
import Order from './Order';

// 🔥 Firebase v9 imports
import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

function Orders() {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "users", user.uid, "orders"),
        orderBy("created", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return () => unsubscribe(); // ✅ cleanup
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <div className='orders'>
      <h1>Your Orders</h1>

      <div className='orders__order'>
        {orders?.map((order) => (
          <Order key={order.id} order={order} /> 
        ))}
      </div>
    </div>
  );
}

export default Orders;