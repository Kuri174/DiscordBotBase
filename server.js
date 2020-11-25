const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const { PassThrough } = require('stream');
const client = new discord.Client();

const myserver_id = "779348258580987907";
const myserver_author_id = "417553593697042432";

const now = new Date();
let cnt = -1;
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
});



client.on('message', message => {

    if (cnt == 0) {
        message.react('👍').then(() => message.react('😇'));

        const filter = (reaction, user) => {
            return ['👍', '😇'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        Array.length = 0;
        cnt = 1;
        message.awaitReactions(filter, { time: 10000 })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '👍') {
                    if (!(Array.includes(message.author.id))) {
                        Array.push(message.author.id);
                    }
                } else if (reaction.emoji.name === '😇') {
                    if (Array.includes(message.author.id)) {
                        // Array.filter(item => (item.match(message.author.id)) == null);
                        Array.pop();
                    }
                }
            })
            .catch(collected => {
                message.reply('押してよ〜〜〜');
            });
        return;
    }

    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.match(/にゃ～ん|にゃーん/)) {
        sendReply(message.channel.id, "にゃ～んにゃん❤️");
        if (message.author.id == myserver_author_id) {
            sendMsg(message.channel.id, "ご主人様だ〜❤️嬉しい〜❤️");
            // おかえり❤️
        }
        return;
    }
    if (message.content.match(/!help/)) {
        return;
    }
    if (message.content.match(/!natume/)) {
        client.channels.get(message.channel.id).send("今日参加する人〜");
        cnt = 0;
        Array.length = 0;
        return;
    }
    if (message.content.match(/!result/)) {
        for (let index = 0; index < Array.length; index++) {
            const element = Array[index];
            sendMsg(myserver_id, "<@" + element + ">");
            sendMsg(myserver_id, "おはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
        }
        sendMsg(myserver_id, Array.length);
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
