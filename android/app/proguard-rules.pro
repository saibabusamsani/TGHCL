# react-native-config
-keep class com.leadwinner.gpms_tghb.BuildConfig { *; }

# React Native / Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# PayU SDK
-keep class com.payu.** { *; }
-dontwarn com.payu.**
-dontwarn com.google.android.apps.nbu.paisa.inapp.client.api.**
-dontwarn com.google.android.gms.auth.api.credentials.**