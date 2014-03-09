var map = {
    map: undefined,

    init: function() {
        var tracking = true;
        var lastPosition;

        function locationHandler(position) {
            console.log("LocationHandler with new position: " + position);
            lastPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            $("#speed").html((position.coords.speed || "0") + " m/s");
            $("#heading").html((position.coords.heading != undefined ?
                                position.coords.heading : "- ")
                               + "°");
            $("#accuracy").html((position.coords.accuracy != undefined ?
                                 position.coords.accuracy : "")
                                + " m");
            if (tracking) {
                map.panTo(lastPosition);
            }
        }

        function locationErrorHandler(positionError) {
            console.log("Fetching location failed: " + positionError.message);
        }

        function initMap() {
            map = L.map('map').setView([60.15, 24.97], 14);
            L.tileLayer.wms("http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta", {
                layers: 'cells',
                styles: 'style-id-203',
                format: 'image/png',
                transparent: true
            }).addTo(map);
        }

        function setupLocationTracking() {
            navigator.geolocation.getCurrentPosition(locationHandler,
                                                     locationErrorHandler);
            navigator.geolocation.watchPosition(locationHandler,
                                                locationErrorHandler,
                                                {
                                                    enableHighAccuracy: true,
                                                    maximumAge: 20000,
                                                });
        }

        function addTrackButtonHandler() {
            $('#tracking').attr('checked', tracking);

            $('#tracking').change(function() {
                tracking = $(this).is(":checked") ? true : false;
                if (tracking && lastPosition) {
                    map.panTo(lastPosition);
                }
            });
        }

        initMap();
        setupLocationTracking();
        addTrackButtonHandler();
    }
}
