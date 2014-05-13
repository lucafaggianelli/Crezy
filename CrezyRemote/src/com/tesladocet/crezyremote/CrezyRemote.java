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
public class CrezyRemote extends Activity implements SensorEventListener {
	
	private static final String LOG_TAG = "CrezyRemote";
	
    /**
     * Whether or not the system UI should be auto-hidden after
     * {@link #AUTO_HIDE_DELAY_MILLIS} milliseconds.
     */
    private static final boolean AUTO_HIDE = true;

    /**
     * If {@link #AUTO_HIDE} is set, the number of milliseconds to wait after
     * user interaction before hiding the system UI.
     */
    private static final int AUTO_HIDE_DELAY_MILLIS = 3000;

    /**
     * If set, will toggle the system UI visibility upon interaction. Otherwise,
     * will show the system UI visibility upon interaction.
     */
    private static final boolean TOGGLE_ON_CLICK = true;

    /**
     * The flags to pass to {@link SystemUiHider#getInstance}.
     */
    private static final int HIDER_FLAGS = SystemUiHider.FLAG_HIDE_NAVIGATION;

    /**
     * The instance of the {@link SystemUiHider} for this activity.
     */
    private SystemUiHider mSystemUiHider;

    CrezyWebSocketServer server;
    WebSocket client = null;
    
    JSONObject orientation = new JSONObject();
    
    private SensorManager mSensorManager;
	private Sensor mOrientationSensor;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.crezy_remote);

        initUiHider();
        
        mSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
		
		mOrientationSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        delayedHide(100);
    }
    
    @Override
    protected void onResume() {
    	super.onResume();
    	
    	mSensorManager.registerListener(this, mOrientationSensor, 
	    		SensorManager.SENSOR_DELAY_GAME);
    	
    	try {
			server = new CrezyWebSocketServer(newClientsHandler, 8888);
			server.start();
			Log.d(LOG_TAG, "Started on: "+server.getAddress().toString()+":"+server.getPort());
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
    }
    
    @Override
    protected void onPause() {
    	super.onPause();
    	
    	mSensorManager.unregisterListener(this);
    }
    
    @Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		float yaw, pitch, roll;
	    float[] result = rotationVectorAction(event.values);
	    yaw = result[0];
	    roll = result[2];
	    pitch = result[1];
	    pitch = (float) Math.max(min, pitch);
	    pitch = (float) Math.min(max, pitch);
	    float dx = (float) (Math.sin(yaw) * (-Math.cos(pitch)));
	    float dy = (float) Math.sin(pitch);
	    float dz = (float) (Math.cos(yaw) * Math.cos(pitch));
		    
		if (client != null) {
			try {
				orientation.put("x", pitch);
				orientation.put("y", roll);
				orientation.put("z", yaw);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			client.send(orientation.toString());
		}
	}
	
	private double max = Math.PI / 2 - 0.01;
	private double min = -max;

	private float[] rotationVectorAction(float[] values) {
	    float[] result = new float[3];
	    float vec[] = values;
	    float quat[] = new float[4];
	    float[] orientation = new float[3];
//	    SensorManager.getQuaternionFromVector(quat, vec);
	    float[] rotMat = new float[9];
	    SensorManager.getRotationMatrixFromVector(rotMat, vec);
	    SensorManager.getOrientation(rotMat, orientation);
	    result[0] = (float) orientation[0];
	    result[1] = (float) orientation[1];
	    result[2] = (float) orientation[2];     
	    return result;
	}

	
    private void initUiHider() {
    	
    	final View controlsView = findViewById(R.id.fullscreen_content_controls);
        final View contentView = findViewById(R.id.fullscreen_content);
    	
    	// Set up an instance of SystemUiHider to control the system UI for
        // this activity.
        mSystemUiHider = SystemUiHider.getInstance(this, contentView, HIDER_FLAGS);
        mSystemUiHider.setup();
        mSystemUiHider
                .setOnVisibilityChangeListener(new SystemUiHider.OnVisibilityChangeListener() {
                    // Cached values.
                    int mControlsHeight;
                    int mShortAnimTime;

                    @Override
                    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
                    public void onVisibilityChange(boolean visible) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
                            // If the ViewPropertyAnimator API is available
                            // (Honeycomb MR2 and later), use it to animate the
                            // in-layout UI controls at the bottom of the
                            // screen.
                            if (mControlsHeight == 0) {
                                mControlsHeight = controlsView.getHeight();
                            }
                            if (mShortAnimTime == 0) {
                                mShortAnimTime = getResources().getInteger(
                                        android.R.integer.config_shortAnimTime);
                            }
                            controlsView.animate()
                                    .translationY(visible ? 0 : mControlsHeight)
                                    .setDuration(mShortAnimTime);
                        } else {
                            // If the ViewPropertyAnimator APIs aren't
                            // available, simply show or hide the in-layout UI
                            // controls.
                            controlsView.setVisibility(visible ? View.VISIBLE : View.GONE);
                        }

                        if (visible && AUTO_HIDE) {
                            // Schedule a hide().
                            delayedHide(AUTO_HIDE_DELAY_MILLIS);
                        }
                    }
                });

        // Set up the user interaction to manually show or hide the system UI.
        contentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (TOGGLE_ON_CLICK) {
                    mSystemUiHider.toggle();
                } else {
                    mSystemUiHider.show();
                }
            }
        });

        // Upon interacting with UI controls, delay any scheduled hide()
        // operations to prevent the jarring behavior of controls going away
        // while interacting with the UI.
        findViewById(R.id.dummy_button).setOnTouchListener(mDelayHideTouchListener);
    }

    /**
     * Touch listener to use for in-layout UI controls to delay hiding the
     * system UI. This is to prevent the jarring behavior of controls going away
     * while interacting with activity UI.
     */
    View.OnTouchListener mDelayHideTouchListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {
            if (AUTO_HIDE) {
                delayedHide(AUTO_HIDE_DELAY_MILLIS);
            }
            return false;
        }
    };

    Handler mHideHandler = new Handler();
    Runnable mHideRunnable = new Runnable() {
        @Override
        public void run() {
            mSystemUiHider.hide();
        }
    };

    /**
     * Schedules a call to hide() in [delay] milliseconds, canceling any
     * previously scheduled calls.
     */
    private void delayedHide(int delayMillis) {
        mHideHandler.removeCallbacks(mHideRunnable);
        mHideHandler.postDelayed(mHideRunnable, delayMillis);
    }
    
    public Handler newClientsHandler = new Handler() {
    	@Override
    	public void handleMessage(Message msg) {
    		client = (WebSocket) server.connections().toArray()[0];
    	}
    };
}
