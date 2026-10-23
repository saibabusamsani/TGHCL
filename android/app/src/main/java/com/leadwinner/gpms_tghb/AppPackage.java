package com.leadwinner.gpms_tghb;

import androidx.annotation.NonNull;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import com.leadwinner.gpms_tghb.modules.LocationOverlayModule;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public final class AppPackage extends BaseReactPackage {

    private static final Map<String, Function<ReactApplicationContext, NativeModule>>  MODULES = new HashMap<>();

    static {
        MODULES.put(LocationOverlayModule.NAME, LocationOverlayModule::new);
    }

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        var factory = MODULES.get(name);
        return factory != null ? factory.apply(reactContext) : null;
    }

    @NonNull
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> modules = new HashMap<>();

            MODULES.forEach((name, factory) ->
                    modules.put(name, new ReactModuleInfo(
                            name,
                            name,
                            false,
                            false,
                            false,
                            false,
                            true
                    ))
            );

            return modules;
        };
    }
}