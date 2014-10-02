

app.service('busData', function ($http) {
    "use strict";

    this.busLatest = function() {

        return $http.get('https://bus.data.je/latest?user=hackathondemo&pass=hackathondemo');
    };

});
