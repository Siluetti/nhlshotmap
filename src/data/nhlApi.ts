import {format} from 'date-fns'; 

export function getSingleGameDataFromNhlApi(game:string, dataHandlerFunction: (jsonData:any) => void){
    getDataByUrl("https://statsapi.web.nhl.com/api/v1/game/"+game+"/feed/live?site=en_nhl", dataHandlerFunction);
}

function getDataByUrl(url:string, dataHandlerFunction: (jsonData:any) => void) {
    fetch(url)
      .then(response => response.json())
      .then(dataHandlerFunction);
}

export function getGamesWithDateRangeFromNhlApi(startDate:Date, endDate:Date, dataHandlerFunction: (jsonData:any) => void) {
    let formattedStartDate = format(startDate, 'yyyy-MM-dd');
    let formattedEndDate = format(endDate, 'yyyy-MM-dd');
    getDataByUrl(
        "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+formattedStartDate+"&endDate="+formattedEndDate+"&hydrate=team,linescore,broadcasts(all),tickets,game(content(media(epg)),seriesSummary),radioBroadcasts,metadata,seriesSummary(series)&site=en_nhlNORDIC&teamId=&gameType=&timecode=", 
        dataHandlerFunction);
  }