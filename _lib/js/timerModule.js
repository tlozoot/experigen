/**********************************************
* timerModule.js
*
* Creates an object that tracks response times for experigen trials.
* Designed to record times for each part in a screen, then return times
* in an object to write to database server. 
*
* by Carl Pillot
* last update 8-16-12
***********************************************/

var timer_maker = function (  ) {
    
    // private variables
    var start_time = 0;
    var stop_time = 0;
    var reponse_id = 1;
    var response_times = {};
    
    var clear_values = function (  ) {
            start_time = 0;
            stop_time = 0;
            reponse_id = 1;
            response_times = {};
    };
    
    return {
        set_start_time: function ( ) {
            start_time = new Date().getTime();
            //console.log('New Start Time: '+start_time);
        },
        log_part: function ( responseID ) {
            stop_time = new Date().getTime();
            //console.log(stop_time);
            responseName = 'response' + responseID + '_time';
            
            // If a response doesn't exist add new response
            if(!response_times.hasOwnProperty(responseName)) {
                response_times[responseName] = 
                    { start: start_time,
                      stop: stop_time,
                      time: stop_time - start_time,
                      number: 1 };
            }
            
            // If a response already exists, recalculate the response time
            // TODO add check for missing values
            //(response_times.hasOwnProperty(responseName)) {
            else {
                response_times[responseName]['stop'] = stop_time;
                response_times[responseName]['time'] = stop_time - response_times[responseName]['start'];
                response_times[responseName]['number'] = response_times[responseName]['number'] + 1;
            }
            //console.log('Recording time for '+responseName);
            //console.log(response_times);
        },
        new_frame: function ( ) {
            clear_values( );
        },
        get_response_times: function ( ) {
            return response_times;
        }
    };
}