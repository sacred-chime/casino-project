# Group C(asino)
We created an online casino. It houses 4 playable games: Blackjack, Slots, Craps, and Minesweeper. All of the games revolve around the player’s casino wallet, adding or subtracting based on wins or losses. In addition, all bets are stored in a database, for future reference. We also have a dedicated payment landing page, for future implementation with payment processors. 

## Members:
Connor Strohecker - cms668@drexel.edu  
Leland Ly - lsl47@drexel.edu  
Ryan Do - rd586@drexel.edu  
Harrison Nguyen - hxn26@drexel.edu  
Mike Bogert - mib39@drexel.edu  

## Technologies
- React
- Typescript
- URQL
- Node.js
- PostgreSQL
- TypeORM
- Redis
- Next.js
- TypeGraphQL
- ChakraUI

## Ideas:
1. **Online Casino**
2. ~~Twitter Clone~~
3. ~~Meme Creator with 3rd party API integration for the photos~~
4. ~~Wolfram Alpha clone (a bunch of science/math calculators)~~
5. ~~Singleplayer/Multiplayer checkers/chess (Chess engine API)~~
6. ~~Reddit Clone~~

## Instructions
1. Install PostgreSQL and Redis (as a service)
2. Create PostgreSQL database called "casino"
3. Create your own server/.env file, following the .env.example file
4. Optional - Install "yarn"
5. Install dependencies (independently for "server" and "web")
6. ~~Under /server run "yarn create:migration" (or "npm run create:migration") *this will create all SQL commands required to setup the database and run them upon server startup*~~
7. Under /server run "yarn watch" (or "npm run watch") *this runs the typescript compiler*
8. Under /server run "yarn dev" (or "npm run dev") *runs the backend server*
9. Under /web run "yarn dev" (or "npm run dev") *runs the frontend web server*
10. Go to "http://localhost:3000" for the web server
11. Optional - "http://localhost:4000/graphql" for the GraphQL UI
