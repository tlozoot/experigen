

var audioRecord = (function () {
	
	URL = window.URL || window.webkitURL; //webkitURL is deprecated

	var serverURL = Experigen.settings.recorderServer;

	var gumStream; 						//stream from getUserMedia()
	var recorder; 						//WebAudioRecorder object
	var input; 							//MediaStreamAudioSourceNode  we'll be recording
	var encodingType; 					//holds selected encoding for resulting audio (file)
	var encodeAfterRecord = true;       // when to encode

	// shim for AudioContext when it's not avb. 
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioContext; //new audio context to help us record

	//var encodingTypeSelect = document.getElementById("encodingTypeSelect");
	var encodingType = "mp3"
	var recorderWrapperID = "recorder"; // DIV that recorder will be in
	var soundFile = "test"; // default filename
	var recordingStatus = false; // are we currently recording?
	var verbose = "false";


	
	function toggleRecording() {
		if(!recordingStatus) {
			startRecording();
			recordingStatus = true;
			startStopButton.innerHTML = Experigen.settings.strings.stopButton;
			
		} else {
			stopRecording();
			recordingStatus = false;
			startStopButton.innerHTML = Experigen.settings.strings.recordButton;
		}
	
	}


	function startRecording() {
		__log("startRecording() called");
		
		// remove earlier recordings
		document.getElementById("recordingsList").innerHTML = "";
		document.getElementById("status").innerHTML = "";

		var constraints = { audio: true, video:false }

		navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
			__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

			audioContext = new AudioContext();
			//assign to gumStream for later use
			gumStream = stream;
		
			input = audioContext.createMediaStreamSource(stream);
		
			//stop the input from playing back through the speakers
			//input.connect(audioContext.destination)

			recorder = new WebAudioRecorder(input, {
			  workerDir: "_lib/recorder/", // must end with slash
			  encoding: encodingType,
			  numChannels:2, //2 is the default, mp3 encoding supports only 2
			  onEncoderLoading: function(recorder, encoding) {
				// show "loading encoder..." display
				__log("Loading "+encoding+" encoder...");
			  },
			  onEncoderLoaded: function(recorder, encoding) {
				// hide "loading encoder..." display
				__log(encoding+" encoder loaded");
			  }
			});

			recorder.onComplete = function(recorder, blob) { 
				__log("Encoding complete");
				createDownloadLink(blob,recorder.encoding);
			}

			recorder.onEncodingProgress = function (recorder, progress) {
				//console.log(progress);
			}

			recorder.setOptions({
			  timeLimit:120,
			  encodeAfterRecord:encodeAfterRecord,
			  ogg: {quality: 0.5},
			  mp3: {bitRate: 160}
			});

			


			//start the recording process
			recorder.startRecording();
			let status = document.createElement('span');
			status.innerHTML = Experigen.settings.strings.recording;
			status.classList.add("pulsating");
			document.getElementById("status").append(status);


			 __log("Recording started");

		}).catch(function(err) {
			//enable the record button if getUSerMedia() fails
			startStopButton.innerHTML = Experigen.settings.strings.recordButton;
		});

		startStopButton.innerHTML = Experigen.settings.strings.stopButton;
	}

	function stopRecording() {
		__log("stopRecording() called");
	
		//stop microphone access
		gumStream.getAudioTracks()[0].stop();

		//disable the stop button
		//startStopButton.innerHTML = Experigen.settings.strings.recordButton;
		startStopButton.disabled = true;
		//document.getElementById("status").innerHTML = "";
		
		let status = document.createElement('span');
		status.innerHTML = Experigen.settings.strings.processing;
		status.classList.add("pulsating");
		document.getElementById("status").innerHTML = "";
		document.getElementById("status").append(status);
		
		recorder.finishRecording();
		__log('Recording stopped');
	}

	function createDownloadLink(blob,encoding) {

	
		var url = URL.createObjectURL(blob);
		var au = document.createElement('audio');
		var li = document.createElement('li');

		//add controls to the <audio> element
		au.controls = true;
		au.src = url;
		//add the new audio and a elements to the li element
		li.appendChild(au);
	
		var filename = audioRecord.soundFile + "_" + new Date().toISOString() + "" + '.'+encoding;

		//upload button
		var that = this;
		this.upload = document.createElement('button');
		upload.href="#";
		upload.id = filename;
		//console.log(filename);
		upload.innerHTML = Experigen.settings.strings.sentButton;
		upload.addEventListener("click", function(event){
			  var xhr=new XMLHttpRequest();
			  xhr.onload=function(e) {
				  if(this.readyState === 4) {
					  __log("Server returned: " , e.target.responseText.replace(/\s+/g," "));
					  document.getElementById("status").innerHTML = Experigen.settings.strings.uploadSuccessful;
					  Experigen.screen().continueButtonClick(document.getElementById("controls"));
				  }
			  };
			  xhr.upload.onprogress = function(e) {
				  document.getElementById(that.upload.id).disabled = true;

				  let status = document.createElement('span');
				  status.innerHTML = Experigen.settings.strings.uploading;
				  status.classList.add("pulsating");
				  document.getElementById("status").innerHTML = "";
				  document.getElementById("status").append(status);
			  } 
		  
			  var fd=new FormData();
			  fd.append("audio_data",blob, filename);
			  xhr.open("POST",serverURL,true);
			  xhr.send(fd);
		})

		this.tryagain = document.createElement('button');
		tryagain.href="#";
		tryagain.id = filename;
		tryagain.innerHTML = Experigen.settings.strings.tryagainButton;
		tryagain.addEventListener("click", function(event){
			document.getElementById("status").innerHTML = "";
			startStopButton.disabled = false;
			document.getElementById("recordingsList").innerHTML = "";
			
		})		

		document.getElementById("status").innerHTML = "";
		document.getElementById("status").appendChild(upload);
		document.getElementById("status").appendChild(tryagain);

		recordingsList.appendChild(li);
	}



	//helper function
	function __log(e, data) {
		//log.innerHTML += "\n" + e + " " + (data || '');
		if (this.verbose) {
			console.log(e + " " + (data || ''));
		}
	}



	return {
		toggleRecording: toggleRecording,
		soundFile: soundFile
	}
})(); 

//var consultantSelection;
///////// load sentences for speakers







