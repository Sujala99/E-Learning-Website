import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
  const { user } = useUserContext();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const studentId = user?._id || user?.id;

    if (!studentId) {
      console.warn("Missing user or user ID");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/cart/${studentId}`);
      // Backend returns cart object with courses array
      setCartItems(response.data.courses || []);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  };

const handleRemove = async (courseId) => {
  console.log("Removing course with ID:", courseId, "for user:", user);
  try {
    const res = await axios.post("http://localhost:4000/cart/remove", {
      studentId: user._id,
      courseId,
    });
    console.log("Remove response:", res.data);
    setCartItems((prev) => prev.filter((item) => item._id !== courseId));
  } catch (error) {
    console.error("Failed to remove course from cart:", error);
  }
};

const handleCheckout = () => {
  localStorage.setItem("cart", JSON.stringify(cartItems)); // save cart temporarily
  navigate("/checkout");
};


  useEffect(() => {
    fetchCart();
  }, [user]);

  if (loading) {
    return <div className="p-6 text-center">Loading cart...</div>;
  }

  const total = cartItems.reduce((acc, item) => acc + (item.pricing || 0), 0);

  return (
    <div className="bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row">
        {/* Cart Items */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <p className="text-gray-500 mb-4">
            You have {cartItems.length} item(s) in your cart
          </p>

          {cartItems.length === 0 && (
            <div className="text-center text-gray-500">Your cart is empty.</div>
          )}

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.title}
                className="w-12 h-12 mr-4 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.lessons || 0} Lessons | {item.students || 0} Students
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold text-blue-500">
                  ₹{item.pricing}
                </span>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded mt-2 ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="w-full md:w-1/2 md:pl-4 mt-8 md:mt-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Cart Total</h2>
            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <button  
            onClick={handleCheckout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full">
              Proceed to Checkout
            </button>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Add Coupon</h3>
              <input
                type="text"
                placeholder="Enter coupon code"
                className="border rounded p-2 w-full mb-2"
              />
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full">
                Apply Coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
