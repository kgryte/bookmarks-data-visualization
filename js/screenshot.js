/**
*
*   Desc:
*       - Use phantomjs to capture screenshots.
*
*   Author:
*       Kristofer Gryte. http://www.kgryte.com
*
*   Copyright (c) 2013.
*
*
*
*   References:
*       https://github.com/ariya/phantomjs/wiki/Screen-Capture
*       https://github.com/hggh/phantomjs-screenshots/blob/master/js/screenshot.js
*       https://github.com/ariya/phantomjs/blob/master/examples/render_multi_url.js
*
*   Useful additional commands:
*       - mogrify -format png -resize "200x125>" *.png  --> batch resize
*       - rename 's/(screenshot)/thumbnail/g' *.png  --> batch rename
*       - rename 's/(1200x750)/200x125/g' *.png --> batch rename
*
*   TODO:
*       [1] Need to remove punctuation from visualization titles when creating the file names! regex
*
*/

// Load modules:
var webpage = require('webpage'),
    fs = require('fs'),
    page, index = 0, filename,
    delay = 30000,
    json, data,
    width = 1200, height = 750;

// Attempt to load our data file:
try {
    json = fs.read('../../data/bookmarks.json');
} catch(e) {
    console.log(e);
    phantom.exit();
};

// Parse the file:
data = JSON.parse( json );

console.log( data.bookmarks.length );


// Start the capture process:
screenshot();


function screenshot() {

    // Re-initialize the page variable:
    page = null;

    // Create a new page:
    page = webpage.create();

    // Define our big we want our screenshots to be:
    page.viewportSize = {
        width: width,
        height: height
    };

    page.clipRect = {
        top: 0,
        left: 0,
        width: width,
        height: height
    }; // this ensures that the output is exactly the dimensions we want...

    // Set the userAgent:
    page.settings.userAgent = 'Phantom.js screenshot';

    // As long as the index is less than the total number of bookmarks, keep capturing screenshots:
    if (index < data.bookmarks.length) {

        // Create the filename:
        filename = 'screenshot_'+ data.bookmarks[index].title.toLowerCase().replace(/ /g, '_') +'_'+width+'x'+height+'px.png';

        // Open the page:
        page.open( data.bookmarks[ index ].url, function( status ) {

            if (status === 'success') {

                // Wait for a delay period to allow the web pages to initialize:
                window.setTimeout( function() {

                    // Set the page background-color to white, if no background-color is set:
                    page.evaluate(function() {
                        if (!document.body.bgColor) {
                            document.body.bgColor = 'white';
                        };
                    });

                    // Render the page to a *.png:
                    page.render( filename );

                    //
                    console.log('Screenshot captured. Saved the url "' + data.bookmarks[index].url + '" to file: ' + filename);

                    // Move to the next bookmark:
                    index++;

                    // Close the page:
                    page.close();

                    // Recursively call the screenshot function:
                    screenshot();

                }, delay);

            } else {
                // Failed to load the page; therefore unable to capture a screenshot.
                console.log('Unable to capture a screenshot for: ' + bookmarks[index].url);
            };

        });

    } else {
        // No more bookmarks to screenshot:
        phantom.exit();
    };

}; // end FUNCTION screenshot()





