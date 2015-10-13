---
layout: post
title: Hiding a list item from an Android ListView without removing it from the data source.
comments: True
---
Ideally when I have to remove a list item from a listview, I'd remove the data object from the collection which the adapter uses and then do a <code> adapter.notifyDataSetChanged() </code> call which'll redraw the list view.

Consider an adapter which uses an array list of Strings. 

{% highlight java %}
public class SampleAdapter extends BaseAdapter {
    Activity activity;
    ArrayList<String> listItems;
    public SampleAdapter(Activity activity, ArrayList<String> listItems) {
        this.activity = activtity;
        this.listItems = listItems;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup arg2) {
        String testString = listItems.get(position);
    }    
}
{% endhighlight %}
Now, to delete an item from the ListView, 
{% highlight java %}
listItems.remove(position);
adapter.notifyDataSetChanged();
{% endhighlight %}

But this approach also removes the item from the <code>listItems</code> ArrayList. 

###What if I do not want to remove the item from the collection and prevent it from displaying in the ListView?

A couple of solutions suggest setting the height of the list item to 0 or to set the visibility of the view to <code>GONE</code> but this does not solve the problem effectively because the list item separator still shows up in the list view making it look clumsy. 

To tackle this problem, I'll use another ArrayList which stores the positions of items in the <code>listItems</code> ArrayList which shouldn't show up in the ListView. 

Let's define another ArrayList of Integers which can store these positions, as an instance variable, and add the logic of hiding a particular view in the<code>getView()</code> method of the adapter. 

Also, check out the <code>getCount()</code> method which should return the correct size of the number of items in the ListView.
{% highlight java %}
public class SampleAdapter extends BaseAdapter {
    Activity activity;
    ArrayList<String> listItems;
    ArrayList<Integer> hiddenPositions = new ArrayList<>();

    public SampleAdapter(Activity activity, ArrayList<String> listItems) {
        this.activity = activtity;
        this.listItems = listItems;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup arg2) {
        // The following small snippet of code ensures 
        // that we skip data from all the hidden positions 
        // and use the updated position to fetch the 
        // correct data from the listItems ArrayList. 
        for(Integer hiddenIndex : hiddenPositions) {
            if(hiddenIndex <= position) {
                position = position + 1;
            }
        }
        String testString = listItems.get(position);
    }    

    @Override
    public int getCount() {
        return listItems.size() - hiddenPositions.size();
    }
}
{% endhighlight %}

Now, whenever I need to hide an item from appearing in the ListView, I add the position value to the <code>hiddenPositions</code> ArrayList and do a <code>notifyDataSetChanged()</code> call. 

To show hidden items again, just remove the position value from the <code> hiddenPositions </code> ArrayList and call <code> notifyDataSetChanged() </code>.

Cheers!
