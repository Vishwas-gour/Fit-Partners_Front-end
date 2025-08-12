import React from "react";
import ReactDOM from "react-dom/client";
import Loader from "./Loader.jsx"; // your loader component

let loaderRoot = null;

export function showLoader(duration = 3000, text = "Loading") {
  if (!loaderRoot) {
    const div = document.createElement("div");
    div.id = "global-loader";
    document.body.appendChild(div);
    loaderRoot = ReactDOM.createRoot(div);
  }

  loaderRoot.render(
    <Loader
      height="100vh"
      width="100vw"
      text={text}
      fontSize="40px"
      strokeColor="#000"
    />
  );

  setTimeout(() => {
    if (loaderRoot) {
      loaderRoot.unmount();
      document.getElementById("global-loader")?.remove();
      loaderRoot = null;
    }
  }, duration);
}
