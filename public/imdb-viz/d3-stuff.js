function render(data) {
    d3.select("svg").remove();

    var margin = {
            top: 40,
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
    y.domain([0, 10]);


    var div = d3.select("body").append("div")
        .attr("class", "d3-tip")
        .style("opacity", 0);

    svg.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x).tickFormat(""));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("IMDB Rating");

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
        .on("mouseover", function(d) {
            div.transition()
                .duration(10)
                .style("opacity", .9);

            var season = d.season_episode.split('.')[0];
            var episode = d.season_episode.split('.')[1];

            div.html("S" + season + "E" + episode + "<br>" + d.imdbRating)
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
        });
}