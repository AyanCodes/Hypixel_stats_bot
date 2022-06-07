const { Client, Intents, MessageEmbed, Modal } = require("discord.js");
require('dotenv').config()
const fetch = require("node-fetch");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const prefix = "$";
let name;

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${prefix}help`);
});

client.on("messageCreate", async (msg) => {
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
    
  if (command === "bedwars") {
    if (!args.length) {
			return msg.channel.send(`You didn't provide any username, ${msg.author}!`);
    }

    name = args
    console.log(name)

    try {
      const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args}`)
      const uuidData =  await uuidResponse.json()

      const response = await fetch(
        `https://api.hypixel.net/player?key=38bf93a7-0d96-4ee8-8d9b-95281dc3e28a&uuid=${uuidData.id}`
      );

      if (!response.ok) return
  
      const data = await response.json();
      const playerBwStats = data.player.stats.Bedwars;
  
      const bedwarsStats = {
        level: data.player.achievements.bedwars_level.toLocaleString(),
        coins: playerBwStats.coins.toLocaleString(),
        winstreak: playerBwStats.winstreak,
        kills: playerBwStats.kills_bedwars.toLocaleString(),
        deaths: playerBwStats.deaths_bedwars.toLocaleString(),
        kdr: Math.round(playerBwStats.kills_bedwars / playerBwStats.deaths_bedwars * 10) / 10,
        finalKills: playerBwStats.final_kills_bedwars.toLocaleString(),
        finalDeaths: playerBwStats.final_deaths_bedwars.toLocaleString(),
        fkdr: Math.round(playerBwStats.final_kills_bedwars / playerBwStats.final_deaths_bedwars * 10) / 10,
        wins: playerBwStats.wins_bedwars.toLocaleString(),
        losses: playerBwStats.losses_bedwars.toLocaleString(),
        wlr: Math.round(playerBwStats.wins_bedwars / playerBwStats.losses_bedwars * 10) / 10,
        bedsBroken: playerBwStats.beds_broken_bedwars.toLocaleString(),
        bedsLost: playerBwStats.beds_lost_bedwars.toLocaleString(),
        bblr: Math.round(playerBwStats.beds_broken_bedwars / playerBwStats.beds_lost_bedwars * 10) / 10,
      }
      
      const bedwarsStatsEmbed = new MessageEmbed();
      bedwarsStatsEmbed.setTitle(`${args} Bedwars Stats`);
      bedwarsStatsEmbed.color = "0x7289da";
      bedwarsStatsEmbed.setThumbnail(`https://crafatar.com/renders/head/${uuidData.id}?overlay`)
      bedwarsStatsEmbed.addFields(
        { name: "Level:", value: `${bedwarsStats.level}`, inline: true },
        { name: "Coins:", value: `${bedwarsStats.coins}`, inline: true },
        { name: "Winstreak:", value: `${bedwarsStats.winstreak}`, inline: true },
        { name: "Kills:", value: `${bedwarsStats.kills}`, inline: true },
        { name: "Deaths:", value: `${bedwarsStats.deaths}`, inline: true, },
        { name: "KDR:", value: `${bedwarsStats.kdr}`, inline: true, },
        { name: "Final kills:", value: `${bedwarsStats.finalKills}`, inline: true, },
        { name: "Final deaths:", value: `${bedwarsStats.finalDeaths}`, inline: true, },
        { name: "FKDR:", value: `${bedwarsStats.fkdr}`, inline: true, },
        { name: "Wins:", value: `${bedwarsStats.wins}`, inline: true, },
        { name: "Losses:", value: `${bedwarsStats.losses}`, inline: true, },
        { name: "WLR:", value: `${bedwarsStats.wlr}`, inline: true, },
        { name: "Beds broken:", value: `${bedwarsStats.bedsBroken}`, inline: true },
        { name: "Beds lost:", value: `${bedwarsStats.bedsLost}`, inline: true },
        { name: "BBLR:", value: `${bedwarsStats.bblr}`, inline: true },
      );
      msg.reply({ embeds: [bedwarsStatsEmbed] });
    } catch (error) {
      msg.reply("Name not found or invalid")
      console.log(error)
    }
   
  } 
});


client.login(process.env.BOT_TOKEN);
