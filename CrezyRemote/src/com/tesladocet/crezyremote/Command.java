package com.tesladocet.crezyremote;

public class Command {

	public final static String
        // Connection
        CONNECT = "connect",
        DISCONNECT = "disconnect",

		// Remote configuration
		REMOTE_LAYOUT = "rem:layout",
		REMOTE_CONFIG = "rem:config",
		
		// Multimedia
		MEDIA_PLAY = "m:play",
		MEDIA_PAUSE = "m:pause",
		MEDIA_NEXT = "m:next",
		MEDIA_PREV = "m:prev",
		
		// Presentation
		PRESENTATION = "pres",
		NOTES = "notes",
		
		// Steps
		STEP_NEXT = "next",
		STEP_GOTO = "goto",
		STEP_PREVIOUS = "prev";
	
	public String name;
	public String value;
	
	public Command() {
		
	}
}
