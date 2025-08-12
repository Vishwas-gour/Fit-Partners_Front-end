import React from "react";

const loaderKeyframes = `
.loader {
  font-size: 40px;
  line-height: 1.5;
  font-family: system-ui, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  color: #0000;
  -webkit-text-stroke: 1px #000;
  background:
    radial-gradient(1.13em at 50% 1.6em,#000 99%,#0000 101%) calc(50% - 1.6em) 0/3.2em 100% text,
    radial-gradient(1.13em at 50% -0.8em,#0000 99%,#000 101%) 50% .8em/3.2em 100% repeat-x text;
  animation: l9 2s linear infinite;
}

.loader:before {
  content: var(--loader-text, "Loading");
}

@keyframes l9 {
  to {
    background-position: calc(50% + 1.6em) 0,
                          calc(50% + 3.2em) .8em;
  }
}
`;

function EmptyPage({
  text = "Loading",
  fontSize = "40px",
  height = "100vh",
  width = "100%",
  fullScreen = true // default to fullscreen
}) {
  return (
    <>
      <style>{loaderKeyframes}</style>
      <div
        style={{
          width: fullScreen ? width : "fit-content",
          height: fullScreen ? height : "fit-content",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: fullScreen ? "#fff" : "transparent"
        }}
      >
        <div
          className="loader"
          style={{
            "--loader-text": `"${text}"`,
            fontSize
          }}
        ></div>
      </div>
    </>
  );
}

export { EmptyPage };
