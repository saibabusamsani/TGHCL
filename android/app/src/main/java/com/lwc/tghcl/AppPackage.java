package com.lwc.tghcl;

import androidx.annotation.NonNull;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.lwc.tghcl.modules.LocationOverlayModule;

import java.util.HashMap;
import java.util.Map;

public class AppPackage extends BaseReactPackage {

    @Override
    public NativeModule getModule(
            String name,
            ReactApplicationContext reactContext
    ) {
        if (LocationOverlayModule.NAME.equals(name)) {
            return new LocationOverlayModule(reactContext);
        }
        return null;
    }

    @NonNull
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put(LocationOverlayModule.NAME, new ReactModuleInfo(
                    LocationOverlayModule.NAME,
                    LocationOverlayModule.NAME,
                    false,
                    false, // needsEagerInit
                    true,  // hasConstants
                    false, // isCxxModule
                    false  // isTurboModule — plain ReactContextBaseJavaModule, no Spec
            ));
            return map;
        };
    }
}