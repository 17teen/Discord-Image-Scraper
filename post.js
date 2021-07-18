// Settings
const { webHook_id, webHook_token } = require("./settings.json");
const { greenBright, red, grey, yellowBright } = require("chalk");
const ora = require("ora");
const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });

// Modules
const { WebhookClient } = require("discord.js");

// Webhook
const webhookCli = new WebhookClient(webHook_id, webHook_token);

readline.question(grey("[?] Do you wish to post these links? (Y/N) "), (answr) => {
    if (answr === "Y" || answr === "y" || answr === "Yes" || answr === "yes" || answr === "YES") return Post()
    if (answr === "N" || answr === "n" || answr === "No" || answr === "no" || answr === "NO") return process.exit(1);
});

/**
 * Posts links to a specifed channel
 */
function Post() {
    const spinner = ora("Preparing to post").start();
    const fetchLinks = require("./links.json")
    fetchLinks.forEach((link, index) => {
        webhookCli.send(link).then((msg) => { spinner.succeed(greenBright(`[${index}] Link Posted: ${yellowBright(msg.content)}`))}).catch((err) => { spinner.fail(red(`[${index}] Link failed to post | ${err}`))})
    });
}