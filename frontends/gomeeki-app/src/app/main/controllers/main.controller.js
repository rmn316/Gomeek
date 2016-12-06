export class MainController {
    constructor(GeoCodeService, TweetService, $scope, $log) {
        "ngInject";
        this.geoCode = GeoCodeService;
        this.tweet = TweetService;
        this.log = $log;
        this.scope = $scope;
        this.data = {};
        this.previousSearch = [];
        this._buildCurrent('Bangkok', 0, 0);

        this.scope.map = {};
        this.scope.markers = {};
        this.scope.markersEvents = {
            click: function(marker, eventName, model) {
                this.scope.map.window.model = model;
                this.scope.map.window.model = model;
                this.scope.map.window.title = model.title;
                this.scope.map.window.show = true;
            }.bind(this)
        };
        this.scope.window = {
            marker: {},
            show: false,
            closeClick: function() {
                this.show = false;
            },
            options: {}, // define when map is ready
            title: ''
        };
        this.scope.closeClick = function () {
            this.window = false;
        };

        this.geoCode.getCoords(this.current.city).then(function(data) {
            this.scope.map = data.map;
            this.tweet.getTweets(this.current.city, data.map.center.latitude, data.map.center.longitude).then(function (response) {
                this.scope.markers = response;
                this._buildCurrent(this.current.city, data.map.center.latitude, data.map.center.longitude);
            }.bind(this));
        }.bind(this));
    }

    search() {
        // check if previous as saves calling api again.
        let previous = this.previousSearch.filter(function (element) {
            return element.city.toLowerCase() === this.data.search.toLowerCase();
        }.bind(this))[0];

        if (angular.isDefined(previous)) {
            this.tweet.getTweets(previous.city, previous.latitude, previous.longitude).then(function (response) {
                // remove from the previousSearch list. as now active search.
                this.previousSearch = this.previousSearch.filter(function (item) {
                    return item.city.toLowerCase() !== previous.city.toLowerCase();
                });

                this.scope.previous = this.previousSearch;
                this.current = previous;
                this.scope.map.center = {
                    latitude: previous.latitude,
                    longitude: previous.longitude
                };
                this.scope.markers = response;
            }.bind(this));
        } else {
            this.geoCode.getCoords(this.data.search).then(function(data) {
                this.scope.map = data.map;
                this.tweet.getTweets(this.data.search, data.map.center.latitude, data.map.center.longitude).then(function (response) {
                    this.previousSearch.push(this.current);
                    this._buildCurrent(this.data.search, data.map.center.latitude, data.map.center.longitude);
                    this.data.search = null;
                    this.scope.markers = response;
                    this.scope.previous = this.previousSearch;
                }.bind(this));
            }.bind(this));
        }
    }

    history(previousCity) {
        // add current city to previous
        this.previousSearch.push(this.current);

        let cityObject = this.previousSearch.filter(function (elem) {
            return elem.city.toLowerCase() === previousCity.toLowerCase();
        })[0];

        // remove previous from list
        this.previousSearch = this.previousSearch.filter(function (elem) {
            return elem.city.toLowerCase() !== previousCity.toLowerCase();
        });

        this.tweet.getTweets(previousCity, cityObject.latitude, cityObject.longitude).then(function (response) {
            this.current = cityObject;
            this.scope.map.center = {
                latitude: cityObject.latitude,
                longitude: cityObject.longitude
            };
            this.scope.markers = response;
            this.scope.previous = this.previousSearch;
        }.bind(this));
    }

    _buildCurrent(city, lat, lng) {
        this.current = {
            city: city,
            latitude: lat,
            longitude: lng
        };
    }
}
