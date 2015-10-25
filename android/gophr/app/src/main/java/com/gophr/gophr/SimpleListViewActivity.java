package com.gophr.gophr;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

import android.view.View;
import android.widget.AdapterView;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Created by tmitim_air on 10/24/15.
 */
public class SimpleListViewActivity extends Activity {

    private ArrayList<HashMap<String, String>> list;
    private List<Item> items = new ArrayList<>();
    private double tip;
    private double total;

    TextView tipAmount;
    TextView totalAmount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.orders);

        ListView listView=(ListView)findViewById(R.id.listView1);

        items.add( new Item(1, "Turkey Sandwich", 4.99 ));
        items.add(new Item(2, "Slice of Pizza", 2.99));
        items.add(new Item(3, "Bottle of Coke", 1.49));

        ListViewAdapter adapter=new ListViewAdapter(this, items);
        listView.setAdapter(adapter);
        tip = 4.00;

        tipAmount= (TextView)findViewById(R.id.tipAmount);
        totalAmount= (TextView)findViewById(R.id.totalAmount);

        // api/orders/

        tipAmount.setText("Tip: $" + String.format("%.02f", tip));
        totalAmount.setText("Total: $" + String.format("%.02f", getTotal(items) + tip));

//        listView.setOnItemClickListener(new AdapterView.OnItemClickListener()
//        {
//            @Override
//            public void onItemClick(AdapterView<?> parent, final View view, int position, long id)
//            {
//                int pos=position+1;
//                Toast.makeText(SimpleListViewActivity.this, Integer.toString(pos)+" Clicked", Toast.LENGTH_SHORT).show();
//            }
//
//        });
    }

    private double getTotal(List<Item> items) {
        double total = 0;
        for(Item item: items) {
            total += item.getQuantity() * item.getPrice();
        }
        return total;
    }
}
