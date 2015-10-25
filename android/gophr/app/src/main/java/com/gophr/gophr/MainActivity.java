/**
 * Copyright (C) 2015 Clover Network, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.gophr.gophr;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import com.clover.sdk.v1.Intents;
import com.clover.sdk.v3.scanner.BarcodeScanner;

public class MainActivity extends Activity {

    private BarcodeScanner mBarcodeScanner;

    private BroadcastReceiver barcodeReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {

            String barcode = intent.getStringExtra("Barcode");
            Intent intent1 = new Intent(MainActivity.this, SimpleListViewActivity.class);
            intent1.putExtra("barcode",barcode);

            startActivity(intent1);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        Intent intent1 = new Intent(MainActivity.this, CashEventTestActivity.class);
//        startActivity(intent1);
//
        setContentView(R.layout.activity_barcode_scanner);

        mBarcodeScanner = new BarcodeScanner(this);

        Button start = (Button) findViewById(R.id.start);
        start.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle extras = new Bundle();
                extras.putBoolean(Intents.EXTRA_SCAN_1D_CODE, true);
                mBarcodeScanner.executeStartScan(extras);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        registerBarcodeScanner();
    }

    @Override
    protected void onPause() {
        super.onPause();
        unregisterBarcodeScanner();
    }

    private void registerBarcodeScanner() {
        registerReceiver(barcodeReceiver, new IntentFilter("com.clover.stripes.BarcodeBroadcast"));
    }

    private void unregisterBarcodeScanner() {
        unregisterReceiver(barcodeReceiver);
    }
}
