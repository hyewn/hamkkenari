import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/common.css";
import "./styles/login.css";
import "./styles/consent.css";
import "./styles/survey.css";
import "./styles/guide.css";
import "./styles/chatflow.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);