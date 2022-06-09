const express = require("express");
    const app = express();
    const server = require('http').createServer(app)
    const io = require('socket.io')(server)
    const bodyParser = require("body-parser")
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    server.listen(5000);
    app.set('view engine', 'ejs')
    app.use(express.static('public'))

    const path = require("path");
    const livereload = require("livereload");
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, 'public'));

    const connectLivereload = require("connect-livereload");
    app.use(connectLivereload());

    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });

    app.get("/", (req, res) => {
        res.render("Text processing")
    });

    app.post('/new',(req, res) => {
        var txt = String(req.body.txt);
        var Character_type1 = ""
        var Character_type2 = ""
        var new_line = ""

        if (txt.search('\n') > -1) {
            new_line = "改行があります。"
        }
        else{
            new_line = "改行がありません。"
        }

        if (txt.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/)) {    
            Character_type2 = "全角文字です"
            txt = Zenkaku2hankaku(txt)
        } else {
            Character_type2 = "半角文字です"
        }
        
        if (isNaN(txt) == true) {
            Character_type1 = "文字列"
        }
        else{
            Character_type1 = "数値"
        }
        

        function Zenkaku2hankaku(str) {
            return str.replace(/[０-９]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
        }
        

        const encoding = require('encoding-japanese');

        var Msg_Code = encoding.detect(txt)
   
        var New_Msg_Code = encoding.convert(txt, {
            to: Msg_Code,
            from: 'EUC'
        });

        res.render("encoding",{New_txt:New_Msg_Code,code:Msg_Code,new_line:new_line,Character_type1:Character_type1,Character_type2:Character_type2})
    
    })








