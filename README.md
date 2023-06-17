# MineSweeper

## Supported Platforms

- Android : fully supported
- iOS : should be supported but not tested

## Setup the development environment 

You only need to have expo with node package manager (`npm`) installed on your machine.
To run the game in development mode, juste tap `npm start` in your terminal at the root of the project.

To test the game with all the squares already revealed (the squares will be revealed after your first play), you can edit the `app.json` file and set `test` in the `extra` property to `true`.

To build the game with expo, use the command `eas build --platform <android|ios> --profile preview`.

## Code structure

- `App.tsx` : main app component
- `src/` : all components and source files
- `src/components/` : React native components used in the app
- `src/hooks/` : React custom hooks, built using custom providers
- `src/providers/` : React custom providers
- `src/styles/` : stylesheets for components
