package com.tesladocet.crezyremote;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import android.os.Handler;
import android.util.Log;

public class CrezyWebSocketServer extends WebSocketServer {

	private static final String LOG_TAG = "Server";
	Handler handler;
	
	public CrezyWebSocketServer(Handler h, int port) throws UnknownHostException {
		super(new InetSocketAddress(port));
		handler = h;
	}
	
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
		handler.obtainMessage().sendToTarget();
	}
}