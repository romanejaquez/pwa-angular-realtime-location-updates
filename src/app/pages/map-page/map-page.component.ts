import { Component, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'firebase';
import {} from 'googlemaps';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapPageComponent implements OnInit, OnDestroy {
  
  locationUpdateDoc = 'e7e70602-91bb-498c-b5cf-e74673e43f69';
  locationUpdatesCollection = 'location-updates';
  driverId = 'NkR3Ki4SHNaIMH9FaBsWGC1EqM23';
  recipientId = 'wCK4OOFX0JNVyVUUJxLwM1HURu23';

  authUser: User;
  authUserSub: Subscription;
  
  showMapPill: boolean;
  mapLoaded: boolean;
  map: google.maps.Map;
  center: google.maps.LatLngLiteral;

  time: string = '';
  distance: string = '';

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;

  sourcePin: google.maps.Marker;
  destinationPin: google.maps.Marker;
  sourcePoint: google.maps.Marker;
  
  locationWatchId: number;
  locSimulationInterval: any;
  destinationSet: boolean;
  latLngs: any[];
  locationUpdateObj: any;

  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    zoom: 12
  }

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;

  placesText: string;
  togglePlacesSearch: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private loginService: LoginService,
    private ngZone: NgZone) {}

  ngOnInit() {

    this.authUserSub = this.loginService.getLoggedInUser().subscribe((user: User) => {
      this.authUser = user;
    });

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true
    });

    // get initial current position
    navigator.geolocation.getCurrentPosition(position => {

      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.destination = this.center;

      if (this.authUser.uid === this.recipientId) {
        this.firestore
        .collection(this.locationUpdatesCollection)
        .doc(this.locationUpdateDoc)
        .set({
          destination: {
            location: {
              lat: this.destination.lat,
              lng: this.destination.lng
            },
            uid: this.authUser.uid
          }
        }, { merge: true });
      }

      // initialize the map container
      this.map = new google.maps.Map(document.getElementById('map-canvas'), {
        ...this.options,
        center: this.destination
      });

      this.map.addListener('tilesloaded', () => {
        this.ngZone.run(() => {
          this.mapLoaded = true;
        });
      });

      this.destinationPin = new google.maps.Marker({
        position: this.destination,
        icon: {
          url: './assets/imgs/destination_custom_pin.svg',
          anchor: new google.maps.Point(37,45),
          origin: new google.maps.Point(0,0),
          scaledSize: new google.maps.Size(70, 70)
        },
        map: this.map
      });

      this.map.addListener("click", (event: any) => {
        this.showMapPill = false;
      });
    });

    // watch position as it changes
    this.locationWatchId = navigator.geolocation.watchPosition(
      (position) => {
  
        // if it's the driver user that's logged in,
        // then update its location as he / she moves
        if (this.authUser.uid === this.driverId) {
          this.source = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
  
          if (this.sourcePin) {
            this.sourcePin.setPosition(this.source);
          }
          
          this.firestore
          .collection(this.locationUpdatesCollection)
          .doc(this.locationUpdateDoc)
          .set({
            source: {
              location: {
                lat: this.source.lat,
                lng: this.source.lng
              },
              uid: this.authUser.uid
            }
          }, { merge: true });
        }
      },
      (error) => {
        // handle error of watch position
    });

    // listen for updates on the locationUpdateDoc
    this.firestore.collection(this.locationUpdatesCollection)
    .doc(this.locationUpdateDoc).
    ref.onSnapshot(snapshot => {
      let updatedSourceLocation = snapshot.data();

      // if this is the package receiver user...
      if (updatedSourceLocation.destination &&
        updatedSourceLocation.destination.uid === this.authUser.uid) {
        
        this.dr.setOptions({
          suppressPolylines: false,
          map: this.map
        });

        // set the route information once initially
        if (this.dr && updatedSourceLocation.route && !this.destinationSet) {
          let response = JSON.parse(updatedSourceLocation.route);
          this.dr.setDirections(response);

          this.ngZone.run(() => {
            let distanceInfo = response.routes[0].legs[0];
            this.distance = distanceInfo.distance.text;
            this.time = distanceInfo.duration.text;
          });

          // set the starting point as a marker
          this.sourcePoint = new google.maps.Marker({
            position: response.request.origin.location,
            icon: {
              url: './assets/imgs/youps_source.svg',
              anchor: new google.maps.Point(37,45),
              origin: new google.maps.Point(0,0),
              scaledSize: new google.maps.Size(70, 70)
            },
            map: this.map
          });

          this.destinationSet = !this.destinationSet;
        }

        // check that the updated source info (the youps driver location)
        // then update the source pin on the receiving user side
        if (updatedSourceLocation.source) {
          this.source = {
            lat: updatedSourceLocation.source.location.lat,
            lng: updatedSourceLocation.source.location.lng
          };
    
          this.setupSourcePin();
        }
      }
    });
  }


  setupSourcePin() {
    if (!this.sourcePin) {
      // adding a marker
      this.sourcePin = new google.maps.Marker({
        position: this.source,
        icon: {
          url: './assets/imgs/truck_pin.svg',
          anchor: new google.maps.Point(37,45),
          origin: new google.maps.Point(0,0),
          scaledSize: new google.maps.Size(70, 70)
        },
        animation: google.maps.Animation.DROP,
        map: this.map
      });

      this.sourcePin.addListener("click", (event: any) => {
        this.showMapPill = true;
        //this.onCenterMap();
      });
    }
    else {
      this.sourcePin.setPosition(this.source);
    }
  }

  setRoutePolyline() {
    let request = {
      origin: this.source,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.ds.route(request, (response: any, status: any) => {
      this.dr.setOptions({
        suppressPolylines: false,
        map: this.map
      });

      if (status == google.maps.DirectionsStatus.OK) {
        this.dr.setDirections(response);

        if (this.authUser.uid === this.driverId) {
          
          this.latLngs = [];
          let step: any = response.routes[0].legs[0].steps[0];
          step.lat_lngs.forEach((stepPoint) => {
            this.latLngs.push({
              lat: stepPoint.lat(),
              lng: stepPoint.lng()
            });
          });

          this.firestore
            .collection(this.locationUpdatesCollection)
            .doc(this.locationUpdateDoc)
            .set({
              route: JSON.stringify(response),
              source: {
                location: {
                  lat: this.source.lat,
                  lng: this.source.lng
                },
                uid: this.authUser.uid
              }
            }, { merge: true });

            let count = 0;
            this.locSimulationInterval = setInterval(() => {
              if (count < this.latLngs.length) {
                let currentPos = this.latLngs[count];

                this.firestore
                .collection(this.locationUpdatesCollection)
                .doc(this.locationUpdateDoc)
                .set({
                  source: {
                    location: {
                      lat: currentPos.lat,
                      lng: currentPos.lng
                    },
                    uid: this.authUser.uid
                  }
                }, { merge: true });
                count++;

                this.source = currentPos;
                this.setupSourcePin();
              }
            }, 1000);            
        }

        this.ngZone.run(() => {
          let distanceInfo = response.routes[0].legs[0];
          this.distance = distanceInfo.distance.text;
          this.time = distanceInfo.duration.text;
        });
      }
    })
  }

  handleAddressChange(event: any) {
    const lat = event.geometry.location.lat();
    const lng = event.geometry.location.lng();

    this.source = {
      lat: lat,
      lng: lng
    };

    this.sourcePoint = new google.maps.Marker({
      position: this.source,
      icon: {
        url: './assets/imgs/youps_source.svg',
        anchor: new google.maps.Point(37,45),
        origin: new google.maps.Point(0,0),
        scaledSize: new google.maps.Size(70, 70)
      },
      map: this.map
    });

    this.setupSourcePin();
    this.setRoutePolyline();
  }

  onCenterMap() {
    this.map.panTo(this.source);
  }

  onLogout() {
    this.loginService.logout();
  }

  clearPlacesField() {
    this.placesText = "";
  }

  toggleSearch() {
    this.togglePlacesSearch = !this.togglePlacesSearch;
  }

  ngOnDestroy() {
    navigator.geolocation.clearWatch(this.locationWatchId);
    clearInterval(this.locSimulationInterval);
  }
}
