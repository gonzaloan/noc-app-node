# Installation and Usage

## Typescript Install

### Dependencies
```
npm i -D typescript @types/node ts-node-dev rimraf
```

### Initialize typescript configuration file

```
npx tsc --init --outDir dist --rootDir src
```

### Create scripts for dev, build start

```
"dev": "tsnd --respawn src/app.ts",
"build": "rimraf ./dist && tsc",
"start": "npm run build && node dist/app.js"
```

### Mongo DB Image Docker

