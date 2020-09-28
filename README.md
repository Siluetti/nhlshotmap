This was created using following: https://aws.amazon.com/blogs/mobile/amplify-framework-announces-new-rearchitected-ui-component-and-modular-javascript-libraries/

Checkout these https://docs.amplify.aws/ui/q/framework/react


TODO:
statsapi integration:
https://statsapi.web.nhl.com/api/v1/game/2019030411/feed/live?site=en_nhl <-- search for keyword "shot"

Note that the coordinates 0,0 is the center of the rink. The coordinates go from -100 to +100 for x and from -41 to +41 for y.


https://statsapi.web.nhl.com/api/v1/game/2019030411/content?site=en_nhl
https://statsapi.web.nhl.com/api/v1/teams?site=en_nhl&teamId=25,14&expand=team.roster,team.stats,roster.person,person.stats&stats=statsSingleSeason
https://statsapi.web.nhl.com/api/v1/tournaments/playoffs?site=en_nhl&expand=round.series,schedule.game.seriesSummary&season=20192020
https://statsapi.web.nhl.com/api/v1/schedule?startDate=2020-09-19&endDate=2020-09-19&hydrate=team,linescore,broadcasts(all),tickets,game(content(media(epg)),seriesSummary),radioBroadcasts,metadata,seriesSummary(series)&site=en_nhlNORDIC&teamId=&gameType=&timecode=


$ npm install -g @aws-amplify/cli
$ amplify configure

amplify configure asks you to sign into the AWS Console.

Once you’re signed in, the Amplify CLI asks you to create an IAM user.

Specify the AWS Region ? 
*region*: # Your preferred region 
Specify the username of the new IAM user: ? 
*user name*: # User name for Amplify IAM user 
Complete the user creation using the AWS console


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
