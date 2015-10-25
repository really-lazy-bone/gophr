package com.gophr.gophr;
import java.util.ArrayList;
import java.util.Arrays;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import static com.gophr.gophr.Constants.FIRST_COLUMN;
import static com.gophr.gophr.Constants.SECOND_COLUMN;
import static com.gophr.gophr.Constants.THIRD_COLUMN;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

/**
 * Created by tmitim_air on 10/24/15.
 */
public class SimpleListViewActivity extends Activity {

    private ArrayList<HashMap<String, String>> list;
    private List<Item> items = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        ListView listView=(ListView)findViewById(R.id.listView1);

        items.add( new Item(1, "Turkey Sandwich", 4.99 ));
        items.add( new Item(2, "Slice of Pizze", 2.99 ));
        items.add( new Item(1, "Bottle of Coke", 1.49 ));


//        list = new ArrayList<HashMap<String,String>>();
//
//
//        HashMap<String,String> temp=new HashMap<String, String>();
//        temp.put(FIRST_COLUMN, "1");
//        temp.put(SECOND_COLUMN, "Turkey Sandwich");
//        temp.put(THIRD_COLUMN, "4.99");
//        list.add(temp);
//
//        HashMap<String,String> temp2=new HashMap<String, String>();
//        temp2.put(FIRST_COLUMN, "2");
//        temp2.put(SECOND_COLUMN, "Slice of Pizza");
//        temp2.put(THIRD_COLUMN, "3.99");
//        list.add(temp2);
//
//        HashMap<String, String> temp3 = new HashMap<String, String>();
//        temp3.put(FIRST_COLUMN, "1");
//        temp3.put(SECOND_COLUMN, "Bottle of Coke");
//        temp3.put(THIRD_COLUMN, "1.30");
//        list.add(temp3);

        ListViewAdapter adapter=new ListViewAdapter(this, items);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener()
        {
            @Override
            public void onItemClick(AdapterView<?> parent, final View view, int position, long id)
            {
                int pos=position+1;
                Toast.makeText(SimpleListViewActivity.this, Integer.toString(pos)+" Clicked", Toast.LENGTH_SHORT).show();
            }

        });
    }
}
