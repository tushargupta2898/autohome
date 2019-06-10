package ek.easytoapps.bitdurg;

import android.view.Menu;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;



public class EkMain extends Activity {
	private WebView mWebView;
	private ProgressBar progressBar;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE); // remove titlebar
		setContentView(R.layout.ekmain);
		// Webview 
		progressBar = (ProgressBar) findViewById(R.id.progressBar1);
		mWebView = (WebView) findViewById(R.id.webview);
		mWebView.getSettings().setJavaScriptEnabled(true);
		mWebView.getSettings().setBuiltInZoomControls(true);
		mWebView.setWebViewClient(new wapWebViewClient());


		mWebView.getSettings().setGeolocationEnabled(true);
		mWebView.setWebChromeClient(new GeoWebChromeClient());

		mWebView.loadUrl("http://dlserver.in/iot");
		//mWebView.loadUrl("https://reports.zoho.com/open-view/1591216000000003515");
		//https://docs.zoho.com/forms/published.do?rid=7c22q50ec460f948d4a5baaae3d56a4cae56c
		//mWebView.loadUrl("file:///android_asset/www/default.html");


	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.ek_main, menu);
		return true;
	}

	private class wapWebViewClient extends WebViewClient {

		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			view.loadUrl(url);
			return true;
		}

		@Override
		public void onPageFinished(WebView view, String url) {
			// when the page loaded splash screen has been invisible
			mWebView.setVisibility(View.VISIBLE);
			progressBar.setVisibility(View.GONE);

		}

		@Override
		public void onReceivedError(WebView view, int errorCode,
									String description, String failingUrl) {
			// if any error occured this message will be showed

			String customHtml = "<html><body><h1>No Internet</h1>" +
					"<p>Please Check Your Internet Connection</p>" +
					"<p>Or May Be Server is Down</p>" +
					"</body></html>";
			mWebView.loadData(customHtml, "text/html", "UTF-8");

			Toast.makeText(EkMain.this, "Error is occured, please try again..." + description, Toast.LENGTH_LONG).show();
		}
	}


	private class GeoWebChromeClient extends WebChromeClient {
		@Override
		public void onGeolocationPermissionsShowPrompt(String origin,
													   GeolocationPermissions.Callback callback) {
			callback.invoke(origin, true, false);
		}
	}


	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if ((keyCode == KeyEvent.KEYCODE_BACK)) {

			if (mWebView.canGoBack()) {
				mWebView.goBack();
				return true;
			} else {

				AlertDialog.Builder builder = new AlertDialog.Builder(this);
				builder.setMessage("Are you sure you want to exit?")
						.setCancelable(false)
						.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								finish();
							}
						})
						.setNegativeButton("No", new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								dialog.cancel();
							}
						});
				AlertDialog alert = builder.create();
				alert.show();


			}

		}
		return super.onKeyDown(keyCode, event);
	}


	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle item selection
		switch (item.getItemId()) {
			case R.id.ek_about:
				Toast.makeText(EkMain.this, "System Solutions , Raipur CG (India) .", Toast.LENGTH_LONG).show();
				return true;
			case R.id.ek_refresh:
				mWebView.reload();
				return true;
			case R.id.ek_exit:
				finish();
				return true;
			default:
				return super.onOptionsItemSelected(item);
		}
	}
}

