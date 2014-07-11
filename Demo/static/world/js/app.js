/**
 * @author maowei
 */
var map;
function initialize() {
	var markers = [];
	var infoWindow, geocoder;
	var mapOptions = {
		//zoom : 8,
		//center : new google.maps.LatLng(-34.397, 150.644),
		disableDefaultUI : false
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-38.0, 141.9), new google.maps.LatLng(-35.0, 151.5));
	map.fitBounds(defaultBounds);

//	var input = document.getElementById('search_input');
//
//	var searchBox = new google.maps.places.SearchBox((input));
//
//	google.maps.event.addListener(searchBox, 'places_changed', function() {
//		var places = searchBox.getPlaces();
//
//		for (var i = 0, marker; marker = markers[i]; i++) {
//			marker.setMap(null);
//		}
//
//		// For each place, get the icon, place name, and location.
//		markers = [];
//		var bounds = new google.maps.LatLngBounds();
//		for (var i = 0, place; place = places[i]; i++) {
//			var image = {
//				url : place.icon,
//				size : new google.maps.Size(71, 71),
//				origin : new google.maps.Point(0, 0),
//				anchor : new google.maps.Point(17, 34),
//				scaledSize : new google.maps.Size(25, 25)
//			};
//
//			// Create a marker for each place.
//			var marker = new google.maps.Marker({
//				map : map,
//				icon : image,
//				title : place.name,
//				position : place.geometry.location
//			});
//
//			markers.push(marker);
//
//			bounds.extend(place.geometry.location);
//		}
//
//		map.fitBounds(bounds);
//	});
//
//	google.maps.event.addListener(map, 'bounds_changed', function() {
//		var bounds = map.getBounds();
//		searchBox.setBounds(bounds);
//	});
	
	function queryWKT(location){
		$.ajax({
			dataType: 'json',
			url: 'query?lat='+location.lat()+'&lng='+location.lng(),
			success: function(data, textStatus){
				alert(textStatus+'   '+data);
			}
		});
	}
	
	function clearOverlays(){
		if(infoWindow){
			infoWindow.close();
		}
	}
	
	function placeMarker(location){
		clearOverlays();
		if(!geocoder){
			geocoder = new google.maps.Geocoder();
		}
		geocoder.geocode({'location': location}, function(results, status){
			if(status == google.maps.GeocoderStatus.OK){
				console.log(results);
				queryWKT(results[0].geometry.location)
			}else{
				alert('geocode failed');
			}
		});
	}
	
	google.maps.event.addListener(map, 'click', function(event){
		placeMarker(event.latLng);
	});

}

google.maps.event.addDomListener(window, 'load', initialize);
