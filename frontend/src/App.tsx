import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { useEffect } from "react";
import { themeChange } from "theme-change";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
};

export default App;
