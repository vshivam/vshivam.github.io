var bar = false;

function getColorForRating(imdbRating){
  if(imdbRating<6){
    return "#9c9ede";
  } else if(imdbRating<=8){
    return "#6b6ecf";
  } else if(imdbRating<=9){
    return "#5254a3";
  } else {
    return "#393b79";
  }
}

function render(data) {
  $('#toggle-chart').show();
  d3.select("svg").remove();

  var margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var svg = d3.select("div#content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    var y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(data.map(function(d) {
      return d.season_episode
    }));

    y.domain([Math.floor(d3.min(data.map(function(d){return d.imdbRating; }))), 10]);

    var div = d3.select("body").append("div")
    .attr("class", "d3-tip")
    .style("opacity", 0);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .attr("stroke", "#ffffff")
    .call(d3.axisBottom(x).tickFormat(""));

    svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
            (height + 20) + ")")
    .style("text-anchor", "middle")
    .text("Episodes (hover for more details)")
    .attr("fill", "#1db954");

    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dx", ".5em");

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "0.7em")
    .style("text-anchor", "middle")
    .text("IMDB Rating")
    .attr("fill", "#1db954");

    if(bar){
    	 svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(d.season_episode);
        })
        .attr("width", x.bandwidth())
        .attr("y", function(d) {
          return y(d.imdbRating);
        })
        .attr("height", function(d) {
          return height - y(d.imdbRating);
        })
        .attr("fill", function(d){ return getColorForRating(d.imdbRating); })
        .on("mouseover", function(d) {
          div.transition()
          .duration(10)
          .style("opacity", .9);

          var season = d.season_episode.split('.')[0];
          var episode = d.season_episode.split('.')[1];

          div.html("S" + season + "E" + episode + ", " + d.imdbRating + "<br><br> Click to IMDB")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");

        })
        .on("mousemove", function() {
          return div.style("top",
                           (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
          .duration(10)
          .style("opacity", 0);
        })
        .on("click", function(d){
          var url = "http://imdb.com/title/" + d.imdbID;
          window.open(url, '_blank');
        });
    } else {
    	// define the line
    	var valueline = d3.line()
    	    .x(function(d) { return x(d.season_episode); })
    	    .y(function(d) { return y(d.imdbRating); });

    	svg.append("path")
    		.data([data])
    		.attr("class", "line")
    		.attr("d", valueline);

        var selectCircle = svg.selectAll(".circle")
    	.data(data);

    	selectCircle.enter().append("circle")
        .attr("class", "circle")
        .attr("r", 4)
        .attr("cx", function(d) {
          return x(d.season_episode);
        })
        .attr("cy", function(d) {
          return y(d.imdbRating);
        })
        .attr("fill", function(d){ return getColorForRating(d.imdbRating); })
        .on("mouseover", function(d) {
          div.transition()
          .duration(10)
          .style("opacity", .9);

          var season = d.season_episode.split('.')[0];
          var episode = d.season_episode.split('.')[1];

          div.html("S" + season + "E" + episode + ", " + d.imdbRating + "<br><br> Click to IMDB")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");

        })
        .on("mousemove", function() {
          return div.style("top",
                           (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
          .duration(10)
          .style("opacity", 0);
        })
        .on("click", function(d){
          var url = "http://imdb.com/title/" + d.imdbID;
          window.open(url, '_blank');
        });
    }        
}
