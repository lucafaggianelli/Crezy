package com.tesladocet.crezyremote;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.channels.NotYetConnectedException;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
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
	
	public void send(String method, String arg) {
		if (socket == null) {
			Log.d(LOG_TAG, "No Crezy app is connected");
			return;
		}
		x
		JSONObject j = new JSONObject();
		try {
			j.put("id", method);
			j.put("what", arg);
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
		Log.d(LOG_TAG, "Got msg: "+msg);
		conn.send(msg);
	}

	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		Log.d(LOG_TAG, conn.getRemoteSocketAddress().getAddress().getHostAddress() + " connected!" );
		socket = (WebSocket) connections().toArray()[0];
		handler.obtainMessage().sendToTarget();
	}
}
