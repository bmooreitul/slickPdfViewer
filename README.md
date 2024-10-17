# slickPdfViewer
A pure Javascript PDF reader with no dependencies.

The original purpose of this package was to resolve cross browser display issues with embedding a pdf in an iframe. 
Specifically Safari refuses to show any toolbar options when for pdfs embedded in iframes.

## Features
 :heavy_check_mark: Cross browser support<br>
 :heavy_check_mark: Iframe support<br>
 :heavy_check_mark: Native Print Dialog<br>
 :heavy_check_mark: Fullscreen Mode<br>
 :heavy_check_mark: No dependencies<br>
 :heavy_check_mark: Responsive<br>

### Demo
You can see a demo here https://laraveldocs.itulbuild.com/examples/slickPdfViewer/1



## What it looks like
![screenshot](examples/example.png)

# Usage

## Basic Example

The below example will render the viewer as html.

```html
<!-- INCLUDE THE PACKAGE FROM CDN -->
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfViewer.min.js"></script>

<script>
  slickPdfView('https://example.com/path/to/file.pdf');
</script>
```

## Basic Example Contained

The below example will render the viewer as html contained in a specific element.

```html
<!-- THE ELEMENT THAT WILL CONTAIN THE RENDERED VIEW -->
<div id="appendToMe"></div>

<!-- INCLUDE THE PACKAGE FROM CDN -->
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfViewer.min.js"></script>

<script>
  slickPdfView('#appendToMe', 'https://example.com/path/to/file.pdf');
</script>
```

## Basic Example With Extra Options

The below example will render the viewer as html and using additional options.

```html
<!-- INCLUDE THE PACKAGE FROM CDN -->
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfViewer.min.js"></script>

<script>
  slickPdfView({
    fileName  : 'custom-file-name.pdf', //CUSTOM NAME WHEN DOWNLOADING/PRINTING AND IN THE TITLE BAR
    fileUrl   : 'https://example.com/path/to/file.pdf', //THE PATH TO THE PDF (CAN BE A FULL URL OR A RELATIVE PATH)
    zoom      : 1.25, //ZOOM IN TO 125% WHEN LOADED
    startPage : 2, //DISPLAY THE 2nd PAGE WHEN LOADED
  });
</script>
```

## Iframed Example

The below example will render the viewer inside of an iframe element.

```html
<!-- THE ELEMENT THAT WILL CONTAIN THE RENDERED VIEW -->
<div id="appendToMe"></div>

<!-- INCLUDE THE PACKAGE FROM CDN -->
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfViewer.min.js"></script>

<script>
  slickPdfIframed('#appendToMe', 'https://example.com/path/to/file.pdf');
</script>
```

# Arguments

```javascript
constructor(wrapperSelector, options)
```
<br>

The core class accepts 2 initial arguments. `wrapperSelector` and `options`.<br><br>

If `wrapperSelector` is provided and `options` is not provided, the `options` value is set to the value passed for `wrapperSelector` and `wrapperSelector` is changed to `body`.<br><br>

If `options` is a string, `options` is changed to `options = {fileUrl: options}` and then merged with the default `options`.<br><br><br>

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

//KITCHEN SINK EXAMPLE: THIS WILL RENDER THE VIEWER DIRECTLY TO A SPECIFIC ELEMENT AND SET SEVERAL OPTIONS
slickPdfView('#appendToMe', {
  fileName       : 'new-name.pdf',      //CUSTOM NAME
  fileUrl        : '/path/to/file.pdf', //URL
  zoom           : 'page-height',       //INITIAL SCALE
  startpage      : 3,                   //SHOW THE 3rd PAGE WHEN LOADED
  padding        : 60,                  //ADD 60px PADDING TO THE INSIDE OF THE VIEWER
  minScale       : 0.1,                 //LIMIT THE MINIMUM ZOOM TO 10%
  maxScale       : 5,                   //LIMIT THE MAX ZOOM TO 500%
  uniqueId       : 'abcdefg123456',     //SET A CUSTOM UNIQUE ID FOR THE RENDERED ELEMENTS
  thumbnails     : true,                //DISPLAY THE THUMBNAIL PANEL ON LOAD
  scrollBehavior : 'instant'            //JUMP BETWEEN PAGES INSTANTLY
});
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
  uniqueId       : null,
  thumbnails     : false,
  scrollBehavior : 'smooth'
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
| uniqueId | *Optional* value to use as a unique id for the rendered viewer to support multiple viewers on the same page.<br><br> *This is set automatically if not provided* |
| thumbnails | *Optional* value to display thumbnail sidebar.<br> *This value is automatically set from local storage if the user has toggled this option previously* |
| scrollBehavior | *Optional* value to control how the viewer jumps between pages. <br><br>**Accepted Values:**<br> - `smooth` Smoothly animate scrolling to a new page <br> - `instant` Instantly jump to the new page <br> - `auto` Use the system scroll behavior.<br><br> *For more information see* https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#behavior |



