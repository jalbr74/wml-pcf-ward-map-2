const { spawn } = require('child_process');

const TARGET_ENVIRONMENT = "04 James Albright - WML Tools";
const TARGET_URL         = "https://jalbr74-wml-tools.crm.dynamics.com/";
const TARGET_SOLUTION    = "JDAMain";

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
        const pacPcfPush = spawn(`pac pcf push --solution-unique-name ${TARGET_SOLUTION}`, { shell: true });

        pacPcfPush.stdout.on('data', (data) => {
            process.stdout.write(data.toString());
        });

        pacPcfPush.stderr.on('data', (data) => {
            process.stderr.write(`stderr: ${data}`);
        });

        pacPcfPush.on('close', (code) => {
            console.log(`'pac pcf push' exited with code ${code}`);
        });
    } else {
        console.log(`You're not connected to the right environment. Please connect to "${TARGET_ENVIRONMENT}" before deploying.`);
    }
});