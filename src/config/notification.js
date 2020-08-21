var path = require('path');
var apn = require('apn');
var FCM = require('fcm-push');
const BASE_PATH = path.resolve();

const sendPushIOS = async (deviceToken, title, message, eventId) => {
    var options = {
        token: {
            key: path.join(BASE_PATH, 'src', 'config', process.env.APN_FILE_NAME),
            keyId: process.env.APN_KEY_ID,
            teamId: process.env.APN_TEAM_ID,
        },
        production: false
    };

    var apnConnection = new apn.Provider(options);
    var note = new apn.Notification();
    note.badge = 1;
    note.alert = message;
    note.payload = { 'title': title , eventId };
    note.topic = "org.reactjs.native.example.BennyBites";
    note.sound = "default"
    return await apnConnection.send(note, deviceToken)
}

const sendPushAndroid = async (deviceToken, title, msg, eventId) => {
    var fcm = new FCM(process.env.FCM_KEY);
    var message = {
        to: deviceToken,
        data: {
            eventId
        },
        notification: {
            title: title,
            body: msg,
        }
    };
    return await fcm.send(message)
}

module.exports = {
    sendPushAndroid,
    sendPushIOS
}

