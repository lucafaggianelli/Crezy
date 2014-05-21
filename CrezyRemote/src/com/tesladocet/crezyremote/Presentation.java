package com.tesladocet.crezyremote;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.SparseIntArray;

public class Presentation {
	
	public String id = "";
	public String title = "";
	public int slidesCount = 0;
	public SparseIntArray slidesTimeout = new SparseIntArray();
	
	public Presentation() {
		
	}
	
	public Presentation(JSONObject j) {
		try {
			id = j.getString("id");
			title = j.getString("title");
			slidesCount = j.getInt("slidesCount");
			
			JSONArray times = j.getJSONArray("slidesTimeout");
			for (int i = 0; i < times.length(); i++) {
				slidesTimeout.put(i, (Integer) times.get(i));
			}
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}