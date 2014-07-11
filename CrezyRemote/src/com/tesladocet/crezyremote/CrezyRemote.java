package com.tesladocet.crezyremote;

import java.net.UnknownHostException;

import org.java_websocket.WebSocket;
import org.json.JSONException;
import org.json.JSONObject;

import com.tesladocet.crezyremote.util.SystemUiHider;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Fragment;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 *
 * @see SystemUiHider
 */
public class CrezyRemote extends Activity {
	
	private static final String LOG_TAG = "CrezyRemote";

    CrezyWebSocketServer server;
    WebSocket client = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.crezy_remote);
        
        try {
			server = new CrezyWebSocketServer(newClientsHandler, 8888);
			server.start();
			Log.d(LOG_TAG, "Started on: "+server.getAddress().toString()+":"+server.getPort());
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
    }
    
    @Override
    protected void onResume() {
    	super.onResume();
    }
    
    @Override
    protected void onPause() {
    	super.onPause();
    }
    
    public void onButtonClick(View v) {
    	Log.d(LOG_TAG, "Clicked id: " + v.getId());
    	switch (v.getId()) {
		case R.id.button_next:
			server.send("step", "next");
			break;
			
		case R.id.button_prev:
			server.send("step", "prev");
			break;

		default:
			break;
		}
    }
    
    public Handler newClientsHandler = new Handler() {
    	@Override
    	public void handleMessage(Message msg) {
    		client = (WebSocket) server.connections().toArray()[0];
    	}
    };
}
