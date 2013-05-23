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
    renderBox   :"#galleryHTML",
    // Flickr Set Id
    setId       :'',
    // Flickr API Key
    APIKey      :'36a6c3ca5158f79fe09ab61e95bd4901',
    // Flickr Photo Set URL
    FlickrAPIURL:'http://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&format=json&api_key={{APIKey}}&extras=url_o,url_q&photoset_id={{setId}}',
    // the HTML templates to create the Gallery
    HTMLtemplates   : {
        thumbnails : '<ul data-contentid="content-{{id}}" class="thumbwrap">{{#photo}}<li><a class="imageLink" href="{{url_o}}" title=""><img src="{{url_q}}" width="100"></a></li>{{/photo}}</ul>',
        flickrLink : '<p class="flickrLink"><a target="_blank" href="http://www.flickr.com/photos/trhoppe/sets/{{setId}}">View photos on Flickr instead</a></p>',
        royalSliderCode : '<div style="display:none;"><div id="content-{{id}}" class="royalSlider rsDefault" style="width:100%; height:100%;">{{#photo}}<a class="rsImg" href="{{url_o}}"></a>{{/photo}}</div></div>'
    },

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

        if(self.setId === '') {
            alert('Not a valid set Id');
            return false;
        }

        // call the Flickr API
        self._createURLAndCallAPI();

    },

    _createURLAndCallAPI: function() {

        var self = this;

        self.FlickrAPIURL = Mustache.render(self.FlickrAPIURL,{'APIKey':self.APIKey,'setId':self.setId});

        $.ajax({
            url: self.FlickrAPIURL,
            dataType: "jsonp",
            jsonp: 'jsoncallback'
        })
        .done(function(data) { 

            if(data.photoset.photo.length === 0) {
                alert('Your photo set has no photos :(');
            }
            else {
                self._processAPIResponse(data); 
            }

        })
        .fail(function() { alert("You either provided an invalid or non existent Flickr Set Id"); });
    },

    _processAPIResponse: function(data) {

        var self = this,
            html = '';

        html += Mustache.render(self.HTMLtemplates.thumbnails,data.photoset);
        html += Mustache.render(self.HTMLtemplates.flickrLink,{'setId':self.setId});
        html += Mustache.render(self.HTMLtemplates.royalSliderCode,data.photoset);

        $(self.renderBox).empty().text(html);

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
