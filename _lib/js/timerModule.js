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
            //console.log(start_time);
        },
        log_part: function ( ) {
            stop_time = new Date().getTime();
            //console.log(stop_time);
            
            // catch if start time hasn't been logged  Shouldn't happen with new design
            if(start_time == 0) start_time = stop_time;
            
            // added time difference to array
            response_times['response_' + reponse_id + '_time'] = stop_time - start_time;
            reponse_id++;
            console.log(response_times);
        },
        new_frame: function ( ) {
            clear_values( );
        },
        get_response_times: function ( ) {
            return response_times;
        }
    };
}