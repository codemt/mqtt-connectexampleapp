var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
require('dotenv').config();
var subscriber = {
        client:  null,
        start: function(x){


              //subscribe to all topics
              var Broker_URL = process.env.BROKER_URL;
              var Topic = process.env.TOPIC;
              var Database_URL =  process.env.DATABASE_URL; 
              // database URL will be localhost/ 
  
              var options = {
                  //clientId: 'MyMQTT',
                  port: 8883,
                  username: process.env.USERNAME, // mqtt user name 
                  password: process.env.PASSWORD,	
                  keepalive : 60,
                  rejectUnauthorized:false
              };
  
              subscriber.client  = mqtt.connect('mqtts://'+Broker_URL, options);
              subscriber.client.on('connect', mqtt_connect);
              subscriber.client.on('reconnect', mqtt_reconnect);
              subscriber.client.on('error', mqtt_error);
               subscriber.client.on('message', this.checkMessage);
               subscriber.client.on('close', this.mqtt_close);
  
              function mqtt_connect() {
                  console.log("Connecting MQTT");
                  subscriber.client.subscribe(Topic, mqtt_subscribe);
              };
  
              function mqtt_subscribe(err, granted) {
                  console.log("Subscribed to " + Topic);
                  if (err) {console.log(err);}
              };
  
              function mqtt_reconnect(err) {
                  console.log("Reconnect MQTT");
                  if (err) {console.log(err);}
                  subscriber.client  = mqtt.connect('mqtts://'+Broker_URL, options);
              };
  
              function mqtt_error(err) {
                  console.log("Error!");
                  if (err) {console.log(err);}
              };
  
              function after_publish() {
                  //do nothing
              };
            
            return new Promise(resolve => {

            setTimeout(() => {
                resolve('resolved');
              }, 5000);

            });
    
            },
            //receive a message from MQTT broker
             checkMessage : function mqtt_messsageReceived(topic, message, packet) {
                
               // console.log(message);
                var msgreceived = message.toString();
                //console.log(msgreceived);
                var myMessages = msgreceived;        
                    myMessages = 
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
                    // console.log("Temp is " +obj.Temp);
                    // console.log("Door is " +obj.Door);
                    // console.log("Fan1 is " +obj.Fan1);
                    // console.log("Fan2 is "+ obj.Fan2);
                    // console.log("Time is " + obj.Time);
                    // console.log("Mac is " + obj.mac);

                  //return myMessages;  
                 //insert_message(obj);
                 module.exports.sendData(obj);
    
    
        },
        sendData : function(obj){
        var mysql = require('mysql'); //https://www.npmjs.com/package/mysql
        //Create Connection
        var connection = mysql.createConnection({
            host: process.env.DATABASE_URL,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        });

        connection.connect(function(err) {
            if (err) throw err;
            console.log("Database Connected!");
        });

                /* $device_log = $request->only(['lat', 'lon', 'speed', 'ct', 'gf', 'vf', 'pf', 
                                      'cr', 'f1', 'f2', 'pb', 'rb', 'cb', 'p6', 'al', 'p8', 
                                      'cl', 'p9', 'l4', 'bt', 'gs', 'no', 'q1', 'q2', 'q3']); */

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
                var name = "Agrisys Device#1"
                var asset_class = "Static Freezers";
                var is_latest=1; 

                var payload = {};
                // payload["rt"]=rt;
                // payload["do"]=door;
                // payload["f1"]=f1;
                // payload["f2"]=f2;
                 payload = Object.assign({
    

                    "rt":devicemessages.Temp,
                    "do":devicemessages.Door,
                    "f1":devicemessages.Fan1,
                    "f2":devicemessages.Fan2,
                    "f3":devicemessages.Fan3
                })
                console.log(payload);
                // Remove undefined elements in the object.
                Object.keys(payload).forEach(key => payload[key] === undefined ? delete payload[key] : '');
                console.log(payload);
                console.log("Created at "+created_at);
                console.log("device id "+DeviceID);
                //console.log( JSON.stringify(payload) );
                var jsondata = JSON.stringify(payload);
                console.log("payload is " +jsondata);
                console.log("jsondata of temp is " +payload["rt"]);

                // insert the device in devices  if device is not present.
                /* 
                    var sql = "INSERT INTO devices (id,name,created_at,asset_class) VALUES ?";
                    var values = [
                        [DeviceID,name,created_at,asset_class]
                    ];
                    connection.query(sql, [values], function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });   
            */
            
                
                   
                              
     


                                         // insert into the device_logs table.
                        var sql = "INSERT INTO device_logs (device_id, created_at,payload,is_latest) VALUES ?";
                        var values = [
                            [DeviceID,created_at,jsondata,is_latest]
                        ];
                        connection.query(sql, [values], function (err, result) {
                        if (err) throw err;
                        console.log("Number of records inserted: " + result.affectedRows);
                        });   

                           // update _is_latest log
        
                        var sql = "UPDATE device_logs SET is_latest=0  WHERE device_id='AGS5ccf7f5a056e' AND created_at < ?";
                        var logs = [
                            [created_at]
                        ];
                        connection.query(sql,[logs], function (err, result) {
                            if (err) throw err;
                            console.log(result.affectedRows + " record(s) updated");
                        });
        	




            


                         
        },
        mqtt_close : function mqtt_close() {
            console.log("Close MQTT");
        },

        stop: function() {
            subscriber.client.end();
        }

        


}
module.exports = subscriber;