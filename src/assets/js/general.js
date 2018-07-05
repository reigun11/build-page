var yourApiKey = 'AIzaSyAdPfG1S6HBLhQWnKeOmFWwybir8sLBIgk'; //Jim's Key

var channelName = 'VAGAStecnologia';
var vidCount = 4;
var vidHeight = 100;
var vidWidth = 300;

$(document).ready(function() {

    //get playlists based on channel
    $.get(
        "https://www.googleapis.com/youtube/v3/channels", {
            part: 'contentDetails',
            forUsername: channelName,
            key: yourApiKey
        },
        function(data) {
            $.each(data.items, function(i, item) {
                console.log(item);
                playerID = item.contentDetails.relatedPlaylists.uploads;
                getVids(playerID);
            })
        }
    );

    function getVids() {

        $.get(
            "https://www.googleapis.com/youtube/v3/playlistItems", {
                part: 'snippet',
                maxResults: vidCount,
                playlistId: playerID,
                key: yourApiKey
            },
            function(data) {
                var output;
                var outputMain;

                $('#results').children('.frameborder').html('');

                $.each(data.items, function(i, item) {
                    console.log(item);
                    vidTitle = item.snippet.title;
                    videoID = item.snippet.resourceId.videoId;
                    vidDate = item.snippet.publishedAt;
                    vidDesc = item.snippet.description;
                    vidThumb = item.snippet.thumbnails.medium.url;

                    var date = new Date(vidDate);
                    var viewDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                    var viewCountId = "viewCount" + i;
                    var getClass = $('#results > .frameborder').attr('data-key');

                    output =
                        '<div class="item ' + getClass + '" data-key="' + videoID + '" data-titl="' + vidTitle + '" data-desc="' + vidDesc + '" data-date="' + viewDate + '" >' +
                        '<div class="media">' +
                        '<a href="#" class="pull-left"><img src="' + vidThumb + '" class="media-object"></a>' +
                        '<div class="media-body">' +
                        '<p class="title">' + vidTitle + '</p>' +
                        '<div class="viewbottom"><span class="icon-view"></span> <span class="' + viewCountId + ' views"></span> </div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    $('#results > .frameborder').append(output);

                    getViews(viewCountId);

                    //show the Main video on page destaque
                    outputMain =
                        '<div class="video"><iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoID + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>' +
                        '<div class="wrapper">' +
                        '<div class="box-tooltip"> <div class="tooltip">' + viewDate + '</div>  <span class="icon-clock"></span></div>' +
                        '<div class="box-tooltip"> <div class="' + viewCountId + ' tooltip views"></div>  <span class="icon-view"></span></div>' +
                        '<p class="title">' +
                        vidTitle +
                        '<p class="text-description">' +
                        vidDesc +
                        '</div>';

                    //append to results list
                    if (i == 0) {
                        $('#video').html('');
                        $('#video').append(outputMain);
                    }
                    //watch page video and show number of videos
                    if (window.location.hash) {
                        var hash = document.URL.substr(document.URL.indexOf('#') + 1);
                        var searchTerm = hash;
                        vidCount = 50;
                        $('h2').text('Resultados para: ' + hash)
                        $('.item:not(:contains('+ searchTerm + '))').hide();
                    }
                })
            }
        );
    }

    function getViews(viewCountId) {
        $.get(
            "https://www.googleapis.com/youtube/v3/videos", {
                part: 'statistics',
                id: videoID,
                key: yourApiKey
            },
            function(data) {
                $.each(data.items, function(i, item) {
                    $('.' + viewCountId).text(item.statistics.viewCount + ' views');
                })
            }
        );
    }

    //getresult
    $('.frameborder').on('click', '.item', function() {
        var id = $(this).attr('data-key')
        var desc = $(this).attr('data-desc');
        var titl = $(this).attr('data-titl');
        var date = $(this).attr('data-date');
        var views = $(this).find(".views").text();
        mainVid(id, titl, desc, date, views);
    });

    //output mainVid
    function mainVid(id, titl, desc, date, views) {

        $('#video').html(`
            <div class="video"><iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>
            <div class="wrapper">
                <div class="box-tooltip"> <div class="tooltip">${date}</div>  <span class="icon-clock"></span></div>
                <div class="box-tooltip"> <div class="tooltip views">${views}</div>  <span class="icon-view"></span></div>
                <p class="title">${titl}</p>
                <p class="text-description">${desc}</p>
            </div>
        `);
    }

    //btn add vidos on page destaque
    $('#resultsLft').on('click', '.btn', function() {
        vidCount = vidCount + 10;
        getVids();

    });

    //watch page video and show number of videos
    if ($('#resultsVids').length){
        var vidCount = 9;
        if (window.location.hash) {
        var  vidCount = 50;
        }
    }

    //watch page video and show number of videos
    if ($('#resultsLft').length){
        var vidCount = 4;
    }

    //btn add videos on page video
    $('#resultsVids').on('click', '.btn', function() {
        vidCount = vidCount + 10;
        getVids();
    });

    //btn add videos on page video
    $('#myInput').keydown(function(e) {
        if (e.which === 13) {
            window.location.href = 'videos.html#'+$('#myInput').val();
            location.reload();
        }
    });


});
