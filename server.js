const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const { PassThrough } = require('stream');
const client = new discord.Client();

const myserver_id = "779348258580987907";
const myserver_author_id = "417553593697042432";

const now = new Date();

let array = [];

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
        array.length = 0;
        message.react('👍');
        message.react('😇');
        const filter = (reaction, user) => {
            if (reaction.emoji.name == '👍') {
                if (!(array.includes(user.id))) {
                    array.push(user.id);
                    console.log('👍', user.id);
                }
            } else if (reaction.emoji.name == '😇') {
                if (array.includes(user.id)) {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        if (element == user.id) {
                            array.splice(index, 1);
                        }
                    }
                    console.log('😇', user.id);
                }
            } else {
                console.log(reaction.emoji.name, user.id);
            }
            return ['👍', '😇'].includes(reaction.emoji.name);
        };

        const collector = message.createReactionCollector(filter, { time: 20000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        });

        collector.on('end', collected => {
            sendMsg(myserver_id, "おはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                sendMsg(myserver_id, "<@" + element + ">");
                console.log(element);
            }
        });
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
