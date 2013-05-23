/**
 * @fileOverview 
 * This uses the Flickr API to grab a particular set via id and returns template formatted HTML image gallery to drop into my wordpress blog
 * 
 * @author <a href="mailto:thoppe@webmd.net">Tom Hoppe</a>
 *
 * @version 1
 */
var flickrGallery = {

    /*==CONFIG================================================*/

    // Selector of default div to place HTML into
    selector    :"#galleryHTML",
    // Flickr Set Id
    setId       :'',

    /*==FUNCTIONS================================================*/

    /*
    * Init function that kicks off module
    * 
    * @param {Object} Object with which we extend ourselves to pass any additional options or overrides
    *
    * @require jQuery
    *
    * @public
    */
	init:function(options){

        var self = this;

        $.extend(self, options);
    }
};

$(function(){

    var $flickrSetId = $('#flickrSetId');

    $flickrSetId.on('focus', function(){
        if($(this).val() === 'Flickr Set ID') {
            $(this).val('');
        } 
    });

    $('#flickrForm').on('submit', function(){
        var flickrSetId = $flickrSetId.val();

        if(flickrSetId === '' || flickrSetId === 'Flickr Set ID') {
            alert('Put in a valid Flickr Set Id');
            return false;
        }

        flickrGallery.init({setId:flickrSetId, selector:'#galleryHTML'});

        return false;
    });

});
