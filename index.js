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

    app.post('/',(req, res) => {
        var txt = String(req.body.txt);

        const encoding = require('encoding-japanese');

        var Msg_Code = encoding.detect(txt)
   
        var New_Msg_Code = encoding.convert(txt, {
            to: Msg_Code,
            from: 'EUC'
        });

        console.log(Msg_Code);
        console.log(New_Msg_Code);
    
        res.render("Text processing")
    })








