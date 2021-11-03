/* * * * * * * * * * * * * * * *
 *                             *
 *       Image Scraper         *
 *       Author: 7teen         *
 *    Discord: ae#0704         *
 *                             *
 * * * * * * * * * * * * * * * */

const { token, fetchChannelId } = require('../config/config.json'),
    ora = require('ora'),
    fetch = require('node-fetch')

/**
 * Request messages
 */
async function scrappingRequest(before) {
    const request = await fetch(
        `https://discord.com/api/channels/${fetchChannelId}/messages?limit=100${
            before ? `&before=${before}` : ''
        }`,
        {
            method: 'GET',
            headers: { authorization: token },
        }
    )
    return await request.json()
}

async function getAllMessages(chunksLimit = null) {
    const messages = await scrappingRequest()

    let rows = chunksLimit || null
    while (messages.length >= 100 && chunksLimit ? rows : true) {
        const newPage = await scrappingRequest(messages.slice(-1).id)
        for (const message of newPage) messages.push(message)
        rows--
    }

    return messages
}

function getLinksFrom(messages) {
    const links = []
    for (const message of messages) {
        for (const attachment of message.attachments)
            links.push(attachment.proxy_url)

        const matchedLinks = message.content.matchAll(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm)

        for (const match of matchedLinks) {
            links.push(match[0])
        }
    }
    return links
}

async function scrapper(chunksLimit = 100) {
    const spinner = ora('Fetching...').start(),
        messages = await getAllMessages(chunksLimit),
        links = getLinksFrom(messages)
    spinner.stop()
    return new Promise((resolve, reject) => resolve(links))
}

module.exports = scrapper
