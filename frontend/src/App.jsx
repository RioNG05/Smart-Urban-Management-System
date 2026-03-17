import AppRoutes from "./routers/AppRoutes";
import { AuthProvider } from "./components/sections/auth/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2500} />
    </AuthProvider>
  );
}

export default App;
