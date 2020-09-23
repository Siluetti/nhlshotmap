import React, { useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const canvasRef = React.useRef(null);

  const [context, setContext] = React.useState(null);

  React.useEffect(() => {}, [context]);

  return (
    <div
      style={{
        textAlign: 'center',
      }}>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          border: '2px solid #000',
          marginTop: 10,
        }}
      ></canvas>
    </div>
  );
}

//export default Canvas
export default App;
