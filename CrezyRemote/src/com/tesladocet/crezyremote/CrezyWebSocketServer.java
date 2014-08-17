package com.tesladocet.crezyremote;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.channels.NotYetConnectedException;
import java.util.Arrays;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Handler;
import android.util.Log;

public class CrezyWebSocketServer extends WebSocketServer {

	private static final String LOG_TAG = "Server";
	Handler handler;
	WebSocket socket;
	
	public CrezyWebSocketServer(Handler h, int port) throws UnknownHostException {
		super(new InetSocketAddress(port));
		handler = h;
		
		Log.d(LOG_TAG, getAddress().toString());
	}
	
	public void send(int id, String method, Object arg) {
		send(id,method,new Object[] {arg});
	}
	
	public void send(int id, String method, Object[] arg) {
		if (socket == null) {
			Log.d(LOG_TAG, "Null socket");
			return;
		}
		
		JSONObject j = new JSONObject();
		try {
			j.put("id", id);
			j.put("method", method);
			if (arg != null)
				j.put("args", new JSONArray(Arrays.asList(arg)));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		try {
			socket.send(j.toString());
		} catch (NotYetConnectedException e) {
			Log.d(LOG_TAG, "No Crezy app is connected");
		}
	}
	
	// -------- Bare websocket callbacks ---------
	
	@Override
	public void onClose(WebSocket conn, int arg1, String arg2, boolean arg3) {
		Log.d(LOG_TAG, conn.getRemoteSocketAddress().getAddress().getHostAddress()+" closed");
	}

	@Override
	public void onError(WebSocket conn, Exception e) {
		e.printStackTrace();
	}

	@Override
	public void onMessage(WebSocket conn, String msg) {
		JSONObject j = null;
		int id = 0;
		String method = null;
		JSONArray args = null;
		String response = null;
		
		try {
			j = new JSONObject(msg);
			id = j.getInt("id");
			method = j.getString("method");
			if (j.has("args"))
				args = j.getJSONArray("args");
			else if (j.has("response")) {
				response = j.getString("response");
			}
		} catch (JSONException e) {
			Log.w(LOG_TAG,"Not a valid message: "+msg);
		}
		
		if (method!=null && method.equals("getPresentation")) {
			handler.obtainMessage(1,0,0,response).sendToTarget();
		}
	}

	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		Log.d(LOG_TAG, conn.getRemoteSocketAddress().getAddress().getHostAddress() + " connected!" );
		socket = (WebSocket) connections().toArray()[0];
		handler.obtainMessage(0).sendToTarget();
	}
}
