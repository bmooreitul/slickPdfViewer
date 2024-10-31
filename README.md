# slickPdfViewer
This is a pure/vanilla Javascript PDF viewer with ***no dependencies*** based on open source software [PDF.JS](https://mozilla.github.io/pdf.js/) (4.7.76)<br>

Since all browsers handle an embedded PDF differently, the goal is to seamlessly emulate Chrome's native PDF viewer accross all browsers/platforms.

You can see demos here [Single Page](https://jsfiddle.net/bmooreitul/twcn1d0y/) [Multiple Instances](https://jsfiddle.net/bmooreitul/r57wj9mf/)


## Features
 :heavy_check_mark: Works on Mac/PC for all 4 major browsers (Chrome/Firefox/Safari/Edge)<br>
 :heavy_check_mark: CORS download/print with or without embedding in an iframe.<br>
 :heavy_check_mark: Works with cross domain files (Even when printing a remote pdf from within an embedded iframe)<br>
 :heavy_check_mark: Native Print Dialog<br>
 :heavy_check_mark: Native Search<br>
 :heavy_check_mark: Fullscreen/Presentation Mode<br>
 :heavy_check_mark: No dependencies<br>
 :heavy_check_mark: Responsive<br>
 :x: Netscape/Juno/AOL/Explorer. Not catering to 30 year old "requirements" or other equally ridiculous cases<br>




## In a Nutshell

Most of the time you will only need to use a couple lines of code to render the viewer

:scream: *You dont even need to download or install anything to use the examples below. It can work entirely from the CDN*

```html
<!-- Real code that can be copy and pasted into any website. Super Simple -->
<script src="//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfLoader.min.js"></script>
<script>slickPdfView('//pdfobject.com/pdf/sample.pdf')</script>
```




# Usage

To begin using slickPdf you will need to inclue the library.

```html
<!-- FROM CDN -->
<script src="//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfLoader.min.js"></script>

<!-- OR FROM LOCALLY HOSTED -->
<script src="/path/to/slickPdfLoader.js"></script>
```

## Basic Example

The below example will render the viewer as html directly to the body element.

```javascript
slickPdfView('//pdfobject.com/pdf/sample.pdf');
```

## Basic Example Contained

The below example will render the viewer as html contained in a specific element.

```html
<!-- THE ELEMENT THAT WILL CONTAIN THE RENDERED VIEW -->
<div id="appendToMe"></div>
<script>
  slickPdfView('#appendToMe', '//pdfobject.com/pdf/sample.pdf');
</script>
```

## Basic Example Multiple Instances on the same page

The below example will render the viewer as html contained in 2 specific elements.

```html
<div id="append-to-me-1" style="width:500px; height:500px;"></div>
<div id="append-to-me-2" style="width:500px; height:500px;"></div>
<script>
  slickPdfView('#append-to-me-1','//pdfobject.com/pdf/sample.pdf');
  slickPdfView('#append-to-me-2','//pdfobject.com/pdf/sample.pdf');
</script>
```

## Basic Example With Extra Options

The below example will render the viewer as html and using additional options.

```javascript
slickPdfView({
  fileName  : 'custom-file-name.pdf', //CUSTOM NAME WHEN DOWNLOADING/PRINTING AND IN THE TITLE BAR
  fileUrl   : 'https://example.com/path/to/file.pdf', //THE PATH TO THE PDF (CAN BE A FULL URL OR A RELATIVE PATH)
  zoom      : 1.25, //ZOOM IN TO 125% WHEN LOADED
  startPage : 2, //DISPLAY THE 2nd PAGE WHEN LOADED
});
```

## Getting the Instance

```javascript
var viewer1;
slickPdfView('//pdfobject.com/pdf/sample.pdf').then( instance => {
  viewer1 = instance;
});
```

## Arguments

The core class accepts 2 initial arguments. `wrapperSelector` and `options`.
```javascript
/**
 *  Instantiate a new SlickPdfViewer class.
 *
 * Instantiate a new SlickPdfViewer class and apply the arguments.
 * If the only argument supplied is `wrapperSelector`, then `options` is set to the value provided in `wrapperSelector` and `wrapperSelector` is set to 'body'.
 * If the `options` value is a string, then the `options` value is converted to `options = {fileUrl: options}`.
 * If the `options.fileUrl` is set, the class will automatically attempt to render the viewer.
 * If the `options.fileUrl` is not set, the viewer is not automatically rendered.
 *
 * @param {string|object|null} wrapperSelector - The element that the viewer will be appended to as a child. 
 * @param {string|object|null} options - The options for initial rendering.
 *
 * @return {Promise} Returns a promise object that resolves to a SlickPdfViewer instance.
 */
slickPdfView(wrapperSelector, options)
```


### Argument Transformation
  - If `wrapperSelector` is provided and `options` is not provided, the `options` value is set to the value passed for `wrapperSelector` and `wrapperSelector` is changed to `body`.
  - If `options` is a string, `options` is changed to `options = {fileUrl: options}` and then merged with the default `options`.


This allows for a flexible combination of use cases.
```javascript

//THIS WILL RENDER THE VIEWER DIRECTLY TO THE BODY ELEMENT
slickPdfView('/path/to/file.pdf');

//THIS WILL RENDER THE VIEWER IN A SPECIFIC ELEMENT
slickPdfView('#appendToMe', '/path/to/file.pdf');

//THIS WILL RENDER THE VIEWER DIRECTLY TO THE BODY ELEMENT AND SET THE FILE NAME
slickPdfView({
  fileName: 'new-name.pdf',
  fileUrl: '/path/to/file.pdf'
});

//THIS WILL RENDER THE VIEWER DIRECTLY TO A SPECIFIC ELEMENT AND SET THE FILE NAME
slickPdfView('#apendToMe > .someElement > #someElementId', {
  fileName: 'new-name.pdf',
  fileUrl: '/path/to/file.pdf'
});
```

### Kitchen Sink Example... Using all options, events, methods and properties

```html
<script src="//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfLoader.min.js"></script>

<div id="appendToMe"></div>

<script>
var pdfUrl = '//assets.website-files.com/603d0d2db8ec32ba7d44fffe/603d0e327eb2748c8ab1053f_loremipsum.pdf';
slickPdfView('#appendToMe', {
    fileName       : 'custom-name.pdf',     //CUSTOM NAME
    fileUrl        : pdfUrl,                //URL
    zoom           : 'page-height',         //INITIAL SCALE
    startpage      : 5,                     //SHOW THE 3rd PAGE WHEN LOADED
    padding        : 60,                    //ADD 60px PADDING TO THE INSIDE OF THE VIEWER
    minScale       : 0.1,                   //LIMIT THE MINIMUM ZOOM TO 10%
    maxScale       : 5,                     //LIMIT THE MAX ZOOM TO 500%
    thumbnails     : true,                  //DISPLAY THE THUMBNAIL PANEL ON LOAD

    //LISTEN FOR ZOOM CHANGE
    onZoomChange: zoom => {
        console.log('zoom changed', zoom, this);
    },

    //LISTEN FOR PAGE CHANGE
    onPageChange: pageNumber => {
        console.log('page changed', pageNumber, this);
    },
}).then(instance => {

    console.log('viewer ready', instance);  //INSTANCE HAS LOADED
    
    //DYNAMIC ATTRIBUTES (GETTERS)
    console.log(instance.currentPage);      //GET THE CURRENT PAGE NUMBER
    console.log(instance.wrapperEle);       //GET THE WRAPPER ELEMENT HTML OBJECT
    console.log(instance.frameElement);     //GET THE FRAME ELEMENT HTML OBJECT
    console.log(instance.zoom);             //GET THE CURRENT ZOOM PERCENT
    console.log(instance.fileName);         //GET THE PDF FILE NAME
    console.log(instance.pageCount);        //GET THE NUMBER OF PAGES
    console.log(instance.info);             //GET THE DOCUMENT INFORMATION
    console.log(instance.viewerApp);        //GET THE PDFJS VIEWER APPLICATION
    
    //DYNAMIC ATTRIBUTES (SETTERS)
    instance.zoom       = '50%';            //SET THE ZOOM TO 50%
    instance.fileName   = 'new-name.pdf';   //RENAME THE FILE

    //METHODS
    console.log(instance.Id());             //GET THE UNIQUE ID FOR THIS INSTANCE
    instance.zoomIn();                      //INCREASE ZOOM
    instance.zoomOut();                     //DECREASE ZOOM
    instance.goToPage(3);                   //JUMP TO THE 3rd PAGE
    instance.fitPageWidth();                //ZOOM IN/OUT TO FULL PAGE WIDTH
    instance.fitPageHeight();               //ZOOM IN/OUT TO FULL PAGE HEIGHT
    console.log(instance.currentPageObj()); //GET THE CURRENT PAGE AS AN OBJECT
    console.log(instance.pages());          //GET AN ARRAY OF PAGE OBJECTS
    instance.print();                       //TRIGGER THE PRINT DIALOG
    instance.download();                    //TRIGGER DOWNLOAD
});
</script>
```

# Options

Here are the default options when instantiating the SlickPdfView class.

```javascript
{
  fileName       : null,
  fileUrl        : null,
  zoom           : 'auto',
  startpage      : 1,
  padding        : 40,
  minScale       : 0.25,
  maxScale       : 4,
  thumbnails     : null,
}
```


| Name | Description |
| --- | --- |
| fileUrl | The location of the pdf. This can be a full url or a relative path. |
| fileName | *Optional* name to display in the titlebar and when downloading.<br><br> *If not provided, this value is automatically set from the file headers returned from the `fileUrl`* |
| zoom | *Optional* value to scale the rendered pdf when loaded.<br><br>**Accepted Values:**<br> - `auto` Automatically Scale the pdf to fit in the viewport<br> - `page-width` Scale the pdf to with the width of the viewport<br> - `page-height` Scale the pdf to fit the height of the viewport<br> - A numeric value like `90` for 90%, `150` for 150% etc. |
| startpage | *Optional* numeric value to specify which page is initially displayed |
| padding | *Optional* numeric value for how much space to add to the inside of the viewer |
| minScale | *Optional* numeric value to limit zooming out. For example `0.25` for 25% `0.5` for 50% etc |
| maxScale | *Optional* numeric value to limit zooming in. For example `1.25` for 125% `4` for 400% etc |
| thumbnails | *Optional* value to display thumbnail sidebar. `true` to show, `false` to hide, or `null` <br> *This value is automatically set from local storage if the user has toggled this option previously and this is not provided/is null.* |


## All Features Confirmed working in these browsers</summary> 
:heavy_check_mark: Chrome Version 130.0.6723.58 (Mac)<br>
:heavy_check_mark: Firefox 131.0.2 (Mac)<br>
:heavy_check_mark: Safari 17.6 (Mac)<br>
:heavy_check_mark: Edge Version 129.0.2792.89 (Windows)<br>
:heavy_check_mark: Chrome Version 130.0.6723.70 (Windows)<br>
:heavy_check_mark: Firefox 131.0.3 (Windows)<br>

## Untested browsers:
- Opera (Mac)
- Opera (Windows)
- Safari (Windows)
- Brave (Windows)
- Brave (Mac)
