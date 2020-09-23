import React, { useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const canvasRef = React.useRef(null);

  const [context, setContext] = React.useState(null);

  React.useEffect(() => {}, [context]);

  // According to Wikipedia https://en.wikipedia.org/wiki/Ice_hockey_rink#:~:text=Most%20North%20American%20rinks%20follow,m)%20from%20the%20end%20boards.
  // ice hockey rink is by default 200 feet times 85 feet
  // so let's set the width to 80 % of the window width and then multiply this with 42.5 % to get the height
  const windowWidth = window.innerWidth;
  const rinkWidth = windowWidth * 0.8;
  const rinkHeight = rinkWidth * 0.425;
  // corner radius is 28 feet which makes it 14 %
  var borderRadiusStyle = rinkWidth * 0.14;
  borderRadiusStyle = borderRadiusStyle+"px";
  // goal lines are 11 feet from the end boards which means 5.5 %
  // TODO add goal lines
  // Blue lines are 75 feet from the end boards which makes 32,5 %
  // TODO add blue lines

  return (
    <div
      style={{
        textAlign: 'center',
      }}>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={rinkWidth}
        height={rinkHeight}
        style={{
          border: '2px solid #000',
          borderRadius: borderRadiusStyle,
          marginTop: 10,
        }}
      ></canvas>

      <p>Koko:  {window.innerWidth} </p>
    </div>
  );
}

//export default Canvas
export default App;
