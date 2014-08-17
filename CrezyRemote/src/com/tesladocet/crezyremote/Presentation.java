package com.tesladocet.crezyremote;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.SparseIntArray;

public class Presentation {
	
	public String id = "";
	public String title = "";
	public int stepsCount = 0;
	public int currentStep = 0;
	public boolean isPlaying = false;
	public SparseIntArray slidesTimeout = new SparseIntArray();
	
	public Presentation() {
		
	}
	
	public Presentation(JSONObject j) {
		try {
			id = j.getString("id");
			title = j.getString("title");
			stepsCount = j.getInt("stepsCount");
			
//			JSONArray times = j.getJSONArray("slidesTimeout");
//			for (int i = 0; i < times.length(); i++) {
//				slidesTimeout.put(i, (Integer) times.get(i));
//			}
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}
