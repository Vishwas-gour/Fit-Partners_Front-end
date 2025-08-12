import React from 'react';

function Loader({ height, width , text, fontSize = "40px", strokeColor = "#000" }) {
  return (
    <>
      <style>{`
        .loader {
          width: fit-content;
          font-size: ${fontSize};
          line-height: 1.5;
          font-family: system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: #0000;
          -webkit-text-stroke: 1px ${strokeColor};
          background:
            radial-gradient(1.13em at 50% 1.6em, ${strokeColor} 99%, #0000 101%) calc(50% - 1.6em) 0/3.2em 100% text,
            radial-gradient(1.13em at 50% -0.8em, #0000 99%, ${strokeColor} 101%) 50% .8em/3.2em 100% repeat-x text;
          animation: l9 2s linear infinite;
        }
        .loader:before {
          content: "${text}";
        }
        @keyframes l9 {
          to {
            background-position: calc(50% + 1.6em) 0, calc(50% + 3.2em) .8em;
          }
        }
      `}</style>

      <div style={{
        height,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="loader"></div>
      </div>
    </>
  );
}

export default Loader;
