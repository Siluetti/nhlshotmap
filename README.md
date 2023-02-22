This was created using following: https://aws.amazon.com/blogs/mobile/amplify-framework-announces-new-rearchitected-ui-component-and-modular-javascript-libraries/

Checkout these https://docs.amplify.aws/ui/q/framework/react


Test URL's: 
https://www.nhl.com/gamecenter/nyi-vs-fla/2020/08/05/2019030043#game=2019030043,game_state=final
https://www.nhl.com/gamecenter/dal-vs-tbl/2020/09/26/2019030415#game=2019030415,game_state=final

TODO:
statsapi integration:
https://statsapi.web.nhl.com/api/v1/game/2019030411/feed/live?site=en_nhl <-- search for keyword "shot"

Note that the coordinates 0,0 is the center of the rink. The coordinates go from -100 to +100 for x and from -41 to +41 for y.


https://statsapi.web.nhl.com/api/v1/game/2019030411/content?site=en_nhl
https://statsapi.web.nhl.com/api/v1/teams?site=en_nhl&teamId=25,14&expand=team.roster,team.stats,roster.person,person.stats&stats=statsSingleSeason
https://statsapi.web.nhl.com/api/v1/tournaments/playoffs?site=en_nhl&expand=round.series,schedule.game.seriesSummary&season=20192020
https://statsapi.web.nhl.com/api/v1/schedule?startDate=2020-09-19&endDate=2020-09-19&hydrate=team,linescore,broadcasts(all),tickets,game(content(media(epg)),seriesSummary),radioBroadcasts,metadata,seriesSummary(series)&site=en_nhlNORDIC&teamId=&gameType=&timecode=


TODO list:
    - new functionalities
        - Create a heat map
        - add aggregate data depending on player
        - add tab bar for multi game series, multi game heat map and single player selection
        - when one spot has multiple events (e.g. see faceoffs) then show the items as a list
        - add multigame possibility for playoff series
        - add multigame possibility for different games
        - debugging
            - add nhl coordinates and converted coordinates to datatip when URL has ?showCoordinates=true
        - UX
            - add info button for "Games with URL" that describes on how to find the URL
            - when no games found, give text "No games found"
            - add aggregate game data (goals)
            - game events dropdown activates keyboard on mobile, disable keyboard
        - enable either https://craft.js.org/ or https://react-dnd.github.io/react-dnd/examples/tutorial
        - use https://github.com/OpenAPITools/openapi-generator-cli for automatic generator
        - API documentation: https://github.com/dword4/nhlapi or https://gitlab.com/dword4/nhlapi
        - add Saga https://medium.com/nmc-techblog/the-power-of-redux-saga-3dbd26a08b49
        - disable Google analytics if cookies declined
    - visuals
        - beautify buttons in "Games with datepicker"
    - refactor / bugs
        - remove extra date from GameEventTypeLegend component
        - BUG: when event is down on the rink, the datatip goes off the browser screen (same problem for left side of the screen)
            - to repeat 
                - set this game: https://www.nhl.com/gamecenter/dal-vs-tbl/2020/09/26/2019030415#game=2019030415,game_state=final
                - only select OT period
                - see left bottom side of the rink
        - BUG: when clicking "Single rink side" with "Goals" selected, the feature breaks
            - to repeat 
                - set this game: https://www.nhl.com/gamecenter/dal-vs-tbl/2020/09/26/2019030415#game=2019030415,game_state=final
                - select "Goals" from the "Filter game events"
                - click Single rink side multiple times, it should not register second mouse click
        - BUG: the faceoffs (and thus probably also the other events on the ice) seem little off the marks. Maybe something to do with the translations as the center faceoff is calculated from rink width and height / 2 and the events are translated coordinates?
            - as a side note it seems that neutral area faceoffs near blue lines are off quite a bit. Reason for this is unclear. 



#Install NPM and amplify
Install NPM. After installing NPM install amplify command line interface. You might need to run these the following command as admin (if you did not see down below):

$ npm install -g @aws-amplify/cli

If the install gives ERR_SOCKET_TIMEOUT it is probably because you have not run the command as admin (or then something has timeouted). In any case run 

$ npm uninstall -g @aws-amplify/cli

Before running the install again.

Now that you have your installation done, you have to configure amplify to use correct credentials. You can do this by running:

$ amplify configure

amplify configure asks you to sign into the AWS Console.

Once you’re signed in, the Amplify CLI asks you to create an IAM user and opens up browser for this. Note that it is not necessary to create a new user if you already have old username. You can just skip the browser setup and give the old username, accessKeyId and secretAccessKey to the console. 

Specify the AWS Region ? 
*region*: # Your preferred region 
Specify the username of the new IAM user: ? 
*user name*: # User name for Amplify IAM user 
Complete the user creation using the AWS console

While trying to run 

$ npm start 

you might hit several problems:

#Problem 1: ps1 cannot be loaded because running scripts is disabled on this system

For this problem see this: https://stackoverflow.com/questions/41117421/ps1-cannot-be-loaded-because-running-scripts-is-disabled-on-this-system

You can run "Set-ExecutionPolicy RemoteSigned" in Powershell. If this does not work, try running "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted"

#Problem 2 "'react-scripts' is not recognized as an internal or external command" 

Try following (https://stackoverflow.com/questions/52039375/stuck-while-installing-packages-npm-err-notarget-no-matching-version-found-for):
1) delete the node-modules folder (from C:\Users\username\AppData\Roaming\npm)
2) delete the package-lock.json
3) Run NPM install
4) Run NPM start

You might have to change some version numbers in you package.json to fix any dependency errors. 

Now that it has started, run "npm install -g @aws-amplify/cli" again



$ npx create-react-app shotmap
$ cd shotmap

$ amplify init 
? Enter a name for the project: amplifyapp 
? Enter a name for the environment: dev 
? Choose your default editor: Visual Studio Code 
? Choose the type of app that you are building: javascript 
? What javascript framework are you using: react 
? Source Directory Path: src 
? Distribution Directory Path: build 
? Build Command: npm run-script build 
? Start Command: npm run-script start 
? Do you want to use an AWS profile? Yes 
? Please choose the profile you want to use: default


"amplify status" will show you what you've added already and if it's locally configured or deployed
"amplify add <category>" will allow you to add features like user login or a backend API
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify console" to open the Amplify Console and view your project status
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud



npm install @material-ui/core
npm install @material-ui/lab


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
