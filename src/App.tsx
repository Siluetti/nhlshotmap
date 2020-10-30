import React from 'react';
import './App.css';
import { connect } from "react-redux";
import SingleEventMap from "./components/SingleEventMap";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import {handleTabChange} from "./statemachine/tabChanger"
import AppProps from './typescript/interfaces/AppProps';
import CookieConsent from "react-cookie-consent";

type AppState = {tabIndex: number, tabIndex2: number};
class App extends React.Component<AppProps, AppState> {
  // _isMounted is here only for solving an issue with data fetching:
  // https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
  _isMounted:boolean = false;
  
  set isMounted(isMounted:boolean){
    this._isMounted = isMounted;
  }

  // _isMounted needs a getter, otherwise it will give following error
  // https://stackoverflow.com/questions/36553274/uncaught-typeerror-cannot-set-property-playerno-of-which-has-only-a-getter-on
  get isMounted():boolean{
      return this._isMounted;
  }


  constructor(props:{}) {
    super(props);
    this.state = {
      tabIndex: 0,
      tabIndex2: 0,
    }
    this.setState = this.setState.bind(this);

  }

  componentDidMount(){
    this.isMounted = true;
  }

  componentDidUpdate(){

  }


  componentWillUnmount() {
    this.isMounted = false;
  }

  cookiesDeclined(){

  }

  cookiesAccepted(){

  }

  render() {
    return (
      <div>

        <AppBar position="static">
          <Tabs 
            value={this.state.tabIndex} 
            onChange={(event, value) => handleTabChange(value, this.setState)}
            >
            <Tab label="Single event map" />
            <Tab label="Heat map" />
            <Tab label="About" />
          </Tabs>
        </AppBar>

        <div hidden={this.state.tabIndex != 0}>
          <AppBar position="static">
            <Tabs 
              value={this.state.tabIndex2} 
              onChange={(event, value) => this.setState({tabIndex2: value})}
              >
              <Tab label="Single game" />
              <Tab label="Multiple games for single team" />
              <Tab label="Playoff series" />
              <Tab label="Single player" />
            </Tabs>
          </AppBar>

          {/* TODO: startDate, endDate, selectStartDateAction, selectEndDateAction 
          are here only because of being typescript & redux noob. Redux needs these 
          in props and typescript is forcing them in here. How to disable this forcing?  */}
          <SingleEventMap hidden={this.state.tabIndex2 != 0} 
            startDate={null} endDate={null} selectStartDateAction={null} selectEndDateAction={null}/>
          <div hidden={this.state.tabIndex2 != 1}>Multiple games for single team</div>
          <div hidden={this.state.tabIndex2 != 2}>Playoff series</div>
          <div hidden={this.state.tabIndex2 != 3}>Single player</div>


        </div>
        <div hidden={this.state.tabIndex != 1}>Heat map functionality</div>
        <div hidden={this.state.tabIndex != 2}><h1>About</h1>

          <p>TODO: This site is not affiliated with NHL. All trademarks are registered to NHL...</p>
          <p>TODO: This site is open source project. The source code can be found here ... . The license is ...</p>
          <p>Please consider donating or becoming patreon.</p>
        <p>Please understand that the data presented here can have issues and they should not be taken as definitive truth. 
          These issues may be because
        </p>
        <ul>
          <li>There is programming error that the person maintaining this page has made,</li>
          <li>There is programming error on the NHL API, or</li>
          <li>The data is incorrect because of reporting bias or human error.</li>
        </ul>
        <p>Regarding the item #3, you might want to see <a href="http://hockeyanalytics.com/Research_files/Product_Recall_for_Shot_Quality.pdf">this PDF</a>, 
        which states following:</p>
        <p><q>The source of these game summaries is the NHL’s Real Time Scoring System
        (RTSS). RTSS scorers have a tough job to do, recording each on ice “event” and
        player ice time. When it comes to a shot, the scorer records the shooter, the
        distance and the shot type by tapping several times on a screen. The time is
        recorded by the system based on one of these taps. Distance is captured by a tap
        on a screen resembling the rink. The system calculates the distance.</q></p>
        <p><q>All of this happens pretty quickly. The highest priority is the shooter, as this data
        does get summarized and published. In the heat of battle, it is easy to get the
        time, shot type and distance wrong. The database clearly has embedded errors.
        There are shots that are impossibly close together in time. There are “wrap”
        shots from 60 feet. There are “tip in” shots from 60 feet. There are likely to be
        other coding errors (slap shots coded as wrist shots). It is easy to imagine that
        the record of distance is off, at least by small amounts. It is easy to imagine that a
        “snap” shot and a “wrist” shot are frequently confused. It is easy to imagine
        that two different scorers would give us two different records of the same event.</q> </p>

        <p>The reporting bias does not only affect shots but also 
          <a href="https://www.arcticicehockey.com/2009/10/12/1081096/giveaways-and-takeaways">takeaways and giveaways</a> and 
          <a href="https://www.allaboutthejersey.com/2010/7/8/1559914/blocked-shots-the-new-jersey">blocked shots</a>.
        </p>

      </div>

      <CookieConsent
          enableDeclineButton
          location="bottom"
          buttonText="Accept"
          cookieName="cookieName"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
          onAccept={this.cookiesAccepted}
          onDecline={this.cookiesDeclined}
        >
        We use cookies.{" "}
        <span style={{ fontSize: "10px" }}>Welcome to the dark side.</span>
      </CookieConsent>
      </div>
    );
  }
}


const mapStateToProps = (state:any) => ({
  // ...state
});
const mapDispatchToProps = (dispatch:any) => ({
  // selectStartDateAction: (date) => dispatch(selectStartDateAction(date)),
  // selectEndDateAction: (date) => dispatch(selectEndDateAction(date)),
});

// connect this App.js to Redux
export default connect(mapStateToProps, mapDispatchToProps)(App);