import {  drawCircle, drawCircleWithBorder, drawArcWithBorder, drawRoundedRectangle} from "./Draw";

export function drawRink(state){
    
    let rinkWidth = state.rinkDimensions.rinkWidth;
    let rinkHeight = state.rinkDimensions.rinkHeight;
    // corner radius is 28 feet which makes it 14 %
    let xOmegaPoint = state.rinkDimensions.xOmegaPoint;
    let yOmegaPoint = state.rinkDimensions.yOmegaPoint;
    // the NHL API gives x values from -99 to +99. That gives 199 different values when you count 0
    let horizontalTranslation = state.rinkDimensions.horizontalTranslation;
    // the NHL API gives y values from -41 to +41. That gives 83 different values when you count 0
    let verticalTranslation = state.rinkDimensions.verticalTranslation;
    // goal lines are 11 feet from the end boards which means 5.5 % and 94.5 % of rink width
    let leftGoalLine = state.rinkDimensions.leftGoalLine;
    let rightGoalLine = state.rinkDimensions.rightGoalLine;
    let centreLine = state.rinkDimensions.centreLine;
    let centreLineWidth = state.rinkDimensions.centreLineWidth;

    let lineWidth = state.rinkDimensions.lineWidth;
    // Blue lines are 75 feet from the end boards which makes 32.5 % and 67.5 % of rink width
    let leftBlueLine = state.rinkDimensions.leftBlueLine;
    let rightBlueLine = state.rinkDimensions.rightBlueLine;
    // faceoff circle is 30 feet in diameter, meaning 15 by radius, which means 7,5 % of rink width
    let faceoffCircleRadius = state.rinkDimensions.faceoffCircleRadius;
    // faceoff spot is 1 foot in diameter, meaning 0,5 foot in radius, which means 0,25 % of rink width
    let centerFaceoffSpotRadius = state.rinkDimensions.centerFaceoffSpotRadius;
    // for all other faceoff spots the radius is 2 feet
    let faceoffSpotRadius = state.rinkDimensions.faceoffSpotRadius;
    
    // According usahockeyrulebook https://www.usahockeyrulebook.com/page/show/1082185-rule-104-face-off-spots-and-face-off-circles
    // section d
    // twenty feet (20') from the back of the goal lines, meaning leftGoalLine + (20 / 200=) 10 % 
    let awayTeamDefendingFaceoffSpotHorizontalPosition = state.rinkDimensions.awayTeamDefendingFaceoffSpotHorizontalPosition;
    // twenty feet (20') from the back of the goal lines, meaning rightGoalLine - (20 / 200=) 10 % 
    let homeTeamDefendingFaceoffSpotHorizontalPosition = state.rinkDimensions.homeTeamDefendingFaceoffSpotHorizontalPosition;

    // section c
    // five feet (5') from the neutral zone side of the blue lines, meaning left blue line position + (5/200 =) 2,5 % 
    let awayTeamNeutralFaceoffSpotHorizontalPosition = state.rinkDimensions.awayTeamNeutralFaceoffSpotHorizontalPosition;
    // five feet (5') from the neutral zone side of the blue lines, right blue line position - (5/200 =) 2,5 %
    let homeTeamNeutralFaceoffSpotHorizontalPosition = state.rinkDimensions.homeTeamNeutralFaceoffSpotHorizontalPosition;

    // all top faceoff spots are in the same vertical position, which is 21,25 feet from top (rink height of 85 feet divided by 4)
    let topFaceoffSpotsVerticalPositions = state.rinkDimensions.topFaceoffSpotsVerticalPositions;
    
    // all top faceoff spots are in the same vertical position, which is 21,25 feet from bottom (rink height of 85 feet divided by 4 multiplied with 3)
    let bottomFaceoffSpotsVerticalPositions = state.rinkDimensions.bottomFaceoffSpotsVerticalPositions;

    // goal crease is 8 feet in diameter, meaning 4 in radius 4 / 200 = 2 % 
    let goalCreaseRadius = state.rinkDimensions.goalCreaseRadius;
    let goalCreaseVerticalPosition = state.rinkDimensions.goalCreaseVerticalPosition;

    // According to https://en.wikipedia.org/wiki/Goal_(ice_hockey)
    // goal is 3,3 feet deep, which translates to (3,3 / 200 =) 1,65 %
    let goalDeepness = state.rinkDimensions.goalDeepness;
    
    // goal is 6 feet wide, so half goal width is 6 feet, which translates to (6 / 200 =) 3 %
    let goalWidth = state.rinkDimensions.goalWidth;


    

    state.context.clearRect(0, 0, rinkWidth, rinkHeight);
    
    // Draw a left red goal line
    state.context.fillStyle = '#ff0000';
    state.context.fillRect(leftGoalLine, 0, lineWidth, rinkHeight);

    // Draw a right red goal line
    state.context.fillStyle = '#ff0000';
    state.context.fillRect(rightGoalLine, 0, lineWidth, rinkHeight);

    // Draw left blue line
    state.context.fillStyle = '#0000ff';
    state.context.fillRect(rightBlueLine, 0, lineWidth, rinkHeight);
    
    // Draw right blue line
    state.context.fillStyle = '#0000ff';
    state.context.fillRect(leftBlueLine, 0, lineWidth, rinkHeight);

    // Draw a red faceoff circle
    drawCircleWithBorder(state.context, xOmegaPoint, yOmegaPoint, '#FFFFFF', faceoffCircleRadius);
        
    // Draw a red centre line
    state.context.fillStyle = '#ff0000';
    state.context.fillRect(centreLine, 0, centreLineWidth, rinkHeight);
    
    // draw center blue faceoff spot 
    drawCircle(state.context, xOmegaPoint, yOmegaPoint, '#0000FF', centerFaceoffSpotRadius);

    // Draw away team top red faceoff circle
    drawCircleWithBorder(state.context, awayTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw away team red top defending side faceoff spot 
    drawCircle(state.context, awayTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // Draw away team bottom red faceoff circle
    drawCircleWithBorder(state.context, awayTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw away team red bottom defending side faceoff spot 
    drawCircle(state.context, awayTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw away team red top neutral side faceoff spot 
    drawCircle(state.context, awayTeamNeutralFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw away team red bottom neutral side faceoff spot 
    drawCircle(state.context, awayTeamNeutralFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);
    
    // Draw home team bottom red faceoff circle
    drawCircleWithBorder(state.context, homeTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw home team red top defending side faceoff spot 
    drawCircle(state.context, homeTeamDefendingFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // Draw home team bottom red faceoff circle
    drawCircleWithBorder(state.context, homeTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FFFFFF', faceoffCircleRadius);
    // draw home team red bottom defending side faceoff spot 
    drawCircle(state.context, homeTeamDefendingFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw home team red top neutral side faceoff spot 
    drawCircle(state.context, homeTeamNeutralFaceoffSpotHorizontalPosition, topFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);

    // draw home team red bottom neutral side faceoff spot 
    drawCircle(state.context, homeTeamNeutralFaceoffSpotHorizontalPosition, bottomFaceoffSpotsVerticalPositions, '#FF0000', faceoffSpotRadius);
    
    // draw away team goal crease 
    drawArcWithBorder(state.context, leftGoalLine+lineWidth, goalCreaseVerticalPosition, '#67C6DD', goalCreaseRadius, '#FF0000', 2, 0 - Math.PI / 2, Math.PI / 2);

    // draw home team goal crease 
    drawArcWithBorder(state.context, rightGoalLine, goalCreaseVerticalPosition, '#67C6DD', goalCreaseRadius, '#FF0000', 2, Math.PI / 2, Math.PI * 1.5);

    // draw away team goal
    drawRoundedRectangle(state.context, leftGoalLine - goalDeepness + lineWidth/2, 
                              goalCreaseVerticalPosition - (goalWidth/2), 
                              goalDeepness, 
                              goalWidth, 
                              '#FFFFFF', 
                              rinkWidth*0.003,0,rinkWidth*0.003,0, rinkWidth*0.0015, '#FF0000'
                              );
    
    // draw home team goal
    drawRoundedRectangle(state.context, rightGoalLine+lineWidth/2, 
                              goalCreaseVerticalPosition - (goalWidth/2), 
                              goalDeepness, 
                              goalWidth, 
                              '#FFFFFF', 
                              0,rinkWidth*0.003,0,rinkWidth*0.003, rinkWidth*0.0015, '#FF0000'
                              );
}