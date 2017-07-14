# epii-cli
###### `epii-node-cli`

Simple `epii` boilerplate.  
**Only support Node 8+.**

## Usage

### install as global dependency

```sh
npm install -g epii-cli@latest
```

### create a server project

```sh
# init project
epii init YOUR-PROJECT

# run dev server
cd YOUR-PROJECT && npm run dev

# build dist
cd YOUR-PROJECT && npm run make

# run prod server
bin/deploy
```

### create a minion project

A `minion` means a component.

```sh
# init project
epii init YOUR-PROJECT --minion

# run dev server
cd YOUR-PROJECT && npm start

# build dist
cd YOUR-PROJECT && npm run build
```
