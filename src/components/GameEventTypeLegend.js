import React from 'react';
import Box from '@material-ui/core/Box';
import {format} from 'date-fns'; 
import { connect } from 'react-redux'
import { GAME_EVENT_TYPE_OPTIONS } from "../constants/gameEventTypeConstants";

const GameEventTypeLegend = ({ startDate }) => {
    return <div>
      <p>{format(startDate, "'Start date is a' d.M.yyyy")}</p>
        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[0].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[0].label}</span>
        
        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[1].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[1].label}</span>

        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[2].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[2].label}</span>

        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[3].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[3].label}</span>

        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[4].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[4].label}</span>

        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[5].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[5].label}</span>

        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[6].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[6].label}</span>

        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[7].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[7].label}</span>

        <Box style={{backgroundColor: GAME_EVENT_TYPE_OPTIONS[8].color, width: "20px", height: "20px", marginLeft: "20px", display: "inline-block"}} />
        <span style={{paddingLeft: "25px"}}>{GAME_EVENT_TYPE_OPTIONS[8].label}</span>
    </div>;
        
    };

  const mapStateToProps = state => {
    return {
        startDate: state.startDate
    }
  }
  
const mapDispatchToProps = {  };
  
export default connect(
    mapStateToProps,
    null
  )(GameEventTypeLegend);