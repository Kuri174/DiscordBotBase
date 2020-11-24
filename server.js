const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

const myserver_id = "779348258580987907";
const myserver_author_id = "417553593697042432";

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
    //sendMsg(myserver_id, "<@417553593697042432> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
    //sendMsg(myserver_id, "<@&780007022933573633> \nおはよーーーーーー！！！！！！朝だよーーーーーー！！！！！！");
});

client.on('message', message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.match(/にゃ～ん|にゃーん/)) {
        sendMsg(message.channel.id, "にゃ～んにゃん❤️");
        if (message.author.id == myserver_author_id) {
            sendMsg(message.channel.id, "ご主人様だ〜❤️嬉しい〜❤️");
        }
        return;
    }
    if (message.content.match(/こらー/)) {
        sendMsg(message.channel.id, "ごめんなさい><");
        return;
    }
    if (message.content.match(/！ナツメ/)) {
        sendMsg(message.channel.id, "はーい❤️");

        let count = 0;
        let frelist = [];
        let msg = sendMsg(message.channel.id, "今日参加する人〜✋");

        // 投票の欄
        client.add_reaction(msg, '\u21a9')
        client.add_reaction(msg, '⏫')
        client.pin_message(msg)

        // リアクションをチェックする
        while (1) {
            let target_reaction = client.wait_for_reaction(message = msg);
            // 発言したユーザが同一でない場合 真
            if (target_reaction.user != msg.author) {
                // 押された絵文字が既存のものの場合 >> 左　del
                if (target_reaction.reaction.emoji == '\u21a9') {
                    // ◀のリアクションに追加があったら反応 frelistにuser.nameがあった場合　真
                    if (target_reaction.user.name in frelist) {
                        frelist.remove(target_reaction.user.name)
                        count -= 1;
                    }
                    //押された絵文字が既存のものの場合 >> 右　add
                } else if (target_reaction.reaction.emoji == '⏫') {
                    if (!(target_reaction.user.name in frelist)) {
                        // リストに名前追加
                        frelist.append(target_reaction.user.name);
                        count += 1;
                    }
                } else if (target_reaction.reaction.emoji == '✖') {
                    // client.edit_message(msg, '募集終了\n' + '\n'.join(frelist));
                    // client.unpin_message(msg);
                    break;
                    client.remove_reaction(msg, target_reaction.reaction.emoji, target_reaction.user);
                    // ユーザーがつけたリアクションを消す※権限によってはエラー
                }
            } else
                client.edit_message(msg, '募集終了\n' + '\n'.join(frelist))
        }
    }
    return;
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
