var map;
var markersArray = [];

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
	  '&signed_in=false&callback=initialize';
  document.body.appendChild(script);
}
window.onload = loadScript;

// Initializing the map and setting markers
function initialize() {
	var mapOpts = {
		zoom: 14,
		center: new google.maps.LatLng(38.5449274, -121.7500067),
		mapTypeControl: false,
		disableDefaultUI: true
	};
	if($(window).width() <= 1080) {
		mapOpts.zoom = 13;
	}
	if ($(window).width() < 850 || $(window).height() < 595) {
		toggleNav();
	}

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOpts);

	setMarkers(markers);

	setAllMap();

	// Reset map on click handler and
	// when window resize conditionals are met
	function resetMap() {
		var windowWidth = $(window).width();
		if(windowWidth <= 1080) {
			map.setZoom(13);
			map.setCenter(mapOpts.center);
		} else if(windowWidth > 1080) {
			map.setZoom(14);
			map.setCenter(mapOpts.center);
		}
	}
	$("#reset").click(function() {
		resetMap();
	});
   $(window).resize(function() {
		resetMap();
	});
}

//Determines if markers should be visible
//This function is passed in the knockout viewModel function
function setAllMap() {
  for (var i = 0; i < markers.length; i++) {
	if(markers[i].bool === true) {
	markers[i].holdMarker.setMap(map);
	} else {
	markers[i].holdMarker.setMap(null);
	}
  }
}

//Information about the different locations
//Provides information for the markers
var markers = [
	{
	title: "Froggy's Grill",
	lat: 38.543407,
	lng: -121.7389779,
	streetAddress: "726 2nd St",
	cityAddress: "Davis, CA 95616",
	url: "www.tommyjs.com",
	id: "nav0",
	visible: ko.observable(true),
	bool: true
	},
	{
	title: 'Davis Food Co-op',
	lat: 38.5495216,
	lng: -121.7398211,
	streetAddress: "620 G St",
	cityAddress: "Davis, CA 95616",
	url: "www.ncg.coop/partners-find/ca/davis-food-co-op",
	id: "nav1",
	visible: ko.observable(true),
	bool: true
	},
	{title: 'Temple Coffee Roasters',
	lat: 38.5445225,
	lng: -121.7395607,
	streetAddress: "239 G St",
	cityAddress: "Davis, CA 95616",
	url: "www.templecoffee.com",
	id: "nav2",
	visible: ko.observable(true),
	bool: true
	},
	{title: 'Zumapoke & Lush Ice',
	lat: 38.5446983,
	lng: -121.7396693,
	streetAddress: "730 3rd St",
	cityAddress: "Davis, CA 95616",
	url: "www.zumapoke.com",
	id: "nav3",
	visible: ko.observable(true),
	bool: true
	},
	{title: 'UC Davis',
	lat: 38.5292559,
	lng: -121.7626134,
	streetAddress: "1 Shields Ave",
	cityAddress: "Davis, CA 95616",
	url: "www.ucdavis.edu",
	id: "nav4",
	visible: ko.observable(true),
	bool: true
	},
	{title: 'Dumpling House & London Fish\'n Chips',
	lat: 38.5426593,
	lng: -121.7410902,
	streetAddress: "129 E St",
	cityAddress: "Davis, CA 95616",
	url: "www.yelp.com/biz/dumpling-house-davis",
	id: "nav5",
	visible: ko.observable(true),
	bool: true
	},
	{title: 'Taqueria Davis',
	lat: 38.5487667,
	lng: -121.7349302,
	streetAddress: "505 L St",
	cityAddress: "Davis, CA 95616",
	url: "www.taqueriadavis.com/",
	id: "nav6",
	visible: ko.observable(true),
	bool: true
	},
	{title: 'Community Park',
	lat:38.5586029,
	lng: -121.7477632,
	streetAddress: "1405 F St",
	cityAddress: "Davis, CA 95616",
	url: "localwiki.org/davis/Community_Park",
	id: "nav7",
	visible: ko.observable(true),
	bool: true
	}
];

//Get Google Street View Image for each inidividual marker
	//Passed lat and lng to get each image location
var headingImageView = [5, 235, 55, 170, 190, 240, -10, 10, 190];
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

function determineImage() {
	if (i === 3) {
		streetViewImage = streetViewUrl + '38.892052,-77.008888&fov=75&heading=' + headingImageView[i] + '&pitch=10';
	} else if (i === 4) {
		streetViewImage = streetViewUrl +
						markers[i].streetAddress + ',' + markers[i].cityAddress +
						'&fov=75&heading=' + headingImageView[i] + '&pitch=10';
	} else {
	   streetViewImage = streetViewUrl +
						markers[i].lat + ',' + markers[i].lng +
						'&fov=75&heading=' + headingImageView[i] + '&pitch=10';
					}
}

//Sets the markers on the map within the initialize function
	//Sets the infoWindows to each individual marker
	//The markers are inidividually set using a for loop
function setMarkers(location) {

	for(i=0; i<location.length; i++) {
		location[i].holdMarker = new google.maps.Marker({
		  position: new google.maps.LatLng(location[i].lat, location[i].lng),
		  map: map,
		  title: location[i].title,
		  icon: {
			url: 'img/map-marker-tiny2.png',
			size: new google.maps.Size(30, 30),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(12.5, 40)
			},
		  shape: {
			coords: [1,25,-40,-25,1],
			type: 'poly'
		  }
		});

		//function to place google street view images within info windows
		determineImage();

		//Binds infoWindow content to each marker
		location[i].contentString = '<img src="' + streetViewImage +
									'" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' +
									location[i].title + '</strong><br><p>' +
									location[i].streetAddress + '<br>' +
									location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url +
									'" target="_blank">' + location[i].url + '</a>';

		var infowindow = new google.maps.InfoWindow({
			content: markers[i].contentString
		});

		//Click marker to view infoWindow
		//zoom in and center location on click
		new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
		  return function() {
			infowindow.setContent(location[i].contentString);
			infowindow.open(map,this);
			map.setCenter(marker.getPosition());
			location[i].picbool = true;
		  };
		})(location[i].holdMarker, i));

		//Click nav element to view infoWindow
		//zoom in and center location on click
		var searchNav = $('#nav' + i);
		searchNav.click((function(marker, i) {
		  return function() {
			infowindow.setContent(location[i].contentString);
			infowindow.open(map,marker);
			map.setZoom(15);
			map.setCenter(marker.getPosition());
			location[i].picbool = true;
		  };
		})(location[i].holdMarker, i));
	}
}

//Search through different locations in nav bar with knockout.js
	//only display markers and nav elements that match query result
var viewModel = {
	query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
	var self = this;
	var search = self.query().toLowerCase();
	return ko.utils.arrayFilter(markers, function(marker) {
	if (marker.title.toLowerCase().indexOf(search) >= 0) {
			marker.bool = true;
			return marker.visible(true);
		} else {
			marker.bool = false;
			setAllMap();
			return marker.visible(false);
		}
	});
}, viewModel);

ko.applyBindings(viewModel);

//Toggle Nav on the left side on click
// "toggleNav" Bound to the blue-arrow button
var navVisible = true;
function noNav() {
	$("#search-nav").animate({
				height: 0,
			}, 500);
			$("#blue-arrow").attr("src", "img/blue-down-arrow.png");
			navVisible = false;
}
function yesNav() {
	$("#search-nav").show();
			var scrollerHeight = $("#scroller").height() + 55;
			if($(window).height() < 600) {
				$("#search-nav").animate({
					height: scrollerHeight - 100,
				}, 500, function() {
					$(this).css('height','auto').css("max-height", 439);
				});
			} else {
			$("#search-nav").animate({
				height: scrollerHeight,
			}, 500, function() {
				$(this).css('height','auto').css("max-height", 549);
			});
			}
			$("#blue-arrow").attr("src", "img/blue-up-arrow.png");
			navVisible = true;
}


function toggleNav() {
	if(navVisible === true) {
			noNav();

	} else {
			yesNav();
	}
}
$("#blue-arrow").click(toggleNav);

//Expand .forecast div on click to see Weather Underground forecast
//and shrink back when additionally clicked
	//size is repsonsive to smaller screens
var weatherContainer = $("#weather-image-container");
var isWeatherVisible = false;
weatherContainer.click(function() {
	if(isWeatherVisible === false) {
		if($(window).width() < 670) {
			$(".forecast li").css("display", "block");
			weatherContainer.animate({
				width: "245"
			}, 500);
		} else {
			$(".forecast li").css("display", "inline-block");
			weatherContainer.animate({
				width: "380"
			}, 500);
		}
		isWeatherVisible = true;
	} else {
		weatherContainer.animate({
		width: "80"
	}, 500);
		isWeatherVisible = false;
	}
});

//GET Weather Underground JSON
var weatherUgUrl = "http://api.wunderground.com/api/8b2bf4a9a6f86794/conditions/q/CA/Davis.json";

$.getJSON(weatherUgUrl, function(data) {
	var list = $(".forecast ul");
	detail = data.current_observation;
	list.append('<li>Temp: ' + detail.temp_f + '° F</li>');
	list.append('<li><img style="width: 25px" src="' + detail.icon_url + '">  ' + detail.icon + '</li>');
}).error(function(e){
		$(".forecast").append('<p style="text-align: center;">Sorry Weather Could Not Be Loaded</p>');
	});

// toggle Weather forecast div
// toggleWeather bound to toggle-weather
var isWeatherImageVisible = true;
var hideWeatherArrow = $("#hide-weather").find("img");
function hideWeather() {
	if(isWeatherImageVisible === true) {
			$("#weather-image-container").animate({
				height: 0,
				paddingTop: 0
			}, 300);
		isWeatherImageVisible = false;
		hideWeatherArrow.attr("src", "img/small-down-arrow.png");
	} else {
			$("#weather-image-container").animate({
				height: 60,
				paddingTop: 5
			}, 300);
		isWeatherImageVisible = true;
		hideWeatherArrow.attr("src", "img/small-up-arrow.png");
	}
}

$("#hide-weather").click(hideWeather);
