# iAlbum
GitHub: https://github.com/michaellee8/hku-comp3322-assignment-4

## Perquisites
- An empty MongoDB instance running in localhost:27017 with auth mechanism disabled. If you don't 
have so, you may choose to install Docker and run `docker-compose up -d` in this directory, which
will give you a MongoDB instance at 27017 and a MongoDB Express explorer instance at 8081.
- A working latest/LTS Node.js installation, with `yarn` command available.
- Latest Chrome browser installed.

## Running
1. Start the MongoDB instance first.
2. Open a new terminal, `cd AlbumService`
3. `yarn install`
4. `PORT=3002 yarn start`
5. Note that you need `PORT=3002` to prevent port collision.
6. Open another new terminal, `cd myapp`
7. `yarn install`
8. `yarn start`
9. Wait for a minute to allow the code compile itself.
10. Head to http://localhost:3000 and enjoy the experience.

## Notes
- This app is styled with Material UI's JSS system so you will not see any `.css` files, instead 
CSS rules are placed in `makeStyle` calls in React components in `app/pages`.
- This app does not use React's local state for state management, instead it uses Redux with Redux 
Toolkit. State management logic are therefore stored separately in `app/logic`.