import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

export default function SingleRinkSide(props) {
    return <div>
        <span>Single rink side:</span>
        {props.jsonData &&
        <Tooltip title="If selected, show events on one side of the rink for each team (away team goal left, home team goal right). If unselected, show events like they happened in the game (switching rink sides apply).">
            <Checkbox defaultChecked={true} value="showEventsOnOneSideOfTheRink" onChange={props.displayEventsOnOneSideHandler} />
        </Tooltip>
        }
    </div>;
}
