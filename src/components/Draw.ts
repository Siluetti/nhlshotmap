export function drawCircle( context:CanvasRenderingContext2D, 
                            x:number, 
                            y:number, 
                            color:string, 
                            radius:number = 5):Path2D{
    context.beginPath();
    context.fillStyle = color;

    var startAngle:number = 0; // Starting point on circle
    var endAngle:number = 2 * Math.PI; // End point on circle
    var anticlockwise:boolean = false; // clockwise or anticlockwise

    const circle:Path2D = new Path2D();
    circle.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    context.fill(circle);
    context.closePath();
    return circle;
  };

export function drawCircleWithBorder( context:CanvasRenderingContext2D, 
                                      x:number, 
                                      y:number, 
                                      color:string, 
                                      radius:number = 5, 
                                      borderColor:string = 'red', 
                                      borderWidth:number = 2):Path2D{
    context.beginPath();
    context.fillStyle = color;

    var startAngle:number = 0; // Starting point on circle
    var endAngle:number = 2 * Math.PI; // End point on circle
    var anticlockwise:boolean = false; // clockwise or anticlockwise

    const circle:Path2D = new Path2D();
    circle.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    context.fill(circle);
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;
    context.stroke(circle);
    context.closePath();
    return circle;
  };

export function drawArcWithBorder(  context:CanvasRenderingContext2D, 
                                    x:number, 
                                    y:number, 
                                    color:string, 
                                    radius:number = 5,
                                    borderColor:string = 'red', 
                                    borderWidth:number = 2, 
                                    startAngle:number = 0, 
                                    endAngle:number = Math.PI):Path2D{
    context.beginPath();
    context.fillStyle = color;

    var anticlockwise:boolean = false; // clockwise or anticlockwise

    const arc:Path2D = new Path2D();
    arc.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    context.fill(arc);
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;
    context.stroke(arc);
    context.closePath();
    return arc;
  };

export function drawRoundedRectangle(context:CanvasRenderingContext2D, 
                        x:number, 
                        y:number, 
                        width:number, 
                        height:number, 
                        fillColor:string = '#FFFFFF',
                        topLeftRadius:number = 5, 
                        topRightRadius:number = 0, 
                        bottomLeftRadius:number = 5, 
                        bottomRightRadius:number = 0, 
                        borderWidth:number = 2, 
                        borderColor:string = '#FF0000'){
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