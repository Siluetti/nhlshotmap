import React from 'react';
import './App.css';
import { connect } from "react-redux";
import SingleEventMap from "./components/SingleEventMap";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import {handleTabChange} from "./statemachine/tabChanger"

class App extends React.Component {
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
    this.state = {
      tabIndex: 0,
      tabIndex2: 0,
    }
    this.setState = this.setState.bind(this);
  }

  componentDidMount(){
    this.isMounted = true;
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate(){

  }


  componentWillUnmount() {
    this.isMounted = false;
    window.removeEventListener('resize', this.updateDimensions);
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
          <SingleEventMap hidden={this.state.tabIndex2 != 0}/>
          <div hidden={this.state.tabIndex2 != 1}>Multiple games for single team</div>
          <div hidden={this.state.tabIndex2 != 2}>Playoff series</div>
          <div hidden={this.state.tabIndex2 != 3}>Single player</div>


        </div>
        <div hidden={this.state.tabIndex != 1}>Heat map functionality</div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  // ...state
});
const mapDispatchToProps = dispatch => ({
  // selectStartDateAction: (date) => dispatch(selectStartDateAction(date)),
  // selectEndDateAction: (date) => dispatch(selectEndDateAction(date)),
});

// connect this App.js to Redux
export default connect(mapStateToProps, mapDispatchToProps)(App);