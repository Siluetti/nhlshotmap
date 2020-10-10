import React from 'react';
import './App.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import MouseTooltip from 'react-sticky-mouse-tooltip';
import { connect } from "react-redux";
import {selectStartDateAction, selectEndDateAction} from "./redux/actions/selectDateAction";
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'; 
import {format} from 'date-fns'; 
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import GameEventTypeLegend from "./components/GameEventTypeLegend";
import { GAME_EVENT_TYPE_OPTIONS, DEFAULT_GAME_EVENT_INDEX } from "./constants/gameEventTypeConstants";
import { getRinkDimensions } from "./constants/rinkDimensions";
import {  drawCircle, drawCircleWithBorder, drawArcWithBorder, drawRoundedRectangle} from "./components/Draw";
import {  drawRink } from "./components/DrawRink";


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
    drawRink(this.state);
    let rinkHeight = this.state.rinkDimensions.rinkHeight;
    // the NHL API gives x values from -99 to +99. That gives 199 different values when you count 0
    let horizontalTranslation = this.state.rinkDimensions.horizontalTranslation;
    // the NHL API gives y values from -41 to +41. That gives 83 different values when you count 0
    let verticalTranslation = this.state.rinkDimensions.verticalTranslation;
    
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
            let circle = drawCircle(this.state.context, translatedCoordinateX, translatedCoordinateY, element.color);
            if (this.state.mouseX && this.state.mouseY && this.state.context.isPointInPath(circle, this.state.mouseX, this.state.mouseY)) {
              localSelectedPlay = play;
              drawCircle(this.state.context, translatedCoordinateX, translatedCoordinateY, element.color, 20);
              
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