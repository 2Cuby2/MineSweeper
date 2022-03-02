# Minesweeper

## Supported Platforms

- Android : fully supported
- iOS : should be supported but not tested yet

## Setup the development environment 

You only need to have expo with a node package manager (npm or yarn) installed on your machine.
To run the game in development mode, juste tap ```yarn start``` in your terminal at the root of the project.

To test the game with all the squares already revealed (the squares will be revealed after your first play), you can edit the app.json file and set ```test``` in ```extra``` to true.

To build the game use the command ```expo build:android``` or ```expo build:ios``` depending on the device you wish to create the build for.

## Already built version

You can find an already built version of the game for android in the folder ```build```.

## Code structure

- ```App.js``` : main app component
- ```src/``` : all components and source files
- ```src/styles/``` : global styles for the app
- ```src/utils/``` : all utils functions to setup the grid and run the game
