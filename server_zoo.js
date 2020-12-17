const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const { PassThrough } = require('stream');
const client = new discord.Client();

const server_id = "725334556017688670";
const my_id = "417553593697042432";

var date = new Date();
var hour = date.getHours();	// 時
var minute = date.getMinutes();	// 分
var second = date.getSeconds();	// 秒
var dayOfWeek = date.getDay();	// 曜日(数値)

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
    //木曜日のみ実行
    if (dayOfWeek != 4) return; 

    console.log('Bot準備完了～');
    client.user.setActivity('ごちうさ', {
        type: 'WATCHING'
    });

    client.channels.get(server_id).send('今日参加する人〜')
        .then(message => {
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

            const due = 21 * 3600 + 55 * 60 + 0;
            const now = (hour + 9) % 24 * 3600 + minute * 60 + second;
            console.log("通知まで", due - now, "秒");
            const collector = message.createReactionCollector(filter, { time: (due - now) * 1000 });

            collector.on('collect', (reaction, user) => {
                console.log(`Collected ${reaction.emoji.name} from ${user.id}`);
            });

            collector.on('end', collected => {
                sendMsg(server_id, "おはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    sendMsg(server_id, "<@" + element + ">");
                    console.log(element);
                }
            });
            return;
        })
        .catch(console.error);
});

client.on('message', message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.match(/にゃ～ん|にゃーん/)) {
        sendReply(message, "にゃ～んにゃん❤️");
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
