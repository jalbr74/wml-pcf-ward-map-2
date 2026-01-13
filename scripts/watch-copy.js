// Be sure to install chokidar and dotenv before running this script:
// $ npm install --save-dev chokidar dotenv
// Also add a .env file to your project, and specify DEST_FILE variable:
// DEST_FILE=path/to/destination/file.js

require('dotenv').config();

const chokidar = require('chokidar');
const fs = require('fs/promises');
const path = require('path');

const SOURCE = path.resolve("out/controls/WardMap2/bundle.js");
const DEST   = path.resolve(process.env.DEST_FILE);

async function copyFile() {
    try {
        await fs.mkdir(path.dirname(DEST), { recursive: true });
        await fs.copyFile(SOURCE, DEST);
        console.log(`[${new Date().toLocaleTimeString()}] Copied ${DEST}`);
    } catch (err) {
        // Ignore missing file during startup/build
        if (err.code !== 'ENOENT') {
            console.error('[error]', err.message);
        }
    }
}

const watcher = chokidar.watch(SOURCE, {
    ignoreInitial: false,        // copy immediately on startup
    awaitWriteFinish: {
        stabilityThreshold: 200,   // wait for file to stop changing
        pollInterval: 50
    }
});

watcher
    .on('add', copyFile)
    .on('change', copyFile);

process.on('SIGINT', async () => {
    await watcher.close();
    process.exit(0);
});
