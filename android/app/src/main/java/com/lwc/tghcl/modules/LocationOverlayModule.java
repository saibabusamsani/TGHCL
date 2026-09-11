package com.lwc.tghcl.modules;

import android.graphics.*;
import android.text.TextUtils;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.*;

public class LocationOverlayModule extends ReactContextBaseJavaModule {

    public static final String NAME = "LocationOverlayModule";

    public LocationOverlayModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void overlayLocationDataOnImage(String imageUri,String currentAddress, double latitude, double longitude, Promise promise) {
        try {
            String cleanPath = imageUri.startsWith("file://") ? imageUri.substring(7) : imageUri;

            Bitmap bitmap = BitmapFactory.decodeFile(cleanPath);
            if (bitmap == null) {
                promise.reject("DECODE_ERROR", "Could not decode image at path: " + cleanPath);
                return;
            }

            float textSize = 65f;
            float maxWidth  = bitmap.getWidth() * 0.88f;
            Paint measurePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
            measurePaint.setTextSize(textSize);

            String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                    .format(new Date());

            List<String> lines = new ArrayList<>();
            if (!TextUtils.isEmpty(currentAddress)) {
                lines.addAll(splitTextByWidth(currentAddress, maxWidth, measurePaint));
            }
            lines.add("Lat: " + latitude);
            lines.add("Lon: " + longitude);
            lines.add("Date: " + time);

            Bitmap result = applyTextOverlay(bitmap, lines, textSize, 60);

            try (FileOutputStream out = new FileOutputStream(cleanPath)) {
                result.compress(Bitmap.CompressFormat.JPEG, 90, out);
            }

            promise.resolve(imageUri);

        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    private Bitmap applyTextOverlay(Bitmap bitmap, List<String> lines,
                                    float textSize, int paddingBottom) {
        Bitmap mutable = bitmap.copy(Bitmap.Config.ARGB_8888, true);
        Canvas canvas = new Canvas(mutable);

        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setColor(Color.WHITE);
        paint.setTextSize(textSize);
        paint.setShadowLayer(2f, 0f, 2f, Color.BLACK);

        float y = mutable.getHeight() - paddingBottom;
        for (int i = lines.size() - 1; i >= 0; i--) {
            canvas.drawText(lines.get(i), 40, y, paint);
            y -= (paint.getTextSize() + 15);
        }
        return mutable;
    }

    private List<String> splitTextByWidth(String text, float maxWidthPx, Paint paint) {
        List<String> result = new ArrayList<>();
        if (TextUtils.isEmpty(text)) return result;

        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();

        for (String word : words) {
            String candidate = line.length() == 0 ? word : line + " " + word;
            if (paint.measureText(candidate) <= maxWidthPx) {
                line = new StringBuilder(candidate);
            } else {
                if (line.length() > 0) {
                    result.add(line.toString());
                    line = new StringBuilder(word);
                } else {
                    StringBuilder chunk = new StringBuilder();
                    for (char c : word.toCharArray()) {
                        String chunkCandidate = chunk.toString() + c;
                        if (paint.measureText(chunkCandidate) <= maxWidthPx) {
                            chunk.append(c);
                        } else {
                            if (chunk.length() > 0) result.add(chunk.toString());
                            chunk = new StringBuilder(String.valueOf(c));
                        }
                    }
                    line = chunk;
                }
            }
        }
        if (line.length() > 0) result.add(line.toString());
        return result;
    }
}