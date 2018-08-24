var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
require('dotenv').config();
var axios = require('axios');

 //subscribe to all topics
 var Broker_URL = process.env.BROKER_URL;
 var Topic = process.env.TOPIC;
var Database_URL = process.env.DATABASE_URL;
// Datbase_URL = 192.168.1.123

var options = {
	//clientId: 'MyMQTT',
	port: 8883,
	username: process.env.USERNAME, // mqtt user name 
	password: process.env.PASSWORD,	
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
function mqtt_messsageReceived(topic, message) {
    
    // convert Byte Array to String.
    var msgreceived = message.toString();

 //   console.log(msgreceived.Temp);
    var myMessages = msgreceived;        
        //remove unwanted hidden characters inside message
         //preserve newlines, etc - use valid JSON
            myMessages = myMessages.replace(/\\n/g, "\\n")  
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
         //remove non-printable and other non-valid JSON chars
        myMessages = myMessages.replace(/[\u0000-\u0019]+/g,""); 
        var obj = JSON.parse(myMessages);
        console.log("Messages are " +myMessages);
        console.log("Object is " +obj);
        console.log("Temp is " +obj.Temp);
        console.log("Door is " +obj.Door);
        console.log("Fan1 is " +obj.Fan1);
        console.log("Fan2 is "+ obj.Fan2);
        console.log("Time is " + obj.Time);
        console.log("Mac is " + obj.mac);

        insert_message(obj);
    
    
};
var mysql = require('mysql'); //https://www.npmjs.com/package/mysql
//Create Connection
var connection = mysql.createConnection({
	host: Database_URL,
	user: "root",
	password: "secretpassword",
	database: "tamsys"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Database Connected!");
});
function insert_message(obj) {

    // assign obj to  device messages 
    var devicemessages = obj; 
    console.log("Device Messages are"+devicemessages);
   
    var rt = devicemessages.Temp;
    var door = devicemessages.Door;
    var f1 = devicemessages.Fan1;
    var f2 = devicemessages.Fan2;
    var created_at  = devicemessages.Time;
    var DeviceID = devicemessages.mac;
    var DeviceID = "AGS"+devicemessages.mac;
    var is_latest=1; 
    var name = "Agrisys Device#1"
    var payload = {};
    payload["rt"]=rt;
    payload["do"]=door;
    payload["f1"]=f1;
    payload["f2"]=f2;
    
    
    //console.log("Created at "+created_at);
    console.log("device id "+DeviceID);
    //console.log( JSON.stringify(payload) );
    var jsondata = JSON.stringify(payload);
    console.log("payload is " +jsondata);
    console.log("created at is " +created_at);

    // hit API and get all the devices.
    // get all device ids and check if the device id exists.
    /*
    connection.query("SELECT id FROM devices", function (err, result, fields) {
        if (err) throw err;
        var deviceids = result.toString();
        var devicesfetched = JSON.stringify(deviceids);
        console.log(devicesfetched);
      });
      */
       /* 
      // check if the deviceID exists in the table.
      var found = false;
        for( var i = 0; i < deviceids.length; i++ )
         {
            if ( deviceids[i] === DeviceID ) {
                found = true;
                break;
            }
        }
        if ( found ) {
            console.log("device id found");
            //the country code is not in the array
  
        } else {
            console.log("Device id not found");
            //the country code exists in the array
        }
        */
   
    /*
    // insert the device table if device id is unique.
    var sql = "INSERT INTO devices (id,name,created_at) VALUES ?";
    var values = [
        [DeviceID,name,created_at,]
    ];
	connection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });   
  */


    
   // insert the device logs in  the device_log table..
    var sql = "INSERT INTO device_logs (device_id,created_at,payload,is_latest)  VALUES ?";
    var values = [
        [DeviceID,created_at,jsondata,is_latest]
    ];
	connection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });   

  

  // update _is_latest log
  

        var sql = "UPDATE device_logs SET is_latest=0 where created_at < ?";
        var logs = [
            [created_at]
        ];
        connection.query(sql,[logs], function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
        });

  
  
  
	//var sql = "INSERT INTO testdevices (deviceid,Temp,Door,Fan1,Fan2) VALUES (?,?,?)";
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

