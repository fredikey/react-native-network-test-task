package com.networktestapp;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Objects;

public class NetworkingModule extends ReactContextBaseJavaModule {
    NetworkingModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "NetworkingModule";
    }

    @ReactMethod
    public void makeRequest(String requestUrl, ReadableMap params, Promise promise) {
        try {
            URL url = new URL(requestUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

            String requestType = params.getString("type");
            urlConnection.setRequestMethod(requestType);

            ReadableMap headers = params.getMap("headers");
            ReadableMapKeySetIterator headersIterator = headers.keySetIterator();
            while (headersIterator.hasNextKey()) {
                String headerKey = headersIterator.nextKey();
                String headerValue = headers.getString(headerKey);
                urlConnection.setRequestProperty(headerKey, headerValue);
            }

            urlConnection.setDoInput(true);
            urlConnection.setReadTimeout(5000);
            urlConnection.setConnectTimeout(5000);

            boolean hasBody = !Objects.equals(requestType, "GET") && params.hasKey("body");
            if (hasBody) {
                urlConnection.setDoOutput(true);

                OutputStream outputStream = urlConnection.getOutputStream();

                JSONObject jsonBody = convertMapToJson(params.getMap("body"));
                outputStream.write(jsonBody.toString().getBytes());

                outputStream.flush();
                outputStream.close();
            }

            int responseStatus = urlConnection.getResponseCode();
            boolean hasError = responseStatus >= 400;
            String responseString = getResponseString(hasError ? urlConnection.getErrorStream() : urlConnection.getInputStream());

            WritableMap output = new WritableNativeMap();
            output.putInt("statusCode", responseStatus);
            if (hasError) {
                output.putString("type", "error");
                output.putString("error", responseString);
            } else {
                output.putString("type", "success");
                output.putString("data", responseString);
            }

            promise.resolve(output);

            urlConnection.disconnect();
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    private static String getResponseString(InputStream inputStream) throws IOException {
        InputStream responseStream = new BufferedInputStream(inputStream);
        BufferedReader responseStreamReader = new BufferedReader(new InputStreamReader(responseStream));

        String line;
        StringBuilder stringBuilder = new StringBuilder();

        while ((line = responseStreamReader.readLine()) != null) {
            stringBuilder.append(line).append("\n");
        }

        responseStream.close();
        responseStreamReader.close();

        return stringBuilder.toString();
    }

    private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
            }
        }
        return object;
    }
}
