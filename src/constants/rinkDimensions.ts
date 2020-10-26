export type RinkDimensions = {
  windowWidth: number,
  rinkWidth: number,
  rinkHeight: number,
  borderRadiusStyle: string,
  xOmegaPoint: number,
  yOmegaPoint: number,
  horizontalTranslation: number,
  verticalTranslation: number,
  leftGoalLine: number,
  rightGoalLine: number,
  centreLine: number,
  centreLineWidth: number,
  lineWidth: number,
  leftBlueLine: number,
  rightBlueLine: number,
  faceoffCircleRadius: number,
  centerFaceoffSpotRadius: number,
  faceoffSpotRadius: number,
  awayTeamDefendingFaceoffSpotHorizontalPosition: number,
  homeTeamDefendingFaceoffSpotHorizontalPosition: number,
  awayTeamNeutralFaceoffSpotHorizontalPosition: number,
  homeTeamNeutralFaceoffSpotHorizontalPosition: number,
  topFaceoffSpotsVerticalPositions: number,
  bottomFaceoffSpotsVerticalPositions: number,
  goalCreaseRadius: number,
  goalCreaseVerticalPosition: number,
  goalDeepness: number,
  goalWidth: number,
}

export function getRinkDimensions(window:Window):RinkDimensions {
  // According to Wikipedia https://en.wikipedia.org/wiki/Ice_hockey_rink#:~:text=Most%20North%20American%20rinks%20follow,m)%20from%20the%20end%20boards.
    // ice hockey rink is by default 200 feet times 85 feet
    // so let's set the width to 80 % of the window width and then multiply this with 42.5 % to get the height of the rink
    var windowWidth:number = window.innerWidth;
    var rinkWidth:number = windowWidth * 0.8;
    var rinkHeight:number = rinkWidth * 0.425;
    // corner radius is 28 feet which makes it 14 %
    var borderRadiusStyleInNumber:number = rinkWidth * 0.14;
    var borderRadiusStyle:string = borderRadiusStyleInNumber + "px";
    // goal lines are 11 feet from the end boards which means 5.5 % and 94.5 % of rink width
    var leftGoalLine:number = rinkWidth * 0.055;
    var rightGoalLine:number = rinkWidth * 0.945;
    // Blue lines are 75 feet from the end boards which makes 32.5 % and 67.5 % of rink width
    var leftBlueLine:number = rinkWidth * 0.325;
    var rightBlueLine:number = rinkWidth * 0.675;

  
  return {
      windowWidth: window.innerWidth,
      rinkWidth: windowWidth * 0.8,
      rinkHeight: rinkWidth * 0.425,
      borderRadiusStyle: borderRadiusStyle,
      xOmegaPoint: rinkWidth / 2,
      yOmegaPoint: rinkHeight / 2,
      // the NHL API gives x values from -99 to +99. That gives 199 different values when you count 0
      horizontalTranslation: rinkWidth / 199,
      // the NHL API gives y values from -41 to +41. That gives 83 different values when you count 0
      verticalTranslation: rinkHeight / 83,
      leftGoalLine: rinkWidth * 0.055,
      rightGoalLine: rinkWidth * 0.945,
      centreLine: rinkWidth * 0.499,
      centreLineWidth: rinkWidth * 0.0021,

      lineWidth: rinkWidth * 0.0021,
      leftBlueLine: rinkWidth * 0.325,
      rightBlueLine: rinkWidth * 0.675,
      // faceoff circle is 30 feet in diameter, meaning 15 by radius, which means 7,5 % of rink width
      faceoffCircleRadius: rinkWidth * 0.075,
      // faceoff spot is 1 foot in diameter, meaning 0,5 foot in radius, which means 0,25 % of rink width
      centerFaceoffSpotRadius: rinkWidth * 0.0025,
      // for all other faceoff spots the radius is 2 feet
      faceoffSpotRadius: rinkWidth * 0.005,
      
      // According usahockeyrulebook https://www.usahockeyrulebook.com/page/show/1082185-rule-104-face-off-spots-and-face-off-circles
      // section d
      // twenty feet (20') from the back of the goal lines, meaning leftGoalLine + (20 / 200=) 10 % 
      awayTeamDefendingFaceoffSpotHorizontalPosition: leftGoalLine + (rinkWidth * 0.1),
      // twenty feet (20') from the back of the goal lines, meaning rightGoalLine - (20 / 200=) 10 % 
      homeTeamDefendingFaceoffSpotHorizontalPosition: rightGoalLine - (rinkWidth * 0.1),

      // section c
      // five feet (5') from the neutral zone side of the blue lines, meaning left blue line position + (5/200 =) 2,5 % 
      awayTeamNeutralFaceoffSpotHorizontalPosition: leftBlueLine + (rinkWidth * 0.025),
      // five feet (5') from the neutral zone side of the blue lines, right blue line position - (5/200 =) 2,5 %
      homeTeamNeutralFaceoffSpotHorizontalPosition: rightBlueLine - (rinkWidth * 0.025),

      // all top faceoff spots are in the same vertical position, which is 21,25 feet from top (rink height of 85 feet divided by 4)
      topFaceoffSpotsVerticalPositions: rinkHeight / 4,
      
      // all top faceoff spots are in the same vertical position, which is 21,25 feet from bottom (rink height of 85 feet divided by 4 multiplied with 3)
      bottomFaceoffSpotsVerticalPositions: rinkHeight / 4 * 3,

      // goal crease is 8 feet in diameter, meaning 4 in radius 4 / 200: 2 % 
      goalCreaseRadius: rinkWidth * 0.02,
      goalCreaseVerticalPosition: rinkHeight / 2,

      // According to https://en.wikipedia.org/wiki/Goal_(ice_hockey)
      // goal is 3,3 feet deep, which translates to (3,3 / 200 =) 1,65 %
      goalDeepness: rinkWidth * 0.0165,
      
      // goal is 6 feet wide, so half goal width is 6 feet, which translates to (6 / 200 =) 3 %
      goalWidth: rinkWidth * 0.03,
  };
}