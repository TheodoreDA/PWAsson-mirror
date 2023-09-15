var express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');


var app = express();

//mise en place du CORS
app.use(cors());

//Recuperation facile des parametres POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/test', (req, res) => {
    console.log('test ok');
});

app.post('/subscribe', (req, res) => {
  console.log('endpoint subscribe',req.body);
    webpush.setVapidDetails(
        'mailto:guillaume.robin@epitech.eu',
        'BMZdk5HrjPfnNP2cDyH70dYm7uby9VRYr7DmCbMsfU0HXDKl2VERLk-W5NTOjC5ocgB9mvUT0eNZIcM3qxmQbJ0',
        'EMcMgIRzM8rATfjcMrUJ0skjheoVLPkFT0OQEhIUT-0'
      );
    console.log('endpoint subscribe',req.body);
    const payload = "test"
    // const payload = {
    //     notification: {
    //         title: 'Ma notification d\'exemple',
    //         body: 'Voici le corps de ma notification',
    //         icon: 'assets/icons/icon-384x384.png',
    //         actions: [
    //             { action: 'bar', title: 'Action custom' },
    //             { action: 'baz', title: 'Une autre action' },
    //         ],
    //         data: {
    //             onActionClick: {
    //                 default: { operation: 'openWindow',url: "http://localhost:3000/" },
    //                 bar: {
    //                     operation: 'focusLastFocusedOrOpen',
    //                     url: '/signin',
    //                 },
    //                 baz: {
    //                     operation: 'navigateLastFocusedOrOpen',
    //                     url: '/signin',
    //                 },
    //             },
    //         },
    //     },
    // };
      webpush.sendNotification(req.body, JSON.stringify(payload));
});

app.listen(4200, () => {
    console.log("Server running on port 4200");
});