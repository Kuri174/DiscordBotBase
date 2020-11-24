const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const { PassThrough } = require('stream');
const client = new discord.Client();

const myserver_id = "779348258580987907";
const myserver_author_id = "417553593697042432";

let Array = [];

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        var data = "";
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            if (!data) {
                res.end("No post data");
                return;
            }
            var dataObject = querystring.parse(data);
            console.log("post:" + dataObject.type);
            if (dataObject.type == "wake") {
                console.log("Woke up in post");
                res.end();
                return;
            }
            res.end();
        });
    }
    else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Discord Bot is active now\n');
    }
}).listen(3000);

client.on('ready', message => {
    console.log('Bot準備完了～');
    client.user.setActivity('ごちうさ', {
        type: 'WATCHING'
    });
    // const fastmessage = client.channels.cache.find(ch => ch.name === '村役場').send('参加する方は、ここにリアクションしてください！');
    // const fastmessagereaction = fastmessage.react('1️⃣');//リアクションをBot自身が追加
    //sendMsg(myserver_id, "<@417553593697042432> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
    //sendMsg(myserver_id, "<@&780007022933573633> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
});

client.on('message', message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.match(/にゃ～ん|にゃーん/)) {
        sendReply(message.channel.id, "にゃ～んにゃん❤️");
        if (message.author.id == myserver_author_id) {
            sendMsg(message.channel.id, "ご主人様だ〜❤️嬉しい〜❤️");
        }
        return;
    }
    if (message.content.match(/!help/)) {
        return;
    }
    if (message.content.match(/!natume/)) {
        client.channels.get(message.channel.id).send("今日参加する人〜").then(
            msg => {
                msg.react("👍")
                msg.react("👎")
            }
        )
        message.react('👍').then(() => message.react('😇'));

        const filter = (reaction, user) => {
            return ['👍', '😇'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        message.awaitReactions(filter, { max: 2, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '👍') {
                    if (!(Array.includes(message.author.id))) {
                        Array.push(message.author.id);
                    }
                } else {
                    if (Array.includes(message.author.id)) {
                        Array.filter(item => (item.match(message.author.id)) == null);
                    }
                }
            })
            .catch(collected => {
                message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            });

        sendMsg(message.channel.id, "今日の参加者↓");
        for (let index = 0; index < Array.length; index++) {
            const element = Array[index];
            sendMsg(message.channel.id, "<@" + element + ">");
        }
        return;
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log('DISCORD_BOT_TOKENが設定されていません。');
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

function sendReply(message, text) {
    message.reply(text)
        .then(console.log("リプライ送信: " + text))
        .catch(console.error);
}

function sendMsg(channelId, text, option = {}) {
    client.channels.get(channelId).send(text, option)
        .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
        .catch(console.error);
}
