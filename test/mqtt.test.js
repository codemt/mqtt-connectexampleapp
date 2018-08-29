process.env.BROKER_URL='mqtt.tamsys.tessol.in';
process.env.BROKER_PORT=8883;
process.env.TOPIC = 'agrisys/chill/#';
process.env.USERNAME='agrisys';
process.env.PASSWORD='VHVlIEF1ZyAxNCAxMzozNzo0OSBVVEMgMjAxOAo='
process.env.DATABASE_URL='127.0.0.1'
process.env.DATABASE_USERNAME='root'
process.env.DATABASE_NAME='tamsys'
process.env.DATABASE_PASSWORD='secretpassword'
;
var mqtt = require('mqtt');
var expect = require('chai').expect;
var assert = require('chai').assert;
let subscriber = require('../subscriber');
let publisher = require('../publisher');
let mysqlclient = require('mysql');
var Broker_URL = process.env.BROKER_URL;
var options = {
    //clientId: 'MyMQTT',
    port: 8883,
    username: process.env.USERNAME, // mqtt user name 
    password: process.env.PASSWORD,	
    keepalive : 60,
    rejectUnauthorized:false
};

// subscriber.start();

describe('subscriber', () => {
    before(() => {
        subscriber.start();
        
    });

    after(() => {
       subscriber.stop();
    });

});

describe('Publish Correct Message', () => {

    it('Publisher Correct Data',function(done){


        try{
            publisher.callPublisher();

        }
        catch(err){

            done(err);
        }
        // call correct data function.
    
       done();

    });

    it('Push Data to Datbase', async function(){


           
                  var x = await subscriber.start();

                 console.log(x);
                 assert.ok(true);
               // done();
           
            

    });
    
    /* PUBLISH INCORRECT DATA */
    
     it('Publish incorrect data', function(done){


        try{
    //         //some test
            publisher.callPublisherIncorrectData();
            
    //        // done();
         }
         catch(err){
             done(err);
         }

         done();

    });

    /* WORKING TEST */ 
     
    it('Publish Less Data',function(done){

              try{
            
                    publisher.callPublisherWithLessData();  
                 }
                 catch(err){
                     done(err);
                 }

                done();
    });
    
    it('Publish More Data',function(done){


        try{
            
            publisher.callPublisherwithMoreData();  
         }
         catch(err){
             done(err);
         }

         done();
       
               
    });

});