/* * * * * * * * * * * * * * * *
 *                             *
 *       Image Scraper         *
 *       Author: 7teen         *
 *    Discord: ae#0704         *
 *                             *
 * * * * * * * * * * * * * * * */

const axios = require('axios').default

async function scrappingRequest(token, fetchChannelId, before) {
    const request = await axios.get(
        `https://discord.com/api/channels/${fetchChannelId}/messages?limit=100${
            before ? `&before=${before}` : ''
        }`,
        {
            headers: { authorization: token },
        }
    )
    return request.data
}

async function getAllMessages(token, fetchChannelId, chunksLimit = null) {
    const messages = await scrappingRequest(token, fetchChannelId)

    let rows = chunksLimit || null
    while (messages.length >= 100 && chunksLimit ? rows : true) {
        const newPage = await scrappingRequest(
            token,
            fetchChannelId,
            messages.slice(-1).id
        )
        for (const message of newPage) messages.push(message)
        rows--
    }

    return messages
}

function getLinksFrom(messages) {
    const links = []
    for (const message of messages) {
        for (const attachment of message.attachments) {
            const url = attachment.proxy_url
            if (!links.includes(url)) links.push(url)
        }

        const matchedLinks = message.content.matchAll(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm
        )

        for (const match of matchedLinks) {
            const url = match[0]
            if (!links.includes(url)) links.push(url)
        }
    }
    return links
}

async function scrapper(token, fetchChannelId, chunksLimit = 100) {
    const messages = await getAllMessages(token, fetchChannelId, chunksLimit),
        links = getLinksFrom(messages)
    return new Promise((resolve, reject) => resolve(links))
}

module.exports = scrapper
