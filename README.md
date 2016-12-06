# Gomeeki
## Introduction
Users search for a city and display and tweets menitioning the search city name on a map. 
- Search GoogleMapsAPI to find the "latitude/longitude" coordinates for a given city/address.
- Search TwitterAPI for any mentions of the searched city/address with a 50km radius of the coordinates provided by google maps.
- Update a GoogleMap to display any tweets on the maps based on the location the twitter user was at when creating the tweet. (subject to geo-location information being available)

## To get started
This project is in two parts the front-end angular application and a backend symfony app. See steps get the project up and running.

## Install dependencies
```
$ cd frontends/rocket-app
$ npm install
$ bower install
$ gulp build
$ cd ../api
$ composer install
```
### Launch Docker container

Ensure you are in the project root
```
$ docker-compose up --build
```
All mysql database tables and permissions should be created a part of the docker-compose command

## Setting up the hosts
ensure you add a reference to vhost in your hosts file.
```
$ vi /etc/hosts
$ 127.0.0.1 gomeeki.dev
```
By default the site is browsable on the url "http://gomeeki.dev:8080"
