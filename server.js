const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

const mychannel_id = "779348258580987907";

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
    sendMsg(mychannel_id, "<@417553593697042432> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
    sendMsg(mychannel_id, "<@&780007022933573633> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
});

client.on('message', message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.match(/にゃ～ん|にゃーん/)) {
        let text = "にゃ～んにゃん❤️";
        sendMsg(message.channel.id, text);
        return;
    }
    if (message.content.match(/こらー/)) {
        let text = "ごめんなさい><";
        sendMsg(message.channel.id, text);
        return;
    }
    if (message.content.match(/！ナツメちゃん/)) {
        sendMsg(message.channel.id, "はーい❤️");

        let mcount = 2;
        text = "あと{}人 募集中\n"
        revmsg = text.format(mcount)
        // friend_list 押した人のList
        frelist = []
        msg = await client.send_message(message.channel, revmsg)

        // #投票の欄
        await client.add_reaction(msg, '\u21a9')
        await client.add_reaction(msg, '⏫')
        await client.pin_message(msg)
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
