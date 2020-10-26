import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';


interface VisiblePeriodsProps { 
  jsonData: any,
  displayPeriodHandler: (event:React.ChangeEvent<HTMLInputElement>) => void,
};

export default function VisiblePeriods(props:VisiblePeriodsProps) {
    return <div><p>Show periods:</p>
        {props.jsonData &&
          Array.apply(null, props.jsonData.liveData.linescore.periods).map((e, i) => (
            <span className="periodHandlerSpan" key={i}>
              <Checkbox defaultChecked={true} value={i} onChange={props.displayPeriodHandler} />
                {props.jsonData.liveData.linescore.periods[i].ordinalNum}
            </span>
          ))
        }</div>;
}
