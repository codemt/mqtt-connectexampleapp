const mqtt = require('mqtt') 	
var timestamps = require('./gettimestamps');	
var publisher = {

	client: null,

	callPublisher: function (){

		
		//subscribe to all topics
		var Broker_URL = 'mqtt.tamsys.tessol.in';
		var options = {
			//clientId: 'MyMQTT',
			port: 8883,
			username: process.env.USERNAME, // mqtt user name 
			password: process.env.PASSWORD,	
			keepalive : 60,
			rejectUnauthorized:false
		};
		publisher.client  = mqtt.connect('mqtts://'+Broker_URL, options);

		publisher.client.on('connect', () => { var options={ qos:1 }});  
		/*

		Messages are {“Temp”:25.50,”Door”:0,”Fan1”:0,”Fan2”:0,”Time”:”22-8-2018 15:07”,”mac”:”5ccf7f5a4ba4”}

		*/
		var time = timestamps.getUTCTime();
		//console.log("Time is " +time);
		
		var msg = {
			Temp:25.50,
			Door:0,
			Fan1:1,
			Fan2:0,
			Time:time,
			mac:"5ccf7f5a056e"
		}

		var datetime=new Date(); 
		//console.log(JSON.stringify(msg));
		publisher.client.publish(process.env.TOPIC,JSON.stringify(msg));
		//publisher.client.end();
			
	}

	

}			
module.exports = publisher;