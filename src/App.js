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
import { connect } from "react-redux";
import {selectStartDateAction, selectEndDateAction} from "./actions/selectDateAction";
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'; 
import {format} from 'date-fns'; 
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '@material-ui/lab/TabPanel';
import AppBar from '@material-ui/core/AppBar';
import GameEventTypeLegend from "./components/GameEventTypeLegend";
import { GAME_EVENT_TYPE_OPTIONS, DEFAULT_GAME_EVENT_INDEX } from "./constants/gameEventTypeConstants";
import { getRinkDimensions } from "./constants/rinkDimensions";


// the canvas logic has been taken from here: https://medium.com/better-programming/add-an-html-canvas-into-your-react-app-176dab099a79
class App extends React.Component {
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
      gameEventTypes: [GAME_EVENT_TYPE_OPTIONS[DEFAULT_GAME_EVENT_INDEX]],
      displayAwayTeam: true,
      displayHomeTeam: true,
      isMouseTooltipVisible: false,
      tabIndex: 0,
      rinkDimensions: getRinkDimensions(window),
    }

    this.mouseTooltipDivRef = React.createRef();


    this.handleGameUrlChange = this.handleGameUrlChange.bind(this);
    this.handleGameEventTypeChange = this.handleGameEventTypeChange.bind(this);
    this.displayAwayTeamHandler = this.displayAwayTeamHandler.bind(this);
    this.displayHomeTeamHandler = this.displayHomeTeamHandler.bind(this);
    this.displayPeriodHandler = this.displayPeriodHandler.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.displayEventsOnOneSideHandler = this.displayEventsOnOneSideHandler.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
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

  drawCircleWithBorder(x, y, color, radius = 5, borderColor = 'red', borderWidth = '2'){
    this.state.context.beginPath();
    this.state.context.fillStyle = color;

    var startAngle = 0; // Starting point on circle
    var endAngle = 2 * Math.PI; // End point on circle
    var anticlockwise = false; // clockwise or anticlockwise

    const circle = new Path2D();
    circle.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    this.state.context.fill(circle);
    this.state.context.lineWidth = borderWidth;
    this.state.context.strokeStyle = borderColor;
    this.state.context.stroke(circle);
    this.state.context.closePath();
    return circle;
  }

  drawArcWithBorder(x, y, color, radius = 5, borderColor = 'red', borderWidth = '2', startAngle = 0, endAngle = Math.PI){
    this.state.context.beginPath();
    this.state.context.fillStyle = color;

    var anticlockwise = false; // clockwise or anticlockwise

    const arc = new Path2D();
    arc.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    this.state.context.fill(arc);
    this.state.context.lineWidth = borderWidth;
    this.state.context.strokeStyle = borderColor;
    this.state.context.stroke(arc);
    this.state.context.closePath();
    return arc;
  }

  drawRoundedRectangle( x = this.state.rinkDimensions.leftGoalLine - (this.state.rinkDimensions.rinkWidth * 0.0165), 
                        y = this.state.rinkDimensions.goalCreaseVerticalPosition - (this.state.rinkDimensions.rinkWidth * 0.015), 
                        width = (this.state.rinkDimensions.rinkWidth * 0.0165), 
                        height = (this.state.rinkDimensions.rinkWidth * 0.03), 
                        fillColor = '#FFFFFF',
                        topLeftRadius = 5, 
                        topRightRadius = 0, 
                        bottomLeftRadius = 5, 
                        bottomRightRadius = 0, 
                        borderWidth = 2, 
                        borderColor = '#FF0000'){
    this.state.context.fillStyle = fillColor;
    this.state.context.beginPath();
    this.state.context.moveTo(x+width, y+height);
    this.state.context.arcTo( x, 
                              y + height, 
                              x,
                              y, 
                              bottomLeftRadius);
    this.state.context.arcTo( x,
                              y,  
                              x+width,
                              y, 
                              topLeftRadius);
    this.state.context.arcTo( x+width,
                              y, 
                              x+width,
                              y+height, 
                              topRightRadius);
    this.state.context.arcTo( x+width,
                              y+height, 
                              x,
                              y+height, 
                              bottomRightRadius);
    this.state.context.fill();
    this.state.context.lineWidth = borderWidth;
    this.state.context.strokeStyle = borderColor;
    this.state.context.stroke();
    this.state.context.closePath();
  }

  componentDidMount(){
    this.isMounted = true;

    window.addEventListener('resize', this.updateDimensions);
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
    
    let rinkWidth = this.state.rinkDimensions.rinkWidth;
    let rinkHeight = this.state.rinkDimensions.rinkHeight;
    // corner radius is 28 feet which makes it 14 %
    let xOmegaPoint = this.state.rinkDimensions.xOmegaPoint;
    let yOmegaPoint = this.state.rinkDimensions.yOmegaPoint;
    // the NHL API gives x values from -99 to +99. That gives 199 different values when you count 0
    let horizontalTranslation = this.state.rinkDimensions.horizontalTranslation;
    // the NHL API gives y values from -41 to +41. That gives 83 different values when you count 0
    let verticalTranslation = this.state.rinkDimensions.verticalTranslation;
    // goal lines are 11 feet from the end boards which means 5.5 % and 94.5 % of rink width
    let leftGoalLine = this.state.rinkDimensions.leftGoalLine;
    let rightGoalLine = this.state.rinkDimensions.rightGoalLine;
    let centreLine = this.state.rinkDimensions.centreLine;
    let centreLineWidth = this.state.rinkDimensions.centreLineWidth;

    let lineWidth = this.state.rinkDimensions.lineWidth;
    // Blue lines are 75 feet from the end boards which makes 32.5 % and 67.5 % of rink width
    let leftBlueLine = this.state.rinkDimensions.leftBlueLine;
    let rightBlueLine = this.state.rinkDimensions.rightBlueLine;
    // faceoff circle is 30 feet in diameter, meaning 15 by radius, which means 7,5 % of rink width
    let faceoffCircleRadius = this.state.rinkDimensions.faceoffCircleRadius;
    // faceoff spot is 1 foot in diameter, meaning 0,5 foot in radius, which means 0,25 % of rink width
    let centerFaceoffSpotRadius = this.state.rinkDimensions.centerFaceoffSpotRadius;
    // for all other faceoff spots the radius is 2 feet
    let faceoffSpotRadius = this.state.rinkDimensions.faceoffSpotRadius;
    
    // According usahockeyrulebook https://www.usahockeyrulebook.com/page/show/1082185-rule-104-face-off-spots-and-face-off-circles
    // section d
    // twenty feet (20') from the back of the goal lines, meaning leftGoalLine + (20 / 200=) 10 % 
    let awayTeamDefendingFaceoffSpotHorizontalPosition = this.state.rinkDimensions.awayTeamDefendingFaceoffSpotHorizontalPosition;
    // twenty feet (20') from the back of the goal lines, meaning rightGoalLine - (20 / 200=) 10 % 
    let homeTeamDefendingFaceoffSpotHorizontalPosition = this.state.rinkDimensions.homeTeamDefendingFaceoffSpotHorizontalPosition;

    // section c
    // five feet (5') from the neutral zone side of the blue lines, meaning left blue line position + (5/200 =) 2,5 % 
    let awayTeamNeutralFaceoffSpotHorizontalPosition = this.state.rinkDimensions.awayTeamNeutralFaceoffSpotHorizontalPosition;
    // five feet (5') from the neutral zone side of the blue lines, right blue line position - (5/200 =) 2,5 %
    let homeTeamNeutralFaceoffSpotHorizontalPosition = this.state.rinkDimensions.homeTeamNeutralFaceoffSpotHorizontalPosition;

    // all top faceoff spots are in the same vertical position, which is 21,25 feet from top (rink height of 85 feet divided by 4)
    let topFaceoffSpotsVerticalPositions = this.state.rinkDimensions.topFaceoffSpotsVerticalPositions;
    
    // all top faceoff spots are in the same vertical position, which is 21,25 feet from bottom (rink height of 85 feet divided by 4 multiplied with 3)
    let bottomFaceoffSpotsVerticalPositions = this.state.rinkDimensions.bottomFaceoffSpotsVerticalPositions;

    // goal crease is 8 feet in diameter, meaning 4 in radius 4 / 200 = 2 % 
    let goalCreaseRadius = this.state.rinkDimensions.goalCreaseRadius;
    let goalCreaseVerticalPosition = this.state.rinkDimensions.goalCreaseVerticalPosition;

    // According to https://en.wikipedia.org/wiki/Goal_(ice_hockey)
    // goal is 3,3 feet deep, which translates to (3,3 / 200 =) 1,65 %
    let goalDeepness = this.state.rinkDimensions.goalDeepness;
    
    // goal is 6 feet wide, so half goal width is 6 feet, which translates to (6 / 200 =) 3 %
    let goalWidth = this.state.rinkDimensions.goalWidth;


    

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

    // Draw a red faceoff circle
    this.drawCircleWithBorder(xOmegaPoint, yOmegaPoint, '#FFFFFF', faceoffCircleRadius);
        
    // Draw a red centre line
    this.state.context.fillStyle = '#ff0000';
    this.state.context.fillRect(centreLine, 0, centreLineWidth, rinkHeight);
    
    // draw center blue faceoff spot 
    this.drawCircle(xOmegaPoint, yOmegaPoint, '#0000FF', centerFaceoffSpotRadius);

    // Draw away team top red faceoff circle
    this.drawCircleWithBorder(awayTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw away team red top defending side faceoff spot 
    this.drawCircle(awayTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // Draw away team bottom red faceoff circle
    this.drawCircleWithBorder(awayTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw away team red bottom defending side faceoff spot 
    this.drawCircle(awayTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw away team red top neutral side faceoff spot 
    this.drawCircle(awayTeamNeutralFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw away team red bottom neutral side faceoff spot 
    this.drawCircle(awayTeamNeutralFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);
    
    // Draw home team bottom red faceoff circle
    this.drawCircleWithBorder(homeTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw home team red top defending side faceoff spot 
    this.drawCircle(homeTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // Draw home team bottom red faceoff circle
    this.drawCircleWithBorder(homeTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw home team red bottom defending side faceoff spot 
    this.drawCircle(homeTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw home team red top neutral side faceoff spot 
    this.drawCircle(homeTeamNeutralFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw home team red bottom neutral side faceoff spot 
    this.drawCircle(homeTeamNeutralFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);
    
    // draw away team goal crease 
    this.drawArcWithBorder(leftGoalLine+lineWidth, goalCreaseVerticalPosition, '#67C6DD', goalCreaseRadius, '#FF0000', 2, 0 - Math.PI / 2, Math.PI / 2);

    // draw home team goal crease 
    this.drawArcWithBorder(rightGoalLine, goalCreaseVerticalPosition, '#67C6DD', goalCreaseRadius, '#FF0000', 2, Math.PI / 2, Math.PI * 1.5);

    // draw away team goal
    this.drawRoundedRectangle(leftGoalLine - goalDeepness + lineWidth/2, 
                              goalCreaseVerticalPosition - (goalWidth/2), 
                              goalDeepness, 
                              goalWidth, 
                              '#FFFFFF', 
                              rinkWidth*0.003,0,rinkWidth*0.003,0, rinkWidth*0.0015, '#FF0000'
                              );
    
    // draw home team goal
    this.drawRoundedRectangle(rightGoalLine+lineWidth/2, 
                              goalCreaseVerticalPosition - (goalWidth/2), 
                              goalDeepness, 
                              goalWidth, 
                              '#FFFFFF', 
                              0,rinkWidth*0.003,0,rinkWidth*0.003, rinkWidth*0.0015, '#FF0000'
                              );
    
    if(this.state.jsonData && this.state.jsonData.liveData) {
      console.log("jsondata livedata filled");
      let allPlays = this.state.jsonData.liveData.plays.allPlays;
      
      if( ! this.state.displayAwayTeam && ! this.state.displayHomeTeam){
        // no need to render any plays
        return;
      }
      let homeTeamAbbreviation = this.state.jsonData.gameData.teams.home.triCode;
      let awayTeamAbbreviation = this.state.jsonData.gameData.teams.away.triCode;

      let i;
      let localSelectedPlay = null;
      this.state.gameEventTypes.forEach(element => {
        for (i = 0; i < allPlays.length; i++) {
          let play = allPlays[i];

          if ( ! play.coordinates || ! play.team){
            // no need to render plays where there are no team or coordinates
            continue;
          }

          // we have to inverse events before doing anything else as if we have filtered something out
          //  we might get some of the events inversed and some not
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
          
          if (play.result.eventTypeId === element.value){
            //console.log(play.coordinates);
  
            // NHL shotmap has negative values but we have only positive.
            let translatedCoordinateX = (play.coordinates.x + 99) * horizontalTranslation;
  
            // With NHL shotmap negative y is south side  of the rink, positive is north side. 
            // For us y 0 is up north and from there we go more south the more positive the y value is
            // that's why we need to inverse the y axis by subtracting the coordinates from rinkHeight
            let translatedCoordinateY = rinkHeight - ((play.coordinates.y + 41) * verticalTranslation);
  
            //console.log("translated coordinate x "+translatedCoordinateX+" translated y "+translatedCoordinateY);
            let circle = this.drawCircle(translatedCoordinateX, translatedCoordinateY, element.color);
            if (this.state.mouseX && this.state.mouseY && this.state.context.isPointInPath(circle, this.state.mouseX, this.state.mouseY)) {
              localSelectedPlay = play;
              this.drawCircle(translatedCoordinateX, translatedCoordinateY, element.color, 20);
              
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
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.setState(
      { 
        rinkDimensions: getRinkDimensions(window),
      }
    );
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
      let result = parsedUrl.hash.replace("#", "").split(',').reduce(function (result, item) {
          let parts = item.split('=');
          result[parts[0]] = parts[1];
          return result;
      }, {});
      let game = result["game"];
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
  
  handleTabChange(event, newValue){
    this.setState({
      tabIndex: newValue,
    });
  }

  render() {
    return (
      <div
        style={{
          textAlign: 'center',
        }}>
      
      <AppBar position="static">
        <Tabs 
          value={this.state.tabIndex} 
          onChange={this.handleTabChange}>
          <Tab label="Games with datepicker" />
          <Tab label="Games with URL" />
        </Tabs>
      </AppBar>
      <div hidden={this.state.tabIndex != 0}>
      <p>{format(this.props.startDate, "'Today is a' d.M.yyyy")}</p>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            id="gamesStartDatePicker"
            label="Start date"
            autoOk={true}
            value={this.props.startDate}
            onChange={(date) => this.props.selectStartDateAction(date)} />

          <DatePicker 
            id="gamesEndDatePicker"
            label="End date"
            autoOk={true}
            value={this.props.endDate}
            onChange={(date) => this.props.selectEndDateAction(date)} /> 
        </MuiPickersUtilsProvider>

      </div>
      <div hidden={this.state.tabIndex != 1}>
        <form onSubmit={this.handleSubmit} style={{width: "100%"}}>
          <label style={{width: "100%"}}>
            <p>NHL game URL:</p>
            <input type="text" onChange={this.handleGameUrlChange} style={{width: "60%"}} />
          </label>
          {this.state.nhlGameUrlError && <p style={{color:"red"}}>{this.state.nhlGameUrlError}</p>}
          <p>Game:  {this.state.game} </p>
        </form>

      </div>



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
          options={GAME_EVENT_TYPE_OPTIONS} 
          onChange={this.handleGameEventTypeChange} 
          getOptionLabel={(option) => option.label}
          defaultValue={[GAME_EVENT_TYPE_OPTIONS[DEFAULT_GAME_EVENT_INDEX]]}
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

        <GameEventTypeLegend />
        
        <span style={{display: "block"}}/>
        <canvas
          id="canvas"
          ref={this.canvasRef}
          width={this.state.rinkDimensions.rinkWidth}
          height={this.state.rinkDimensions.rinkHeight}
          style={{
            border: '2px solid #000',
            borderRadius: this.state.rinkDimensions.borderRadiusStyle,
            marginTop: 10,
          }}
        ></canvas>
        <MouseTooltip
          visible={this.selectedPlay}
          offsetX={15}
          offsetY={10} 
        >
          {this.selectedPlay &&
          <div 
            style={{            
              border: '2px solid #000',
              backgroundColor: 'white',
              textAlign: 'left',
              paddingLeft: '10px',
              paddingRight: '10px',
            }}>
            <p>{this.selectedPlay.team.name}<br/>
            {this.selectedPlay.result.event}<br/>
            {this.selectedPlay.result.description}<br/>
            Period: {this.selectedPlay.about.ordinalNum}<br/>
            Period time: {this.selectedPlay.about.periodTime}</p>
          </div>
        }
        </MouseTooltip>
        <p>Width:  {window.innerWidth} </p>        
      </div>
    );
  }
}


const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  selectStartDateAction: (date) => dispatch(selectStartDateAction(date)),
  selectEndDateAction: (date) => dispatch(selectEndDateAction(date)),
});

// connect this App.js to Redux
export default connect(mapStateToProps, mapDispatchToProps)(App);