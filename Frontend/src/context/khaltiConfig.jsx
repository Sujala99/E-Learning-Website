const khaltiConfig = {
  publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY, // 🔑 from .env
  productIdentity: 'eduplatform',
  productName: 'Online Courses',
  productUrl: 'http://localhost:5173',
};

export default khaltiConfig;



// const publicTestKey = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";

// const publicTestKey = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";
// import Success from "../Pages/Success";
// import { useNavigate } from "react-router-dom";

// const publicTestKey = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";

// const Payment = ({
//   cart,
//   address,
//   contact,
//   paymentMethod,
//   total,
//   setError,
//   fetchCart
// }) => {
//   const { user } = useAuthContext();
//   const userId = user ? user.id : null;
//   const [checkout, setCheckout] = useState(null);
//   const navigate = useNavigate();

//   const config = {
//     publicKey: publicTestKey,
//     productIdentity: "123766",
//     productName: "Zenstore",
//     productUrl: "http://localhost:3000",
//     eventHandler: {
//       onSuccess(payload) {



