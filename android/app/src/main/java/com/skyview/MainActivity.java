package com.skyview;

import java.util.Arrays;
import java.util.List;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactActivity;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.sensormanager.SensorManagerPackage;

public class MainActivity extends ReactActivity {

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFusedLocationPackage(),
            new SensorManagerPackage()
        );
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SkyView";
    }
}
