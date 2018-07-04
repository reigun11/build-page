var yourApiKey = 'AIzaSyAdPfG1S6HBLhQWnKeOmFWwybir8sLBIgk'; //Jim's Key

var channelName = 'VAGAStecnologia';
var vidCount = 4;
var vidHeight = 100;
var vidWidth = 300;

$(document).ready(function () {

    //get playlists based on channel
    $.get(
        "https://www.googleapis.com/youtube/v3/channels", {
            part: 'contentDetails',
            forUsername: channelName,
            key: yourApiKey
        },
        function (data) {
            $.each(data.items, function (i, item) {
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
            function (data) {
                var output;
                var outputMain;

                $('#results').html('');

                $.each(data.items, function (i, item) {
                    console.log(item);
                    vidTitle = item.snippet.title;
                    videoID = item.snippet.resourceId.videoId;
                    vidDate = item.snippet.publishedAt;
                    vidDesc = item.snippet.description;
                    vidThumb = item.snippet.thumbnails.medium.url;

                    var date = new Date(vidDate);
                    var viewDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                    var viewCountId = "viewCount" + i;
                    output =
                    '<li class="item" data-key="'+videoID+'" data-titl="'+vidTitle+'" data-desc="'+vidDesc+'" data-date="'+viewDate+'" >'
                        +'<div class="media">'
                            + '<a href="#" class="pull-left"><img src="' + vidThumb + '" class="media-object"></a>'
                            + '<div class="media-body">'
                                +'<p class="title">'+ vidTitle +'</p>'
                                +'<div class="viewbottom"><span class="icon-view"></span> <span class="'+ viewCountId +' views"></span> </div>'
                            +'</div>'
                        +'</div>'
                    '</li>'
                    //'<li  class="item" data-key="'+videoID+'" data-titl="'+vidTitle+'" data-desc="'+vidDesc+'" data-date="'+viewDate+'" ><a target=_blank href="https://www.youtube.com/watch?v=' + videoID + '">' + vidTitle + '</a><a target=_blank  href="https://www.youtube.com/watch?v=' + videoID + '"><img src="' + vidThumb + '" class="thumbnail"></a><span class="' + viewCountId + ' views"></span><span class="date">publish date: ' + vidDate + '</span><p class="description">' + vidDesc + //'</p><iframe height="' + vidHeight + '" width ="' + vidWidth
                    //        + '" src=\"//www.youtube.com/embed/' + videoID + '\"></iframe></li>';


                    $('#results').append(output);

                    getViews(viewCountId);

                    outputMain =
                    '<div class="video"><iframe width="560" height="315" src="https://www.youtube.com/embed/'+videoID+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>'
                    + '<div class="wrapper">'
                    +'<div class="box-tooltip"> <div class="tooltip">'+viewDate+'</div>  <span class="icon-clock"></span></div>'
                    +'<div class="box-tooltip"> <div class="'+ viewCountId +' tooltip views"></div>  <span class="icon-view"></span></div>'
                      + '<p class="title">'
                          + vidTitle
                      +'<p class="text-description">'
                          +vidDesc
                    +'</div>';

                    //append to results list
                    if (i == 0){
                        $('#video').html('');
                        $('#video').append(outputMain);
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
            function (data) {
                $.each(data.items, function (i, item) {
                    $('.'+viewCountId).text(item.statistics.viewCount+' views');
                })
            }
        );
    }

    //getresult
    $('#results').on('click', 'li', function () {
        var id = $(this).attr('data-key');
        var desc = $(this).attr('data-desc');
        var titl = $(this).attr('data-titl');
        var date = $(this).attr('data-date');
        var views = $(this).find( ".views" ).text();
        mainVid(id,titl,desc,date,views);
    });

    //output mainVid
    function mainVid(id,titl,desc,date,views) {

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

    //btn add + videos on page
    $('#resultsLft').on('click', '.btn', function () {
        alert(vidCount)
        vidCount = vidCount + 10;
        getVids();

    });


});
