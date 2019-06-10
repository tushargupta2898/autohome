		$(document).ready(function() {
            localStorage.setItem("ek_my_lat", "");
            localStorage.setItem("ek_my_long", "");
            $('#ek_modal_title1').html("Finding Your Location !")
            $('#myPleaseWait').modal('show');


            function list_gurudwaras(){
                    var request1 = {
						    location: new google.maps.LatLng(u_latitude, u_longitude),
						    radius: '500',
                            types: ['hospital']
						};
                    var request = {
                         location: new google.maps.LatLng(u_latitude, u_longitude),
                         radius: '500',
                         query: 'gurudwara'
                        };
                    var container = document.getElementById('map');
					var service = new google.maps.places.PlacesService(container);
                    service.textSearch(request, nearbyCallback);
					//service.nearbySearch(request, nearbyCallback);

            };





            function m2k(miles) {
				var mi = parseFloat(miles);
				var km = "";
				if (!isNaN(mi)) km = mi * 1.609344;
				
				return km;
			}
            var rad = function(x) {
				return x * Math.PI / 180;
			};
            var getDistance = function(lat_1, lng_1, lat_2, lng_2) {
				var R = 6378137; // Earth’s mean radius in meter
				var dLat = rad(lat_2 - lat_1);
				var dLong = rad(lng_2 - lng_1);
				var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(rad(lat_1)) * Math.cos(rad(lat_2)) *
				Math.sin(dLong / 2) * Math.sin(dLong / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				var d = R * c;
				return d; // returns the distance in meter
			};
			var u_longitude, u_latitude, max_distance, u_metric;


			var apiGeolocationSuccess = function(position) {
			    u_latitude = position.coords.latitude;
			    u_longitude = position.coords.longitude;

                localStorage.setItem("ek_my_lat", u_latitude);
                localStorage.setItem("ek_my_long", u_longitude);
                list_gurudwaras();
                $('#myPleaseWait').modal('hide');
			   
			   
			};

			var tryAPIGeolocation = function() {
			    jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBGoCEGRgwkxgYqz31_2Y565w4HasPZEQQ", function(success) {
		            apiGeolocationSuccess({
		                coords: {
		                    latitude: success.location.lat,
		                    longitude: success.location.lng
		                }
                        
		            });
		        })
		        .fail(function(err) {
			        //$(".geo_waiting .alert").removeClass("alert-info").addClass("alert-danger");
		            //$(".geo_waiting p").html("Seems like it's taking some time to get your position... Please try again later.");
		        });
			};

			var browserGeolocationSuccess = function(position) {
			    u_latitude = position.coords.latitude;
			    u_longitude = position.coords.longitude;
                localStorage.setItem("ek_my_lat", u_latitude);
                localStorage.setItem("ek_my_long", u_longitude);
			    list_gurudwaras();
                $('#myPleaseWait').modal('hide');
                
			    
			};

			var browserGeolocationFail = function(error) {
			    switch (error.code) {
			        case error.TIMEOUT:
			            //$(".geo_waiting .alert").removeClass("alert-info").addClass("alert-danger");
			            //$(".geo_waiting p").html("Seems like it's taking some time to get your position... Please try again later.");
			            break;
			        case error.PERMISSION_DENIED:
			            if (error.message.indexOf("Only secure origins are allowed") == 0) {
			                tryAPIGeolocation();
			            }
			            break;
			        case error.POSITION_UNAVAILABLE:
			            //$(".geo_waiting .alert").removeClass("alert-info").addClass("alert-danger");
			            //$(".geo_waiting p").html("Seems like it's taking some time to get your position... Please try again later.");
			            break;
			    }
			};

			var tryGeolocation = function() {
			    if (navigator.geolocation) {
			        navigator.geolocation.getCurrentPosition(
			            browserGeolocationSuccess,
			            browserGeolocationFail, {
			                maximumAge: 50000,
			                timeout: 20000,
			                enableHighAccuracy: true
			            });
			    }
			};

			tryGeolocation();

            function nearbyCallback(results, status, pagination) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					//console.log(results); 
                    var s="";
                    var tLink='';
                    for (var i = 0; i < results.length; i++) {
						var place = results[i];
						//console.log(place.name); 
                        
                        var distance_in_kms = parseInt(getDistance(u_latitude, u_longitude, place.geometry.location.lat(), place.geometry.location.lng()))/1000;
                        
                        var tDist = Math.round(distance_in_kms * 100) / 100 ;
                        
                        tLink='<a href="#" class="list-group-item"><span class="badge">' + tDist + ' KM</span>'+ place.name + '</a>';

						s += tLink;
					}
                    console.log(s); 
                    $('#ek_list_places').html(s);
                   }
				};
        
        })
