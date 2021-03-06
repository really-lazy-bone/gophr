package com.gophr.gophr;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;
import android.util.Log;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

import java.net.URL;
import java.net.HttpURLConnection;
import android.view.View;
import android.widget.AdapterView;
import android.widget.TextView;
import android.widget.Button;

import java.io.InputStreamReader;
import java.io.InputStream;
import java.io.BufferedReader;


import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.View.OnClickListener;

import android.os.StrictMode;

/**
 * Created by tmitim_air on 10/24/15.
 */
public class SimpleListViewActivity extends Activity {

    private ArrayList<HashMap<String, String>> list;
    private List<Item> items = new ArrayList<>();
    private double tip;
    final Context context = this;
    final String SERVER_PATH = "http://45.55.186.189:3000/api/order/";
    TextView tipAmount;
    TextView totalAmount;

    private Button button;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.orders);

        ListView listView=(ListView)findViewById(R.id.listView1);

        Bundle extras = getIntent().getExtras();
        String barcode = "9108879894";

        if (extras != null) {
            barcode = extras.getString("barcode");
            String path = SERVER_PATH + barcode + "/shoppinglist";

            Log.d("gophr_log", path);
        }
        try {
            String json = get(SERVER_PATH + barcode + "/shoppinglist");

            Gson gson = new Gson();

            Log.d("gophr_log", json);

            JsonObject jo = gson.fromJson(json, JsonObject.class);

            ListViewAdapter adapter = new ListViewAdapter(this, jo.getItems());
            listView.setAdapter(adapter);
            tip = jo.getTip();
            items = jo.getItems();
        } catch (Exception e) {
            // do nothing
        }
        tipAmount= (TextView)findViewById(R.id.tipAmount);
        totalAmount= (TextView)findViewById(R.id.totalAmount);

        tipAmount.setText("Tip: $" + String.format("%.02f", tip));
        totalAmount.setText("Total: $" + String.format("%.02f", getTotal(items) + tip));

        button = (Button) findViewById(R.id.confirmButton);

        // add button listener
        button.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View arg0) {

                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                        context);

                // set title
                alertDialogBuilder.setTitle(" ");

                // set dialog message
                alertDialogBuilder
                        .setMessage("Transaction Completed")
                        .setCancelable(false)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                // if this button is clicked, close
                                // current activity
                                SimpleListViewActivity.this.finish();
                            }
                        });
//                        .setNegativeButton("No", new DialogInterface.OnClickListener() {
//                            public void onClick(DialogInterface dialog, int id) {
//                                // if this button is clicked, just close
//                                // the dialog box and do nothing
//                                dialog.cancel();
//                            }
//                        });

                // create alert dialog
                AlertDialog alertDialog = alertDialogBuilder.create();

                // show it
                alertDialog.show();
            }
        });

    }

    private double getTotal(List<Item> items) {
        double total = 0;
        for(Item item: items) {
            total = total +  (item.getQuantity() * item.getPrice());
        }
        return total;
    }

    public String get(String surl) {

        StringBuffer chaine = new StringBuffer("");
        try{
            URL url = new URL(surl);

            // So async method is not required.
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);

            HttpURLConnection connection = (HttpURLConnection)url.openConnection();

            connection.setRequestMethod("GET");
            connection.setDoInput(true);
            connection.connect();

            InputStream inputStream = connection.getInputStream();

            BufferedReader rd = new BufferedReader(new InputStreamReader(inputStream));
            String line = "";
            while ((line = rd.readLine()) != null) {
                chaine.append(line);
            }

        } catch (Exception e) {
            // writing exception to log
            Log.d("gophr_log", e.toString() + e.getLocalizedMessage());
        }

        return chaine.toString();
    }

    public class JsonObject{
        private double tip;
        private List<Item> list;

        public double getTip() {
            return tip;
        }

        public List<Item> getItems() {
            return list;
        }
    }
}
