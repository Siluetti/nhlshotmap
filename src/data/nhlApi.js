import {format} from 'date-fns'; 

export function getSingleGameDataFromNhlApi(game, dataHandlerFunction){
    getDataByUrl("https://statsapi.web.nhl.com/api/v1/game/"+game+"/feed/live?site=en_nhl", dataHandlerFunction);
}

function getDataByUrl(url, dataHandlerFunction) {
    fetch(url)
      .then(response => response.json())
      .then(dataHandlerFunction);
}

export function getGamesWithDateRangeFromNhlApi(startDate, endDate, dataHandlerFunction) {
    let formattedStartDate = format(startDate, 'yyyy-MM-dd');
    let formattedEndDate = format(endDate, 'yyyy-MM-dd');
    getDataByUrl(
        "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+formattedStartDate+"&endDate="+formattedEndDate+"&hydrate=team,linescore,broadcasts(all),tickets,game(content(media(epg)),seriesSummary),radioBroadcasts,metadata,seriesSummary(series)&site=en_nhlNORDIC&teamId=&gameType=&timecode=", 
        dataHandlerFunction);
//     this.clearState();
//     if ( ! (this.props.startDate) || ! (this.props.endDate)) {
//       console.log("start or enddate null or undefined");
//       return;
//     }

  }