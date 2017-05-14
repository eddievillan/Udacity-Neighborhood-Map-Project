var map;
var mapOpts;
var openInfoWindow;
var yelp;
var yelpQuery;
var myObservableYelp = ko.observableArray();

// Initializing the map and setting myMarkers
function initMap() {

	var mapCanvas = $('#google-map');
	var canvasHeight = $('#google-map').height();
	var canvasWidth = $('#google-map').width();
	mapOpts = {
		disableDefaultUI: true,
		center: new google.maps.LatLng(38.5449274, -121.7500067),
	};

	if(canvasWidth > 960 && canvasHeight > 920) {
		mapOpts.zoom = 15;
	}else if(canvasHeight < 500){
		mapOpts.zoom = 13;
	}else {
		mapOpts.zoom = 14;
	}

	if (canvasWidth < 600 || canvasHeight < 700) {
		noNav();
		noYelpNav();
	}

	map = new google.maps.Map(document.getElementById('google-map'), mapOpts);

	setMyMarkers();
}

//If map doesn't load, display error
function googleError() {
	console.log("Google Map Error");
	$('#google-map').prepend('<h1 style="padding: 0px 80px 0px 280px;display: flex; ' +
		'font-size: 40px; text-align: center;">Error Google Map Couldn\'t Load</h1>');
}

//Information about the different locations
var myMarkers = [
	{title: "Froggy's Grill",
	lat: 38.543407,
	lng: -121.7389779,
	streetAddress: "726 2nd St",
	cityAddress: "Davis, CA 95616",
	url: "www.tommyjs.com",
	visible: ko.observable(true)},
	{title: 'Davis Food Co-op',
	lat: 38.5495216,
	lng: -121.7398211,
	streetAddress: "620 G St",
	cityAddress: "Davis, CA 95616",
	url: "www.ncg.coop/partners-find/ca/davis-food-co-op",
	visible: ko.observable(true)},
	{title: 'Temple Coffee Roasters',
	lat: 38.5445069,
	lng: -121.7395449,
	streetAddress: "239 G St",
	cityAddress: "Davis, CA 95616",
	url: "www.templecoffee.com",
	visible: ko.observable(true)},
	{title: 'Zumapoke & Lush Ice',
	lat: 38.5446983,
	lng: -121.7396693,
	streetAddress: "730 3rd St",
	cityAddress: "Davis, CA 95616",
	url: "www.zumapoke.com",
	visible: ko.observable(true)},
	{title: 'UC Davis',
	lat: 38.5292559,
	lng: -121.7626134,
	streetAddress: "1 Shields Ave",
	cityAddress: "Davis, CA 95616",
	url: "www.ucdavis.edu",
	visible: ko.observable(true)},
	{title: 'Dumpling House & London Fish\'n Chips',
	lat: 38.5426593,
	lng: -121.7410902,
	streetAddress: "129 E St",
	cityAddress: "Davis, CA 95616",
	url: "www.yelp.com/biz/dumpling-house-davis",
	visible: ko.observable(true)},
	{title: 'Taqueria Davis',
	lat: 38.5487920,
	lng: -121.7349302,
	streetAddress: "505 L St",
	cityAddress: "Davis, CA 95616",
	url: "www.taqueriadavis.com/",
	visible: ko.observable(true)},
	{title: 'Community Park',
	lat:38.5586029,
	lng: -121.7477632,
	streetAddress: "1405 F St",
	cityAddress: "Davis, CA 95616",
	url: "localwiki.org/davis/Community_Park",
	visible: ko.observable(true)}
];

// Generates Google Street Image depending on lat and lng of location
var googStreetImage;
function setImage() {
	var googStreetUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

	googStreetImage = googStreetUrl + myMarkers[i].lat + ',' +
					  myMarkers[i].lng + '&fov=70&pitch=8';
}

// Set Markers on map, generate info windows
// Add event listener for markers to open info window on click
function setMyMarkers() {

	for(i=0; i<myMarkers.length; i++) {
		myMarkers[i].googleMarker = new google.maps.Marker({
		  position: new google.maps.LatLng(myMarkers[i].lat, myMarkers[i].lng),
		  map: map,
		  title: myMarkers[i].title,
		  icon: {
			url: 'img/map-marker.png',
			size: new google.maps.Size(30, 30),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(12.5, 40)
			},
		});

		//function to place google street view images within info windows
		setImage();

		//Binds infoWindow content to each marker
		myMarkers[i].infoWindowContent = '<img src="' + googStreetImage +
									'" alt="Google Street View at ' + myMarkers[i].title +
									'"><br><strong>' +
									myMarkers[i].title + '</strong><br><a class="web-links" href="http://' +
									myMarkers[i].url + '" target="_blank">' + myMarkers[i].url + '</a><br><p>' +
									myMarkers[i].streetAddress + '<br>' +
									myMarkers[i].cityAddress + '</p>';

		myMarkers[i].infowindow = new google.maps.InfoWindow({
			content: myMarkers[i].infoWindowContent
		});
		// Zoom, center, and open infowindow on marker click. If theres an open infowindow, close it first before
		// opening a new one.
		new google.maps.event.addListener(myMarkers[i].googleMarker, 'click', (function(marker, i) {
		  return function() {
		  	if(openInfoWindow != null){
		  		openInfoWindow.close();
		  	}

			myMarkers[i].infowindow.setContent(myMarkers[i].infoWindowContent);
			myMarkers[i].infowindow.open(map,this);
			openInfoWindow = myMarkers[i].infowindow;
			map.setZoom(16);
			map.setCenter(marker.getPosition());
			marker.setAnimation(google.maps.Animation.DROP);
		  };
		})(myMarkers[i].googleMarker, i));
	}
}

myMarkers.forEach(function(marker){
	getFoursquareInfo(marker);
});

//Foursquare API
function getFoursquareInfo(marker) {
	var clientID = 'USGOIUZIHMC5GPVPYCAIBE5GTB0HSRQFVGSZ3RSZBXWY22W3';
	var clientSecret = 'TVRQGYNPIEYOVRSFLFLB3UCRZH2RDCMHPUOVGKUPSA5HDS0F';
	var version = 20170412;
	var foursquare = 'https://api.foursquare.com/v2/venues/search?client_id=' + clientID + 
			'&client_secret=' + clientSecret + '&v=' + version + '&ll=' + marker.lat + ',' + marker.lng + 
			'&query=' + marker.title;

	$.ajax(foursquare).done(function(results) {
		var thisVenue = results.response.venues[0];
		marker.phoneNumber = thisVenue.contact.phone;
		marker.formattedPhone = thisVenue.contact.formattedPhone;

		marker.infoWindowContent += '<br><a href="tel:' + marker.phoneNumber + 
				'">' + marker.formattedPhone + '</a>';
	}).fail(function(jqXHR, textStatus) {
		window.alert('Foursquare API failed to connect, please try again later.');
	});
}

// This oauthentication 1.0a code was found at the following link
// https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/5

/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var yelp_url = 'https://api.yelp.com/v2/search';
var yelp_key_secret = 'K6FRrwS70ySFSyOcN4lBfgw7xec';
var yelp_token_secret = 'v8Qk6-Q20sAMkB4RFat3vxQKlx8';

var parameters = {
  oauth_consumer_key: 'B3RvZpcnjESLKCMRkZgKvg',
  oauth_token: 'CdQsN-p_PEKGuEN4gIdoPLMXWqPCmCb5',
  oauth_nonce: nonce_generate(),
  oauth_timestamp: Math.floor(Date.now()/1000),
  oauth_signature_method: 'HMAC-SHA1',
  oauth_version : '1.0',
  // This is crucial to include for jsonp implementation
  //	in AJAX or else the oauth-signature will be wrong.
  callback: 'cb',
  term: 'Chinese',
  location: 'Davis, CA',
  limit: '10'
};

var encodedSignature = oauthSignature.generate('GET',yelp_url,
	parameters, yelp_key_secret, yelp_token_secret);
parameters.oauth_signature = encodedSignature;

var settings = {
  url: yelp_url,
  data: parameters,
   // This is crucial to include as well to prevent jQuery from adding on a cache-buster
   // 	parameter "_=23489489749837", invalidating our oauth-signature
  cache: true,
  dataType: 'jsonp'
};

// Send AJAX query via jQuery library.
$.ajax(settings).done(function(results) {
	yelp = results.businesses;
  	for(var i = 0; i < yelp.length; i++) {
  		yelp[i].visible = ko.observable(true);
  		myObservableYelp.push(yelp[i]);
  	}
  }).fail(function(jqXHR, textStatus) {
  	window.alert("Uh Oh! The Yelp request didn't go through. Please try again later.");
  });


// Recreate oauth info and recall yelp API GET request
function searchYelp() {
	var newSearchParameters = {
		oauth_consumer_key: 'B3RvZpcnjESLKCMRkZgKvg',
		oauth_token: 'CdQsN-p_PEKGuEN4gIdoPLMXWqPCmCb5',
		oauth_nonce: nonce_generate(),
		oauth_timestamp: Math.floor(Date.now()/1000),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version : '1.0',
		// This is crucial to include for jsonp implementation
		//	in AJAX or else the oauth-signature will be wrong.
		callback: 'cb',
		term: viewModel.yelpQuery(),
		location: 'Davis, CA',
		limit: '10'
	};
	encodedSignature = oauthSignature.generate('GET',yelp_url,
	newSearchParameters, yelp_key_secret, yelp_token_secret);
	newSearchParameters.oauth_signature = encodedSignature;
	var newSettings = {
		url: yelp_url,
		data: newSearchParameters,
		// This is crucial to include as well to prevent jQuery from adding on a cache-buster
		// 	parameter "_=23489489749837", invalidating our oauth-signature
		cache: true,
		dataType: 'jsonp'
	};
	$.ajax(newSettings).done(function(results) {
	yelp = results.businesses;
	var oldArray = myObservableYelp.removeAll();
  	for(var i = 0; i < yelp.length; i++) {
  		yelp[i].visible = ko.observable(true);
  		myObservableYelp.push(yelp[i]);
  	}
  }).fail(function(jqXHR, textStatus) {
  	window.alert("Uh Oh! The Yelp request didn't go through. Please try again later.");
  });
}

var viewModel = {
	query: ko.observable(''),
	yelpQuery: ko.observable(''),
	mapCanvasReset: function() {
		mapCanvas = $('#google-map');
		var canvasHeight = $('#google-map').height();
		var canvasWidth = $('#google-map').width();

		if(openInfoWindow != null) {
			openInfoWindow.close();
		}
		noNav();
		noYelpNav();
		map.setCenter(mapOpts.center);
		if(canvasWidth > 960 && canvasHeight > 920) {
			map.setZoom(15);
		}
		else if(canvasHeight < 500) {
			map.setZoom(13);
		}
		else {
			map.setZoom(14);
		}
	},
	// open info window of marker that is clicked
	openWindow: function(marker) {
		if(!marker.infowindow){
			return;
		} else {
			if(openInfoWindow) {
				openInfoWindow.close();
			}
			marker.infowindow.setContent(marker.infoWindowContent);
			marker.infowindow.open(map, marker.googleMarker);
			marker.googleMarker.setAnimation(google.maps.Animation.DROP);
			openInfoWindow = marker.infowindow;
			map.setZoom(16);
			map.setCenter(marker.googleMarker.getPosition());
		}
	},
	// Toggle nav on the left side
	toggleNav: function() {
		if(navVisible) {
			return noNav();
		} else if(yelpNavVisible) {
			noYelpNav();
			yesNav();
		} else {
			yesNav();
		}
	},
	// Toggle Yelp nav on the right side
	toggleYelpNav: function() {
		if(yelpNavVisible) {
			return noYelpNav();
		} else if(navVisible) {
			noNav();
			yesYelpNav();
		} else {
			yesYelpNav();
		}
	},
	// When enter is clicked, execute function 'searchYelp'
	// I use this for the yelp search in the right side navigation
	onEnter: function(d,e) {
		e.keyCode === 13 && searchYelp();
		return true;
	}
};

// Search through myMarkers using knockout dependent observable
viewModel.myMarkers = ko.computed(function() {
    var search = viewModel.query().toLowerCase();
    return ko.utils.arrayFilter(myMarkers, function(marker) {
    	var lowerCaseMarkerTitle = marker.title.toLowerCase();
    	if (lowerCaseMarkerTitle.indexOf(search) >= 0) {
    		if(marker.googleMarker){
    			marker.googleMarker.setVisible(true);
    		}
            return true;
        } else {
        	if(marker.googleMarker){
    			marker.googleMarker.setVisible(false);
    		}
            return false;
        }
    });
}, viewModel);

ko.applyBindings(viewModel);

//Toggle Yelp Nav on the right-side on click
var yelpNavVisible = true;
function noYelpNav() {
	$(".yelp-search-nav").animate({
				height: 0,
			}, 500);
			$(".yelp-blue-arrow").attr("src", "img/blue-down-arrow.png");
			yelpNavVisible = false;
}
function yesYelpNav() {
	$(".yelp-search-nav").show();
			var scrollerHeight = $(".scroller").height() + 200;
			if($(window).height() < 600) {
				$(".yelp-search-nav").animate({
					height: scrollerHeight - 100,
				}, 500);
			} else {
			$(".yelp-search-nav").animate({
				height: scrollerHeight,
			}, 500);
			}
			$(".yelp-blue-arrow").attr("src", "img/blue-up-arrow.png");
			yelpNavVisible = true;
}

//Toggle Nav on the left-side on click
var navVisible = true;
function noNav() {
	$(".marker-search-nav").animate({
				height: 0,
			}, 500);
			$(".blue-arrow").attr("src", "img/blue-down-arrow.png");
			navVisible = false;
}
function yesNav() {
	$(".marker-search-nav").show();
			var scrollerHeight = $("#scroller").height() + 500;
			if($(window).height() < 600) {
				$(".marker-search-nav").animate({
					height: scrollerHeight - 100,
				}, 500, function() {
					$(this).css('height','auto').css("max-height", 439);
				});
			} else {
			$(".marker-search-nav").animate({
				height: scrollerHeight,
			}, 500, function() {
				$(this).css('height','auto').css("max-height", 549);
			});
			}
			$(".blue-arrow").attr("src", "img/blue-up-arrow.png");
			navVisible = true;
}