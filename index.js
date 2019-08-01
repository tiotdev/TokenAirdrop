const fs = require("fs");
const steem = require("steem");
const SSC = require("sscjs");
const config = require("./config.js").config;
const path = require('path').dirname(require.main.filename);

const ssc = new SSC('https://api.steem-engine.com/rpc');


function send(){
    if (config.mode.toLowerCase() != "issue" && config.mode.toLowerCase() != "transfer"){
        callback("Please only use issue or transfer in the mode in config.")
        return;
    }
    getTokens(result => {
        result.forEach(element => {
            var sendJSON = {"contractName":"tokens","contractAction":config.mode.toLowerCase() ,"contractPayload":{"symbol": config.tokenSymbol,"to": element.author,"quantity": element.amountToSend,"memo":"Test"}}
            steem.broadcast.customJson(config.accountPrivateActiveKey, [config.accountName], null, "ssc-mainnet1", JSON.stringify(sendJSON), function(err, result) {
                if (!err){
                    console.log(`Sent ${element.amountToSend} to ${element.author}.`)
                } else {
                    console.log(`Error sending ${element.amountToSend} to ${element.author}.`)
                }
            });
        });
    })
}

function getTokens(callback){
    fs.readFile(`${path}/ToSend.txt`, (err, data) => {
        callback(JSON.parse(data));
    })
}

send();