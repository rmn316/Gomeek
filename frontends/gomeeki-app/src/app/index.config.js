export function config($logProvider, uiGmapGoogleMapApiProvider) {
    'ngInject';
    // Enable log
    $logProvider.debugEnabled(true);
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBk7Jw6J4cG7enBj3fq2T8dYx3_rwd0cV4',
        v: 3.24,
        libraries: 'weather,geometry,visualization'
    });

}
