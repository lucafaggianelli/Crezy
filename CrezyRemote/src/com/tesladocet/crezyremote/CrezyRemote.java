package com.tesladocet.crezyremote;

import java.net.UnknownHostException;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONException;
import org.json.JSONObject;

import com.tesladocet.crezyremote.util.SystemUiHider;

import android.annotation.SuppressLint;
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
import android.view.WindowManager;
import android.widget.ImageButton;
import android.widget.SeekBar;
import android.widget.SeekBar.OnSeekBarChangeListener;
import android.widget.TextView;

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 *
 * @see SystemUiHider
 */
public class CrezyRemote extends Activity implements OnSeekBarChangeListener {
	
	private static final String LOG_TAG = "CrezyRemote";

    static CrezyWebSocketServer server;
    static Presentation presentation = null;

    static SeekBar seekbar = null;
    static TextView titleView = null;
    static TextView stepTitleView = null;
    static ImageButton playButton = null;
    
    @SuppressLint("NewApi") @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        if (Build.VERSION.SDK_INT < 16) {
            getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN);
        } else {
        	View decorView = getWindow().getDecorView();
        	decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN);
        	getActionBar().hide();
        }

        setContentView(R.layout.crezy_remote);
        seekbar = (SeekBar) findViewById(R.id.seekbar);
        seekbar.setOnSeekBarChangeListener(this);

        titleView = (TextView) findViewById(R.id.presentation_title);
        stepTitleView = (TextView) findViewById(R.id.step_title);
        playButton = (ImageButton) findViewById(R.id.button_play);
        
        try {
			server = new CrezyWebSocketServer(wsHandler, 8888);
			server.start();
			
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
    	switch (v.getId()) {
		case R.id.button_next:
			server.send(0,"setStep","next");
			updateCurrentStep(presentation.currentStep+1);
			break;
			
		case R.id.button_prev:
			server.send(0,"setStep","prev");
			updateCurrentStep(presentation.currentStep-1);
			break;

		case R.id.button_first:
			server.send(0,"setStep","first");
			updateCurrentStep(0);
			break;
			
		case R.id.button_last:
			server.send(0,"setStep","last");
			updateCurrentStep(presentation.stepsCount-1);
			break;
			
		case R.id.button_play:
			if (presentation.isPlaying) {
				server.send(0, "present","pause");
				presentation.isPlaying = false;
				playButton.setImageResource(R.drawable.ic_action_play_over_video);
			} else {
				server.send(0, "present","play");
				presentation.isPlaying = true;
				playButton.setImageResource(R.drawable.ic_action_pause_over_video);
			}
			break;
			
		default:
			break;
		}
    }
    
    static public Handler wsHandler = new Handler() {
    	@Override
    	public void handleMessage(Message msg) {
    		switch (msg.what) {
			case 0:
				Log.i(LOG_TAG, "Connected");
				server.send(0, "getPresentation", null);
				break;

			case 1:
				Log.i(LOG_TAG, "Got a new presentation");
				try {
					presentation = new Presentation(new JSONObject((String)msg.obj));
				} catch (JSONException e) {
					Log.w(LOG_TAG,"Not a valid presentation");
				}
				
				titleView.setText(presentation.title);
				seekbar.setMax(presentation.stepsCount-1);
				seekbar.setProgress(0);
				break;
				
			default:
				break;
			}
    	}
    };

    public void updateCurrentStep(int step) {
    	if (presentation != null) {
    		presentation.currentStep = step;
    		seekbar.setProgress(step);
    		stepTitleView.setText("Step "+(step+1));
    	}
    }
    
	@Override
	public void onProgressChanged(SeekBar seekBar, int progress,
			boolean fromUser) {
	}

	@Override
	public void onStartTrackingTouch(SeekBar seekBar) {

	}

	@Override
	public void onStopTrackingTouch(SeekBar seekBar) {		
		server.send(0, "setStep", ""+seekBar.getProgress());
		updateCurrentStep(seekBar.getProgress());
	}
}
