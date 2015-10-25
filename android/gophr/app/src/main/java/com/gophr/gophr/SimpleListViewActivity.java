package com.gophr.gophr;
import java.util.ArrayList;
import java.util.Arrays;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import static com.gophr.gophr.Constants.FIRST_COLUMN;
import static com.gophr.gophr.Constants.FOURTH_COLUMN;
import static com.gophr.gophr.Constants.SECOND_COLUMN;
import static com.gophr.gophr.Constants.THIRD_COLUMN;

import java.util.ArrayList;
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
//
//    private ListView mainListView ;
//    private ArrayAdapter<String> listAdapter ;

    private ArrayList<HashMap<String, String>> list;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        ListView listView=(ListView)findViewById(R.id.listView1);

        list = new ArrayList<HashMap<String,String>>();

        HashMap<String,String> temp=new HashMap<String, String>();
        temp.put(FIRST_COLUMN, "Ankit Karia");
        temp.put(SECOND_COLUMN, "Male");
        temp.put(THIRD_COLUMN, "22");
        temp.put(FOURTH_COLUMN, "Unmarried");
        list.add(temp);

        HashMap<String,String> temp2=new HashMap<String, String>();
        temp2.put(FIRST_COLUMN, "Rajat Ghai");
        temp2.put(SECOND_COLUMN, "Male");
        temp2.put(THIRD_COLUMN, "25");
        temp2.put(FOURTH_COLUMN, "Unmarried");
        list.add(temp2);

        HashMap<String, String> temp3 = new HashMap<String, String>();
        temp3.put(FIRST_COLUMN, "Karina Kaif");
        temp3.put(SECOND_COLUMN, "Female");
        temp3.put(THIRD_COLUMN, "31");
        temp3.put(FOURTH_COLUMN, "Unmarried");
        list.add(temp3);

        ListViewAdapter adapter=new ListViewAdapter(this, list);
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
