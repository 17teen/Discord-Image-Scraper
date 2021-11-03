const { grey, greenBright, red, yellowBright } = require('chalk'),
    { webhookId, webhookToken } = require('./config/config.json'),
    { WebhookClient } = require('discord.js'),
    readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    }),
    { writeFileSync } = require('fs'),
    scrapper = require('./src/scrapper'),
    ora = require('ora'),
    webhookCli = new WebhookClient(webhookId, webhookToken),
    linksPath = './links.json'

async function sendLinks(links) {
    for (let i = 0; i < links.length; i++) {
        const spinner = ora('Preparing to post').start(),
            link = links[i]
        try {
            const message = await webhookCli.send(link)
            spinner.succeed(
                greenBright(
                    `[${i}] Link Posted: ${yellowBright(message.content)}`
                )
            )
        } catch (e) {
            spinner.fail(red(`[${i}] Link failed to post | ${e}`))
        }
    }
}

async function main(answer) {
    const links = await scrapper()

    writeFileSync(linksPath, JSON.stringify(links, null, 2))

    greenBright(`Extracted ${links.length} attachments at "${linksPath}"`)

    if (['y', 'yes'].includes(answer.trim().toLowerCase()))
        await sendLinks(links)

    process.exit(0)
}

readline.question(grey('[?] Do you wish to post these links? (Y/N) '), main)
