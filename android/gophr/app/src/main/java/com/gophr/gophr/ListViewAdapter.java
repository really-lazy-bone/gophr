package com.gophr.gophr;

import static com.gophr.gophr.Constants.FIRST_COLUMN;
import static com.gophr.gophr.Constants.SECOND_COLUMN;
import static com.gophr.gophr.Constants.THIRD_COLUMN;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class ListViewAdapter extends BaseAdapter{

    public List<Item> items;
    Activity activity;
    TextView txtFirst;
    TextView txtSecond;
    TextView txtThird;
    public ListViewAdapter(Activity activity, List<Item> items){
        super();
        this.activity=activity;
        this.items=items;
    }

    @Override
    public int getCount() {
        // TODO Auto-generated method stub
        return items.size();
    }

    @Override
    public Object getItem(int position) {
        // TODO Auto-generated method stub
        return items.get(position);
    }

    @Override
    public long getItemId(int position) {
        // TODO Auto-generated method stub
        return 0;
    }



    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // TODO Auto-generated method stub

        LayoutInflater inflater=activity.getLayoutInflater();

        if(convertView == null){

            convertView=inflater.inflate(R.layout.colmn_row, null);

            txtFirst=(TextView) convertView.findViewById(R.id.quantity);
            txtSecond=(TextView) convertView.findViewById(R.id.item);
            txtThird=(TextView) convertView.findViewById(R.id.price);

        }

//        HashMap<String, String> map=list.get(position);
        Item item = items.get(position);
        txtFirst.setText("" + item.getQuantity());
        txtSecond.setText(item.getName());
        txtThird.setText("$" + item.getPrice());

        return convertView;
    }

}
