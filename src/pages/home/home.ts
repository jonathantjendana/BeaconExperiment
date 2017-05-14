// core stuff
import { Component, ElementRef } from '@angular/core';
import { NavController, Platform, Events, AlertController } from 'ionic-angular';
import { NgZone, Renderer } from "@angular/core";

// plugins
import { IBeacon } from 'ionic-native';

// providers
import { BeaconProvider } from '../../providers/beacon-provider'

// models
import { BeaconModel } from '../../models/beacon-model';

import * as svgPanZoom from 'svg-pan-zoom';
import * as Hammer from 'hammerjs';


declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  beacons = [{ identifier: 'lemon', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 38948, minor: 18761, distance: 0 },
  { identifier: 'candy', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 14365, minor: 29583, distance: 0 },
  { identifier: 'beetroot', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 27065, minor: 2371, distance: 0 },
  { identifier: 'ice', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 16381, minor: 53866, distance: 0 },
  { identifier: 'mint', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 60141, minor: 18428, distance: 0 },
  { identifier: 'blueberry', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 2290, minor: 9216, distance: 0 }
  ];
  // beacons: any = [];
  beaconRegions: any = [];
  // regionList: any = ['lemon', 'candy', 'beetroot', 'ice', 'mint', 'blueberry'];
  regionList: any = ['T2036', 'T2035', 'T2034', 'T2033', 'T2032', 'T2031'];

  inRegions: any = [];

  beaconsDetected: any = [];
  nearestBeacon: any
  // beacons: BeaconModel[] = [];
  zone: any;
  lemon: any = {
    'animate': true
  }
  candy: any = {
    'animate': false
  }
  beetroot: any = {

    'animate': false
  }
  ice: any = {

    'animate': false
  }
  mint: any = {
    'animate': false
  }
  blueberry: any = {
    'animate': false
  }

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public beaconProvider: BeaconProvider,
    public events: Events,
    public elref: ElementRef,
    public alertCtrl: AlertController,
    private renderer: Renderer
  ) {
    // required for UI update
    this.zone = new NgZone({ enableLongStackTrace: false });

  }
  lemonBlink() {
    this.lemon.animate = true;
    this.candy.animate = false;
    this.beetroot.animate = false;
    this.ice.animate = false;
    this.mint.animate = false;
    this.blueberry.animate = false;
  }
  candyBlink() {
    this.lemon.animate = false;
    this.candy.animate = true;
    this.beetroot.animate = false;
    this.ice.animate = false;
    this.mint.animate = false;
    this.blueberry.animate = false;
  }
  beetrootBlink() {
    this.lemon.animate = false;
    this.candy.animate = false;
    this.beetroot.animate = true;
    this.ice.animate = false;
    this.mint.animate = false;
    this.blueberry.animate = false;
  }
  iceBlink() {
    this.lemon.animate = false;
    this.candy.animate = false;
    this.beetroot.animate = false;
    this.ice.animate = true;
    this.mint.animate = false;
    this.blueberry.animate = false;
  }
  mintBlink() {
    this.lemon.animate = false;
    this.candy.animate = false;
    this.beetroot.animate = false;
    this.ice.animate = false;
    this.mint.animate = true;
    this.blueberry.animate = false;
  }
  blueberryBlink() {
    this.lemon.animate = false;
    this.candy.animate = false;
    this.beetroot.animate = false;
    this.ice.animate = false;
    this.mint.animate = false;
    this.blueberry.animate = true;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // this.beaconProvider.getAllBeacons().then((beaconResult) => {
      // console.dir(beaconResult);
      // this.beacons = beaconResult.json();
      console.dir(this.beacons);

      let eventsHandler = {
        haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
        init: function (options) {
          var instance = options.instance, initialScale = 1, pannedX = 0, pannedY = 0;
          this.hammer = Hammer(options.svgElement, {
            inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
          })

          this.hammer.get('pinch').set({ enable: true });

          this.hammer.on('pinchstart pinchmove', function (ev) {
            // On pinch start remember initial zoom
            if (ev.type === 'pinchstart') {
              initialScale = instance.getZoom()
              instance.zoom(initialScale * ev.scale)
            }
            instance.zoom(initialScale * ev.scale)
          })

          this.hammer.on('panstart panmove', function (ev) {
            // On pan start reset panned variables
            if (ev.type === 'panstart') {
              pannedX = 0
              pannedY = 0
            }
            // Pan only the difference
            instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY })
            pannedX = ev.deltaX
            pannedY = ev.deltaY
          })
        },
        destroy: function () {
          this.hammer.destroy();
        }
      }
      var div = this.elref.nativeElement.querySelector('#svg-id');
      console.log(div);
      let panZoomInstance = svgPanZoom(div, {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: false,
        center: true,
        minZoom: 0.1,
        customEventsHandler: eventsHandler
      });
      // // panZoomInstance.zoomBy(2.5);
      // panZoomInstance.pan({x: 15, y: 120})
      // panZoomInstance.zoomBy(2.5);
      panZoomInstance.panBy({ x: 18, y: 220 });
      panZoomInstance.zoomBy(3);

      this.beaconProvider.initialise().then((isInitialised) => {
        if (isInitialised) {
          cordova.plugins.locationManager.enableBluetooth();

          this.listenToBeaconEvents();

        }
      });
    })

    // });
  }

  getBeaconInfo() {
    var T2036 = this.elref.nativeElement.querySelector('#T2036');
    // let oldClasses = T2036.getAttribute('class'); 
    this.renderer.setElementAttribute(T2036, "class", 'animate');
    console.log(T2036);
  }

  listenToBeaconEvents() {
    cordova.plugins.locationManager.enableBluetooth();

    for (var i = 0; i < this.beacons.length; i++) {
      this.beaconRegions.push(new cordova.plugins.locationManager.BeaconRegion(this.beacons[i].identifier, this.beacons[i].uuid, this.beacons[i].major, this.beacons[i].minor));
    } //end for

    var delegate = new cordova.plugins.locationManager.Delegate()

    cordova.plugins.locationManager.setDelegate(delegate);

    // required in iOS 8+
    cordova.plugins.locationManager.requestAlwaysAuthorization()

    for (var i = 0; i < this.beaconRegions.length; i++) {

      cordova.plugins.locationManager.startMonitoringForRegion(this.beaconRegions[i])
        .fail(function (e) { console.error(e); })
        .done();

      cordova.plugins.locationManager.startRangingBeaconsInRegion(this.beaconRegions[i])
        .fail(console.error)
        .done();
    }
    // function blink() {
    //   var div = this.elRef.nativeElement.querySelector('.blink');
    //   console.log(div);
    //   div.fadeOut(500).fadeIn(500, blink);
    // }
    // delegate.didEnterRegion = (data) => {
    // console.dir(data);
    // this.inRegions.push(data);
    // console.log('didEnterRegion:', JSON.stringify(data));
    // console.log('Welcome to ' + data.region.identifier);
    // console.log(data);
    // if (this.regionList.indexOf(data.region.identifier) >= 0) {
    //   console.log(data.region.identifier);

    //   this.inRegions.push(data.region.identifier);
    // }
    // console.dir(this.inRegions);
    // delegate.didRangeBeaconsInRegion = (data) => {
    //   console.log(data);
    // }

    // if (data.region.identifier == 'beetroot') {



    // switch (data.region.identifier) {
    //   case 'lemon':
    //     this.zone.run(() => this.lemonBlink());
    //     break;
    //   case 'candy':
    //     this.zone.run(() => this.candyBlink());
    //     break;
    //   case 'beetroot':
    //     this.zone.run(() => this.beetrootBlink());
    //     break;
    //   case 'ice':
    //     this.zone.run(() => this.iceBlink());
    //     break;
    //   case 'mint':
    //     this.zone.run(() => this.mintBlink());
    //     break;
    //   case 'blueberry':
    //     this.zone.run(() => this.blueberryBlink());
    //     break;
    //   default:
    //     this.zone.run(() => this.showAlert('You are not in the hilltop area'))
    // }

    // this.lemon.animate = false;
    // this.beetroot.animate = true;
    // this.ice.animate = false;
    // }
    // for (var i = 0; i < this.beacons.length; i++) {
    //   if (this.beaconIsFound(this.beacons[i], data.region)) {
    //     this.beacons[i].status = "In range"
    //     this._zone.run(() => this.items[i] = this.beacons[i]);
    //     console.log(this.beacons[i].identifier);
    //   }
    // }
    // }

    delegate.didRangeBeaconsInRegion = (data) => {
      let noOfBeacons = data.beacons.length;
      //got beacons detected
      if (noOfBeacons > 0) {
        for (var i = 0; i < this.beacons.length; i++) {
          if (this.beaconIsFound(this.beacons[i], data.beacons[0])) {
            this.beacons[i].distance = data.beacons[0].rssi;
            this.zone.run(() => this.beacons[i].distance = data.beacons[0].rssi);
          } //end if		  
        } //end for
        //assign the first detected beacons as the nearest beacon
        if (!this.nearestBeacon) {
          this.nearestBeacon = data.beacons[0];
          for (let b = 0; b < this.beacons.length; b++) {

            if (this.beaconIsFound(this.beacons[b], this.nearestBeacon)) {
              console.log('nearest beacon is ' + this.beacons[b].identifier);

              this.updateUI(this.beacons[b].identifier);
            }
          }
        }
        //loop through the detected beacon
        for (let i = 0; i < noOfBeacons; i++) {
          let beaconFound = data.beacons[i];
          this.beaconIsNew(beaconFound);
        }
        this.findNearestBeacon();
        // console.dir(this.nearestBeacon)
        // let beaconsDetectedLength = this.beaconsDetected.length;
        // if (beaconsDetectedLength > 0) {
        //   //set nearestBeacon RSSI to be compared
        //   let nearestRssi = parseInt(this.nearestBeacon.rssi);
        //   for (let d = 0; d < beaconsDetectedLength; d++) {
        //     let detectedBeacon = this.beaconsDetected[d];
        //     let detectRssi = parseInt(this.beaconsDetected[d].rssi);
        //     // console.dir(this.nearestBeacon);
        //     console.log('checking which is nearer');
        //     console.log('detect: ' + detectRssi+' nearest: ' + nearestRssi);
        //     if (detectRssi.toFixed() < nearestRssi.toFixed()) {
        //       // if (detectRssi.toFixed() != nearestRssi.toFixed()) {
        //       // console.log('same nearest');

        //       console.log('changing nearest');
        //       this.nearestBeacon = detectedBeacon;

        //       // console.log('change nearest beacon to ' + this.nearestBeacon);
        //       console.dir(detectedBeacon.major);
        //       console.dir(this.nearestBeacon.major);

        //       for (let b = 0; b < this.beacons.length; b++) {
        //         if (this.beaconIsFound(this.beacons[b], this.nearestBeacon)) {
        //           console.log(this.beacons[b].identifier);
        //           this.updateUI(this.beacons[b].identifier);
        //         }
        //       }
        //       // for (let b = 0; b < this.beacons.length; b++) {
        //       //   if (this.beaconIsFound(this.beacons[b], this.beaconsDetected[d])) {

        //       //     // console.dir(this.beacons[b]);
        //       //     this.nearestBeacon = this.beacons[b];
        //       //     // this.zone.run(() => this.beacons[i] = this.beacons[i]);
        //       //     // console.dir(this.beacons[b]);
        //       //     // console.log(this.nearestBeacon.identifier);


        //       //   } //end if
        //       // }
        //       // console.dir(this.nearestBeacon);


        //       // }             // console.log(detectRssi - nearestRssi);

        //     }
        //     // else {
        //     //   // console.dir(this.beaconsDetected);
        //     //   // console.dir(this.nearestBeacon);
        //     // }
        //   }
        // }

      }//end if data.beacons.length>0
      // console.dir(this.beaconsDetected);





      // if (this.nearestBeacon) {

      //   switch (this.nearestBeacon.identifier) {
      //     case 'lemon':
      //       this.zone.run(() => this.lemonBlink());
      //       break;
      //     case 'candy':
      //       this.zone.run(() => this.candyBlink());
      //       break;
      //     case 'beetroot':
      //       this.zone.run(() => this.beetrootBlink());
      //       break;
      //     case 'ice':
      //       this.zone.run(() => this.iceBlink());
      //       break;
      //     case 'mint':
      //       this.zone.run(() => this.mintBlink());
      //       break;
      //     case 'blueberry':
      //       this.zone.run(() => this.blueberryBlink());
      //       break;
      //     default:
      //       this.zone.run(() => this.showAlert('You are not in the hilltop area'))
      //   }

      // }


      // if (noOfBeacons > 0) {

      //   for (let i = 0; i < noOfBeacons; i++) {
      //     let beaconFound = data.beacons[i];
      //        for (let i = 0; i < this.beacons.length; i++) {
      //       if (this.beaconIsFound(this.beacons[i], beaconFound)) {
      //         this.beacons[i].distance = beaconFound.rssi;
      //         this.beacons[i].lastupdatetime = Date.now();
      //         // console.log(this.beacons[i]);
      //         console.log(this.beacons[i].identifier);
      //         let region = this.beacons[i].identifier;
      //       }

      //     }
      //   }
      // }
      // this.inRegions.push(data);
      // console.dir(this.inRegions);



      // if (data.beacons.length > 0) {
      //   for (var i = 0; i < this.beacons.length; i++) {
      //     if (this.beaconIsFound(this.beacons[i], data.beacons[0])) {
      //       this.beacons[i].distance = data.beacons[0].rssi;
      //       this.beacons[i].lastupdatetime = Date.now();
      //       this.zone.run(() => this.beacons[i] = this.beacons[i]);
      //     } //end if		  
      //   } //end for

      // }//end if data.beacons.length>0

    }




    // this.events.subscribe('didEnterRegion', (data) => {
    //   		console.log('didEnterRegion:', JSON.stringify(data));
    //   this.zone.run(() => {
    //     console.log(data);
    //     this.beacons = [];
    //     let beaconList = data.beacons;
    //     console.log(beaconList);
    //   })
    // })

    // this.events.subscribe('didRangeBeaconsInRegion', (data) => {

    //   // update the UI with the beacon list  
    //   this.zone.run(() => {
    //     console.log(data);
    //     this.beacons = [];

    //     let beaconList = data.beacons;
    //     beaconList.forEach((beacon) => {
    //       let beaconObject = new BeaconModel(beacon);
    //       this.beacons.push(beaconObject);
    //     });

    //   });

    // });
  }

  blink(id) {
    console.log(id);
    for (let i = 0; i < this.regionList.length; i++) {

      if (id == this.regionList[i]) {
        var target = this.elref.nativeElement.querySelector('#' + this.regionList[i]);
        // console.log(target);
        let oldClasses = target.getAttribute('class');
        if (!oldClasses) {
          console.log(oldClasses);
          this.renderer.setElementAttribute(target, "class", 'animate');
        }


      } else {
        var target = this.elref.nativeElement.querySelector('#' + this.regionList[i]);
        // let oldClasses = T2036.getAttribute('class'); 

        this.renderer.setElementAttribute(target, "class", '');
      }



    }
  }

  updateUI(nearBeaconIdentifier) {
    console.log(nearBeaconIdentifier);
    switch (nearBeaconIdentifier) {
      case 'lemon':
        this.zone.run(() => {
          this.blink(this.regionList[0]);

        });


        break;
      case 'candy':
        this.zone.run(() => {
          this.blink(this.regionList[1]);
        });
        break;
      case 'beetroot':
        this.zone.run(() => {
          this.blink(this.regionList[2]);
        });
        break;
      case 'ice':
        this.zone.run(() => {
          this.blink(this.regionList[3]);
        });
        break;
      case 'mint':
        this.zone.run(() => {
          this.blink(this.regionList[4]);
        });
        break;
      case 'blueberry':
        this.zone.run(() => {
          this.blink(this.regionList[5])
        });
        break;
      default:
        this.zone.run(() => this.showAlert('You are not in the hilltop area'))
    }
  }

  findNearestBeacon() {
    let nearest = this.beaconsDetected[0];
    for (let i = 0; i < this.beaconsDetected.length; i++) {
      if (parseInt(this.beaconsDetected[i].rssi).toFixed() < parseInt(nearest.rssi).toFixed()) {
        nearest = this.beaconsDetected[i];
      }
    }
    if (this.nearestBeacon != nearest) {
      this.nearestBeacon = nearest;
      for (let b = 0; b < this.beacons.length; b++) {
        if (this.beaconIsFound(this.beacons[b], this.nearestBeacon)) {
          console.log(this.beacons[b].identifier);
          this.beacons[b].distance = nearest.rssi;
          this.updateUI(this.beacons[b].identifier);

        }
      }
      // this.updateUI(this.nearestBeacon.identifier);
    }

    // return nearest;
  }
  beaconIsNew(beacon) {
    // console.log("Checking if beacon is new...");

    var beaconfound = 0;
    for (var i = 0; i < this.beaconsDetected.length; i++) {
      if (this.beaconsDetected[i].uuid == beacon.uuid &&
        this.beaconsDetected[i].major == beacon.major &&
        this.beaconsDetected[i].minor == beacon.minor) {
        this.beaconsDetected[i] = beacon;
        beaconfound++;

      }

    } //end for

    if (beaconfound <= 0) {
      // console.log("Beacon is new!");
      this.beaconsDetected.push(beacon);
      return true;
    }
    else {
      // console.log("Beacon has been stored");
      return false;
    }
  } //end beaconIsNew

  beaconIsFound(beaconToFind, beaconDetected) {
    //console.log("Checking to see if beacon " + beaconToFind.identifier + " " + beaconToFind.uuid +  " " + beaconToFind.major + " " + beaconToFind.minor + " is within range");
    //console.log("Beacon detected is " + beaconDetected.uuid + " " + beaconDetected.major + " " + beaconDetected.minor)

    if (beaconToFind.uuid.toUpperCase() == beaconDetected.uuid.toUpperCase() &&
      beaconToFind.major == beaconDetected.major &&
      beaconToFind.minor == beaconDetected.minor) {
      //console.log("Beacon found!")
      return true;
    }

    //console.log("Beacon not found...")
    return false;

  } //end beaconIsFound

  showAlert(result) {
    let prompt = this.alertCtrl.create({
      title: 'Project Manager',
      message: result,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.navCtrl.popToRoot();
          }
        }
      ]
    })
    prompt.present();
  }
}

