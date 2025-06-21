// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useUserContext } from "../../context/UserContext";

// const Checkout = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [finalTotal, setFinalTotal] = useState(0);
//   const { user } = useUserContext();

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartItems(storedCart);
//     const subtotal = storedCart.reduce((acc, item) => acc + item.pricing, 0);
//     const discount = subtotal * 0.15;
//     setFinalTotal(Math.round(subtotal - discount));
//   }, []);

//   const handleKhaltiPayment = async () => {
//     try {
//       // Step 1: Create Order
//       const orderRes = await axios.post("http://localhost:4000/order/khalti/init", {
//         userId: user._id,
//         userName: user.name,
//         userEmail: user.email,
//         instructorId: cartItems[0]?.instructorId || "instructor001",
//         instructorName: cartItems[0]?.instructorName || "Instructor",
//         courseImage: cartItems[0]?.image || "",
//         courseTitle: "Multiple Courses",
//         courseId: cartItems.map((item) => item._id),
//         coursePricing: finalTotal,
//       });

//       const { orderId } = orderRes.data.data;

//       // Step 2: Configure Khalti Widget
//       const config = {
//         publicKey: "test_public_key_c3b2272c5bb542508e5de4e8cf1cbdfe",
//         productIdentity: orderId,
//         productName: "Course Purchase",
//         productUrl: "http://localhost:5173/checkout",
//         eventHandler: {
//           onSuccess: async (payload) => {
//             try {
//               const verifyRes = await axios.post("http://localhost:4000/order/khalti/verify", {
//                 token: payload.token,
//                 amount: payload.amount,
//                 orderId: orderId,
//               });
//               alert("Payment Successful!");
//               console.log("Verified:", verifyRes.data);
//             } catch (err) {
//               console.error("Verification failed:", err);
//               alert("Payment verification failed");
//             }
//           },
//           onError: (error) => {
//             console.error("Khalti error:", error);
//             alert("Khalti Payment Failed");
//           },
//           onClose: () => {
//             console.log("Khalti widget closed");
//           },
//         },
//         paymentPreference: ["KHALTI"],
//       };

//       const checkout = new window.KhaltiCheckout(config);
//       checkout.show({ amount: finalTotal * 100 }); // amount in paisa
//     } catch (err) {
//       console.error("Order creation failed:", err);
//       alert("Failed to initiate order");
//     }
//   };

//   const subtotal = cartItems.reduce((acc, item) => acc + item.pricing, 0);
//   const discount = subtotal * 0.15;

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Checkout</h1>

//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         <h2 className="text-lg font-semibold mb-2">Summary</h2>
//         <ul>
//           {cartItems.map((item) => (
//             <li key={item._id} className="flex justify-between items-center mb-2">
//               <span>{item.title}</span>
//               <span className="font-semibold">Rs. {item.pricing}</span>
//             </li>
//           ))}
//         </ul>
//         <div className="flex justify-between mt-4">
//           <span className="font-semibold">Subtotal</span>
//           <span className="font-semibold">Rs. {subtotal}</span>
//         </div>
//         <div className="flex justify-between mt-2">
//           <span className="font-semibold">Discount (15%)</span>
//           <span className="font-semibold text-green-600">- Rs. {discount.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between mt-2 font-bold text-blue-600">
//           <span>Total</span>
//           <span>Rs. {finalTotal}</span>
//         </div>
//       </div>

//       <button
//         onClick={handleKhaltiPayment}
//         className="bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded w-full"
//       >
//         Pay with Khalti
//       </button>
//     </div>
//   );
// };

// export default Checkout;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const { user } = useUserContext();
  const navigate = useNavigate();

useEffect(() => {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  setCartItems(storedCart);
  const subtotal = storedCart.reduce((acc, item) => acc + item.pricing, 0);
  const discount = subtotal * 0.15;
  setFinalTotal(Math.round(subtotal - discount));

  // console.log(" user:", user);         
  // console.log("cartItems:", storedCart); 
}, [user]);

const handleSimulatedPayment = async () => {
  const userId = user?._id || user?.id;

  if (!userId) {
    alert(" User not loaded yet. Please wait.");
    return;
  }

  if (!cartItems.length) {
    alert("Cart is empty.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4000/order/simulate-payment-success", {
      userId,
      cartItems: cartItems.map((course) => ({
        _id: course._id,
        title: course.title,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        image: course.image,
      })),
    });

    if (response.data.success) {
      alert("Payment successful!");
      localStorage.removeItem("cart");
      navigate("/mylearning");
    } else {
      alert("Payment failed.");
    }
  } catch (err) {
    // console.error("Simulated payment failed:", err);
    alert("Something went wrong while processing your order.");
  }
};

  const subtotal = cartItems.reduce((acc, item) => acc + item.pricing, 0);
  const discount = subtotal * 0.15;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <ul>
          {cartItems.map((item) => (
            <li key={item._id} className="flex justify-between items-center mb-2">
              <span>{item.title}</span>
              <span className="font-semibold">Rs. {item.pricing}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <span className="font-semibold">Subtotal</span>
          <span className="font-semibold">Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-semibold">Discount (15%)</span>
          <span className="font-semibold text-green-600">- Rs. {discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-2 font-bold text-blue-600">
          <span>Total</span>
          <span>Rs. {finalTotal}</span>
        </div>
      </div>

      <button
  onClick={handleSimulatedPayment}
  disabled={!user}
  className={`${
    !user ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  } text-white font-semibold py-2 px-4 rounded w-full`}
>
  Simulate Payment (Success)
</button>
    </div>
  );
};

export default Checkout;
