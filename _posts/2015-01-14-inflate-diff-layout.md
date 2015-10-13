---
layout: post
title: Inflating different xml layouts in an Android ListView for different Objects.
comments: True
---

While working on the Ambient Dynamix Project, I needed to create a listview which contains a non fixed number of headers each one followed by some list items.


A common solution is to use the [MergeAdapter](https://github.com/commonsguy/cwac-merge). A MergeAdapter object exposes the <code>addAdapter()</code>, <code>addView()</code> and <code>addViews()</code> methods. The [demo](https://github.com/commonsguy/cwac-merge/blob/master/demo/src/com/commonsware/cwac/merge/demo/MergeAdapterDemo.java) included in the repo is pretty self explanatory.
But in case of the MergeAdapter, I'd need to keep track of multiple adapters, one for each of the list, which can be a bit of pain in case I need some data back from the adapters. So, I wrote a custom adapter which could inflate different layouts depending on the type of item. 

###Writing the Custom Adapter : 
Create a public class which contains the types of items in the list view. 

{% highlight java %}
public class ListItemType {
    final public static int HEADER_VIEW = 0;
    final public static int CONTEXT_PLUGIN_VIEW = 1;
}
{% endhighlight %}

Create another public class with two fields, an int and an Object. We'll use an ArrayList of objects of this class as the data source for our custom adapter. The idea is to use the use the <code>type</code> value to inflate the relevant xml layout inside the adapter. 

{% highlight java %}
public class ListViewItem {
    int type;
    Object object;

    public ListViewItem(int type, Object object) {
        this.type = type;
        this.object = object;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }
}
{% endhighlight %}

We'll assume that we also have two classes whose objects contain the data for the different list items. Let's call them <code>HeaderObject</code> and <code>ListItemObject</code>. For the sake of simplicity, we'll just add a String field to both the classes. But you'll need to use this method only if you have very different data for the views and hence they cannot be stored by the same object. 

{% highlight java %}
public class HeaderObject {
	String headerName;

	public HeaderObject(String headerName) {
		this.headerName = headerName;
	}

	public String getHeaderName() {
		return headerName;
	}
}

public class ListItemObject {
	String itemName;

	public ListItemObject(String itemName) {
		this.itemName = itemName;
	}

	public String getItemName() {
		return itemName;
	}
}
{% endhighlight %}
 
The custom adapter : 

{% highlight java %}
public class SampleAdapter extends BaseAdapter {
    Activity activity;
    ArrayList <ListViewItem> listItems;

    public SampleAdapter(Activity activity, ArrayList <ListViewItem> listItems) {
        this.activity = activity;
        this.listItems = listItems;
    }

    @Override
    public int getItemViewType(int position) {
        return installedPluginsListItems.get(position).getType();
    }

//Since we have two types of items here, we'll return 2. 
    @Override
    public int getViewTypeCount() {
        return 2;
    }

//We'll use a switch case on the type and then typecast it to the relevant 
// HeaderObject or the ListItemObject.

//We'll also use the ViewHolder pattern so that android can recycle the views 
//and we do not inflate it every time getView() is called. We'll need to create two ViewHolder //Objects for both the item types. 

//Let's assume the two layouts to inflated are called list_item_layout and header_layout. 
    @Override
    public View getView(final int position, View convertView,
        final ViewGroup arg2) {
        LayoutInflater inflater = activity.getLayoutInflater();
        Object listObject = null;
        listObject = listItems
            .get(position).getObject();
        switch (getItemViewType(position)) {
            case ListItemType.CONTEXT_PLUGIN_VIEW:
                ListItemObject listItemObject = (ListItemObject) listObject;
                ViewHolderListItem holder;
                if (convertView == null) {
                    holder = new ViewHolderListItem();
                    convertView = inflater.inflate(
                            R.layout.list_item_layout, null);  
                    holder.itemNameView = (TextView) convertView.findViewById(R.id.itemNameViewId);
                    convertView.setTag(holder);
                } else {
                    holder = convertView.getTag();
                }
                holder.itemNameView.setText(listItemObject.getItemName());
                return convertView;              
            case ListItemType.HEADER_VIEW:
                HeaderObject headerObject = (HeaderObject) listObject;
                ViewHolderHeader holder;
                if (convertView == null) {
                    holder = new ViewHolderListItem();
                    convertView = inflater.inflate(
                            R.layout.header_layout, null);  
                    holder.headerNameView = (TextView) convertView.findViewById(R.id.headerNameViewId);
                    convertView.setTag(holder);
                } else {
                    holder = convertView.getTag();
                }
                holder.headerNameView.setText(headerObject.getHeaderName());
                return convertView; 
        }
        return null;
    }

    private static class ViewHolderListItem {
        TextView itemNameView;
    }

    private static class ViewHolderHeader {
        TextView headerNameView;
    }
}
{% endhighlight %}

Creating the adapter: 

{% highlight java %}
ArrayList<ListViewItem> listItems = new ArrayList<>();
listItems.add(new ListViewItem(ListItemType.HEADER_VIEW, new HeaderObject(..)));
listItems.add(new ListViewItem(ListItemType.CONTEXT_PLUGIN_VIEW, new ListItemObject(..)));
listItems.add(new ListViewItem(ListItemType.CONTEXT_PLUGIN_VIEW, new ListItemObject(..)));

SampleAdapter adapter = new SampleAdapter(activity, listItems);
{% endhighlight %}

I am not too sure if this is the best way to go about this and there definitely is an overhead of typecasting every object but it works!

Suggestions / Queries ? Cheers! :D

