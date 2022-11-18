// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'demo-project',
    appId: '1:647963766032:web:59f670db5f758dc5964995',
    databaseURL:
      'https://kt-flashcard-default-rtdb.asia-southeast1.firebasedatabase.app',
    storageBucket: 'kt-flashcard.appspot.com',
    locationId: 'asia-east1',
    apiKey: 'AIzaSyD_zqJMtBbTrHQmOO3AeTjSvVlk3TB7Zhc',
    authDomain: 'kt-flashcard.firebaseapp.com',
    messagingSenderId: '647963766032',
  },
  production: false,
  useEmulators: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
