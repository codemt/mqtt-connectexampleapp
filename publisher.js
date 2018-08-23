const mqtt = require('mqtt') 
 //subscribe to all topics
var Broker_URL = 'mqtt.tamsys.tessol.in';
var options = {
	//clientId: 'MyMQTT',
	port: 8883,
	username: 'agrisys', // mqtt user name 
	password: 'VHVlIEF1ZyAxNCAxMzozNzo0OSBVVEMgMjAxOAo=',	
    keepalive : 60,
    rejectUnauthorized:false
};
var client  = mqtt.connect('mqtts://'+Broker_URL, options);

 client.on('connect', () => { var options={ qos:1 }});  
/*

Messages are {“Temp”:25.50,”Door”:0,”Fan1”:0,”Fan2”:0,”Time”:”22-8-2018 15:07”,”mac”:”5ccf7f5a4ba4”}

*/
var msg = {
	Temp:25.50,
	Door:0,
	Fan1:0,
	Fan2:0,
	Time:"22-8-2018 15:07",
	mac:"5ccf7f5a4ba4"
}

var datetime=new Date(); 
client.publish('agrisys/chill/5ccf7f5a056e',JSON.stringify(msg));
//client.disconnect();