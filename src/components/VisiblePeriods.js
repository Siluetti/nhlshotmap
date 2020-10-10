import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

export default function VisiblePeriods(props) {
    return <div><p>Show periods:</p>
        {props.jsonData &&
          Array.apply(null, { length: props.jsonData.liveData.linescore.periods.length}).map((e, i) => (
            <span className="periodHandlerSpan" key={i}>
              <Checkbox defaultChecked={true} value={i} onChange={props.displayPeriodHandler} />
                {props.jsonData.liveData.linescore.periods[i].ordinalNum}
            </span>
          ))
        }</div>;
}
