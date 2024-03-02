import { REST, Routes } from "discord.js";

const commands = [
    {
        name: 'huh',
        description: 'tracking 00000003672720'
    }
]
if(process.env.DISCORD_SECRET) {
    const rest = new REST().setToken(process.env.DISCORD_SECRET)

    if(process.env.APPLICATION_ID && process.env.GUILD_ID) {
        registerCommands(process.env.APPLICATION_ID, process.env.GUILD_ID, rest)
    } else {
        console.log('esell')
    }
} else {
    console.log('esel')
}
async function registerCommands(applicationId: string, guildId: string, rest: REST) {
    try {
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body: commands }
        )
    } catch (error) {
        console.error(error)
    }
}