var epDetails = new Array();
var baseUrl = "http://shivamverma.info/";

$(document).ready(function(){
    function loadTv(imdbId) {
        $.get("http://www.omdbapi.com/?r=json&i=" + imdbId, function(data) {
            $('.loader').show();
            $('#search-input').val(data.Title);
            var totalSeasons = data.totalSeasons;
            var season = 1;
            var callback = function(eps) {
                console.log("Received Season:" + totalSeasons);
                epDetails = epDetails.concat(eps);
                if (season < totalSeasons) {
                    season++;
                    loadSeasonData(imdbId, season, callback);
                } else {
                    render(epDetails);
                    $('.loader').hide();
                }
            };
            loadSeasonData(imdbId, season, callback)
        });
    }

    function loadSeasonData(imdbId, seasonNum, callback) {
        $.get("http://www.omdbapi.com/?r=json&i=" + imdbId + "&season=" + seasonNum, function(data) {
            if (typeof data !== 'undefined' && typeof data.Episodes !== 'undefined') {
                var eps = data.Episodes.filter(function(ep) {
                    return ep.imdbRating != "N/A"
                });
                $.each(eps, function(index, ep) {
                    if (ep.imdbRating == "N/A") {
                        ep.imdbRating = 0;
                    } else {
                        ep.imdbRating = parseFloat(ep.imdbRating);
                    }
                    ep.season_episode = seasonNum + "\." + ep.Episode;
                });
                callback(eps);
            }
        });
    }

    $('#search-input').on('input', function() {
        $('.loader').show();
        var term = $(this).val();
        if(term.length==0){
            $('.loader').hide();
            return;
        }
        getSearchSuggestions(term);
    });

    $('#toggle-chart').on('click', function(){
        bar = !bar;
        render(epDetails);
    });


    function getSearchSuggestions(term) {
        $.get("http://www.omdbapi.com/?type=series&s=" + term, function(data) {
            if (typeof data !== 'undefined' && typeof data.Search !== 'undefined') {
                var suggest = data.Search.splice(0, 4);
                displaySuggestions(suggest);
            }
        });
    }

    var source = $("#suggestion-template").html();
    var template = Handlebars.compile(source);

    function displaySuggestions(searchResults) {
        $('#suggestion-list').empty();

        $.each(searchResults, function(index, result) {
            var html = template(result);
            $('#suggestion-list').append(html);
        });
        $('.loader').hide();
    }

    $(document).on('click', '.suggestion', function() {
        /*
        var movieTitle = $(this).data('title');
        $('#search-input').val(movieTitle);
        $('#suggestion-list').empty();
        $('.loader').show();
        */
        var imdbId = $(this).data('imdb');
        location.href = baseUrl + 'public/imdb-viz/?i=' + imdbId;
        // loadTv(imdbId);
    });

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var imdbId = getParameterByName('i');
    if(typeof imdbId !== 'undefined' && imdbId.trim() != ''){
        loadTv(imdbId);
    }

});
