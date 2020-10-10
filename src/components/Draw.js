export function drawCircle(context, x, y, color, radius = 5){
    context.beginPath();
    context.fillStyle = color;

    var startAngle = 0; // Starting point on circle
    var endAngle = 2 * Math.PI; // End point on circle
    var anticlockwise = false; // clockwise or anticlockwise

    const circle = new Path2D();
    circle.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    context.fill(circle);
    context.closePath();
    return circle;
  };

export function drawCircleWithBorder(context, x, y, color, radius = 5, borderColor = 'red', borderWidth = '2'){
    context.beginPath();
    context.fillStyle = color;

    var startAngle = 0; // Starting point on circle
    var endAngle = 2 * Math.PI; // End point on circle
    var anticlockwise = false; // clockwise or anticlockwise

    const circle = new Path2D();
    circle.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    context.fill(circle);
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;
    context.stroke(circle);
    context.closePath();
    return circle;
  };

export function drawArcWithBorder(context, x, y, color, radius = 5, borderColor = 'red', borderWidth = '2', startAngle = 0, endAngle = Math.PI){
    context.beginPath();
    context.fillStyle = color;

    var anticlockwise = false; // clockwise or anticlockwise

    const arc = new Path2D();
    arc.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    context.fill(arc);
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;
    context.stroke(arc);
    context.closePath();
    return arc;
  };

export function drawRoundedRectangle(context, x, 
                        y, 
                        width, 
                        height, 
                        fillColor = '#FFFFFF',
                        topLeftRadius = 5, 
                        topRightRadius = 0, 
                        bottomLeftRadius = 5, 
                        bottomRightRadius = 0, 
                        borderWidth = 2, 
                        borderColor = '#FF0000'){
    context.fillStyle = fillColor;
    context.beginPath();
    context.moveTo(x+width, y+height);
    context.arcTo( x, 
                              y + height, 
                              x,
                              y, 
                              bottomLeftRadius);
    context.arcTo( x,
                              y,  
                              x+width,
                              y, 
                              topLeftRadius);
    context.arcTo( x+width,
                              y, 
                              x+width,
                              y+height, 
                              topRightRadius);
    context.arcTo( x+width,
                              y+height, 
                              x,
                              y+height, 
                              bottomRightRadius);
    context.fill();
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;
    context.stroke();
    context.closePath();
  }