var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
var Topic = 'test/data'; //subscribe to all topics
var Broker_URL = 'test.mosquitto.org';
//var Database_URL = '192.168.1.123';

var options = {
	//clientId: 'MyMQTT',
	port: 8883,
	//username: 'agrisys', // mqtt user name 
	//password: 'VHVlIEF1ZyAxNCAxMzozNzo0OSBVVEMgMjAxOAo=',	
    keepalive : 60,
    rejectUnauthorized:false
};

var client  = mqtt.connect('mqtts://'+Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    var helloworld = "helloworld";
    mqtt_messsageReceived(Topic ,helloworld);
    if (err) {console.log(err);}
};

function mqtt_reconnect(err) {
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
	client  = mqtt.connect('mqtts://'+Broker_URL, options);
};

function mqtt_error(err) {
    console.log("Error!");
	if (err) {console.log(err);}
};

function after_publish() {
	//do nothing
};

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {

    console.log("Messages are "+message);
	//var message_str = message.toString(); //convert byte array to string
	//message_str = message_str.replace(/\n$/, ''); //remove new line
	//payload syntax: clientID,topic,message
	// if (countInstances(message_str) != 1) {
	// 	console.log("Invalid payload");
	// 	} else {	
	// 	insert_message(topic, message_str, packet);
	// 	console.log(message_arr);
	// }
};
function insert_message(topic, message_str, packet) {
	var message_arr = extract_string(message_str); //split a string into an array
	var Temp = message_arr[0];
    var Door = message_arr[1];
    var Fan1  = message_arr[2];
    var Fan2 = message_arr[3];
    var Time = message_arr[4];
    var Mac = message_arr[5];

    console.log(Temp,Door,Fan1,Fan2,Time,Mac);

	// var sql = "INSERT INTO ?? (??,??,??) VALUES (?,?,?)";
	// var params = ['tbl_messages', 'clientID', 'topic', 'message', clientID, topic, message];
	// sql = mysql.format(sql, params);	
	
	// connection.query(sql, function (error, results) {
	// 	if (error) throw error;
	// 	console.log("Message added: " + message_str);
	// }); 
};	


function mqtt_close() {
	console.log("Close MQTT");
};

