# Group C(asino)

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
- MikroORM
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
2. Create your own server/.env file, following the .env.example file
3. Optional - Install "yarn"
4. Install dependencies (independently for "server" and "web")
5. Under /server run "yarn create:migration" (or "npm run create:migration") *this will create all SQL commands required to setup the database and run them upon server startup*
6. Under /server run "yarn watch" (or "npm run watch") *this runs the typescript compiler*
7. Under /server run "yarn dev" (or "npm run dev") *runs the backend server*
8. Under /web run "yarn dev" (or "npm run dev") *runs the frontend web server*
9. Go to "http://localhost:3000" for the web server
10. Optional - "http://localhost:4000/graphql" for the GraphQL UI