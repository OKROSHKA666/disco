import { ChannelType, Client, IntentsBitField } from 'discord.js';
import { NodeHtmlMarkdown } from 'node-html-markdown';
const form = new FormData();
form.append('action', 'tracking');
form.append('n', '00000003672720');
const url = 'https://fox-express.ru/action.php';
async function fetchData(url, formData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return await response.text();
    }
    catch (error) {
        console.log(`Failed to fetch data: ${error}`);
    }
}
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.MessageContent,
    ]
});
client.on('interactionCreate', async (inter) => {
    if (!inter.isChatInputCommand())
        return;
    if (inter.commandName === 'huh') {
        const data = await fetchData(url, form);
        if (data) {
            const markdownData = NodeHtmlMarkdown.translate(data);
            inter.reply(markdownData);
        }
    }
});
let lastResponse = '';
async function makePostRequestAndCheckChanges() {
    const channelId = process.env.TRACK_CHANNEL_ID;
    const data = await fetchData(url, form);
    if (data) {
        if (data !== lastResponse) {
            lastResponse = data;
            const markdownData = NodeHtmlMarkdown.translate(data);
            if (channelId) {
                const channel = client.channels.cache.get(channelId);
                if (channel && channel.type === ChannelType.GuildText) {
                    channel.send(markdownData + ' \n @everyone')
                        .catch(err => console.error('Failed to send message to Discord channel:', err));
                }
                else {
                    console.error('channelId missing');
                }
            }
        }
    }
}
client.once('ready', () => {
    console.log('Bot is ready');
    setInterval(makePostRequestAndCheckChanges, 600000);
});
client.login(process.env.DISCORD_SECRET);
