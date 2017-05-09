import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { IBeacon } from 'ionic-native';
import 'rxjs/add/operator/toPromise';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

/*
  Generated class for the BeaconProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BeaconProvider {

  beacons = [{ identifier: 'lemon', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 38948, minor: 18761, distance: -9999, lastupdatetime: Date.now(), status: "Out of range", region: '1' },
  { identifier: 'candy', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 14365, minor: 29583, distance: -9999, lastupdatetime: Date.now(), status: "Out of range", region: '2' },
  { identifier: 'beetroot', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 27065, minor: 2371, distance: -9999, lastupdatetime: Date.now(), status: "Out of range", region: '3' },
  { identifier: 'ice', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 16381, minor: 53866, distance: -9999, lastupdatetime: Date.now(), status: "Out of range", region: '4' },
  { identifier: 'mint', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 60141, minor: 18428, distance: -9999, lastupdatetime: Date.now(), status: "Out of range", region: '5' },
  { identifier: 'blueberry', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 2290, minor: 9216, distance: -9999, lastupdatetime: Date.now(), status: "Out of range", region: '6' }
  ];
  beaconRegions: any = [];

  delegate: any;
  region: any;

  constructor(public platform: Platform, public events: Events) {
  }
  // getToken() {
  //   let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'username':'test', 'password': 'test123' });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.post('http://ec2-54-255-242-122.ap-southeast-1.compute.amazonaws.com/api/token' , options).toPromise();
  // }
  getAllBeacons() {
    // let headers = new Headers();
    // let options = new RequestOptions({ headers: headers });
    // return this.authHttp.get('http://ec2-54-255-242-122.ap-southeast-1.compute.amazonaws.com/mapi/api/mobilebeacons').toPromise();
  }

  initialise(): any {
    let promise = new Promise((resolve, reject) => {
      // we need to be running on a device 
      if (this.platform.is('cordova')) {

        // Request permission to use location on iOS
        IBeacon.requestAlwaysAuthorization();

        // create a new delegate and register it with the native layer
        this.delegate = IBeacon.Delegate();

        // Subscribe to some of the delegate's event handlers
        this.delegate.didRangeBeaconsInRegion()
          .subscribe(
          data => {
            this.events.publish('didRangeBeaconsInRegion', data);
          },
          error => console.error()
          );

        // this.delegate.didEnterRegion().subscribe(
        //   data => {
        //     this.events.publish('didEnterRegion', data);
        //   },
        //   error => console.error()
        // );

        // setup a beacon region
        for (let i = 0; i < this.beacons.length; i++) {

          // this.region = IBeacon.BeaconRegion('deskBeacon', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D');
          this.region = IBeacon.BeaconRegion('region: ' + i, this.beacons[i].uuid, this.beacons[i].major, this.beacons[i].minor);
          IBeacon.startRangingBeaconsInRegion(this.region).then(() => {
            console.log('ranged region ' + i);
            resolve(true);
          },
            error => {
              console.log('Failed to begin monitoring: ', error);
              resolve(false);
            })


        }

        // start ranging
        // IBeacon.startRangingBeaconsInRegion(this.region)
        //   .then(
        //   () => {
        //     resolve(true);
        //   },
        //   error => {
        //     console.error('Failed to begin monitoring: ', error);
        //     resolve(false);
        //   }
        //   );


      } else {
        console.error("This application needs to be running on a device");
        resolve(false);
      }
    });

    return promise;
  }


}
