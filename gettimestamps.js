var TimeStamps = {

    getUTCTime :   function(){

          var today = new Date();
          var dd = today.getDate(); // get date
          var mm = today.getMonth(); // get month
          var yyyy = today.getFullYear(); // get year 

      // get hours minutes and seconds .
      // get normal indian hours
      //var hours = today.getHours();
      // get hours in UTC.
      var hours = today.getUTCHours();
      var min = today.getMinutes();
      var seconds = today.getSeconds();

      if(dd<10) {
          dd = '0'+dd;
      } 

      if(mm<10) {
          mm = '0'+mm;
      
      } 
      if(min<10)
      {
          min = '0'+min;
          
      }
      if(seconds<10)
      {
          seconds = '0'+seconds;
      }

      today = yyyy + '-' + mm + '-' + dd + ' ' + hours+':'+min+':'+seconds;
      
  
      return today;





      }

}
module.exports = TimeStamps;