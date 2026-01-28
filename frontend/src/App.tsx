import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { useEffect } from "react";
import { themeChange } from "theme-change";

const App = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
