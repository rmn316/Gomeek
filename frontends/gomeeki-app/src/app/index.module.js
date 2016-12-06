/* global malarkey:false, moment:false */

import {config} from './index.config';
import {routerConfig} from './index.route';
import {runBlock} from './index.run';
import {MainController} from './main/controllers/main.controller';
import {GeoCodeServiceProvider} from './components/geocode/geocode.provider';
import {TweetServiceProvider} from './components/tweet/tweet.provider';

angular.module('frontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps'])
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant("googleAPI", 'AIzaSyBk7Jw6J4cG7enBj3fq2T8dYx3_rwd0cV4')
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .provider('GeoCodeService', GeoCodeServiceProvider)
    .provider('TweetService', TweetServiceProvider)
    .controller('MainController', MainController);