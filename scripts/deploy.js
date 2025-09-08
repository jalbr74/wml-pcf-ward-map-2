const { spawn } = require('child_process');

const TARGET_ENVIRONMENT = "04 James Albright - WML Tools";
const TARGET_SOLUTION    = "JDAMain";

const deployCommand = `pac pcf push --solution-unique-name ${TARGET_SOLUTION}`;
const pacOrgWho = spawn('pac org who', { shell: true });

let output = '';

pacOrgWho.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    process.stdout.write(text); // Stream output to console
});

pacOrgWho.stderr.on('data', (data) => {
    process.stderr.write(`stderr: ${data}`);
});

pacOrgWho.on('close', (code) => {
    const isConnectedToTheRightEnvironment = output.includes(TARGET_ENVIRONMENT);
    if (isConnectedToTheRightEnvironment) {
        const spawnedProcess = spawn(deployCommand, { shell: true });

        spawnedProcess.stdout.on('data', (data) => process.stdout.write(data.toString()));
        spawnedProcess.stderr.on('data', (data) => process.stderr.write(`stderr: ${data}`));
        spawnedProcess.on('close', (code) => console.log(`Deploy command exited with code ${code}`));
    } else {
        console.error(`\x1b[31mYou're not connected to the right environment. Please connect to "${TARGET_ENVIRONMENT}" before deploying.\x1b[0m`);
    }
});