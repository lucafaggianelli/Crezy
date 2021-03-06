package com.tesladocet.crezyremote;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

public class MotionManager extends Fragment implements SensorEventListener {
	
	private static final String LOG_TAG = "SensorManager";
	
	private SensorManager mSensorManager;
	private Sensor mOrientationSensor;
	
	public MotionManager() {
		mSensorManager = (SensorManager) getActivity()
				.getSystemService(Context.SENSOR_SERVICE);
		
		mOrientationSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return null;
	}
	
	@Override
	public void onResume() {
		super.onResume();
	    mSensorManager.registerListener(this, mOrientationSensor, 
	    		SensorManager.SENSOR_DELAY_GAME);
	}

	@Override
	public void onPause() {
		super.onPause();
	    mSensorManager.unregisterListener(this);
	}
	
	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
	}
}
