import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Payments from "./pages/Payments.jsx";
import NavBar from "./components/NavBar.jsx";
import { Authenticator, View } from "@aws-amplify/ui-react";
import NotFound from "./pages/NotFound.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/pagos" Component={Payments} />
          <Route path="/" Component={App} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  </React.StrictMode>
);
