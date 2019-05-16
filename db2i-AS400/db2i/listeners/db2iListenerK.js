// Listener code goes here or check out examples ( see top right dropdown menu )
// Getting the string equivalent of the record message.

var messageContent = payloadAsString;
// Create the payload
var messageAudit = {};
var date  = new Date();
messageAudit.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
messageAudit.message = messageContent;
var msg = JSON.stringify(messageAudit);
print("Message Topic Keyed :" + msg);
