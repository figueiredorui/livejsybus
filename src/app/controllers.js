
app.controller('MapCtrl', function ($scope, $ionicLoading, $ionicPopup, $ionicModal, $window, busData) {
    "use strict";

    var busMarkers = [];
    var infowindow = new google.maps.InfoWindow();
    var myLocationMarker = null;

    $scope.mapCreated = function (map) {

        $scope.map = map;
        centerMyLocation();
        showMyLocation();
        showLiveBus();
    };

    $scope.statusMessage = '';
    $scope.autoCenter = true;

    $scope.centerOnMe = centerMyLocation;
    $scope.showAbout = showAbout;

    setInterval(showLiveBus, 15000);

    function showLiveBus() {

        var busMarkers_old = busMarkers;
        busMarkers = [];

        busData.busLatest().success(function (result) {

            result.forEach(function (_bus) {
                // Filter out stupid double array
                _bus = _bus[0];

                var direction = '';
                if (_bus.MonitoredVehicleJourney.DirectionRef == 'inbound')
                    direction = 'Going to Town'
                else
                    direction = 'Leaving Town'

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(_bus.loc.coordinates[1], _bus.loc.coordinates[0]),
                    map: $scope.map,
                    title: 'Route ' + _bus.MonitoredVehicleJourney.PublishedLineName,
                    icon: 'img/bus_icon.png',
                    //url: '#/tab/timetable/' + _bus.MonitoredVehicleJourney.PublishedLineName + '/' + _bus.MonitoredVehicleJourney.DirectionRef
                });

                busMarkers.push(marker);

                google.maps.event.addListener(marker, 'click', (function (marker) {
                    return function () {
                        infowindow.setContent('<p>' + marker.title + '</p><p>' + direction + '</p>');
                        infowindow.open($scope.map, marker);
                    }
                })(marker));

            });

            busMarkers_old.forEach(function (_marker) {
                _marker.setMap(null);
            });

            $scope.statusMessage = '';
        }).error(function (result) {
            $scope.statusMessage = 'Unable to get bus data';
        });
    }

    function showMyLocation() {

        if (!$scope.map) {
            return;
        }

        navigator.geolocation.watchPosition(function (pos) {

            if ($scope.autoCenter)
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

            if (myLocationMarker != null)
                myLocationMarker.setMap(null);

            myLocationMarker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: $scope.map,
                title: 'You are here ',
            });

            google.maps.event.addListener(myLocationMarker, 'click', (function (myLocationMarker) {
                return function () {
                    infowindow.setContent('<p>You are here</p>');
                    infowindow.open($scope.map, myLocationMarker);
                }
            })(myLocationMarker));

            $scope.statusMessage = '';

        }, function (error) {
            $scope.statusMessage = 'Unable to get location';
        }, { enableHighAccuracy: true, timeout: 30000 });

    };

    function centerMyLocation() {

        if (!$scope.map) {
            return;
        }

        navigator.geolocation.getCurrentPosition(function (pos) {

            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

            $scope.statusMessage = '';

        }, function (error) {
            // alert('Unable to get location: ' + error.message);
            $scope.statusMessage = 'Unable to get location';
        }, { enableHighAccuracy: true, timeout: 30000 });

    };

    function showAbout() {
        // An alert dialog
        var alertPopup = $ionicPopup.alert({
            title: 'github.com/figueiredorui/livejsybus',
            template: 'github.com/figueiredorui/livejsybus'
        });
        alertPopup.then(function (res) {
        });
    }
})

