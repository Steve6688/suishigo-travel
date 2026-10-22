package com.qinggan.travel;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {
    private float top = 0, bottom = 0, left = 0, right = 0;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarContrastEnforced(false);
        getWindow().setStatusBarContrastEnforced(false);
        WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView()).setAppearanceLightStatusBars(true);

        final WebView wv = bridge.getWebView();
        wv.getSettings().setMediaPlaybackRequiresUserGesture(false);
        View root = getWindow().getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets i = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            float d = getResources().getDisplayMetrics().density;
            top = i.top / d; bottom = i.bottom / d; left = i.left / d; right = i.right / d;
            injectInsets(wv);
            return ViewCompat.onApplyWindowInsets(v, insets);
        });
        bridge.addWebViewListener(new WebViewListener() {
            @Override
            public void onPageLoaded(WebView webView) { injectInsets(webView); }
        });
    }

    private void injectInsets(WebView wv) {
        String js = "(function(){var s=document.documentElement.style;"
            + "s.setProperty('--sat','" + top + "px');s.setProperty('--sab','" + bottom + "px');"
            + "s.setProperty('--sal','" + left + "px');s.setProperty('--sar','" + right + "px');})();";
        wv.post(() -> wv.evaluateJavascript(js, null));
    }
}
