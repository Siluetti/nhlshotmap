import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

// the canvas logic has been taken from here: https://medium.com/better-programming/add-an-html-canvas-into-your-react-app-176dab099a79
export default class App extends React.Component {
  // _isMounted is here only for solving an issue with data fetching:
  // https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
  _isMounted = false;

  set isMounted(isMounted){
    this._isMounted = isMounted;
  }

  // _isMounted needs a getter, otherwise it will give following error
  // https://stackoverflow.com/questions/36553274/uncaught-typeerror-cannot-set-property-playerno-of-which-has-only-a-getter-on
  get isMounted(){
      return this._isMounted;
  }

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef(null);
    this.state = {
      context: null,
      jsonData: null,
      nhlGameUrl: null,
      game: null,
      awayTeam: null,
      homeTeam: null,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  drawCircle(x, y, color, radius = 5){
    this.state.context.beginPath();
    this.state.context.fillStyle = color;

    var startAngle = 0; // Starting point on circle
    var endAngle = 2 * Math.PI; // End point on circle
    var anticlockwise = false; // clockwise or anticlockwise

    this.state.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    this.state.context.fill();
    this.state.context.closePath();
  }

  componentDidMount(){
    this.isMounted = true;
  }

  componentDidUpdate(){
    // goal lines are 11 feet from the end boards which means 5.5 % and 94.5 %
    var leftGoalLine = rinkWidth * 0.055;
    var rightGoalLine = rinkWidth * 0.945;
    var lineWidth = rinkWidth * 0.0025;
    // Blue lines are 75 feet from the end boards which makes 32.5 % and 67.5 %
    var leftBlueLine = rinkWidth * 0.325;
    var rightBlueLine = rinkWidth * 0.675;
    
    if (this.canvasRef.current) {
      const renderCtx = this.canvasRef.current.getContext('2d');

      if (renderCtx) {
        this.state.context = renderCtx;
      }
    }
    
    if(this.state.jsonData && this.state.jsonData.liveData) {
      console.log("jsondata livedata filled");
    } else {
      console.log("checking nhl game url");
      if(this.state.game){
        console.log("nhl game url found");
  
        fetch("https://statsapi.web.nhl.com/api/v1/game/"+this.state.game+"/feed/live?site=en_nhl")
          .then(response => response.json())
          .then(jsonData => {
            if(this.isMounted){
              this.setState({ jsonData: jsonData });
              console.log("jsondata filled with game "+this.state.game);
              var allPlays = jsonData.liveData.plays.allPlays;
              this.setState(
                {
                  jsonData: jsonData,
                  awayTeam: jsonData.gameData.teams.away.name,
                  homeTeam: jsonData.gameData.teams.home.name,
                }
              );
              if(this.state.context) {
                this.drawCircle(xOmegaPoint, yOmegaPoint, '#FF0000', 10);
                
                var i;
                for (i = 0; i < allPlays.length; i++) {
                  var play = allPlays[i];
                  if(play.result.eventTypeId === "SHOT"){
                    //console.log(play.coordinates);

                    // NHL shotmap has negative values but we have only positive.
                    var translatedCoordinateX = (play.coordinates.x + 99) * horizontalTranslation;

                    // With NHL shotmap negative y is south side  of the rink, positive is north side. 
                    // For us y 0 is up north and from there we go more south the more positive the y value is
                    // that's why we need to inverse the y axis by subtracting the coordinates from rinkHeight
                    var translatedCoordinateY = rinkHeight - ((play.coordinates.y + 41) * verticalTranslation);

                    //console.log("translated coordinate x "+translatedCoordinateX+" translated y "+translatedCoordinateY);
                    this.drawCircle(translatedCoordinateX, translatedCoordinateY, '#000000');

                  }
                }
              }

            }else {
              console.log("jsondata not filled as the component was not mounted");
            }

          } );

        console.log("jsondata livedata not filled, calling API");

      }

    }


    // Draw a left red goal line
    if (this.state.context) {
      this.state.context.fillStyle = '#ff0000';
      this.state.context.fillRect(leftGoalLine, 0, lineWidth, rinkHeight);
    }

    // Draw a right red goal line
    if (this.state.context) {
      this.state.context.fillStyle = '#ff0000';
      this.state.context.fillRect(rightGoalLine, 0, lineWidth, rinkHeight);
    }

    // Draw left blue line
    if (this.state.context) {
      this.state.context.fillStyle = '#0000ff';
      this.state.context.fillRect(rightBlueLine, 0, lineWidth, rinkHeight);
    }
    
    // Draw right blue line
    if (this.state.context) {
      this.state.context.fillStyle = '#0000ff';
      this.state.context.fillRect(leftBlueLine, 0, lineWidth, rinkHeight);
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleChange(event) {
    var parsedUrl = new URL(event.target.value);
    console.log(parsedUrl.hash); 
    var result = parsedUrl.hash.replace("#", "").split(',').reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});
    var game = result["game"];

    if(this.state.context){
      this.state.context.clearRect(0, 0, rinkWidth, rinkHeight);
    }
  
    this.setState(
        {
          jsonData: null, 
          game: game,
          nhlGameUrl: event.target.value,
        }
      );
  }

  render() {
    return (
      <div
        style={{
          textAlign: 'center',
        }}>
      <form onSubmit={this.handleSubmit} style={{width: "100%"}}>
        <label style={{width: "100%"}}>
          <p>NHL game URL:</p>
          <input type="text" value={this.state.nhlGameUrl} onChange={this.handleChange} style={{width: "60%"}} />
        </label>
        <p>Game:  {this.state.game} </p>        
      </form>

      <p>{this.state.awayTeam} @ {this.state.homeTeam}</p>
        <canvas
          id="canvas"
          ref={this.canvasRef}
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
}

    // According to Wikipedia https://en.wikipedia.org/wiki/Ice_hockey_rink#:~:text=Most%20North%20American%20rinks%20follow,m)%20from%20the%20end%20boards.
    // ice hockey rink is by default 200 feet times 85 feet
    // so let's set the width to 80 % of the window width and then multiply this with 42.5 % to get the height
    const windowWidth = window.innerWidth;
    const rinkWidth = windowWidth * 0.8;
    const rinkHeight = rinkWidth * 0.425;
    // corner radius is 28 feet which makes it 14 %
    var borderRadiusStyle = rinkWidth * 0.14;
    borderRadiusStyle = borderRadiusStyle + "px";
    var xOmegaPoint = rinkWidth / 2;
    var yOmegaPoint = rinkHeight / 2;
    // the NHL API gives x values from -99 to +99. That gives 199 different values when you count 0
    var horizontalTranslation = rinkWidth / 199;
    // the NHL API gives y values from -41 to +41. That gives 83 different values when you count 0
    var verticalTranslation = rinkHeight / 83;
  

//export default Canvas
ReactDOM.render(
  <App />,
  document.getElementById('root')
);