const express = require('express')
const fs = require("fs");
const bodyParser = require("body-parser")
const uniqid = require('uniqid');
const sanitizeHtml = require('sanitize-html');

const dataFile = "./data/players.json";
const port = 3000

const app = express()

//get player by id
app.get('/players/:id', function(req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data) => {
        let players = JSON.parse(data);

        //megkeressük a megfelelő player-ot id alján
        const playersById = players.find(player => player.id === id)
        if (!playersById) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //visszaküldjük
        res.send(playersById);
    });
})

//get players
app.get('/players', function(req, res) {
    fs.readFile(dataFile, (error, data) => {
        let players = data;
        res.send(players);
    });
})


//delete player by id
app.delete('/players/:id', function(req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data) => {
        let players = JSON.parse(data);

        //megkeressük a megfelelő player indexét id alján
        const playersIndexById = players.findIndex(player => player.id === id)

        if (playersIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //letöröljük
        players.splice(playersIndexById, 1);

        //visszaír: obj -> json
        players = JSON.stringify(players)
        fs.writeFile(dataFile, players, (error) => {
            console.log(error);
            //visszaküldjük, hogy melyik id-t töröltük
            res.send({ id: id });
        })
    });
})

//put player by id
app.put('/players/:id', bodyParser.json(), function(req, res) {
    let id = req.params.id;
    let putPlayer = {
            id: id,
            name: sanitizeHtml(req.body.name),
            quantity: req.body.quantity,
            price: req.body.price,
            type: sanitizeHtml(req.body.type)
        }
        //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data) => {
        let players = JSON.parse(data);

        //megkeressük a megfelelő player indexét id alján
        const playersIndexById = players.findIndex(player => player.id === id)

        if (playersIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //felülírjuk
        players[playersIndexById] = putplayer;

        //visszaír: obj -> json
        players = JSON.stringify(players)
        fs.writeFile(dataFile, players, (error) => {
            console.log(error);
            //visszaküldjük, a módosított rekordot
            res.send(putplayer);
        })
    });
})

//post
app.post('/players', bodyParser.json(), function(req, res) {
    let newplayer = {
        id: uniqid(),
        name: sanitizeHtml(req.body.name),
        quantity: req.body.quantity,
        price: req.body.price,
        type: sanitizeHtml(req.body.type)
    }


    fs.readFile(dataFile, (error, data) => {
        //beolvas, json -> obj
        let players = JSON.parse(data);
        //push
        players.push(newPlayer);
        //visszaír: obj -> json
        players = JSON.stringify(players)
        fs.writeFile(dataFile, players, (error) => {
            console.log(error);
            res.send(newPlayers);
        })

    })

})

app.listen(port)

//<script>alert('betörtem')</scrip>