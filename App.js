import React, {Component} from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter, Image, Animated, PermissionsAndroid, Button} from 'react-native';
import {SensorManager} from 'NativeModules';
import Bluetooth from 'react-native-bluetooth-serial';

type Props = {};
export default class App extends Component<Props> {
  state = {
    orientation: {
      azimuth: 0,
      pitch: 0,
      roll: 0,
    },
    position: {
      heading: 0,
      accuracy: 0,
      altitude: 0,
      longitude: 0,
      latitude: 0
    },
    rotation: new Animated.Value(0),
    devices: []
  };

  async componentDidMount (): void {
    try {
      SensorManager.startOrientation(100);
      DeviceEventEmitter.addListener('Orientation', (data) => {
        this.setState({
          orientation: {
            ...data,
            azimuth: Math.round(data.azimuth)
          }
        });
        this.state.rotation.setValue(Math.round(data.azimuth));
      });

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'SkyView Location Permissions',
          message: 'App needs access to your location',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel'
        }
      )


      if (!granted) {
        alert('Without access to your location app might not work as expected.');
        return;
      }

      this.watchId = navigator.geolocation.watchPosition(
        position => {
          this.setState({position: position.coords});
        },
        error => {
          alert(JSON.stringify(error));
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          maximumAge: 5000,
        }
      )
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  componentWillUnmount (): void {
    SensorManager.stopOrientation();
    navigator.geolocation.clearWatch(this.watchId);
  }

  async onPressSend() {
    try {
      const isBluetoothEnabled = await Bluetooth.isEnabled();

      if (!isBluetoothEnabled) {
        try {
          await Bluetooth.requestEnable()
        } catch (e) {
          alert('You need to turn the bluetooth on to send GPS data to HoloLense');
          return;
        }
      }

      try {
        const message = {
          orientation: this.state.orientation,
          position: this.state.position
        };

        await Bluetooth.write(JSON.stringify(message))

        alert('Successfully sent to the device')
      } catch (e) {
        alert('Error while sending data to the device')
        alert(e.message);
      }
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.compassConatiner}>
          <Animated.Image
            source={require('./assets/compass.png')}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: [
                {
                  rotate: this.state.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '-360deg']
                  })
                }
              ]
            }}
          />
          <Image source={require('./assets/arrow.png')} style={styles.arrow} />
        </View>
        <Text style={styles.text}>Azimuth {this.state.orientation.azimuth}</Text>
        <Text style={styles.text}>GPS</Text>
        <Text style={styles.text}>Long: {this.state.position.longitude}</Text>
        <Text style={styles.text}>Lat: {this.state.position.latitude}</Text>
        <Text style={styles.text}>Alt: {this.state.position.altitude}</Text>
        <Text style={styles.text}>Acc: {this.state.position.accuracy}</Text>

        <Button title={'Send to HoloLense'} onPress={() => this.onPressSend()}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  compassConatiner: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  arrow: {
    height: 150,
      width: 75,
  },
  text: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
