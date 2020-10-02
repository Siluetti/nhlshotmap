import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import MouseTooltip from 'react-sticky-mouse-tooltip';





// the canvas logic has been taken from here: https://medium.com/better-programming/add-an-html-canvas-into-your-react-app-176dab099a79
export default class App extends React.Component {
  // _isMounted is here only for solving an issue with data fetching:
  // https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
  _isMounted = false;
  inversedEvents = true;
  selectedPlay = null;

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
      gameEventTypes: [gameEventTypeOptions[DEFAULT_GAME_EVENT_INDEX]],
      displayAwayTeam: true,
      displayHomeTeam: true,
      isMouseTooltipVisible: false,
    }
    this.handleGameUrlChange = this.handleGameUrlChange.bind(this);
    this.handleGameEventTypeChange = this.handleGameEventTypeChange.bind(this);
    this.displayAwayTeamHandler = this.displayAwayTeamHandler.bind(this);
    this.displayHomeTeamHandler = this.displayHomeTeamHandler.bind(this);
    this.displayPeriodHandler = this.displayPeriodHandler.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.displayEventsOnOneSideHandler = this.displayEventsOnOneSideHandler.bind(this);
  }

  drawCircle(x, y, color, radius = 5){
    this.state.context.beginPath();
    this.state.context.fillStyle = color;

    var startAngle = 0; // Starting point on circle
    var endAngle = 2 * Math.PI; // End point on circle
    var anticlockwise = false; // clockwise or anticlockwise

    const circle = new Path2D();
    circle.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    this.state.context.fill(circle);
    this.state.context.closePath();
    return circle;
  }

  componentDidMount(){
    this.isMounted = true;

    if (this.canvasRef.current) {
      const renderCtx = this.canvasRef.current.getContext('2d');
      this.canvasRef.current.onmousemove = this.onMouseMove;
      if (renderCtx) {
        this.state.context = renderCtx;
      }
    }

  }

  componentDidUpdate(){
    
    if( ! this.state.context){
      return;
    }
    
    this.state.context.clearRect(0, 0, rinkWidth, rinkHeight);
    
    // Draw a left red goal line
    this.state.context.fillStyle = '#ff0000';
    this.state.context.fillRect(leftGoalLine, 0, lineWidth, rinkHeight);

    // Draw a right red goal line
    this.state.context.fillStyle = '#ff0000';
    this.state.context.fillRect(rightGoalLine, 0, lineWidth, rinkHeight);

    // Draw left blue line
    this.state.context.fillStyle = '#0000ff';
    this.state.context.fillRect(rightBlueLine, 0, lineWidth, rinkHeight);
    
    // Draw right blue line
    this.state.context.fillStyle = '#0000ff';
    this.state.context.fillRect(leftBlueLine, 0, lineWidth, rinkHeight);

    // draw center red circle
    this.drawCircle(xOmegaPoint, yOmegaPoint, '#FF0000', 10);

    if(this.state.jsonData && this.state.jsonData.liveData) {
      console.log("jsondata livedata filled");
      var allPlays = this.state.jsonData.liveData.plays.allPlays;
      
      if( ! this.state.displayAwayTeam && ! this.state.displayHomeTeam){
        // no need to render any plays
        return;
      }
      var homeTeamAbbreviation = this.state.jsonData.gameData.teams.home.triCode;
      var awayTeamAbbreviation = this.state.jsonData.gameData.teams.away.triCode;

      var i;
      var localSelectedPlay = null;
      this.state.gameEventTypes.forEach(element => {
        for (i = 0; i < allPlays.length; i++) {
          var play = allPlays[i];

          if ( ! play.coordinates || ! play.team){
            // no need to render plays where there are no team or coordinates
            continue;
          }

          if ( ! this.state.showPeriods[play.about.period-1]){
            // this play happened in period that has been filtered out by user
            continue;
          }

          if ( ! this.state.displayAwayTeam && play.team.triCode === awayTeamAbbreviation) {
            // we don't want to display away team plays
            continue;
          }
          
          if ( ! this.state.displayHomeTeam && play.team.triCode === homeTeamAbbreviation) {
            // we don't want to display home team plays
            continue;
          }
          
          if ( this.inversedEvents == false) {
            // By default the events are distributed on both ends of the ice for one team.
            // In this case the user has selected to show events on one side of the rink.
            // If period is even, we want to show the events in one side of the rink for certain team
            if ( play.about.period % 2 == 0 ) {
              // inverse the coordinates
              play.coordinates.x = -play.coordinates.x;
              play.coordinates.y = -play.coordinates.y;
            }
          }

          if (play.result.eventTypeId === element.value){
            //console.log(play.coordinates);
  
            // NHL shotmap has negative values but we have only positive.
            var translatedCoordinateX = (play.coordinates.x + 99) * horizontalTranslation;
  
            // With NHL shotmap negative y is south side  of the rink, positive is north side. 
            // For us y 0 is up north and from there we go more south the more positive the y value is
            // that's why we need to inverse the y axis by subtracting the coordinates from rinkHeight
            var translatedCoordinateY = rinkHeight - ((play.coordinates.y + 41) * verticalTranslation);
  
            //console.log("translated coordinate x "+translatedCoordinateX+" translated y "+translatedCoordinateY);
            let circle = this.drawCircle(translatedCoordinateX, translatedCoordinateY, element.color);
            if (this.state.mouseX && this.state.mouseY && this.state.context.isPointInPath(circle, this.state.mouseX, this.state.mouseY)) {
              localSelectedPlay = play;
              let circle = this.drawCircle(translatedCoordinateX, translatedCoordinateY, element.color, 20);
              
              this.state.context.fillStyle = "#000000";
              this.state.context.font = "20px Georgia";
              this.state.context.fillText(play.result.description, translatedCoordinateX+30, translatedCoordinateY);
            } 
          }
        }
      });

      if ( this.inversedEvents == false) {
        this.inversedEvents = true;
      }


      if(localSelectedPlay){
        this.selectedPlay = localSelectedPlay;
      } else {
        this.selectedPlay = null;
      }


    } else {
      console.log("checking nhl game url");
      if( ! this.state.game){
        return;
      }
      console.log("nhl game url found");
  
      this.getDataFromNhlApi();

      console.log("jsondata livedata not filled, calling API");
    }

  }

  onMouseMove(event){
    this.setState(
      {
        mouseX: event.offsetX,
        mouseY: event.offsetY,
      }
    );
  }

  getDataFromNhlApi(){
    fetch("https://statsapi.web.nhl.com/api/v1/game/"+this.state.game+"/feed/live?site=en_nhl")
        .then(response => response.json())
        .then(jsonData => {
            console.log("jsondata filled with game "+this.state.game);
            this.inversedEvents = false;
            this.setState(
              {
                showPeriods: new Array(jsonData.liveData.linescore.periods.length).fill(true),
                jsonData: jsonData,
                awayTeam: jsonData.gameData.teams.away,
                homeTeam: jsonData.gameData.teams.home,
              }
            );
        } );
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleGameUrlChange(event) {
    if(event.target.value){
      try {
        var parsedUrl = new URL(event.target.value);
      } catch (error) {
        this.setState(
          {
            jsonData: null, 
            game: game,
            nhlGameUrl: event.target.value,
            nhlGameUrlError: "Malformed URL",
          }
        );
        return;
      }
      console.log(parsedUrl.hash); 
      var result = parsedUrl.hash.replace("#", "").split(',').reduce(function (result, item) {
          var parts = item.split('=');
          result[parts[0]] = parts[1];
          return result;
      }, {});
      var game = result["game"];
      this.setState(
        {
          jsonData: null, 
          game: game,
          nhlGameUrl: event.target.value,
          nhlGameUrlError: null,
        }
      );  
    } else {
      this.setState(
        {
          jsonData: null, 
          game: null,
          nhlGameUrl: null,
          nhlGameUrlError: null,
          awayTeam: null,
          homeTeam: null,
        }
      );  
    }
  }

  handleGameEventTypeChange(event, value) {
    console.log(value);
    this.setState(
      {
        gameEventTypes: value,
      }
    );
  }

  displayAwayTeamHandler(event){
    this.setState(
      {
        displayAwayTeam: event.target.checked,
      }
    );

  }

  displayHomeTeamHandler(event){
    this.setState(
      {
        displayHomeTeam: event.target.checked,
      }
    );
  }

  displayPeriodHandler(event){
    console.log(this.state.showPeriods);
    console.log("Changing value "+event.target.value);

    let showPeriods = this.state.showPeriods;
    showPeriods[event.target.value] = event.target.checked;
    this.setState({showPeriods: showPeriods});
  }
  
  displayEventsOnOneSideHandler(event){
    console.log("Changing showEventsOnOneSide "+event.target.checked);

    this.inversedEvents = false;
    // this is only for triggering event
    this.setState({showEventsOnOneSide: event.target.checked});
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
            <input type="text" onChange={this.handleGameUrlChange} style={{width: "60%"}} />
          </label>
          {this.state.nhlGameUrlError && <p style={{color:"red"}}>{this.state.nhlGameUrlError}</p>}
          <p>Game:  {this.state.game} </p>
        </form>

        <p>
          {this.state.awayTeam && <Checkbox value="awayTeamCheckBox" defaultChecked={this.state.displayAwayTeam} onChange={this.displayAwayTeamHandler} />}
          {this.state.awayTeam && this.state.awayTeam.name}&nbsp;
          @ 
          {this.state.homeTeam && <Checkbox value="homeTeamCheckBox" defaultChecked={this.state.displayHomeTeam} onChange={this.displayHomeTeamHandler} />}
          {this.state.homeTeam && this.state.homeTeam.name}
        </p>

        <Autocomplete
          multiple
          filterSelectedOptions
          id="gameEventTypesAutoComplete"
          options={gameEventTypeOptions} 
          onChange={this.handleGameEventTypeChange} 
          getOptionLabel={(option) => option.label}
          defaultValue={[gameEventTypeOptions[DEFAULT_GAME_EVENT_INDEX]]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Filter game events"
              placeholder="Game event types" 
            />
          )}
        />
        
        <p>Show periods:</p>
        {this.state.jsonData &&
          Array.apply(null, { length: this.state.jsonData.liveData.linescore.periods.length}).map((e, i) => (
            <span className="periodHandlerSpan" key={i}>
              <Checkbox defaultChecked={true} value={i} onChange={this.displayPeriodHandler} />
                {this.state.jsonData.liveData.linescore.periods[i].ordinalNum}
            </span>
          ))
        }

        <br/>
        <span>Single rink side:</span>
        {this.state.jsonData &&
          <Tooltip title="If selected, show events on one side of the rink for each team (away team goal left, home team goal right). If unselected, show events like they happened in the game (switching rink sides apply).">
            <Checkbox defaultChecked={true} value="showEventsOnOneSideOfTheRink" onChange={this.displayEventsOnOneSideHandler} />
          </Tooltip>
        }

        <br/>

        <Box style={{backgroundColor: gameEventTypeOptions[0].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[0].label}</span>
        
        <Box style={{backgroundColor: gameEventTypeOptions[1].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[1].label}</span>

        <Box style={{backgroundColor: gameEventTypeOptions[2].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[2].label}</span>

        <Box style={{backgroundColor: gameEventTypeOptions[3].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[3].label}</span>

        <Box style={{backgroundColor: gameEventTypeOptions[4].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[4].label}</span>

        <Box style={{backgroundColor: gameEventTypeOptions[5].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[5].label}</span>

        <Box style={{backgroundColor: gameEventTypeOptions[6].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[6].label}</span>

        <Box style={{backgroundColor: gameEventTypeOptions[7].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[7].label}</span>

        <Box style={{backgroundColor: gameEventTypeOptions[8].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{gameEventTypeOptions[8].label}</span>


        <span style={{display: "block"}}/>
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
        <MouseTooltip
          visible={this.selectedPlay}
          offsetX={15}
          offsetY={10}
        >
          {this.selectedPlay &&
          <span>
            <p>{this.selectedPlay.team.name}<br/>
            {this.selectedPlay.result.event}<br/>
            {this.selectedPlay.result.description}<br/>
            Period: {this.selectedPlay.about.ordinalNum}<br/>
            Period time: {this.selectedPlay.about.periodTime}</p>
          </span>
        }
        </MouseTooltip>
        <p>Width:  {window.innerWidth} </p>        
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
    // goal lines are 11 feet from the end boards which means 5.5 % and 94.5 %
    var leftGoalLine = rinkWidth * 0.055;
    var rightGoalLine = rinkWidth * 0.945;
    var lineWidth = rinkWidth * 0.0025;
    // Blue lines are 75 feet from the end boards which makes 32.5 % and 67.5 %
    var leftBlueLine = rinkWidth * 0.325;
    var rightBlueLine = rinkWidth * 0.675;
    const DEFAULT_GAME_EVENT_INDEX = 3;
    
    var gameEventTypeOptions = [
/*      { value: 'GAME_SCHEDULED', label: 'Game Scheduled' },
      { value: 'PERIOD_READY', label: 'Period ready' },
      { value: 'PERIOD_START', label: 'Period starts' },*/
      { value: 'FACEOFF', label: 'Faceoffs', color: '#FF0000' },
//      { value: 'STOP', label: 'Stops', color: '#000000' },
      { value: 'HIT', label: 'Hits', color: '#D789D7' },
      { value: 'BLOCKED_SHOT', label: 'Blocked shots', color: '#00FF00' },
      { value: 'SHOT', label: 'Shots', color: '#000000' },
      { value: 'TAKEAWAY', label: 'Takeaways', color: '#FF5200' },
      { value: 'MISSED_SHOT', label: 'Missed shots', color: '#0000FF' },
      { value: 'GOAL', label: 'Goals', color: '#d2e603' },
      { value: 'GIVEAWAY', label: 'Giveaways', color: '#6F0000' },
      { value: 'PENALTY', label: 'Penalties', color: '#F0A500' },
/*      { value: 'PERIOD_END', label: 'Period ends' },
      { value: 'PERIOD_OFFICIAL', label: 'Period officials' },
      { value: 'GAME_END', label: 'Game end' },
      { value: 'GAME_OFFICIAL', label: 'Game official' }*/
    ]
//export default Canvas
ReactDOM.render(
  <App />,
  document.getElementById('root')
);