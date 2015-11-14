// JavaScript Document
function initPOISearch(map, markers){ 	
	var lat;
	var lng;
	var clickPosition = null;
	var clickMarker = null;
	var POIs = [];
	var input = document.getElementById('pac-input');
	var btn = document.getElementById('go');
  	//get clicking point
	google.maps.event.addListener(map, "click", function(event){
		lat = event.latLng.lat();
		lng = event.latLng.lng();
		clickPosition = {lat: lat, lng: lng};
		if(clickMarker != null){
			clickMarker.setMap(null);
		}
		clickMarker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: clickPosition,
			map: map,
			title: 'Hello World'
			//change icon image
			//icon: url
		});
		deleteMarker(markers);
		getAndShow(input, clickPosition, markers);
	});
	triggerClickingPOI();
	
	//get keyword
	
	input.addEventListener('keypress', function(e){
		var key = e.which || e.keyCode;
		if(key == 13){
			getAndShow(input, clickPosition, markers);
		}
	});
	
	btn.addEventListener('click', function(e){
		getAndShow(input, clickPosition, markers);
	});
}

//get keyword and show POIs
function getAndShow(input, location, markers){
	keyword = input.value;
	if(keyword && location != null){
		deleteMarker(markers);
		showPOIs(keyword, location, markers);
	}
}

function showPOIs(keyword, location, markers){
	//passing keyword and location to database and retrieve POIS
	/*
		add code to retrieve data from database
	
	*/
	//test case
	POIs = [];
	for(var i=0; i < 10; i++){
		POIs.push({
		position: {lat: Singapore.lat, lng:Singapore.lng+i/100},
		content: 'Ambassador Road<br />Bickenhill<br />Solihull<br />Birmingham<br />B26 3AW' + i,//can be
		/*
		  title: text
		  icon: url
		*/
		}
		);
	}
	
	//create markers
	var j=0;
	for (var i =0; i < POIs.length; i++) {
		setTimeout(function() {
		var marker = new google.maps.Marker({
			position: POIs[j].position,
			map: map,
			title: 'hello world'
			//animation: google.maps.Animation.DROP
			//icon: POIs[j].icon;
		});
		setInfoWindow(marker, POIs[j].content);
		markers.push(marker);	
		j++;
		}, i * 200+200);
	}
}

function setInfoWindow(marker, message){
	var infoWindow = new google.maps.InfoWindow({
		content: message
	});
	google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
}

function deleteMarker(markers){
	markers.forEach(function(marker){
			marker.setMap(null);
		});
	markers = [];
}

//if POI on google maps are not disabled, please use this to listen their click event
function triggerClickingPOI(){
	//keep a reference to the original setPosition-function
	var fx = google.maps.InfoWindow.prototype.setPosition;
	
	//override the built-in setPosition-method
	google.maps.InfoWindow.prototype.setPosition = function () {
	
	//logAsInternal isn't documented, but as it seems
	//it's only defined for InfoWindows opened on POI's
	if (this.logAsInternal) {
		google.maps.event.addListenerOnce(this, 'map_changed',function () {
			//the infoWindow will be opened, usually after a click on a POI
	  		if (map) {
				//trigger the click
				google.maps.event.trigger(map, 'click', {latLng: this.getPosition()});
	  		}
		});
	}
	//call the original setPosition-method
	fx.apply(this, arguments);
	};
}