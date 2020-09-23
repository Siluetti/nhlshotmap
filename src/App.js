import React, { useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// the canvas logic has been taken from here: https://medium.com/better-programming/add-an-html-canvas-into-your-react-app-176dab099a79

function App() {
  const canvasRef = React.useRef(null);

  const [context, setContext] = React.useState(null);
  // According to Wikipedia https://en.wikipedia.org/wiki/Ice_hockey_rink#:~:text=Most%20North%20American%20rinks%20follow,m)%20from%20the%20end%20boards.
  // ice hockey rink is by default 200 feet times 85 feet
  // so let's set the width to 80 % of the window width and then multiply this with 42.5 % to get the height
  const windowWidth = window.innerWidth;
  const rinkWidth = windowWidth * 0.8;
  const rinkHeight = rinkWidth * 0.425;
  // corner radius is 28 feet which makes it 14 %
  var borderRadiusStyle = rinkWidth * 0.14;
  borderRadiusStyle = borderRadiusStyle + "px";
  // goal lines are 11 feet from the end boards which means 5.5 % and 94.5 %
  var leftGoalLine = rinkWidth * 0.055;
  var rightGoalLine = rinkWidth * 0.945;
  var lineWidth = rinkWidth * 0.0025;
  // Blue lines are 75 feet from the end boards which makes 32.5 % and 67.5 %
  var leftBlueLine = rinkWidth * 0.325;
  var rightBlueLine = rinkWidth * 0.675;

  React.useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        setContext(renderCtx);
      }
    }

    // Draw a left red goal line
    if (context) {
      context.fillStyle = '#ff0000';
      context.fillRect(leftGoalLine, 0, lineWidth, rinkHeight);
    }

    // Draw a right red goal line
    if (context) {
      context.fillStyle = '#ff0000';
      context.fillRect(rightGoalLine, 0, lineWidth, rinkHeight);
    }

    // Draw left blue line
    if (context) {
      context.fillStyle = '#0000ff';
      context.fillRect(rightBlueLine, 0, lineWidth, rinkHeight);
    }
    
    // Draw right blue line
    if (context) {
      context.fillStyle = '#0000ff';
      context.fillRect(leftBlueLine, 0, lineWidth, rinkHeight);
    }
  }, [context]);


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
