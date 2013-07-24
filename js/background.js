/**
*
*
*
*
*
*
*
*
*/

chrome.browserAction.onClicked.addListener( function() {

    $.ajax({
        dataType: 'json',
        url: 'data/bookmarks.json',
        success: success,
        async: false
    });

    function success(data) {

        // Open each bookmark in a new tab:
        $.each(data.bookmarks, function(id, val) {

            chrome.tabs.create( {url: val.url} );

        });

    };

});

