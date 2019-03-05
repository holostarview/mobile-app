# Mobile App for Hololens Starmap Viewer

## Requirements (for Android)

1. [Yarn](https://yarnpkg.com/lang/en/docs/install/) manager
2. [Java 8 JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
3. Android SDK. Better to install [Android Studio](https://developer.android.com/studio/install) and install all needd SDKs there

## Installation

1. Clone repository
2. Install npm packages with `yarn install --frozen-lockfile` command

## Build (for Android)

### Debug

Just run `react-native run-android` command with android device connected

### Release

1. You need to generate keystore to sign the apk and put it to sources. Tutorial can be found [here](https://facebook.github.io/react-native/docs/signed-apk-android)
2. To run release build on device use `react-native run-android --variant=release`
3. To build the apk go to `android` directory (`cd android`) and run `./gradlew assembleRelease`). Apk then can be found in `andoid/app/build/outputs/apk/release/app-release.apk`