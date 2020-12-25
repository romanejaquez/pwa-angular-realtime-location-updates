# YouPS - Real-Time Location Updates using Firebase Cloud Firestore
### by Roman Just Codes (RJC)

This project is part of a series of projects in which I'll be developing an Angular PWA app for a fictional package delivering company called "YouPS". In this installment, I'll be adding the feature of real-time location updates between users leveraging the power of Firebase Cloud Firestore.

###Before proceeding...###

**NOTE**: YOU MUST HAVE THE GOOGLE PLACES API AND THE DIRECTIONS API ENABLED AS WELL AS A GOOGLE MAPS API KEY FOR THIS TO WORK! More info [here](https://cloud.google.com/maps-platform/routes/?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_289050149247-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+~+Google+Maps+Routes+API-KWID_43700038883964686-aud-581578347266:kwd-569137409002-userloc_9001895&utm_term=KW_google%20routes%20api-ST_google+routes+api&gclid=Cj0KCQjwk8b7BRCaARIsAARRTL5UrZgouD8GIumbNRbHSMrxUVO5nvEiZMh62UmY0jn0kvkVuuffwdcaApVaEALw_wcB).

**ON FIREBASE CONFIGURATION**: Make sure to edit the ***firebaseConfig*** configuration object in the environment files of the project, after you create your Firebase project and configure your web app.

**ON FIREBASE CLOUD FIRESTORE**: You can either create the data structure upfront or let the front end push the initial schema to Firebase Cloud Firestore.

The data structure requires the following:
-A collection called **location-updates**
-A document with a unique GUID (see **map-page.ts** and look for a member variable called ***locationUpdateDoc*** with value **'e7e70602-91bb-498c-b5cf-e74673e43f69'**;)
-Two users logged into the system using Firebase Authentication (see **map-page.ts** and replace **driverId** and **recipientId** to test between two users).

**ON FIREBASE CLOUD MESSAGING CONFIGURATION***: Use the same Firebase Configuration object and add it to the firebase-messaging-sw.js file provided.

Link to the original Firebase service worker file content provided by Google.
https://github.com/firebase/quickstart-js/blob/29248d166833e51f154a0ed04bb41bfcd309703e/messaging/firebase-messaging-sw.js#L15-L37

Documentation on the Firebase service worker file here
https://firebase.google.com/docs/cloud-messaging/js/receive


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.0-next.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
