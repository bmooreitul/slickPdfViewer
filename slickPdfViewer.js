function slickPdfView(wrapperSelector, settings){ return new SlickPdfView(wrapperSelector, settings)};
function slickPdfIframed(wrapperSelector, settings){ return SlickPdfView.iframed(wrapperSelector, settings)};

class SlickPdfView {

	settings = {
		fileName 	: null,
		fileUrl 	: null,
		zoom 		: 'auto',
		startpage 	: 1,
		padding 	: 40,
		minScale 	: 0.25,
		maxScale 	: 4,
		wrapper 	: 'body',
		uniqueId 	: null,
		thumbnails 	: false,
	};
	requestedOptions 	= {};
	viewer 				= null;

	//SETUP THIS CLASS WITH THE TARGET ELEMENT AND ANY SETTINGS
	constructor(wrapperSelector, settings){

		//SET THE FILEURL SETTING IF SETTINGS IS A STRING
		if(typeof settings == 'string') settings = {fileUrl: settings};

		//IF THE WRAPPERSELECTOR IS AN OBJECT AND NO SETTINGS WERE USE IT AS SETTINGS AND SET WRAPPERSELECTOR TO USE BODY
		if(typeof wrapperSelector == 'object' && typeof settings == 'undefined'){
			settings 		= wrapperSelector;
			wrapperSelector = 'body';
		}

		//IF THE WRAPPERSELECTOR IS A STRING AND NO SETTINGS WERE PASSED THEN ASSUME IT IS THE FILEURL
		if(typeof wrapperSelector == 'string' && typeof settings == 'undefined'){
			settings 		= {fileUrl: wrapperSelector};
			wrapperSelector = 'body';
		}

		//MERGE THE SETTINGS
		if(typeof settings === 'object' && !Array.isArray(settings) && settings !== null) for(var x in settings) this.settings[x] = settings[x];

		//CREATE A UNIQUE ID
		this.settings.uniqueId 		= Date.now().toString(36)+Math.random().toString(36).substring(2, 12).padStart(12, 0);

		//SET THE WRAPPER
		this.settings.wrapper 		= wrapperSelector;

		//TRY TO PARSE THE LOCAL STORAGE SETTINGS
		var localStorageSettings 	= localStorage.getItem('slickPdfSettings');
		if(typeof localStorageSettings !== 'string'){
			localStorage.setItem('slickPdfSettings', JSON.stringify({}));
			localStorageSettings = localStorage.getItem('slickPdfSettings');
		}

		//TRY TO USE THE PARSED LOCAL STORAGE SETTINGS
		try{
			var localStorageDecoded = JSON.parse(localStorageSettings);
			if(typeof localStorageDecoded == 'object') for(var x in localStorageDecoded) this.settings[x] = localStorageDecoded[x];
		}
		catch{}

		//RENDER THE VIEWER AS LONG AS A FILEURL IS PROVIDED
		if(this.settings.fileUrl != null) this.render();

		//RETURN THIS CLASS
		return this;
	}

	//RENDER THE VIEWER IN AN IFRAME
	static iframed(wrapperSelector, settings){

		//FIND THE SCRIPT TO USE FOR THE IFRAME
		var scripts = document.getElementsByTagName('script');
		var SlickPdfViewerScriptSrc;
		for(var x in scripts){
			if(typeof scripts[x].src != 'undefined' && scripts[x].src.indexOf('slickPdfViewer')){
				SlickPdfViewerScriptSrc = scripts[x].src;
				break;
			}
		}

		//SET THE FILEURL SETTING IF SETTINGS IS A STRING
		if(typeof settings == 'string') settings = {fileUrl: settings};
		
		//IF THE WRAPPERSELECTOR IS AN OBJECT AND NO SETTINGS WERE USE IT AS SETTINGS AND SET WRAPPERSELECTOR TO USE BODY
		if(typeof wrapperSelector == 'object' && typeof settings == 'undefined'){
			settings 		= wrapperSelector;
			wrapperSelector = 'body';
		}

		//IF THE WRAPPERSELECTOR IS A STRING AND NO SETTINGS WERE PASSED THEN ASSUME IT IS THE FILEURL
		if(typeof wrapperSelector == 'string' && typeof settings == 'undefined'){
			settings 		= {fileUrl: wrapperSelector};
			wrapperSelector = 'body';
		}

		//IF NO SETTINGS WERE PASSED THEN INIT AN EMPTY OBJECT
		if(typeof settings !== 'object') settings = {};
		
		//BUILD THE IFRAME
		var iframe 			= document.createElement('iframe');
		var wrapperEle 		= document.querySelector(wrapperSelector);
		var loaded 			= false;
		var viewerInstance 	= null;
		
		//ADD THE IFRAME TO THE WRAPPER ELEMENT
		wrapperEle.appendChild(iframe);

		//SET THE IFRAME ATTRIBUTES
		iframe.setAttribute('style', 'width:100%; height:100vh; border:0; margin:0; padding:0;');
		iframe.classList.add('sp-viewer-iframe');
		iframe.sandbox = '';

		//BUILD THE IFRAME HTML
		var html = `<!DOCTYPE html>
			<html lang="en-US">
			    <head>
			        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
			        <title></title>
			        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"/>
			    </head>
			    <body onload="parent.viewerInstance = window.spViewerInstance">
			        <script type="text/javascript" src="`+SlickPdfViewerScriptSrc+`"></script>
			        <script>
			        	window.spViewerInstance = new SlickPdfView('body', `+JSON.stringify(settings)+`);
			        </script>
			    </body>
			</html>`;

		//SET THE IFRAME CONTENT
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write(html);
		iframe.contentWindow.document.close();

		//SEND BACK THE IFRAME AND VIEWER
		return {iframe: iframe, viewer: function(){ return iframe.contentWindow.spViewerInstance; }};
	}

	//CREATE A DOM ELEMENT
	static createElement(html){
		var ele = document.createElement('div');
		ele.innerHTML = html.trim();
		return ele.firstChild;
	}

	//TRIGGER A DOM EVENT
	triggerEvent(name, data){
		try{
			if(typeof data == 'undefined') data = {};
			var target = window.top !== window.self && typeof window.parent.document != 'undefined' ? window.parent.document : document;
			target.dispatchEvent(new CustomEvent(name, {detail: {viewer: this.viewer, data: data}}))
		}
		catch{}
	}

	//PARSE URL PARAMETERS FROM THE SETTINGS
	urlParams(){
		var res = {};
		var url = new URL(this.settings.fileUrl, window.location.origin);
		this.settings.fileUrl = url.toString();
        (url.search || "?").substr(1).split("&").forEach(function(part) {part && (part = part.split("=", 2), res[decodeURIComponent(part[0])] = decodeURIComponent(part[1])) });
        this.requestedOptions = res;
        try{
        	res.title = url.pathname.split('/').pop();
        	if(this.settings.fileName !== null) res.title = this.settings.fileName;
        }
        catch{}
        return res;
	}

	//RENDER THE VIEWER
	render(initializeCallback){
		var fileUrl 		= this.settings.fileUrl;
        var parsedUrlParams = this.urlParams(new URL(this.settings.fileUrl, window.location.origin));
        var that 			= this;
        this.triggerEvent('show.it.slickpdf');
        this.renderCss();
        this.renderElements();
        fileUrl ? (this.getFile(function(fileInfo){
            if(that.settings.fileName != null) parsedUrlParams.title = that.settings.fileName;
            if(that.settings.fileName === null && parsedUrlParams.title) that.settings.fileName = parsedUrlParams.title;
            that.settings = {...parsedUrlParams, ...that.settings};
            that.viewer = new SlickPdfViewer(that, initializeCallback);
        })) : that.viewer = new SlickPdfViewer(that, initializeCallback);
        return this;
	}

	//BUILD THE CSS FOR THE VIEWER IF NEEDED
	renderCss(){

		//CHECK IF THE STYLESHEET EXISTS
		var styleExists = !!document.getElementById('sp-viewer-styles');

		//IF THE STYLESHEET DOESNT EXIST
		if(!styleExists){

			//DEFINE THE CSS ELEMENT
			var styleEle = `<style id="sp-viewer-styles">
	        	html.sp-main-html,body.sp-main-body {position:relative; height:100%; padding:0px; margin:0px; overflow:hidden !important; font-family:sans-serif; background-color:#525659;}
	        	.sp-viewer * {font-family:sans-serif}
	        	.sp-main-html *, .sp-main-body *, .sp-viewer * {padding:0; margin:0;}
				.sp-viewer .sp-titlebar {position:absolute; z-index:2; top:0px; left:0px; height:56px; width:100%; overflow:hidden; box-shadow:rgba(0, 0, 0, 0.09) 0px -2px 8px, rgba(0, 0, 0, 0.06) 0px 4px 8px, rgba(0, 0, 0, 0.3) 0px 1px 2px, rgba(0, 0, 0, 0.15) 0px 2px 6px; background-color:#323639; display:flex; justify-content:space-between;align-items: center;}
				.sp-viewer .sp-document-name {margin-right:10px; margin-left:10px; color:#F2F2F2; line-height:1; font-family:sans-serif; display:inline-block; font-size:14px; flex-shrink: 2; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}
				.sp-viewer .sp-titlebar-center {display:flex; flex-shrink: 0; overflow: hidden; white-space: nowrap; min-width: 215px; align-items: center;}				
				.sp-viewer .sp-titlebar-right {flex-shrink: 0; width: 105px;}
				.sp-viewer .sp-titlebar-left {display:flex; align-items:center;}
				.sp-viewer .sp-titlebar-right>* {float:left;}
				.sp-viewer .toolbarButton > svg {width:16px; height:16px; color:#b1b1b1}
				.sp-viewer .splitToolbarButton>.toolbarButton {border-radius:0; float:left;}
				.sp-viewer .splitToolbarButton.toggled .toolbarButton {margin:0;}
				.sp-viewer .toolbarButton, .sp-viewer .toolbarButton:focus {border:0 none; background-color:rgba(0, 0, 0, 0); height:32px; height:32px; border-radius:50%; background-image:none;}
				.sp-viewer .dropdownToolbarButton {margin:3px 2px 4px 0;}
				.sp-viewer .dropdownToolbarButton {background-color:rgba(0, 0, 0, 0.5); background-clip:padding-box; border:1px solid hsla(0, 0%, 0%, .35); border-color:hsla(0, 0%, 0%, .32) hsla(0, 0%, 0%, .38) hsla(0, 0%, 0%, .42); box-shadow:0 1px 0 hsla(0, 0%, 100%, .05) inset, 0 0 1px hsla(0, 0%, 100%, .15) inset, 0 1px 0 hsla(0, 0%, 100%, .05);}
				.sp-viewer .toolbarButton:hover:active {background-color:hsla(0, 0%, 0%, .2); background-image:linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-webkit-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-moz-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-ms-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-o-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); border-color:hsla(0, 0%, 0%, .35) hsla(0, 0%, 0%, .4) hsla(0, 0%, 0%, .45); box-shadow:0 1px 1px hsla(0, 0%, 0%, .1) inset, 0 0 1px hsla(0, 0%, 0%, .2) inset, 0 1px 0 hsla(0, 0%, 100%, .05);}
				.sp-viewer .splitToolbarButton:hover>.toolbarButton, .sp-viewer .splitToolbarButton:focus>.toolbarButton, .sp-viewer .splitToolbarButton.toggled>.toolbarButton, .sp-viewer .toolbarButton.textButton {background-color:hsla(0, 0%, 0%, .12); background-image:-webkit-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-moz-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-ms-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-o-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-clip:padding-box; border:1px solid hsla(0, 0%, 0%, .35); border-color:hsla(0, 0%, 0%, .32) hsla(0, 0%, 0%, .38) hsla(0, 0%, 0%, .42); box-shadow:0 1px 0 hsla(0, 0%, 100%, .05) inset, 0 0 1px hsla(0, 0%, 100%, .15) inset, 0 1px 0 hsla(0, 0%, 100%, .05); -webkit-transition-property:background-color, border-color, box-shadow; -webkit-transition-duration:150ms; -webkit-transition-timing-function:ease; -moz-transition-property:background-color, border-color, box-shadow; -moz-transition-duration:150ms; -moz-transition-timing-function:ease; -ms-transition-property:background-color, border-color, box-shadow; -ms-transition-duration:150ms; -ms-transition-timing-function:ease; -o-transition-property:background-color, border-color, box-shadow; -o-transition-duration:150ms; -o-transition-timing-function:ease; transition-property:background-color, border-color, box-shadow; transition-duration:150ms; transition-timing-function:ease;}
				.sp-viewer .splitToolbarButton>.toolbarButton:hover, .sp-viewer .splitToolbarButton>.toolbarButton:focus,  .sp-viewer .toolbarButton.textButton:hover, .sp-viewer .toolbarButton.textButton:focus {background-color:hsla(0, 0%, 0%, .2); box-shadow:0 1px 0 hsla(0, 0%, 100%, .05) inset, 0 0 1px hsla(0, 0%, 100%, .15) inset, 0 0 1px hsla(0, 0%, 0%, .05); z-index:199;}
				.sp-viewer .splitToolbarButton:hover>.toolbarButton, .sp-viewer .splitToolbarButton:focus>.toolbarButton, .sp-viewer .splitToolbarButton.toggled>.toolbarButton, .sp-viewer .toolbarButton.textButton {background-color:hsla(0, 0%, 0%, .12); background-image:-webkit-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-moz-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-ms-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:-o-linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-image:linear-gradient(hsla(0, 0%, 100%, .05), hsla(0, 0%, 100%, 0)); background-clip:padding-box; border:1px solid hsla(0, 0%, 0%, .35); border-color:hsla(0, 0%, 0%, .32) hsla(0, 0%, 0%, .38) hsla(0, 0%, 0%, .42); box-shadow:0 1px 0 hsla(0, 0%, 100%, .05) inset, 0 0 1px hsla(0, 0%, 100%, .15) inset, 0 1px 0 hsla(0, 0%, 100%, .05); -webkit-transition-property:background-color, border-color, box-shadow; -webkit-transition-duration:150ms; -webkit-transition-timing-function:ease; -moz-transition-property:background-color, border-color, box-shadow; -moz-transition-duration:150ms; -moz-transition-timing-function:ease; -ms-transition-property:background-color, border-color, box-shadow; -ms-transition-duration:150ms; -ms-transition-timing-function:ease; -o-transition-property:background-color, border-color, box-shadow; -o-transition-duration:150ms; -o-transition-timing-function:ease; transition-property:background-color, border-color, box-shadow; transition-duration:150ms; transition-timing-function:ease;}
				.sp-viewer .splitToolbarButton>.toolbarButton:hover, .sp-viewer .splitToolbarButton>.toolbarButton:focus,  .sp-viewer .toolbarButton.textButton:hover, .sp-viewer .toolbarButton.textButton:focus {background-color:hsla(0, 0%, 0%, .2); box-shadow:0 1px 0 hsla(0, 0%, 100%, .05) inset, 0 0 1px hsla(0, 0%, 100%, .15) inset, 0 0 1px hsla(0, 0%, 0%, .05); z-index:199;}
				.sp-viewer .dropdownToolbarButton {border:1px solid #333 !important;}
				.sp-viewer .toolbarButton, .sp-viewer .dropdownToolbarButton {min-width:32px; padding:2px 6px 2px; border:1px solid transparent; border-radius:2px; color:hsl(0, 0%, 95%); font-size:12px; line-height:1; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; cursor:default; -webkit-transition-property:background-color, border-color, box-shadow; -webkit-transition-duration:150ms; -webkit-transition-timing-function:ease; -moz-transition-property:background-color, border-color, box-shadow; -moz-transition-duration:150ms; -moz-transition-timing-function:ease; -ms-transition-property:background-color, border-color, box-shadow; -ms-transition-duration:150ms; -ms-transition-timing-function:ease; -o-transition-property:background-color, border-color, box-shadow; -o-transition-duration:150ms; -o-transition-timing-function:ease; transition-property:background-color, border-color, box-shadow; transition-duration:150ms; transition-timing-function:ease;}
				.sp-viewer .toolbarButton, .sp-viewer .dropdownToolbarButton {margin:3px 2px 4px 0;}
				.sp-viewer .splitToolbarButton:hover>.splitToolbarButtonSeparator, .sp-viewer .splitToolbarButton.toggled>.splitToolbarButtonSeparator {padding:12px 0; margin:0; box-shadow:0 0 0 1px hsla(0, 0%, 100%, .03); -webkit-transition-property:padding; -webkit-transition-duration:10ms; -webkit-transition-timing-function:ease; -moz-transition-property:padding; -moz-transition-duration:10ms; -moz-transition-timing-function:ease; -ms-transition-property:padding; -ms-transition-duration:10ms; -ms-transition-timing-function:ease; -o-transition-property:padding; -o-transition-duration:10ms; -o-transition-timing-function:ease; transition-property:padding; transition-duration:10ms; transition-timing-function:ease;}
				.sp-viewer .toolbarButton.toggled:hover:active, .sp-viewer .splitToolbarButton>.toolbarButton:hover:active {background-color:hsla(0, 0%, 0%, .4); border-color:hsla(0, 0%, 0%, .4) hsla(0, 0%, 0%, .5) hsla(0, 0%, 0%, .55); box-shadow:0 1px 1px hsla(0, 0%, 0%, .2) inset, 0 0 1px hsla(0, 0%, 0%, .3) inset, 0 1px 0 hsla(0, 0%, 100%, .05);}
				.sp-viewer .splitToolbarButton>.toolbarButton:first-child, .sp-viewer .splitToolbarButton>.toolbarButton:last-child {position:relative; margin:0; margin-left:4px; margin-right:-1px; border-top-left-radius:2px; border-bottom-left-radius:2px; border-right-color:transparent;}
				.sp-viewer .splitToolbarButtonSeparator {padding:8px 0; width:1px; background-color:hsla(0, 0%, 00%, .5); z-index:99; box-shadow:0 0 0 1px hsla(0, 0%, 100%, .08); display:inline-block; margin:5px 0;}
				.sp-viewer .splitToolbarButtonSeparator {float:left;}
				.sp-viewer .dropdownToolbarButton {padding:4px 2px 4px; overflow:hidden; background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAQCAQAAABwiK17AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI9JREFUCFtjYCARMDJwMggCMSNEH5eRxe3ZRhYMXCAOO7fe1fn/119bwK3HwM7AIHCs6f+y/4v/LzvRyCDAwMDDoMXgyRAExNpANtAIBQYTBksgVgCyGfgP5/3vA8HDeQz8QMUsNvtK/5ftK+WwBSlmZpAQ99+WK+7PIAFkAwErgySDJhCzwpzPzMAGkcEPAPi8H7JRgYIZAAAAAElFTkSuQmCC') no-repeat, rgba(0, 0, 0, 0.5);}
				.sp-viewer .dropdownToolbarButton>select {-webkit-appearance:none; -moz-appearance:none; font-size:12px; color:hsl(0, 0%, 95%); margin:0; padding:0; border:none; background:rgba(0, 0, 0, 0);}
				.sp-viewer .dropdownToolbarButton>select>option {background:hsl(0, 0%, 24%);}
				.sp-viewer .dropdownToolbarButton {background-position:95%;}
				.sp-viewer .toolbarField.pageNumber {min-width:16px; text-align:center; width:16px;}
				.sp-viewer .toolbarField {padding:3px 6px; margin:4px 0 4px 0; border:1px solid transparent; border-radius:2px; background-color:rgba(0, 0, 0, 0.5); border-color:hsla(0, 0%, 0%, .32) hsla(0, 0%, 0%, .38) hsla(0, 0%, 0%, .42); box-shadow:0 1px 0 hsla(0, 0%, 0%, .05) inset, 0 1px 0 hsla(0, 0%, 100%, .05); color:hsl(0, 0%, 95%); font-size:12px; line-height:1; outline-style:none; -moz-transition-property:background-color, border-color, box-shadow; -moz-transition-duration:150ms; -moz-transition-timing-function:ease;}
				.sp-viewer .toolbarField.pageNumber::-webkit-inner-spin-button, .sp-viewer .toolbarField.pageNumber::-webkit-outer-spin-button {-webkit-appearance:none; margin:0;}
				.sp-viewer .toolbarField:hover {background-color:rgba(0, 0, 0, 0.5); border-color:hsla(0, 0%, 0%, .4) hsla(0, 0%, 0%, .43) hsla(0, 0%, 0%, .45);}
				.sp-viewer .sp-toolbarLabel {min-width:16px; padding:3px 6px 3px 2px; margin:4px 2px 4px 0; border:1px solid transparent; border-radius:2px; color:hsl(0, 0%, 85%); font-size:12px; line-height:1; text-align:left; -webkit-user-select:none; -moz-user-select:none; cursor:default;}
				.sp-viewer .sp-canvas-container {transition-property:left; transition-duration:.5s; overflow:auto; padding-top:6px; padding-bottom:6px; position:absolute; top:56px; right:0; bottom:0px; text-align:center; background-color:#525659;}
				.sp-viewer .sp-thumbnail-container:not(.open) ~ .sp-canvas-container  {left:0;}
				.sp-viewer .sp-thumbnail-container.open ~ .sp-canvas-container  {left:250px;}
				.sp-viewer .sp-thumbnail-container {transition-property:left; transition-duration:.5s; width:250px; top:56px; left:-250px; bottom:0px; overflow:auto; position:absolute; box-shadow:0px 1px 3px rgba(50, 50, 50, 0.75); z-index:1; background-color:#323639}
				.sp-viewer .sp-thumbnail-container.open {left:0px;}
				.sp-viewer .sp-canvas {box-shadow:0px 0px 7px rgba(0, 0, 0, 0.75); overflow:hidden;}
				.sp-viewer .sp-page-number-input {max-width:20px;}
				.sp-viewer .sp-scale-select-container {width:68px;}
				.sp-viewer .sp-thumbnail-wrap {padding-bottom: 10px; padding-top:20px; cursor:pointer; text-align:center;}
				.sp-viewer .sp-thumbnail-wrap canvas {opacity:0.6}
				.sp-viewer .sp-thumbnail-wrap:hover canvas, .sp-viewer .sp-thumbnail-wrap.active canvas {box-shadow: 0 0 15px rgba(0,0,0,0.7); opacity:1}
				.sp-viewer .sp-thumbnail-wrap.active canvas {outline: 6px solid #8ab4f8;}
				.sp-viewer .sp-thumbnail-label {text-align:center; padding:6px 8px 8px; color:#b1b1b1; font-size:13px}
				.sp-viewer .sp-thumbnail-toggle {margin-left:10px; margin-top:6px;}
				.sp-viewer .sp-scale-select {outline:none !important;}
				.sp-viewer button.toolbarButton {border-radius:50%}
				.sp-viewer button.toolbarButton:hover {background: rgba(255, 255, 255, 0.08);}

				@media(max-width: 600px) {
				    .sp-viewer .sp-document-name {display:none;}
				    .sp-viewer .sp-thumbnail-container.open {left:-250px !important;}
				    .sp-viewer .sp-canvas-container {left:0px !important}
				    .sp-viewer .sp-thumbnail-toggle {display:none !important}
				}
				@media(max-width: 800px) {
				    .sp-viewer .sp-scale-select-container {display:none;}
				}
				@media(max-width: 400px) {
				    .sp-viewer .sp-nav-buttons, .sp-viewer .sp-number-pages-label, .sp-viewer .sp-page-number-input, .sp-viewer .sp-page-label {display:none;}
				}
				@media screen, print, handheld, projection {
				    .sp-viewer .sp-page {margin:7px auto 7px auto; position:relative; overflow:hidden; background-clip:content-box; background-color:white; box-shadow:0px 0px 7px rgba(0, 0, 0, 0.75); -webkit-box-shadow:0px 0px 7px rgba(0, 0, 0, 0.75); -moz-box-shadow:0px 0px 7px rgba(0, 0, 0, 0.75); -ms-box-shadow:0px 0px 7px rgba(0, 0, 0, 0.75); -o-box-shadow:0px 0px 7px rgba(0, 0, 0, 0.75);}
				    .sp-viewer .sp-textLayer {position:absolute; left:0; top:0; right:0; bottom:0; color:#000; font-family:sans-serif; overflow:hidden;}
				    .sp-viewer .sp-textLayer>div {color:transparent !important; position:absolute; line-height:1; /*white-space:pre;*/ cursor:text;}
				    .sp-viewer ::selection {background:rgba(0, 0, 255, 0.3);}
				    .sp-viewer ::-moz-selection {background:rgba(0, 0, 255, 0.3);}
				}
				@media only screen and (max-device-width: 800px) and (max-device-height: 800px){
				    .sp-viewer .sp-canvas-container {top:0; bottom:0;}
				    .sp-viewer .sp-titlebar {background-color:rgba(0, 0, 0, 0.75); background-image:none; -webkit-transition:all 0.5s; -moz-transition:all 0.5s; transition:all 0.5s;}
				    .sp-viewer .sp-titlebar {top:-32px;}
				    .sp-viewer .sp-titlebar.viewer-touched {top:0px;}
				    .sp-viewer .viewer-touched {display:block; opacity:1 !important;}
				    .sp-viewer .sp-previous-button, .sp-viewer .sp-next-button {display:none;}
				}
	        </style>`;

	        //FIGURE OUT WHERE TO ADD THE STYLE ELEMENT
	        var headEle = document.querySelector('head');
	        if(!headEle) wrapperEle.innerHTML = styleEle+document.querySelector(this.wrapper);
	        else headEle.innerHTML += styleEle;
		}

		//ADD HTML AND BODY CLASSES IF THIS IS AN IFRAME
		if(window.top !== window.self){
			document.querySelector('html').classList.add('sp-main-html');
			document.querySelector('body').classList.add('sp-main-body');
		}
	}

	renderElements(){
		var uniqueId = this.settings.uniqueId;

		var html = `<div id="viewer-`+uniqueId+`" class="sp-viewer">
            <div id="titlebar-`+uniqueId+`" class="sp-titlebar">
            	<div class="sp-titlebar-left">
	            	<button id="thumbnail-toggle-`+uniqueId+`" class="toolbarButton sp-thumbnail-toggle">
	            		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
	            	</button>
	            	<div id="documentName-`+uniqueId+`" class="sp-document-name"></div>
            	</div>
                <div class="sp-titlebar-center">
                    <div id="navButtons-`+uniqueId+`" class="splitToolbarButton sp-nav-buttons" style="display:none;">
                        <button id="previous-`+uniqueId+`" class="toolbarButton pageUp sp-previous-button" title="Previous Page">
                        	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192l72 0 0 288c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-288 72 0c9.6 0 18.2-5.7 22-14.5z"/></svg>
                        </button>
                        <button id="next-`+uniqueId+`" class="toolbarButton pageDown sp-next-button" title="Next Page">
                        	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>
                        </button>
                    </div>
                    <label id="pageNumberLabel-`+uniqueId+`" class="sp-toolbarLabel sp-page-label" style="display:none;"  for="pageNumber">Page:</label>
                    <input type="number" id="pageNumber-`+uniqueId+`" class="toolbarField pageNumber sp-page-number-input"/>
                    <span id="numPages-`+uniqueId+`" class="sp-toolbarLabel sp-number-pages-label"></span>
                    <button id="zoomOut-`+uniqueId+`" class="toolbarButton zoomOut sp-zoom-out-button" title="Zoom Out"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" ><path fill="currentColor" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg></button>
                    <span id="scaleSelectContainer-`+uniqueId+`" class="dropdownToolbarButton sp-scale-select-container">
                        <select id="scaleSelect-`+uniqueId+`" class="sp-scale-select" title="Zoom" oncontextmenu="return false;">
                            <option id="pageAutoOption-`+uniqueId+`" value="auto" selected>Auto</option>
                            <option id="pageActualOption-`+uniqueId+`" value="page-actual">Actual</option>
                            <option id="pageWidthOption-`+uniqueId+`" value="page-width">Fit-Width</option>
                            <option id="pageHeightOption-`+uniqueId+`" value="page-height">Fit-Height</option>
                            <option id="customScaleOption-`+uniqueId+`" value="custom"></option>
                            <option value="0.5">50%</option>
                            <option value="0.75">75%</option>
                            <option value="1">100%</option>
                            <option value="1.25">125%</option>
                            <option value="1.5">150%</option>
                            <option value="2">200%</option>
                        </select>
                    </span>
                    <button id="zoomIn-`+uniqueId+`" class="toolbarButton zoomIn sp-zoom-in-button" title="Zoom In"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></button>
                </div>
                <div id="titlebarRight-`+uniqueId+`" class="sp-titlebar-right">                    
                    <button id="download-`+uniqueId+`" class="toolbarButton download sp-download-button" title="Download"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg></button>
                    <button id="printBtn-`+uniqueId+`" class="toolbarButton print sp-print-button" title="Print"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 32 0 64-256 0 0-64 0-16 0-16 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg></button>
                    <button id="fullscreen-`+uniqueId+`" class="toolbarButton fullscreen sp-fullscreen-button" title="Fullscreen"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"/></svg></button>
                </div>
            </div>
            <div id="thumbnail-container-`+uniqueId+`" class="sp-thumbnail-container `+(this.settings.thumbnails === true ? 'open' : '')+`"></div>
            <div id="canvasContainer-`+uniqueId+`" class="sp-canvas-container"></div>
        </div>`;

        var wrapperEle = document.querySelector(this.settings.wrapper);
        wrapperEle.innerHTML += html;
	}

	getFile(callback){
		var url = this.settings.fileUrl;
        var request = new XMLHttpRequest;
        var that = this;
        request.onreadystatechange = function() {
            var responseMimeType;
            request.readyState === 4 && ((request.status >= 200 && request.status < 300 || request.status === 0) && (responseMimeType = request.getResponseHeader("content-type")) && function(){
                try{
                	var responseHeaders = request.getAllResponseHeaders();
				    var arr 			= responseHeaders.trim().split(/[\r\n]+/);
				    var headerMap 		= {};
				    arr.forEach((line) => {
				      var parts 		= line.split(": ");
				      var header 		= parts.shift();
				      headerMap[header] = parts.join(": ");
				    });

                    if(that.settings.fileName == null && typeof headerMap['content-disposition'] != 'undefined'){
                        var fileName = request.getResponseHeader('content-disposition').split('filename="').pop().split('";')[0];
                        that.settings.fileName = fileName;
                    }
                    if(settings.fileUrl == null) that.settings.fileUrl = request.responseURL;
                }
                catch{}
                return "application/pdf" === responseMimeType
            }(), callback({mime: 'application/pdf', type: 'pdf', url: url}));
        };
        request.open("HEAD", url, !0);
        request.send()
    }

    getBase64File(){
    	function getFileAsBase64(url) {
		  return new Promise((resolve, reject) => {
		    const xhr = new XMLHttpRequest();
		    xhr.open('GET', url);
		    xhr.responseType = 'arraybuffer';

		    xhr.onload = function() {
		      if(this.status === 200) {
		        const base64 = btoa(
		          new Uint8Array(this.response).reduce(
		            (data, byte) => data + String.fromCharCode(byte),
		            ''
		          )
		        );
		        resolve(base64);
		      } else {
		        reject(new Error('Request failed with status ' + this.status));
		      }
		    };

		    xhr.onerror = function() {
		      reject(new Error('Network error'));
		    };

		    xhr.send();
		  });
		}

		var that = this;

		getFileAsBase64(this.settings.fileUrl)
		  .then(base64 => {
		  	that.settings.base64File = base64;
		  })
		  .catch(error => {
		    console.error(error);
		  });
    }
}

class SlickPdfViewer {

	viewerWrapper;
    settings;
    plugin;
    pluginLoaded 		= false;
    pages 				= [];
    isFullscreen 		= false;
    currentPage 		= 1;
    elements 			= {};
    customScaleSelected = false;
    calcTimer;
    titleBarTouchTimer;

    constructor(viewerWrapper, initializeCallback){
    	this.viewerWrapper 	= viewerWrapper;
	    this.settings 		= viewerWrapper.settings;
	    this.plugin 		= new SlickPDFViewerPlugin(this);

	    return this.initialize(initializeCallback)
    }

    addViewerTouched(){
    	var that = this;
        this.elements.titleBar.classList.add("viewer-touched");
        clearTimeout(this.titleBarTouchTimer);
        this.titleBarTouchTimer = setTimeout(function() { that.removeViewerTouched() }, 5E3)
    }

    removeViewerTouched(){
        this.elements.titleBar.classList.remove("viewer-touched");
    }

    toggleViewerTouched(){
        this.elements.titleBar.classList.contains("viewer-touched") ? this.removeViewerTouched() : this.addViewerTouched()
    }

    initialize(callback) {

    	this.elements.scaleSelect 				= document.getElementById("scaleSelect-"+this.settings.uniqueId);
	    this.elements.canvasContainer 			= document.getElementById("canvasContainer-"+this.settings.uniqueId);
	    this.elements.pageCount 				= document.getElementById("numPages-"+this.settings.uniqueId);
	    this.elements.documentTitle 			= document.getElementById("documentName-"+this.settings.uniqueId);
	    this.elements.titleBar 					= document.getElementById("titlebar-"+this.settings.uniqueId);
	    this.elements.printBtn 					= document.getElementById("printBtn-"+this.settings.uniqueId);
	    this.elements.next						= document.getElementById("next-"+this.settings.uniqueId);
	    this.elements.previous 					= document.getElementById("previous-"+this.settings.uniqueId);
	    this.elements.fullscreen 				= document.getElementById("fullscreen-"+this.settings.uniqueId);
	    this.elements.download 					= document.getElementById("download-"+this.settings.uniqueId);
	    this.elements.zoomOut 					= document.getElementById("zoomOut-"+this.settings.uniqueId);
	    this.elements.zoomIn 					= document.getElementById("zoomIn-"+this.settings.uniqueId);
	    this.elements.pageNumber				= document.getElementById("pageNumber-"+this.settings.uniqueId);
	    this.elements.viewer 					= document.getElementById("viewer-"+this.settings.uniqueId);
	    this.elements.pageWidthOption			= document.getElementById("pageWidthOption-"+this.settings.uniqueId);
	    this.elements.pageAutoOption			= document.getElementById("pageAutoOption-"+this.settings.uniqueId);
	    this.elements.customScaleOption			= document.getElementById("customScaleOption-"+this.settings.uniqueId);
	    this.elements.thumbnailContainer 		= document.getElementById('thumbnail-container-'+this.settings.uniqueId);
	    this.elements.thumbnailToggle 			= document.getElementById('thumbnail-toggle-'+this.settings.uniqueId);
        
        var that 								= this;
        var scaleSetting						= this.setupZoomScale(this.settings.zoom);
        document.title 							= this.settings.fileName;
        this.elements.documentTitle.innerHTML 	= this.settings.fileName;

        document.exitFullscreen || document.cancelFullScreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.webkitCancelFullScreen || document.msExitFullscreen || (this.elements.fullscreen.style.visibility = "hidden", 1);
    	this.listenFor("fullscreen", this.toggleFullScreen);
    	this.listenFor("printBtn", this.triggerPrint);
    	this.listenFor("zoomOut", this.zoomOut);
    	this.listenFor("zoomIn", this.zoomIn);
    	this.listenFor("previous", this.showPreviousPage);
    	this.listenFor("next", this.showNextPage);
    	this.elements.thumbnailToggle.addEventListener('click', function(){ that.toggleThumbnailDisplay() });
    	this.elements.pageNumber.addEventListener("change", function() { that.showPage(this.value) });
    	this.elements.scaleSelect.addEventListener("change", function() { that.checkZoomScale(this.value) });
        this.elements.canvasContainer.addEventListener("click", function(){ that.toggleViewerTouched()});
        this.elements.titleBar.addEventListener("click", function(){ that.addViewerTouched() });
        this.listenFor("download", this.download);
       
    	window.addEventListener("resize", function(){
            that.pluginLoaded && (that.elements.pageWidthOption.selected || that.elements.pageAutoOption.selected) && that.checkZoomScale(that.elements.scaleSelect.value);
        });
        window.addEventListener("keydown", function(event) {
            switch(event.keyCode){
                case 8:
                case 33:
                case 37:
                case 38:
                case 80:
                    that.showPreviousPage();
                    break;
                case 13:
                case 34:
                case 39:
                case 40:
                case 78:
                    that.showNextPage();
                    break;
                case 32:
                    event.shiftKey ? that.showPreviousPage() : that.showNextPage();
                    break;
                case 36:
                    that.showPage(1);
                    break;
                case 35:
                    that.showPage(that.pages.length);
            }
    	});
        
        this.plugin.initialize((plugin) => {
            that.pluginLoaded = true;
            that.pages 							= that.plugin.getPages();
            that.elements.pageCount.innerHTML 	= " / " + that.pages.length;
            that.showPage(that.settings.startpage);
            that.checkZoomScale(scaleSetting);
            that.elements.canvasContainer.onscroll = function(){ return that.calculatePageInView() };
            that.calculatePageInViewDelayed(0, callback);
        });

        return this;
    };

    updateStorage(key, val){
    	var localStorageSettings = localStorage.getItem('slickPdfSettings');
    	if(localStorageSettings === null) localStorageSettings = JSON.stringify({});
    	localStorageSettings = JSON.parse(localStorageSettings);
    	localStorageSettings[key] = val;
    	localStorage.setItem('slickPdfSettings', JSON.stringify(localStorageSettings));
    }

    toggleThumbnailDisplay(){
    	this.elements.thumbnailContainer.classList.toggle('open');
    	this.updateStorage('thumbnails', this.elements.thumbnailContainer.classList.contains('open'));
    }

    calculatePageInViewDelayed(delay, callback){
    	clearTimeout(this.calcTimer);
    	var that = this;
        this.calcTimer = setTimeout(function(){ that.calculatePageInView(callback); }, delay)
    }

    calculatePageInView(callback){
    	var pageInView;
        if(this.plugin.onScroll) this.plugin.onScroll();
        this.plugin.getPageInView && (pageInView = this.plugin.getPageInView()) && (this.currentPage = pageInView, this.elements.pageNumber.value = pageInView)
        if(typeof callback == 'function') callback(this);
    }

    listenFor(selector, callback){
    	var that = this;
    	var ele = document.getElementById(selector+'-'+this.settings.uniqueId);
        ele.addEventListener("click", function() {
        	callback.bind(that)(ele);
            ele.blur()
        })
    }

    showPage(targetPageNumber){
        0 >= targetPageNumber ? targetPageNumber = 1 : targetPageNumber > this.pages.length && (targetPageNumber = this.pages.length);
        this.plugin.showPage(targetPageNumber);
        this.currentPage = targetPageNumber;
        this.elements.pageNumber.value = this.currentPage;
    }

    showNextPage(){
        this.showPage(this.currentPage + 1)
    }

    showPreviousPage(){
        this.showPage(this.currentPage - 1)
    }

    download(){
    	var that = this;
    	if(!(/^(http|https):\/\/[^ "]+$/).test(this.settings.fileUrl)) return;
    	fetch(this.settings.fileUrl)
    		.then((res) => {
    			if(!res.ok) throw new Error("Network Problem");
    			return res.blob();
    		})
    		.then((file) => {
    			var tUrl 		= URL.createObjectURL(file);
            	var tmp1 		= document.createElement("a");
            	tmp1.href 		= tUrl;
            	tmp1.download 	= that.settings.fileName;
            	document.body.appendChild(tmp1);
            	tmp1.click();
            	URL.revokeObjectURL(tUrl);
            	tmp1.remove();
    		});
    }

    triggerPrint(){
    	printJS(this.settings.fileUrl);
    	//printJS({printable: this.settings.base64File, type: 'pdf', base64: true});
    }

    toggleFullScreen(){
        this.isFullscreen ? document.exitFullscreen ? document.exitFullscreen() : document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen() : this.elements.viewer.requestFullscreen ? this.elements.viewer.requestFullscreen() : this.elements.viewer.mozRequestFullScreen ? this.elements.viewer.mozRequestFullScreen() : this.elements.viewer.webkitRequestFullscreen ? this.elements.viewer.webkitRequestFullscreen() : this.elements.viewer.webkitRequestFullScreen ? this.elements.viewer.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : this.elements.viewer.msRequestFullscreen && this.elements.viewer.msRequestFullscreen()
    	this.isFullscreen = !this.isFullscreen;
    }
    
    getZoomLevel(){
        return this.plugin.getZoomLevel();
    }

    setZoomLevel(targetZoomLevel) {
        this.plugin.setZoomLevel(targetZoomLevel)
        var customScaleElement = this.elements.customScaleOption,
    	c = this.selectZoomLevelOption(String(targetZoomLevel));
		customScaleElement.selected = false;
		c || (customScaleElement.textContent = Math.round(1E4 * targetZoomLevel) / 100 + "%", customScaleElement.selected = true)
    }

    zoomOut(){
        this.checkZoomScale(Math.max(this.settings.minScale, (this.getZoomLevel() / 1.1).toFixed(2)), true)
    }

    zoomIn(){
        this.checkZoomScale(Math.min(this.settings.maxScale, ((1.1 * this.getZoomLevel()).toFixed(2))), true)
    }

    changeScale(targetZoomLevel, shouldReset){
    	if(targetZoomLevel !== this.getZoomLevel()) {
            this.setZoomLevel(targetZoomLevel);
        }
    }

    selectZoomLevelOption(val) {
        var res = false;
        for(var x = 0; x < this.elements.scaleSelect.options.length; x++){
        	var option = this.elements.scaleSelect.options[x];
        	option.value !== val ? option.selected = false : res = option.selected = true;
        }
        return res;
    }

    checkZoomScale(targetScale, shouldReset) {
        
        var currentScale;
        if (currentScale = "custom" === targetScale ? parseFloat(this.elements.customScaleOption.textContent) / 100 : parseFloat(targetScale)) this.changeScale(currentScale, true);
        else {
            var width = this.elements.canvasContainer.clientWidth - this.settings.padding;
            var height = this.elements.canvasContainer.clientHeight - this.settings.padding;
            switch (targetScale) {
                case "page-actual":
                    this.changeScale(1, shouldReset);
                    break;
                case "page-width":
                    this.plugin.fitToWidth(width);
                    break;
                case "page-height":
                    this.plugin.fitToHeight(height);
                    break;
                case "page-fit":
                    this.plugin.fitToPage(width, height);
                    break;
                case "auto":
                    this.plugin.fitSmart(width, height);
            }
            this.selectZoomLevelOption(targetScale)
        }
        this.calculatePageInViewDelayed(300)
    };

    setupZoomScale(targetScale) {
        return -1 !== ["auto", "page-actual", "page-width", 'page-height'].indexOf(targetScale) ? targetScale : (targetScale = parseFloat(targetScale)) && this.settings.minScale <= targetScale && targetScale <= this.settings.maxScale ? targetScale : this.settings.zoom
    };
};

class SlickPDFViewerPlugin {

	//DEFINE DEFAULT CLASS VALUES
	thumbnailScrollTimer;
	onLoad 					= function(){};
	viewer 					= null;
	viewerWrapper 			= null;
	pdfContainer 			= null;
	pages 					= [];
	transportWrapperStatus 	= [];
	transportWrappers 		= [];
	textLayers 				= [];
	pageCount 				= 0;
	viewportZoom 			= 1;
	viewportWidth 			= 0;
	viewportHeight 			= 0;
	statusTypes 			= {
        BLANK 				: 0,
        RUNNING 			: 1,
        FINISHED 			: 2,
        RUNNINGOUTDATED 	: 3
    };

    constructor(viewObj){
    	this.viewer 		= viewObj;
    	this.viewerWrapper 	= this.viewer.viewerWrapper;
    	return this;
    }

    initialize(callback) {

    	//DEFINE THIS CLASS AS A VARIABLE
    	var that = this;

    	//SET THE CALLBACK
    	if(typeof callback == 'function') this.onLoad = callback;

    	//LOAD THE PDF
        PDFJS.getDocument(this.viewerWrapper.settings.fileUrl).then(function(response) {

        	//SET THE PDF CONTAINER
        	that.pdfContainer = response;

        	//LOOP THROUGH THE PAGES AND BUILD THEM
            for(var x = 0; x < that.pdfContainer.numPages; x += 1) that.pdfContainer.getPage(x + 1).then(function(transportWrapper){ that.buildPageFromTransport(transportWrapper); })
        })
    }

    renderScale(transportWrapper, width, height) {
        
        //DEFINE THE ELEMENTS
        var pageContainerEle 			= this.pages[transportWrapper.pageIndex];
        var pageCanvas 					= pageContainerEle.getElementsByTagName("canvas")[0];
        var pageEle						= pageContainerEle.getElementsByTagName("div")[0];

        var defaultViewport = transportWrapper.getViewport(1);

        //SET ELEMENT ATTRIBUTES
        pageContainerEle.style.width 	= width+"px";
        pageContainerEle.style.height 	= height+"px";
        pageCanvas.width 				= width;
        pageCanvas.height 				= height;
        pageEle.style.width 			= defaultViewport.width+"px";
        pageEle.style.height 			= defaultViewport.height+"px";
        pageEle.style.transform 		= "scale("+this.viewportZoom+","+this.viewportZoom+")";
        pageEle.style.transformOrigin 	= "0% 0%";
        
        //SET THE TRANSPORT WRAPPER STATUS
        this.transportWrapperStatus[transportWrapper.pageIndex] = this.transportWrapperStatus[transportWrapper.pageIndex] === this.statusTypes.RUNNING ? this.statusTypes.RUNNINGOUTDATED : this.statusTypes.BLANK
    }

    renderTransport(transportWrapper) {

        var textLayer 	= this.textLayers[transportWrapper.pageIndex];
        var pageCanvas 	= this.pages[transportWrapper.pageIndex].getElementsByTagName("canvas")[0];
        var pageIndex 	= transportWrapper.pageIndex;
        var that 		= this;

        if(this.transportWrapperStatus[pageIndex] === this.statusTypes.BLANK){
        	this.transportWrapperStatus[pageIndex] = this.statusTypes.RUNNING;
        	transportWrapper.render({
	            canvasContext 	: pageCanvas.getContext("2d"),
	            textLayer 		: textLayer,
	            viewport 		: transportWrapper.getViewport(this.viewportZoom)
	        }).promise.then(function(){
	        	that.checkTransportRender(transportWrapper);           
	        })
        }        
    }
    checkTransportRender(transportWrapper){

    	var pageIndex 	= transportWrapper.pageIndex;

    	if(this.transportWrapperStatus[pageIndex] === this.statusTypes.RUNNINGOUTDATED){
    		this.transportWrapperStatus[pageIndex] = this.statusTypes.BLANK;
    		this.renderTransport(transportWrapper);
    	}
    	else{
    		this.transportWrapperStatus[pageIndex] = this.statusTypes.FINISHED
    	}
    }

    buildPages(){
    	for(var x in this.pages){
    		var pageContainerEle = this.pages[x];
    		pageContainerEle.style.display = "block";
    		this.viewer.elements.canvasContainer.appendChild(pageContainerEle);
    	}
        this.showPage(1);
        this.onLoad(this)
        this.viewerWrapper.triggerEvent('shown.it.slickpdf');
    }

    buildPageFromTransport(transportWrapper) {

    	//DEFINE SOME COMMON VARS
    	var that 				= this;
        var pageIndex			= transportWrapper.pageIndex + 1;
        var uniqueId 			= this.viewer.settings.uniqueId;
        var viewport			= transportWrapper.getViewport(this.viewportZoom);

        //BUILD SOME ELEMENTS
        var pageContainerEle 	= SlickPdfView.createElement(`<div id="pageContainer`+pageIndex+`-`+uniqueId+`" class="sp-page" data-sp-page-index="`+pageIndex+`"></div>`);
        var pageCanvas 			= SlickPdfView.createElement(`<canvas id="canvas`+pageIndex+`-`+uniqueId+`" class="sp-canvas"></canvas>`);
        var textLayerDiv 		= SlickPdfView.createElement(`<div class="sp-textLayer" id="textLayer-`+pageIndex+`-`+uniqueId+`"></div>`);
        var thumbnailDiv 		= SlickPdfView.createElement(`<div class="sp-thumbnail-wrap" id="thumbnailwrap`+pageIndex+`-`+uniqueId+`" data-sp-page-index="`+pageIndex+`"></div>`);
        var thumbnailCanvas 	= SlickPdfView.createElement(`<canvas width="100" height="`+(100*(viewport.height/viewport.width))+`"></canvas>`);

        //RENDER THE THUMBNAIL
        transportWrapper.render({
        	canvasContext 	: thumbnailCanvas.getContext("2d"),
        	viewport 		: transportWrapper.getViewport(Math.min(thumbnailCanvas.width/viewport.width, thumbnailCanvas.height/viewport.height))
        }).promise.then(function(){
        	thumbnailDiv.appendChild(thumbnailCanvas);
        	thumbnailDiv.appendChild(SlickPdfView.createElement(`<div class="sp-thumbnail-label">`+pageIndex+`</div>`));
        	thumbnailDiv.addEventListener('click', function(){ that.viewer.elements.thumbnailContainer.querySelector('.active').classList.remove('active'); this.classList.add('active'); that.showPage(pageIndex); });
        });

        //APPEND THE RENDERED ELEMENTS
        this.viewer.elements.thumbnailContainer.appendChild(thumbnailDiv);
        pageContainerEle.appendChild(pageCanvas);
        pageContainerEle.appendChild(textLayerDiv);

        //CALCULATE THE PAGE SETTINGS
        this.pages[transportWrapper.pageIndex] 							= pageContainerEle;
        this.transportWrappers[transportWrapper.pageIndex] 				= transportWrapper;
        this.transportWrapperStatus[transportWrapper.pageIndex] 		= this.statusTypes.BLANK;
        this.renderScale(transportWrapper, viewport.width, viewport.height);
        this.viewportWidth < viewport.width && (this.viewportWidth 		= viewport.width);
        this.viewportHeight < viewport.height && (this.viewportHeight 	= viewport.height);

        //DEFINE THE TEXT LAYER
        var textLayer = new TextLayerBuilder({textLayerDiv : textLayerDiv, viewport : viewport, pageIndex : pageIndex-1});

        //RENDER THE TEXT LAYER
        transportWrapper.getTextContent().then(function(textContent) {
            textLayer.setTextContent(textContent);
            textLayer.render(200)
            that.textLayers[transportWrapper.pageIndex] = textLayer;
        });

        //ITERATE THE PAGE COUNT
        this.pageCount += 1;

        //CHECK IF WE ARE READY TO BUILD THE PAGES
        this.pageCount === this.pdfContainer.numPages && this.buildPages()
    }
    
    getPages(){
        return this.pages;
    }

    fitToWidth(targetWidth) {
        this.viewportWidth !== targetWidth && (targetWidth /= this.viewportWidth, this.setZoomLevel(targetWidth))
    }

    fitToHeight(targetHeight) {
        this.viewportHeight !== targetHeight && (targetHeight /= this.viewportHeight, this.setZoomLevel(targetHeight))
    }

    fitToPage(width, height) {
        var targetZoom = width / this.viewportWidth;
        height / this.viewportHeight < targetZoom && (targetZoom = height / this.viewportHeight);
        this.setZoomLevel(targetZoom)
    }

    fitSmart(width, height) {
        var targetZoom = width / this.viewportWidth;
        height && height / this.viewportHeight < targetZoom && (targetZoom = height / this.viewportHeight);
        targetZoom = Math.min(1, targetZoom);
        this.setZoomLevel(targetZoom)
    }

    setZoomLevel(targetZoomLevel) {
        var viewport;
        if(this.viewportZoom !== targetZoomLevel) for (this.viewportZoom = targetZoomLevel, targetZoomLevel = 0; targetZoomLevel < this.transportWrappers.length; targetZoomLevel += 1) viewport = this.transportWrappers[targetZoomLevel].getViewport(this.viewportZoom), this.renderScale(this.transportWrappers[targetZoomLevel], viewport.width, viewport.height)
    };
    getZoomLevel() {
        return this.viewportZoom
    }

    onScroll() {
        var a;
        for (a = 0; a < this.pages.length; a += 1) this.checkPageInView(this.pages[a]) && this.renderTransport(this.transportWrappers[a])
    }

	//CHECK IF A PROVIDED PAGE IS SUPPOSED TO BE ACTIVE
	checkPageInView(pageContainerEle){

		//DONT BOTHER EVALUATING IF THIS PAGE ISNT DISPLAYED
		if(pageContainerEle.style.display === 'none') return false;

        //CALC THE POSITIONS OF THE PAGE AND CANVAS
        var canvasContainerScrollTop 	= this.viewer.elements.canvasContainer.scrollTop;
        var canvasContainerHeight 		= canvasContainerScrollTop+this.viewer.elements.canvasContainer.clientHeight;
        var pageContainerOffsetTop 		= pageContainerEle.offsetTop;

        //CHECK IF THE PAGE CONTAINER IS AT LEAST 60% VISIBLE (THE PREVIOUS PAGE MIGHT STILL BE VISIBLE BUT WE WANT TO SET THE THUMBNAIL ACTIVE STATE TO THE FIRST PAGE THAT IS MOSTLY VISIBLE)
        var pageContainerHeight 		= pageContainerOffsetTop + (pageContainerEle.clientHeight*0.6);

        //VALIDATE IF THE PAGE IS VISIBLE AND ENOUGH OF THE PAGE IS SHOWN TO CONSIDER IT ACTIVE
        var isActive = pageContainerOffsetTop >= canvasContainerScrollTop && pageContainerOffsetTop < canvasContainerHeight || pageContainerHeight >= canvasContainerScrollTop && pageContainerHeight < canvasContainerHeight || pageContainerOffsetTop < canvasContainerScrollTop && pageContainerHeight >= canvasContainerHeight;

        //IF THE PAGE IS SUPPOSED TO BE ACTIVE
        if(isActive && this.viewer.elements.thumbnailContainer.classList.contains('open')){

        	//CLEAR ANY RUNNING THUMBNAIL SCROLL TIMERS
    		clearTimeout(this.thumbnailScrollTimer);

    		//DEFINE THIS CLASS AS A VARIABLE
    		var that 	= this;

    		//DEFINE HOW LONG TO WAIT BEFORE SCROLLING INTO VIEW
    		var delay 	= 500;

    		//START A NEW TIMER AND WAIT FOR THE DELAY
    		this.thumbnailScrollTimer = setTimeout(function(){

    			//GET THE THUMBNAIL WRAPPER
	        	var thumbnailWrapper = that.viewer.elements.thumbnailContainer.querySelector('.sp-thumbnail-wrap[data-sp-page-index="'+pageContainerEle.getAttribute('data-sp-page-index')+'"]');

	        	//REMOVE THE ACTIVE CLASS FROM ALL THE THUMBNAIL WRAPPERS
	        	that.viewer.elements.thumbnailContainer.querySelectorAll('.sp-thumbnail-wrap').forEach((el, i) => el.classList.remove('active'));

	        	//SET THE THUMBNAIL WRAPPER TO ACTIVE
	        	thumbnailWrapper.classList.add('active');

	        	//SCROLL THE THUMBNAIL INTO VIEW
    			thumbnailWrapper.scrollIntoView({behavior: "smooth", block:"nearest"});

    		}, delay);
        }

        //RETURN IF THIS PAGE IS SUPPOSED TO BE ACTIVE
        return isActive;
	}

	//GET THE FIRST PAGE NUMBER THAT IS VISIBLE
    getPageInView() {
    	for(var x in this.pages) if(this.checkPageInView(this.pages[x])) return Number(x)+1;
    }

	//SCROLL TO A PAGE BY PAGE NUMBER
    showPage(pageNumber){
    	this.pages[pageNumber-1].scrollIntoView({behavior:"smooth",block:"center"});
    }
};

//printjs Library v1.5.0 https://printjs.crabbly.com/
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.printJS=t():e.printJS=t()}(window,function(){return function(n){var r={};function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}return o.m=n,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=4)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(2),i=(r=o)&&r.__esModule?r:{default:r},a=n(1);var l={send:function(r,e){document.getElementsByTagName("body")[0].appendChild(e);var o=document.getElementById(r.frameId);o.onload=function(){if("pdf"!==r.type){var e=o.contentWindow||o.contentDocument;if(e.document&&(e=e.document),e.body.appendChild(r.printableElement),"pdf"!==r.type&&r.style){var t=document.createElement("style");t.innerHTML=r.style,e.head.appendChild(t)}var n=e.getElementsByTagName("img");0<n.length?function(e){var t=[],n=!0,r=!1,o=void 0;try{for(var i,a=e[Symbol.iterator]();!(n=(i=a.next()).done);n=!0){var l=i.value;t.push(u(l))}}catch(e){r=!0,o=e}finally{try{!n&&a.return&&a.return()}finally{if(r)throw o}}return Promise.all(t)}(n).then(function(){return d(o,r)}):d(o,r)}else d(o,r)}}};function d(t,n){try{if(t.focus(),i.default.isEdge()||i.default.isIE())try{t.contentWindow.document.execCommand("print",!1,null)}catch(e){t.contentWindow.print()}else t.contentWindow.print()}catch(e){n.onError(e)}finally{(0,a.cleanUp)(n)}}function u(n){return new Promise(function(t){!function e(){n&&void 0!==n.naturalWidth&&0!==n.naturalWidth&&n.complete?t():setTimeout(e,500)}()})}t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.addWrapper=function(e,t){return'<div style="font-family:'+t.font+" !important; font-size: "+t.font_size+' !important; width:100%;">'+e+"</div>"},t.capitalizePrint=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},t.collectStyles=f,t.loopNodesCollectStyles=function e(t,n){for(var r=0;r<t.length;r++){var o=t[r];if(-1===n.ignoreElements.indexOf(o.getAttribute("id"))){var i=o.tagName;if("INPUT"===i||"TEXTAREA"===i||"SELECT"===i){var a=f(o,n),l=o.parentNode,d="SELECT"===i?document.createTextNode(o.options[o.selectedIndex].text):document.createTextNode(o.value),u=document.createElement("div");u.appendChild(d),u.setAttribute("style",a),l.appendChild(u),l.removeChild(o)}else o.setAttribute("style",f(o,n));var c=o.children;c&&c.length&&e(c,n)}else o.parentNode.removeChild(o)}},t.addHeader=function(e,t){var n=document.createElement("div");if(l(t.header))n.innerHTML=t.header;else{var r=document.createElement("h1"),o=document.createTextNode(t.header);r.appendChild(o),r.setAttribute("style",t.headerStyle),n.appendChild(r)}e.insertBefore(n,e.childNodes[0])},t.cleanUp=function(t){t.showModal&&r.default.close();t.onLoadingEnd&&t.onLoadingEnd();(t.showModal||t.onLoadingStart)&&window.URL.revokeObjectURL(t.printable);if(t.onPrintDialogClose){var n="mouseover";(o.default.isChrome()||o.default.isFirefox())&&(n="focus");window.addEventListener(n,function e(){window.removeEventListener(n,e),t.onPrintDialogClose()})}},t.isRawHTML=l;var r=a(n(3)),o=a(n(2));function a(e){return e&&e.__esModule?e:{default:e}}function f(e,t){var n=document.defaultView||window,r="",o=n.getComputedStyle(e,"");return Object.keys(o).map(function(e){(-1!==t.targetStyles.indexOf("*")||-1!==t.targetStyle.indexOf(o[e])||function(e,t){for(var n=0;n<e.length;n++)if("object"===(void 0===t?"undefined":i(t))&&-1!==t.indexOf(e[n]))return!0;return!1}(t.targetStyles,o[e]))&&o.getPropertyValue(o[e])&&(r+=o[e]+":"+o.getPropertyValue(o[e])+";")}),r+="max-width: "+t.maxWidth+"px !important;"+t.font_size+" !important;"}function l(e){return new RegExp("<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)</\\1>").test(e)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={isFirefox:function(){return"undefined"!=typeof InstallTrigger},isIE:function(){return-1!==navigator.userAgent.indexOf("MSIE")||!!document.documentMode},isEdge:function(){return!r.isIE()&&!!window.StyleMedia},isChrome:function(){return!!(0<arguments.length&&void 0!==arguments[0]?arguments[0]:window).chrome},isSafari:function(){return 0<Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")||-1!==navigator.userAgent.toLowerCase().indexOf("safari")}};t.default=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={show:function(e){var t=document.createElement("div");t.setAttribute("style","font-family:sans-serif; display:table; text-align:center; font-weight:300; font-size:30px; left:0; top:0;position:fixed; z-index: 9990;color: #0460B5; width: 100%; height: 100%; background-color:rgba(255,255,255,.9);transition: opacity .3s ease;"),t.setAttribute("id","printJS-Modal");var n=document.createElement("div");n.setAttribute("style","display:table-cell; vertical-align:middle; padding-bottom:100px;");var r=document.createElement("div");r.setAttribute("class","printClose"),r.setAttribute("id","printClose"),n.appendChild(r);var o=document.createElement("span");o.setAttribute("class","printSpinner"),n.appendChild(o);var i=document.createTextNode(e.modalMessage);n.appendChild(i),t.appendChild(n),document.getElementsByTagName("body")[0].appendChild(t),document.getElementById("printClose").addEventListener("click",function(){a.close()})},close:function(){var e=document.getElementById("printJS-Modal");e.parentNode.removeChild(e)}};t.default=a},function(e,t,n){e.exports=n(5)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(6);var r,o=n(7);var i=((r=o)&&r.__esModule?r:{default:r}).default.init;"undefined"!=typeof window&&(window.printJS=i),t.default=i},function(e,t,n){},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=r(n(2)),l=r(n(3)),d=r(n(8)),u=r(n(9)),c=r(n(10)),f=r(n(11)),s=r(n(12));function r(e){return e&&e.__esModule?e:{default:e}}var p=["pdf","html","image","json","raw-html"];t.default={init:function(){var t={printable:null,fallbackPrintable:null,type:"pdf",header:null,headerStyle:"font-weight: 300;",maxWidth:800,font:"TimesNewRoman",font_size:"12pt",honorMarginPadding:!0,honorColor:!1,properties:null,gridHeaderStyle:"font-weight: bold; padding: 5px; border: 1px solid #dddddd;",gridStyle:"border: 1px solid lightgray; margin-bottom: -1px;",showModal:!1,onError:function(e){throw e},onLoadingStart:null,onLoadingEnd:null,onPrintDialogClose:null,onPdfOpen:null,onBrowserIncompatible:function(){return!0},modalMessage:"Retrieving Document...",frameId:"printJS",printableElement:null,documentTitle:"Document",targetStyle:["clear","display","width","min-width","height","min-height","max-height"],targetStyles:["border","box","break","text-decoration"],ignoreElements:[],imageStyle:"max-width: 100%;",repeatTableHeader:!0,css:null,style:null,scanStyles:!0,base64:!1},e=arguments[0];if(void 0===e)throw new Error("printJS expects at least 1 attribute.");switch(void 0===e?"undefined":i(e)){case"string":t.printable=encodeURI(e),t.fallbackPrintable=t.printable,t.type=arguments[1]||t.type;break;case"object":for(var n in t.printable=e.printable,t.base64=void 0!==e.base64,t.fallbackPrintable=void 0!==e.fallbackPrintable?e.fallbackPrintable:t.printable,t.fallbackPrintable=t.base64?"data:application/pdf;base64,"+t.fallbackPrintable:t.fallbackPrintable,t)"printable"!==n&&"fallbackPrintable"!==n&&"base64"!==n&&(t[n]=void 0!==e[n]?e[n]:t[n]);break;default:throw new Error('Unexpected argument type! Expected "string" or "object", got '+(void 0===e?"undefined":i(e)))}if(!t.printable)throw new Error("Missing printable information.");if(!t.type||"string"!=typeof t.type||-1===p.indexOf(t.type.toLowerCase()))throw new Error("Invalid print type. Available types are: pdf, html, image and json.");t.showModal&&l.default.show(t),t.onLoadingStart&&t.onLoadingStart();var r=document.getElementById(t.frameId);r&&r.parentNode.removeChild(r);var o=void 0;switch((o=document.createElement("iframe")).setAttribute("style","visibility: hidden; height: 0; width: 0; position: absolute;"),o.setAttribute("id",t.frameId),"pdf"!==t.type&&(o.srcdoc="<html><head><title>"+t.documentTitle+"</title>",null!==t.css&&(Array.isArray(t.css)||(t.css=[t.css]),t.css.forEach(function(e){o.srcdoc+='<link rel="stylesheet" href="'+e+'">'})),o.srcdoc+="</head><body></body></html>"),t.type){case"pdf":if(a.default.isFirefox()||a.default.isEdge()||a.default.isIE())try{if(console.info("PrintJS currently doesn't support PDF printing in Firefox, Internet Explorer and Edge."),!0===t.onBrowserIncompatible())window.open(t.fallbackPrintable,"_blank").focus(),t.onPdfOpen&&t.onPdfOpen()}catch(e){t.onError(e)}finally{t.showModal&&l.default.close(),t.onLoadingEnd&&t.onLoadingEnd()}else d.default.print(t,o);break;case"image":f.default.print(t,o);break;case"html":u.default.print(t,o);break;case"raw-html":c.default.print(t,o);break;case"json":s.default.print(t,o)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(0),i=(r=o)&&r.__esModule?r:{default:r},a=n(1);function l(e,t,n){var r=new window.Blob([n],{type:"application/pdf"});r=window.URL.createObjectURL(r),t.setAttribute("src",r),i.default.send(e,t)}t.default={print:function(e,t){if(e.base64){var n=Uint8Array.from(atob(e.printable),function(e){return e.charCodeAt(0)});l(e,t,n)}else{e.printable=/^(blob|http)/i.test(e.printable)?e.printable:window.location.origin+("/"!==e.printable.charAt(0)?"/"+e.printable:e.printable);var r=new window.XMLHttpRequest;r.responseType="arraybuffer",r.addEventListener("load",function(){if(-1===[200,201].indexOf(r.status))return(0,a.cleanUp)(e),void e.onError(r.statusText);l(e,t,r.response)}),r.open("GET",e.printable,!0),r.send()}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(1),i=n(0),a=(r=i)&&r.__esModule?r:{default:r};t.default={print:function(e,t){var n=document.getElementById(e.printable);n?(e.printableElement=function e(t,n){var r=t.cloneNode();var o=!0;var i=!1;var a=void 0;try{for(var l,d=t.childNodes[Symbol.iterator]();!(o=(l=d.next()).done);o=!0){var u=l.value;if(-1===n.ignoreElements.indexOf(u.id)){var c=e(u,n);r.appendChild(c)}}}catch(e){i=!0,a=e}finally{try{!o&&d.return&&d.return()}finally{if(i)throw a}}switch(t.tagName){case"SELECT":r.value=t.value;break;case"CANVAS":r.getContext("2d").drawImage(t,0,0)}return r}(n,e),e.header&&(0,o.addHeader)(e.printableElement,e),a.default.send(e,t)):window.console.error("Invalid HTML element id: "+e.printable)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(0),i=(r=o)&&r.__esModule?r:{default:r};t.default={print:function(e,t){e.printableElement=document.createElement("div"),e.printableElement.setAttribute("style","width:100%"),e.printableElement.innerHTML=e.printable,i.default.send(e,t)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(1),i=n(0),a=(r=i)&&r.__esModule?r:{default:r};t.default={print:function(r,e){r.printable.constructor!==Array&&(r.printable=[r.printable]),r.printableElement=document.createElement("div"),r.printable.forEach(function(e){var t=document.createElement("img");t.setAttribute("style",r.imageStyle),t.src=e;var n=document.createElement("div");n.appendChild(t),r.printableElement.appendChild(n)}),r.header&&(0,o.addHeader)(r.printableElement,r),a.default.send(r,e)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c=n(1),i=n(0),a=(r=i)&&r.__esModule?r:{default:r};t.default={print:function(t,e){if("object"!==o(t.printable))throw new Error("Invalid javascript data object (JSON).");if("boolean"!=typeof t.repeatTableHeader)throw new Error("Invalid value for repeatTableHeader attribute (JSON).");if(!t.properties||!Array.isArray(t.properties))throw new Error("Invalid properties array for your JSON data.");t.properties=t.properties.map(function(e){return{field:"object"===(void 0===e?"undefined":o(e))?e.field:e,displayName:"object"===(void 0===e?"undefined":o(e))?e.displayName:e,columnSize:"object"===(void 0===e?"undefined":o(e))&&e.columnSize?e.columnSize+";":100/t.properties.length+"%;"}}),t.printableElement=document.createElement("div"),t.header&&(0,c.addHeader)(t.printableElement,t),t.printableElement.innerHTML+=function(e){var t=e.printable,n=e.properties,r='<table style="border-collapse: collapse; width: 100%;">';e.repeatTableHeader&&(r+="<thead>");r+="<tr>";for(var o=0;o<n.length;o++)r+='<th style="width:'+n[o].columnSize+";"+e.gridHeaderStyle+'">'+(0,c.capitalizePrint)(n[o].displayName)+"</th>";r+="</tr>",e.repeatTableHeader&&(r+="</thead>");r+="<tbody>";for(var i=0;i<t.length;i++){r+="<tr>";for(var a=0;a<n.length;a++){var l=t[i],d=n[a].field.split(".");if(1<d.length)for(var u=0;u<d.length;u++)l=l[d[u]];else l=l[n[a].field];r+='<td style="width:'+n[a].columnSize+e.gridStyle+'">'+l+"</td>"}r+="</tr>"}return r+="</tbody></table>"}(t),a.default.send(t,e)}}}]).default});

//PDF.JS Compatibility v1.1.114 https://cdnjs.cloudflare.com/ajax/libs/pdf.js/1.1.114/compatibility.min.js
"undefined"==typeof PDFJS&&(("undefined"!=typeof window?window:this).PDFJS={}),function(){function e(e,t){return new n(this.slice(e,t))}function t(e,t){arguments.length<2&&(t=0);for(var n=0,r=e.length;r>n;++n,++t)this[t]=255&e[n]}function n(n){var r,i,o;if("number"==typeof n)for(r=[],i=0;n>i;++i)r[i]=0;else if("slice"in n)r=n.slice(0);else for(r=[],i=0,o=n.length;o>i;++i)r[i]=n[i];return r.subarray=e,r.buffer=r,r.byteLength=r.length,r.set=t,"object"==typeof n&&n.buffer&&(r.buffer=n.buffer),r}return"undefined"!=typeof Uint8Array?("undefined"==typeof Uint8Array.prototype.subarray&&(Uint8Array.prototype.subarray=function(e,t){return new Uint8Array(this.slice(e,t))},Float32Array.prototype.subarray=function(e,t){return new Float32Array(this.slice(e,t))}),void("undefined"==typeof Float64Array&&(window.Float64Array=Float32Array))):(window.Uint8Array=n,window.Int8Array=n,window.Uint32Array=n,window.Int32Array=n,window.Uint16Array=n,window.Float32Array=n,void(window.Float64Array=n))}(),function(){window.URL||(window.URL=window.webkitURL)}(),function(){if("undefined"!=typeof Object.defineProperty){var e=!0;try{Object.defineProperty(new Image,"id",{value:"test"});var t=function(){};t.prototype={get id(){}},Object.defineProperty(new t,"id",{value:"",configurable:!0,enumerable:!0,writable:!1})}catch(n){e=!1}if(e)return}Object.defineProperty=function(e,t,n){delete e[t],"get"in n&&e.__defineGetter__(t,n.get),"set"in n&&e.__defineSetter__(t,n.set),"value"in n&&(e.__defineSetter__(t,function(e){return this.__defineGetter__(t,function(){return e}),e}),e[t]=n.value)}}(),function(){var e=XMLHttpRequest.prototype,t=new XMLHttpRequest;return"overrideMimeType"in t||Object.defineProperty(e,"overrideMimeType",{value:function(e){}}),"responseType"in t?void 0:(PDFJS.disableWorker=!0,Object.defineProperty(e,"responseType",{get:function(){return this._responseType||"text"},set:function(e){"text"!==e&&"arraybuffer"!==e||(this._responseType=e,"arraybuffer"===e&&"function"==typeof this.overrideMimeType&&this.overrideMimeType("text/plain; charset=x-user-defined"))}}),"undefined"!=typeof VBArray?void Object.defineProperty(e,"response",{get:function(){return"arraybuffer"===this.responseType?new Uint8Array(new VBArray(this.responseBody).toArray()):this.responseText}}):void Object.defineProperty(e,"response",{get:function(){if("arraybuffer"!==this.responseType)return this.responseText;var e,t=this.responseText,n=t.length,r=new Uint8Array(n);for(e=0;n>e;++e)r[e]=255&t.charCodeAt(e);return r.buffer}}))}(),function(){if(!("btoa"in window)){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";window.btoa=function(t){var n,r,i="";for(n=0,r=t.length;r>n;n+=3){var o=255&t.charCodeAt(n),a=255&t.charCodeAt(n+1),s=255&t.charCodeAt(n+2),u=o>>2,f=(3&o)<<4|a>>4,c=r>n+1?(15&a)<<2|s>>6:64,d=r>n+2?63&s:64;i+=e.charAt(u)+e.charAt(f)+e.charAt(c)+e.charAt(d)}return i}}}(),function(){if(!("atob"in window)){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";window.atob=function(t){if(t=t.replace(/=+$/,""),t.length%4===1)throw new Error("bad atob input");for(var n,r,i=0,o=0,a="";r=t.charAt(o++);~r&&(n=i%4?64*n+r:r,i++%4)?a+=String.fromCharCode(255&n>>(-2*i&6)):0)r=e.indexOf(r);return a}}}(),function(){"undefined"==typeof Function.prototype.bind&&(Function.prototype.bind=function(e){var t=this,n=Array.prototype.slice.call(arguments,1),r=function(){var r=n.concat(Array.prototype.slice.call(arguments));return t.apply(e,r)};return r})}(),function(){var e=document.createElement("div");"dataset"in e||Object.defineProperty(HTMLElement.prototype,"dataset",{get:function(){if(this._dataset)return this._dataset;for(var e={},t=0,n=this.attributes.length;n>t;t++){var r=this.attributes[t];if("data-"===r.name.substring(0,5)){var i=r.name.substring(5).replace(/\-([a-z])/g,function(e,t){return t.toUpperCase()});e[i]=r.value}}return Object.defineProperty(this,"_dataset",{value:e,writable:!1,enumerable:!1}),e},enumerable:!0})}(),function(){function e(e,t,n,r){var i=e.className||"",o=i.split(/\s+/g);""===o[0]&&o.shift();var a=o.indexOf(t);return 0>a&&n&&o.push(t),a>=0&&r&&o.splice(a,1),e.className=o.join(" "),a>=0}var t=document.createElement("div");if(!("classList"in t)){var n={add:function(t){e(this.element,t,!0,!1)},contains:function(t){return e(this.element,t,!1,!1)},remove:function(t){e(this.element,t,!1,!0)},toggle:function(t){e(this.element,t,!0,!0)}};Object.defineProperty(HTMLElement.prototype,"classList",{get:function(){if(this._classList)return this._classList;var e=Object.create(n,{element:{value:this,writable:!1,enumerable:!0}});return Object.defineProperty(this,"_classList",{value:e,writable:!1,enumerable:!1}),e},enumerable:!0})}}(),function(){"console"in window?"bind"in console.log||(console.log=function(e){return function(t){return e(t)}}(console.log),console.error=function(e){return function(t){return e(t)}}(console.error),console.warn=function(e){return function(t){return e(t)}}(console.warn)):window.console={log:function(){},error:function(){},warn:function(){}}}(),function(){function e(e){t(e.target)&&e.stopPropagation()}function t(e){return e.disabled||e.parentNode&&t(e.parentNode)}-1!==navigator.userAgent.indexOf("Opera")&&document.addEventListener("click",e,!0)}(),function(){navigator.userAgent.indexOf("Trident")>=0&&(PDFJS.disableCreateObjectURL=!0)}(),function(){"language"in navigator||(PDFJS.locale=navigator.userLanguage||"en-US")}(),function(){var e=Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")>0,t=/Android\s[0-2][^\d]/,n=t.test(navigator.userAgent),r=/Chrome\/(39|40)\./.test(navigator.userAgent);(e||n||r)&&(PDFJS.disableRange=!0,PDFJS.disableStream=!0)}(),function(){(!history.pushState||navigator.userAgent.indexOf("Android 2.")>=0)&&(PDFJS.disableHistory=!0)}(),function(){if(window.CanvasPixelArray)"function"!=typeof window.CanvasPixelArray.prototype.set&&(window.CanvasPixelArray.prototype.set=function(e){for(var t=0,n=this.length;n>t;t++)this[t]=e[t]});else{var e,t=!1;if(navigator.userAgent.indexOf("Chrom")>=0?(e=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./),t=e&&parseInt(e[2])<21):navigator.userAgent.indexOf("Android")>=0?t=/Android\s[0-4][^\d]/g.test(navigator.userAgent):navigator.userAgent.indexOf("Safari")>=0&&(e=navigator.userAgent.match(/Version\/([0-9]+)\.([0-9]+)\.([0-9]+) Safari\//),t=e&&parseInt(e[1])<6),t){var n=window.CanvasRenderingContext2D.prototype;n._createImageData=n.createImageData,n.createImageData=function(e,t){var n=this._createImageData(e,t);return n.data.set=function(e){for(var t=0,n=this.length;n>t;t++)this[t]=e[t]},n}}}}(),function(){function e(e){window.setTimeout(e,20)}var t=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);return t?void(window.requestAnimationFrame=e):void("requestAnimationFrame"in window||(window.requestAnimationFrame=window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||e))}(),function(){var e=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),t=/Android/g.test(navigator.userAgent);(e||t)&&(PDFJS.maxCanvasPixels=5242880)}(),function(){var e=navigator.userAgent.indexOf("Trident")>=0&&window.parent!==window;e&&(PDFJS.disableFullscreen=!0)}();

//PDF.JS Library v1.1.114 https://cdnjs.cloudflare.com/ajax/libs/pdf.js/1.1.114/pdf.min.js
"undefined"==typeof PDFJS&&(("undefined"!=typeof window?window:this).PDFJS={}),PDFJS.version="1.1.114",PDFJS.build="3fd44fd",function(){"use strict";function t(t){PDFJS.verbosity>=PDFJS.VERBOSITY_LEVELS.infos&&console.log("Info: "+t)}function e(t){PDFJS.verbosity>=PDFJS.VERBOSITY_LEVELS.warnings&&console.log("Warning: "+t)}function n(t){throw PDFJS.verbosity>=PDFJS.VERBOSITY_LEVELS.errors&&(console.log("Error: "+t),console.log(i())),R.notify(L.unknown),new Error(t)}function i(){try{throw new Error}catch(t){return t.stack?t.stack.split("\n").slice(2).join("\n"):""}}function r(t,e){t||n(e)}function a(t,e){if(!e)return t;if(/^[a-z][a-z0-9+\-.]*:/i.test(e))return e;var n;if("/"===e.charAt(0))return n=t.indexOf("://"),"/"===e.charAt(1)?++n:n=t.indexOf("/",n+3),t.substring(0,n)+e;var i=t.length;n=t.lastIndexOf("#"),i=n>=0?n:i,n=t.lastIndexOf("?",i),i=n>=0?n:i;var r=t.lastIndexOf("/",i);return t.substring(0,r+1)+e}function s(t,e){if(!t)return!1;var n=/^[a-z][a-z0-9+\-.]*(?=:)/i.exec(t);if(!n)return e;switch(n=n[0].toLowerCase()){case"http":case"https":case"ftp":case"mailto":case"tel":return!0;default:return!1}}function o(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!1}),n}function l(t){r(null!==t&&"object"==typeof t&&void 0!==t.length,"Invalid argument for bytesToString");var e=t.length,n=8192;if(n>e)return String.fromCharCode.apply(null,t);for(var i=[],a=0;e>a;a+=n){var s=Math.min(a+n,e),o=t.subarray(a,s);i.push(String.fromCharCode.apply(null,o))}return i.join("")}function c(t){r("string"==typeof t,"Invalid argument for stringToBytes");for(var e=t.length,n=new Uint8Array(e),i=0;e>i;++i)n[i]=255&t.charCodeAt(i);return n}function h(t){return String.fromCharCode(t>>24&255,t>>16&255,t>>8&255,255&t)}function u(){var t=new Uint8Array(2);t[0]=1;var e=new Uint16Array(t.buffer);return 1===e[0]}function d(){var t=document.createElement("canvas");t.width=t.height=1;var e=t.getContext("2d"),n=e.createImageData(1,1);return"undefined"!=typeof n.data.buffer}function f(t){return"number"==typeof t}function p(t){return t instanceof Array}function A(t){return"object"==typeof t&&null!==t&&void 0!==t.byteLength}function g(){var t={};return t.promise=new Promise(function(e,n){t.resolve=e,t.reject=n}),t}function m(t,e){this.name=t,this.comObj=e,this.callbackIndex=1,this.postMessageTransfers=!0;var i=this.callbacksCapabilities={},r=this.actionHandler={};r.console_log=[function(t){console.log.apply(console,t)}],r.console_error=[function(t){console.error.apply(console,t)}],r._unsupported_feature=[function(t){R.notify(t)}],e.onmessage=function(t){var a=t.data;if(a.isReply){var s=a.callbackId;if(a.callbackId in i){var o=i[s];delete i[s],"error"in a?o.reject(a.error):o.resolve(a.data)}else n("Cannot resolve callback "+s)}else if(a.action in r){var l=r[a.action];a.callbackId?Promise.resolve().then(function(){return l[0].call(l[1],a.data)}).then(function(t){e.postMessage({isReply:!0,callbackId:a.callbackId,data:t})},function(t){e.postMessage({isReply:!0,callbackId:a.callbackId,error:t})}):l[0].call(l[1],a.data)}else n("Unknown action from worker: "+a.action)}}function v(t,n,i){var r=new Image;r.onload=function(){i.resolve(t,r)},r.onerror=function(){i.resolve(t,null),e("Error during JPEG image loading")},r.src=n}function b(t,e){var n=document.createElement("canvas");return n.width=t,n.height=e,n}function S(t){t.mozCurrentTransform||(t._originalSave=t.save,t._originalRestore=t.restore,t._originalRotate=t.rotate,t._originalScale=t.scale,t._originalTranslate=t.translate,t._originalTransform=t.transform,t._originalSetTransform=t.setTransform,t._transformMatrix=t._transformMatrix||[1,0,0,1,0,0],t._transformStack=[],Object.defineProperty(t,"mozCurrentTransform",{get:function(){return this._transformMatrix}}),Object.defineProperty(t,"mozCurrentTransformInverse",{get:function(){var t=this._transformMatrix,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],s=t[5],o=e*r-n*i,l=n*i-e*r;return[r/o,n/l,i/l,e/o,(r*a-i*s)/l,(n*a-e*s)/o]}}),t.save=function(){var t=this._transformMatrix;this._transformStack.push(t),this._transformMatrix=t.slice(0,6),this._originalSave()},t.restore=function(){var t=this._transformStack.pop();t&&(this._transformMatrix=t,this._originalRestore())},t.translate=function(t,e){var n=this._transformMatrix;n[4]=n[0]*t+n[2]*e+n[4],n[5]=n[1]*t+n[3]*e+n[5],this._originalTranslate(t,e)},t.scale=function(t,e){var n=this._transformMatrix;n[0]=n[0]*t,n[1]=n[1]*t,n[2]=n[2]*e,n[3]=n[3]*e,this._originalScale(t,e)},t.transform=function(e,n,i,r,a,s){var o=this._transformMatrix;this._transformMatrix=[o[0]*e+o[2]*n,o[1]*e+o[3]*n,o[0]*i+o[2]*r,o[1]*i+o[3]*r,o[0]*a+o[2]*s+o[4],o[1]*a+o[3]*s+o[5]],t._originalTransform(e,n,i,r,a,s)},t.setTransform=function(e,n,i,r,a,s){this._transformMatrix=[e,n,i,r,a,s],t._originalSetTransform(e,n,i,r,a,s)},t.rotate=function(t){var e=Math.cos(t),n=Math.sin(t),i=this._transformMatrix;this._transformMatrix=[i[0]*e+i[2]*n,i[1]*e+i[3]*n,i[0]*-n+i[2]*e,i[1]*-n+i[3]*e,i[4],i[5]],this._originalRotate(t)})}function x(t){var e,n,i,r,a=1e3,s=t.width,o=t.height,l=s+1,c=new Uint8Array(l*(o+1)),h=new Uint8Array([0,2,4,0,1,0,5,4,8,10,0,8,0,2,1,0]),u=s+7&-8,d=t.data,f=new Uint8Array(u*o),p=0;for(e=0,r=d.length;r>e;e++)for(var A=128,g=d[e];A>0;)f[p++]=g&A?0:255,A>>=1;var m=0;for(p=0,0!==f[p]&&(c[0]=1,++m),n=1;s>n;n++)f[p]!==f[p+1]&&(c[n]=f[p]?2:1,++m),p++;for(0!==f[p]&&(c[n]=2,++m),e=1;o>e;e++){p=e*u,i=e*l,f[p-u]!==f[p]&&(c[i]=f[p]?1:8,++m);var v=(f[p]?4:0)+(f[p-u]?8:0);for(n=1;s>n;n++)v=(v>>2)+(f[p+1]?4:0)+(f[p-u+1]?8:0),h[v]&&(c[i+n]=h[v],++m),p++;if(f[p-u]!==f[p]&&(c[i+n]=f[p]?2:4,++m),m>a)return null}for(p=u*(o-1),i=e*l,0!==f[p]&&(c[i]=8,++m),n=1;s>n;n++)f[p]!==f[p+1]&&(c[i+n]=f[p]?4:8,++m),p++;if(0!==f[p]&&(c[i+n]=4,++m),m>a)return null;var b=new Int32Array([0,l,-1,0,-l,0,0,0,1]),S=[];for(e=0;m&&o>=e;e++){for(var x=e*l,y=x+s;y>x&&!c[x];)x++;if(x!==y){var k,P=[x%l,e],C=c[x],F=x;do{var D=b[C];do x+=D;while(!c[x]);k=c[x],5!==k&&10!==k?(C=k,c[x]=0):(C=k&51*C>>4,c[x]&=C>>2|C<<2),P.push(x%l),P.push(x/l|0),--m}while(F!==x);S.push(P),--e}}var w=function(t){t.save(),t.scale(1/s,-1/o),t.translate(0,-o),t.beginPath();for(var e=0,n=S.length;n>e;e++){var i=S[e];t.moveTo(i[0],i[1]);for(var r=2,a=i.length;a>r;r+=2)t.lineTo(i[r],i[r+1])}t.fill(),t.beginPath(),t.restore()};return w}function y(t){var e=ot[t[0]];return e||n("Unknown IR type: "+t[0]),e.fromIR(t)}var k="undefined"==typeof window?this:window,P="undefined"==typeof window,C=[.001,0,0,.001,0,0],F={FILL:0,STROKE:1,FILL_STROKE:2,INVISIBLE:3,FILL_ADD_TO_PATH:4,STROKE_ADD_TO_PATH:5,FILL_STROKE_ADD_TO_PATH:6,ADD_TO_PATH:7,FILL_STROKE_MASK:3,ADD_TO_PATH_FLAG:4},D={GRAYSCALE_1BPP:1,RGB_24BPP:2,RGBA_32BPP:3},w={WIDGET:1,TEXT:2,LINK:3};k.PDFJS||(k.PDFJS={}),k.PDFJS.pdfBug=!1,PDFJS.VERBOSITY_LEVELS={errors:0,warnings:1,infos:5};var T=PDFJS.OPS={dependency:1,setLineWidth:2,setLineCap:3,setLineJoin:4,setMiterLimit:5,setDash:6,setRenderingIntent:7,setFlatness:8,setGState:9,save:10,restore:11,transform:12,moveTo:13,lineTo:14,curveTo:15,curveTo2:16,curveTo3:17,closePath:18,rectangle:19,stroke:20,closeStroke:21,fill:22,eoFill:23,fillStroke:24,eoFillStroke:25,closeFillStroke:26,closeEOFillStroke:27,endPath:28,clip:29,eoClip:30,beginText:31,endText:32,setCharSpacing:33,setWordSpacing:34,setHScale:35,setLeading:36,setFont:37,setTextRenderingMode:38,setTextRise:39,moveText:40,setLeadingMoveText:41,setTextMatrix:42,nextLine:43,showText:44,showSpacedText:45,nextLineShowText:46,nextLineSetSpacingShowText:47,setCharWidth:48,setCharWidthAndBounds:49,setStrokeColorSpace:50,setFillColorSpace:51,setStrokeColor:52,setStrokeColorN:53,setFillColor:54,setFillColorN:55,setStrokeGray:56,setFillGray:57,setStrokeRGBColor:58,setFillRGBColor:59,setStrokeCMYKColor:60,setFillCMYKColor:61,shadingFill:62,beginInlineImage:63,beginImageData:64,endInlineImage:65,paintXObject:66,markPoint:67,markPointProps:68,beginMarkedContent:69,beginMarkedContentProps:70,endMarkedContent:71,beginCompat:72,endCompat:73,paintFormXObjectBegin:74,paintFormXObjectEnd:75,beginGroup:76,endGroup:77,beginAnnotations:78,endAnnotations:79,beginAnnotation:80,endAnnotation:81,paintJpegXObject:82,paintImageMaskXObject:83,paintImageMaskXObjectGroup:84,paintImageXObject:85,paintInlineImageXObject:86,paintInlineImageXObjectGroup:87,paintImageXObjectRepeat:88,paintImageMaskXObjectRepeat:89,paintSolidColorImageMask:90,constructPath:91},L=PDFJS.UNSUPPORTED_FEATURES={unknown:"unknown",forms:"forms",javaScript:"javaScript",smask:"smask",shadingPattern:"shadingPattern",font:"font"},R=PDFJS.UnsupportedManager=function(){var t=[];return{listen:function(e){t.push(e)},notify:function(n){e('Unsupported feature "'+n+'"');for(var i=0,r=t.length;r>i;i++)t[i](n)}}}();PDFJS.isValidUrl=s,PDFJS.shadow=o;var E=PDFJS.PasswordResponses={NEED_PASSWORD:1,INCORRECT_PASSWORD:2},I=function(){function t(t,e){this.name="PasswordException",this.message=t,this.code=e}return t.prototype=new Error,t.constructor=t,t}();PDFJS.PasswordException=I;var M=function(){function t(t,e){this.name="UnknownErrorException",this.message=t,this.details=e}return t.prototype=new Error,t.constructor=t,t}();PDFJS.UnknownErrorException=M;var _=function(){function t(t){this.name="InvalidPDFException",this.message=t}return t.prototype=new Error,t.constructor=t,t}();PDFJS.InvalidPDFException=_;var O=function(){function t(t){this.name="MissingPDFException",this.message=t}return t.prototype=new Error,t.constructor=t,t}();PDFJS.MissingPDFException=O;var j=function(){function t(t,e){this.name="UnexpectedResponseException",this.message=t,this.status=e}return t.prototype=new Error,t.constructor=t,t}();PDFJS.UnexpectedResponseException=j;(function(){function t(t){this.message=t}return t.prototype=new Error,t.prototype.name="NotImplementedException",t.constructor=t,t})(),function(){function t(t,e){this.begin=t,this.end=e,this.message="Missing data ["+t+", "+e+")"}return t.prototype=new Error,t.prototype.name="MissingDataException",t.constructor=t,t}(),function(){function t(t){this.message=t}return t.prototype=new Error,t.prototype.name="XRefParseException",t.constructor=t,t}();Object.defineProperty(PDFJS,"isLittleEndian",{configurable:!0,get:function(){return o(PDFJS,"isLittleEndian",u())}}),Object.defineProperty(PDFJS,"hasCanvasTypedArrays",{configurable:!0,get:function(){return o(PDFJS,"hasCanvasTypedArrays",d())}});var N=function(){function t(t,e){this.buffer=t,this.byteLength=t.length,this.length=void 0===e?this.byteLength>>2:e,n(this.length)}function e(t){return{get:function(){var e=this.buffer,n=t<<2;return(e[n]|e[n+1]<<8|e[n+2]<<16|e[n+3]<<24)>>>0},set:function(e){var n=this.buffer,i=t<<2;n[i]=255&e,n[i+1]=e>>8&255,n[i+2]=e>>16&255,n[i+3]=e>>>24&255}}}function n(n){for(;n>i;)Object.defineProperty(t.prototype,i,e(i)),i++}t.prototype=Object.create(null);var i=0;return t}(),J=[1,0,0,1,0,0],B=PDFJS.Util=function(){function t(){}var e=["rgb(",0,",",0,",",0,")"];return t.makeCssRgb=function(t,n,i){return e[1]=t,e[3]=n,e[5]=i,e.join("")},t.transform=function(t,e){return[t[0]*e[0]+t[2]*e[1],t[1]*e[0]+t[3]*e[1],t[0]*e[2]+t[2]*e[3],t[1]*e[2]+t[3]*e[3],t[0]*e[4]+t[2]*e[5]+t[4],t[1]*e[4]+t[3]*e[5]+t[5]]},t.applyTransform=function(t,e){var n=t[0]*e[0]+t[1]*e[2]+e[4],i=t[0]*e[1]+t[1]*e[3]+e[5];return[n,i]},t.applyInverseTransform=function(t,e){var n=e[0]*e[3]-e[1]*e[2],i=(t[0]*e[3]-t[1]*e[2]+e[2]*e[5]-e[4]*e[3])/n,r=(-t[0]*e[1]+t[1]*e[0]+e[4]*e[1]-e[5]*e[0])/n;return[i,r]},t.getAxialAlignedBoundingBox=function(e,n){var i=t.applyTransform(e,n),r=t.applyTransform(e.slice(2,4),n),a=t.applyTransform([e[0],e[3]],n),s=t.applyTransform([e[2],e[1]],n);return[Math.min(i[0],r[0],a[0],s[0]),Math.min(i[1],r[1],a[1],s[1]),Math.max(i[0],r[0],a[0],s[0]),Math.max(i[1],r[1],a[1],s[1])]},t.inverseTransform=function(t){var e=t[0]*t[3]-t[1]*t[2];return[t[3]/e,-t[1]/e,-t[2]/e,t[0]/e,(t[2]*t[5]-t[4]*t[3])/e,(t[4]*t[1]-t[5]*t[0])/e]},t.apply3dTransform=function(t,e){return[t[0]*e[0]+t[1]*e[1]+t[2]*e[2],t[3]*e[0]+t[4]*e[1]+t[5]*e[2],t[6]*e[0]+t[7]*e[1]+t[8]*e[2]]},t.singularValueDecompose2dScale=function(t){var e=[t[0],t[2],t[1],t[3]],n=t[0]*e[0]+t[1]*e[2],i=t[0]*e[1]+t[1]*e[3],r=t[2]*e[0]+t[3]*e[2],a=t[2]*e[1]+t[3]*e[3],s=(n+a)/2,o=Math.sqrt((n+a)*(n+a)-4*(n*a-r*i))/2,l=s+o||1,c=s-o||1;return[Math.sqrt(l),Math.sqrt(c)]},t.normalizeRect=function(t){var e=t.slice(0);return t[0]>t[2]&&(e[0]=t[2],e[2]=t[0]),t[1]>t[3]&&(e[1]=t[3],e[3]=t[1]),e},t.intersect=function(e,n){function i(t,e){return t-e}var r=[e[0],e[2],n[0],n[2]].sort(i),a=[e[1],e[3],n[1],n[3]].sort(i),s=[];return e=t.normalizeRect(e),n=t.normalizeRect(n),r[0]===e[0]&&r[1]===n[0]||r[0]===n[0]&&r[1]===e[0]?(s[0]=r[1],s[2]=r[2],a[0]===e[1]&&a[1]===n[1]||a[0]===n[1]&&a[1]===e[1]?(s[1]=a[1],s[3]=a[2],s):!1):!1},t.sign=function(t){return 0>t?-1:1},t.appendToArray=function(t,e){Array.prototype.push.apply(t,e)},t.prependToArray=function(t,e){Array.prototype.unshift.apply(t,e)},t.extendObj=function(t,e){for(var n in e)t[n]=e[n]},t.getInheritableProperty=function(t,e){for(;t&&!t.has(e);)t=t.get("Parent");return t?t.get(e):null},t.inherit=function(t,e,n){t.prototype=Object.create(e.prototype),t.prototype.constructor=t;for(var i in n)t.prototype[i]=n[i]},t.loadScript=function(t,e){var n=document.createElement("script"),i=!1;n.setAttribute("src",t),e&&(n.onload=function(){i||e(),i=!0}),document.getElementsByTagName("head")[0].appendChild(n)},t}();PDFJS.PageViewport=function(){function t(t,e,n,i,r,a){this.viewBox=t,this.scale=e,this.rotation=n,this.offsetX=i,this.offsetY=r;var s,o,l,c,h=(t[2]+t[0])/2,u=(t[3]+t[1])/2;switch(n%=360,n=0>n?n+360:n){case 180:s=-1,o=0,l=0,c=1;break;case 90:s=0,o=1,l=1,c=0;break;case 270:s=0,o=-1,l=-1,c=0;break;default:s=1,o=0,l=0,c=-1}a&&(l=-l,c=-c);var d,f,p,A;0===s?(d=Math.abs(u-t[1])*e+i,f=Math.abs(h-t[0])*e+r,p=Math.abs(t[3]-t[1])*e,A=Math.abs(t[2]-t[0])*e):(d=Math.abs(h-t[0])*e+i,f=Math.abs(u-t[1])*e+r,p=Math.abs(t[2]-t[0])*e,A=Math.abs(t[3]-t[1])*e),this.transform=[s*e,o*e,l*e,c*e,d-s*e*h-l*e*u,f-o*e*h-c*e*u],this.width=p,this.height=A,this.fontScale=e}return t.prototype={clone:function(e){e=e||{};var n="scale"in e?e.scale:this.scale,i="rotation"in e?e.rotation:this.rotation;return new t(this.viewBox.slice(),n,i,this.offsetX,this.offsetY,e.dontFlip)},convertToViewportPoint:function(t,e){return B.applyTransform([t,e],this.transform)},convertToViewportRectangle:function(t){var e=B.applyTransform([t[0],t[1]],this.transform),n=B.applyTransform([t[2],t[3]],this.transform);return[e[0],e[1],n[0],n[1]]},convertToPdfPoint:function(t,e){return B.applyInverseTransform([t,e],this.transform)}},t}();PDFJS.createPromiseCapability=g,function(){function t(t){this._status=n,this._handlers=[];try{t.call(this,this._resolve.bind(this),this._reject.bind(this))}catch(e){this._reject(e)}}if(k.Promise)return"function"!=typeof k.Promise.all&&(k.Promise.all=function(t){var e,n,i=0,r=[],a=new k.Promise(function(t,i){e=t,n=i});return t.forEach(function(t,a){i++,t.then(function(t){r[a]=t,i--,0===i&&e(r)},n)}),0===i&&e(r),a}),"function"!=typeof k.Promise.resolve&&(k.Promise.resolve=function(t){return new k.Promise(function(e){e(t)})}),"function"!=typeof k.Promise.reject&&(k.Promise.reject=function(t){return new k.Promise(function(e,n){n(t)})}),void("function"!=typeof k.Promise.prototype["catch"]&&(k.Promise.prototype["catch"]=function(t){return k.Promise.prototype.then(void 0,t)}));var n=0,i=1,r=2,a=500,s={handlers:[],running:!1,unhandledRejections:[],pendingRejectionCheck:!1,scheduleHandlers:function(t){t._status!==n&&(this.handlers=this.handlers.concat(t._handlers),t._handlers=[],this.running||(this.running=!0,setTimeout(this.runHandlers.bind(this),0)))},runHandlers:function(){for(var t=1,e=Date.now()+t;this.handlers.length>0;){var n=this.handlers.shift(),a=n.thisPromise._status,s=n.thisPromise._value;try{a===i?"function"==typeof n.onResolve&&(s=n.onResolve(s)):"function"==typeof n.onReject&&(s=n.onReject(s),a=i,n.thisPromise._unhandledRejection&&this.removeUnhandeledRejection(n.thisPromise))}catch(o){a=r,s=o}if(n.nextPromise._updateStatus(a,s),Date.now()>=e)break}return this.handlers.length>0?void setTimeout(this.runHandlers.bind(this),0):void(this.running=!1)},addUnhandledRejection:function(t){this.unhandledRejections.push({promise:t,time:Date.now()}),this.scheduleRejectionCheck()},removeUnhandeledRejection:function(t){t._unhandledRejection=!1;for(var e=0;e<this.unhandledRejections.length;e++)this.unhandledRejections[e].promise===t&&(this.unhandledRejections.splice(e),e--)},scheduleRejectionCheck:function(){this.pendingRejectionCheck||(this.pendingRejectionCheck=!0,setTimeout(function(){this.pendingRejectionCheck=!1;for(var t=Date.now(),n=0;n<this.unhandledRejections.length;n++)if(t-this.unhandledRejections[n].time>a){var i=this.unhandledRejections[n].promise._value,r="Unhandled rejection: "+i;i.stack&&(r+="\n"+i.stack),e(r),this.unhandledRejections.splice(n),n--}this.unhandledRejections.length&&this.scheduleRejectionCheck()}.bind(this),a))}};t.all=function(e){function n(t){s._status!==r&&(l=[],a(t))}var i,a,s=new t(function(t,e){i=t,a=e}),o=e.length,l=[];if(0===o)return i(l),s;for(var c=0,h=e.length;h>c;++c){var u=e[c],d=function(t){return function(e){s._status!==r&&(l[t]=e,o--,0===o&&i(l))}}(c);t.isPromise(u)?u.then(d,n):d(u)}return s},t.isPromise=function(t){return t&&"function"==typeof t.then},t.resolve=function(e){return new t(function(t){t(e)})},t.reject=function(e){return new t(function(t,n){n(e)})},t.prototype={_status:null,_value:null,_handlers:null,_unhandledRejection:null,_updateStatus:function(e,n){if(this._status!==i&&this._status!==r){if(e===i&&t.isPromise(n))return void n.then(this._updateStatus.bind(this,i),this._updateStatus.bind(this,r));this._status=e,this._value=n,e===r&&0===this._handlers.length&&(this._unhandledRejection=!0,s.addUnhandledRejection(this)),s.scheduleHandlers(this)}},_resolve:function(t){this._updateStatus(i,t)},_reject:function(t){this._updateStatus(r,t)},then:function(e,n){var i=new t(function(t,e){this.resolve=t,this.reject=e});return this._handlers.push({thisPromise:this,onResolve:e,onReject:n,nextPromise:i}),s.scheduleHandlers(this),i},"catch":function(t){return this.then(void 0,t)}},k.Promise=t}();var W=function(){function t(t,e,n){for(;t.length<n;)t+=e;return t}function n(){this.started={},this.times=[],this.enabled=!0}return n.prototype={time:function(t){this.enabled&&(t in this.started&&e("Timer is already running for "+t),this.started[t]=Date.now())},timeEnd:function(t){this.enabled&&(t in this.started||e("Timer has not been started for "+t),this.times.push({name:t,start:this.started[t],end:Date.now()}),delete this.started[t])},toString:function(){var e,n,i=this.times,r="",a=0;for(e=0,n=i.length;n>e;++e){var s=i[e].name;s.length>a&&(a=s.length)}for(e=0,n=i.length;n>e;++e){var o=i[e],l=o.end-o.start;r+=t(o.name," ",a)+" "+l+"ms\n"}return r}},n}();PDFJS.createBlob=function(t,e){if("undefined"!=typeof Blob)return new Blob([t],{type:e});var n=new MozBlobBuilder;return n.append(t),n.getBlob(e)},PDFJS.createObjectURL=function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";return function(e,n){if(!PDFJS.disableCreateObjectURL&&"undefined"!=typeof URL&&URL.createObjectURL){var i=PDFJS.createBlob(e,n);return URL.createObjectURL(i)}for(var r="data:"+n+";base64,",a=0,s=e.length;s>a;a+=3){var o=255&e[a],l=255&e[a+1],c=255&e[a+2],h=o>>2,u=(3&o)<<4|l>>4,d=s>a+1?(15&l)<<2|c>>6:64,f=s>a+2?63&c:64;r+=t[h]+t[u]+t[d]+t[f]}return r}}(),m.prototype={on:function(t,e,i){var r=this.actionHandler;r[t]&&n('There is already an actionName called "'+t+'"'),r[t]=[e,i]},send:function(t,e,n){var i={action:t,data:e};this.postMessage(i,n)},sendWithPromise:function(t,e,n){var i=this.callbackIndex++,r={action:t,data:e,callbackId:i},a=g();this.callbacksCapabilities[i]=a;try{this.postMessage(r,n)}catch(s){a.reject(s)}return a.promise},postMessage:function(t,e){e&&this.postMessageTransfers?this.comObj.postMessage(t,e):this.comObj.postMessage(t)}},PDFJS.maxImageSize=void 0===PDFJS.maxImageSize?-1:PDFJS.maxImageSize,PDFJS.cMapUrl=void 0===PDFJS.cMapUrl?null:PDFJS.cMapUrl,PDFJS.cMapPacked=void 0===PDFJS.cMapPacked?!1:PDFJS.cMapPacked,PDFJS.disableFontFace=void 0===PDFJS.disableFontFace?!1:PDFJS.disableFontFace,PDFJS.imageResourcesPath=void 0===PDFJS.imageResourcesPath?"":PDFJS.imageResourcesPath,PDFJS.disableWorker=void 0===PDFJS.disableWorker?!1:PDFJS.disableWorker,PDFJS.workerSrc=void 0===PDFJS.workerSrc?null:PDFJS.workerSrc,PDFJS.disableRange=void 0===PDFJS.disableRange?!1:PDFJS.disableRange,PDFJS.disableStream=void 0===PDFJS.disableStream?!1:PDFJS.disableStream,PDFJS.disableAutoFetch=void 0===PDFJS.disableAutoFetch?!1:PDFJS.disableAutoFetch,PDFJS.pdfBug=void 0===PDFJS.pdfBug?!1:PDFJS.pdfBug,PDFJS.postMessageTransfers=void 0===PDFJS.postMessageTransfers?!0:PDFJS.postMessageTransfers,PDFJS.disableCreateObjectURL=void 0===PDFJS.disableCreateObjectURL?!1:PDFJS.disableCreateObjectURL,PDFJS.disableWebGL=void 0===PDFJS.disableWebGL?!0:PDFJS.disableWebGL,PDFJS.disableFullscreen=void 0===PDFJS.disableFullscreen?!1:PDFJS.disableFullscreen,PDFJS.useOnlyCssZoom=void 0===PDFJS.useOnlyCssZoom?!1:PDFJS.useOnlyCssZoom,PDFJS.verbosity=void 0===PDFJS.verbosity?PDFJS.VERBOSITY_LEVELS.warnings:PDFJS.verbosity,PDFJS.maxCanvasPixels=void 0===PDFJS.maxCanvasPixels?16777216:PDFJS.maxCanvasPixels,PDFJS.openExternalLinksInNewWindow=void 0===PDFJS.openExternalLinksInNewWindow?!1:PDFJS.openExternalLinksInNewWindow,PDFJS.getDocument=function(t,e,i,r){var s=new G;e&&(e instanceof U||(e=Object.create(e),e.length=t.length,e.initialData=t.initialData),t=Object.create(t),t.range=e),s.onPassword=i||null,s.onProgress=r||null;var o,l,h;"string"==typeof t?h={url:t}:A(t)?h={data:t}:t instanceof U?h={range:t}:("object"!=typeof t&&n("Invalid parameter in getDocument, need either Uint8Array, string or a parameter object"),t.url||t.data||t.range||n("Invalid parameter object: need either .data, .range or .url"),h=t);var u={};for(var d in h)if("url"!==d||"undefined"==typeof window){if("range"!==d)if("data"!==d||h[d]instanceof Uint8Array)u[d]=h[d];else{var f=h[d];"string"==typeof f?u[d]=c(f):"object"!=typeof f||null===f||isNaN(f.length)?n("Invalid PDF binary data: either typed array, string or array-like object is expected in the data property."):u[d]=new Uint8Array(f)}}else u[d]=a(window.location.href,h[d]);return o=g(),l=new Y(o,h.range),o.promise.then(function(){l.fetchDocument(s,u)}),s};var G=function(){function t(){this._capability=g(),this.onPassword=null,this.onProgress=null}return t.prototype={get promise(){return this._capability.promise},then:function(t,e){return this.promise.then.apply(this.promise,arguments)}},t}(),U=function(){function t(t,e){this.length=t,this.initialData=e,this._rangeListeners=[],this._progressListeners=[],this._progressiveReadListeners=[],this._readyCapability=g()}return t.prototype={addRangeListener:function(t){this._rangeListeners.push(t)},addProgressListener:function(t){this._progressListeners.push(t)},addProgressiveReadListener:function(t){this._progressiveReadListeners.push(t)},onDataRange:function(t,e){for(var n=this._rangeListeners,i=0,r=n.length;r>i;++i)n[i](t,e)},onDataProgress:function(t){this._readyCapability.promise.then(function(){for(var e=this._progressListeners,n=0,i=e.length;i>n;++n)e[n](t)}.bind(this))},onDataProgressiveRead:function(t){this._readyCapability.promise.then(function(){for(var e=this._progressiveReadListeners,n=0,i=e.length;i>n;++n)e[n](t)}.bind(this))},transportReady:function(){this._readyCapability.resolve()},requestDataRange:function(t,e){throw new Error("Abstract method PDFDataRangeTransport.requestDataRange")}},t}();PDFJS.PDFDataRangeTransport=U;var X=function(){function t(t,e){this.pdfInfo=t,this.transport=e}return t.prototype={get numPages(){return this.pdfInfo.numPages},get fingerprint(){return this.pdfInfo.fingerprint},getPage:function(t){return this.transport.getPage(t)},getPageIndex:function(t){return this.transport.getPageIndex(t)},getDestinations:function(){return this.transport.getDestinations()},getDestination:function(t){return this.transport.getDestination(t)},getAttachments:function(){return this.transport.getAttachments()},getJavaScript:function(){return this.transport.getJavaScript()},getOutline:function(){return this.transport.getOutline()},getMetadata:function(){return this.transport.getMetadata()},getData:function(){return this.transport.getData()},getDownloadInfo:function(){return this.transport.downloadInfoCapability.promise},getStats:function(){return this.transport.getStats()},cleanup:function(){this.transport.startCleanup()},destroy:function(){this.transport.destroy()}},t}(),z=function(){function t(t,e,n){this.pageIndex=t,this.pageInfo=e,this.transport=n,this.stats=new W,this.stats.enabled=!!k.PDFJS.enableStats,this.commonObjs=n.commonObjs,this.objs=new H,this.cleanupAfterRender=!1,this.pendingDestroy=!1,this.intentStates={}}return t.prototype={get pageNumber(){return this.pageIndex+1},get rotate(){return this.pageInfo.rotate},get ref(){return this.pageInfo.ref},get view(){return this.pageInfo.view},getViewport:function(t,e){return arguments.length<2&&(e=this.rotate),new PDFJS.PageViewport(this.view,t,e,0,0)},getAnnotations:function(){if(this.annotationsPromise)return this.annotationsPromise;var t=this.transport.getAnnotations(this.pageIndex);return this.annotationsPromise=t,t},render:function(t){function e(t){var e=r.renderTasks.indexOf(a);e>=0&&r.renderTasks.splice(e,1),o.cleanupAfterRender&&(o.pendingDestroy=!0),o._tryDestroy(),t?a.capability.reject(t):a.capability.resolve(),n.timeEnd("Rendering"),n.timeEnd("Overall")}var n=this.stats;n.time("Overall"),this.pendingDestroy=!1;var i="print"===t.intent?"print":"display";this.intentStates[i]||(this.intentStates[i]={});var r=this.intentStates[i];r.displayReadyCapability||(r.receivingOperatorList=!0,r.displayReadyCapability=g(),r.operatorList={fnArray:[],argsArray:[],lastChunk:!1},this.stats.time("Page Request"),this.transport.messageHandler.send("RenderPageRequest",{pageIndex:this.pageNumber-1,intent:i}));var a=new V(e,t,this.objs,this.commonObjs,r.operatorList,this.pageNumber);r.renderTasks||(r.renderTasks=[]),r.renderTasks.push(a);var s=a.task;t.continueCallback&&(s.onContinue=t.continueCallback);var o=this;return r.displayReadyCapability.promise.then(function(t){return o.pendingDestroy?void e():(n.time("Rendering"),a.initalizeGraphics(t),void a.operatorListChanged())},function(t){e(t)}),s},getOperatorList:function(){function t(){n.operatorList.lastChunk&&n.opListReadCapability.resolve(n.operatorList)}var e="oplist";this.intentStates[e]||(this.intentStates[e]={});var n=this.intentStates[e];if(!n.opListReadCapability){var i={};i.operatorListChanged=t,n.receivingOperatorList=!0,n.opListReadCapability=g(),n.renderTasks=[],n.renderTasks.push(i),n.operatorList={fnArray:[],argsArray:[],lastChunk:!1},this.transport.messageHandler.send("RenderPageRequest",{pageIndex:this.pageIndex,intent:e})}return n.opListReadCapability.promise},getTextContent:function(){return this.transport.messageHandler.sendWithPromise("GetTextContent",{pageIndex:this.pageNumber-1})},destroy:function(){this.pendingDestroy=!0,this._tryDestroy()},_tryDestroy:function(){this.pendingDestroy&&!Object.keys(this.intentStates).some(function(t){var e=this.intentStates[t];return 0!==e.renderTasks.length||e.receivingOperatorList},this)&&(Object.keys(this.intentStates).forEach(function(t){delete this.intentStates[t]},this),this.objs.clear(),this.annotationsPromise=null,this.pendingDestroy=!1)},_startRenderPage:function(t,e){var n=this.intentStates[e];n.displayReadyCapability&&n.displayReadyCapability.resolve(t)},_renderPageChunk:function(t,e){var n,i,r=this.intentStates[e];for(n=0,i=t.length;i>n;n++)r.operatorList.fnArray.push(t.fnArray[n]),r.operatorList.argsArray.push(t.argsArray[n]);for(r.operatorList.lastChunk=t.lastChunk,n=0;n<r.renderTasks.length;n++)r.renderTasks[n].operatorListChanged();t.lastChunk&&(r.receivingOperatorList=!1,this._tryDestroy())}},t}(),Y=function(){function i(e,i){if(this.pdfDataRangeTransport=i,this.workerInitializedCapability=e,this.commonObjs=new H,this.loadingTask=null,this.pageCache=[],this.pagePromises=[],this.downloadInfoCapability=g(),!k.PDFJS.disableWorker&&"undefined"!=typeof Worker){var r=PDFJS.workerSrc;r||n("No PDFJS.workerSrc specified");try{var a=new Worker(r),s=new m("main",a);this.messageHandler=s,s.on("test",function(t){var n=t&&t.supportTypedArray;n?(this.worker=a,t.supportTransfers||(PDFJS.postMessageTransfers=!1),this.setupMessageHandler(s),e.resolve()):this.setupFakeWorker()}.bind(this));var o=new Uint8Array([PDFJS.postMessageTransfers?255:0]);try{s.send("test",o,[o.buffer])}catch(l){t("Cannot use postMessage transfers"),o[0]=0,s.send("test",o)}return}catch(c){t("The worker has been disabled.")}}this.setupFakeWorker()}return i.prototype={destroy:function(){this.pageCache=[],this.pagePromises=[];var t=this;this.messageHandler.sendWithPromise("Terminate",null).then(function(){ht.clear(),t.worker&&t.worker.terminate()})},setupFakeWorker:function(){k.PDFJS.disableWorker=!0,PDFJS.fakeWorkerFilesLoadedCapability||(PDFJS.fakeWorkerFilesLoadedCapability=g(),B.loadScript(PDFJS.workerSrc,function(){PDFJS.fakeWorkerFilesLoadedCapability.resolve()})),PDFJS.fakeWorkerFilesLoadedCapability.promise.then(function(){e("Setting up fake worker.");var t={postMessage:function(e){t.onmessage({data:e})},terminate:function(){}},n=new m("main",t);this.setupMessageHandler(n),PDFJS.WorkerMessageHandler.setup(n),this.workerInitializedCapability.resolve()}.bind(this))},setupMessageHandler:function(t){function i(e){t.send("UpdatePassword",e)}this.messageHandler=t;var r=this.pdfDataRangeTransport;r&&(r.addRangeListener(function(e,n){t.send("OnDataRange",{begin:e,chunk:n})}),r.addProgressListener(function(e){t.send("OnDataProgress",{loaded:e})}),r.addProgressiveReadListener(function(e){t.send("OnDataRange",{chunk:e})}),t.on("RequestDataRange",function(t){r.requestDataRange(t.begin,t.end)},this)),t.on("GetDoc",function(t){var e=t.pdfInfo;this.numPages=t.pdfInfo.numPages;var n=new X(e,this);this.pdfDocument=n,this.loadingTask._capability.resolve(n)},this),t.on("NeedPassword",function(t){var e=this.loadingTask;return e.onPassword?e.onPassword(i,E.NEED_PASSWORD):void e._capability.reject(new I(t.message,t.code))},this),t.on("IncorrectPassword",function(t){var e=this.loadingTask;return e.onPassword?e.onPassword(i,E.INCORRECT_PASSWORD):void e._capability.reject(new I(t.message,t.code))},this),t.on("InvalidPDF",function(t){this.loadingTask._capability.reject(new _(t.message))},this),t.on("MissingPDF",function(t){this.loadingTask._capability.reject(new O(t.message))},this),t.on("UnexpectedResponse",function(t){this.loadingTask._capability.reject(new j(t.message,t.status))},this),t.on("UnknownError",function(t){this.loadingTask._capability.reject(new M(t.message,t.details))},this),t.on("DataLoaded",function(t){this.downloadInfoCapability.resolve(t)},this),t.on("PDFManagerReady",function(t){this.pdfDataRangeTransport&&this.pdfDataRangeTransport.transportReady()},this),t.on("StartRenderPage",function(t){var e=this.pageCache[t.pageIndex];e.stats.timeEnd("Page Request"),e._startRenderPage(t.transparency,t.intent)},this),t.on("RenderPageChunk",function(t){var e=this.pageCache[t.pageIndex];e._renderPageChunk(t.operatorList,t.intent)},this),t.on("commonobj",function(t){var n=t[0],i=t[1];if(!this.commonObjs.hasData(n))switch(i){case"Font":var r,a=t[2];if("error"in a){var s=a.error;e("Error during font loading: "+s),this.commonObjs.resolve(n,s);break}r=new ut(a),ht.bind([r],function(t){this.commonObjs.resolve(n,r)}.bind(this));break;case"FontPath":this.commonObjs.resolve(n,t[2]);break;default:s("Got unknown common object type "+i)}},this),t.on("obj",function(t){var e,i=t[0],r=t[1],a=t[2],s=this.pageCache[r];if(!s.objs.hasData(i))switch(a){case"JpegStream":e=t[3],v(i,e,s.objs);break;case"Image":e=t[3],s.objs.resolve(i,e);var o=8e6;e&&"data"in e&&e.data.length>o&&(s.cleanupAfterRender=!0);break;default:n("Got unknown object type "+a)}},this),t.on("DocProgress",function(t){var e=this.loadingTask;
e.onProgress&&e.onProgress({loaded:t.loaded,total:t.total})},this),t.on("PageError",function(t){var e=this.pageCache[t.pageNum-1],i=e.intentStates[t.intent];i.displayReadyCapability?i.displayReadyCapability.reject(t.error):n(t.error)},this),t.on("JpegDecode",function(t){var e=t[0],n=t[1];return 3!==n&&1!==n?Promise.reject(new Error("Only 3 components or 1 component can be returned")):new Promise(function(t,i){var r=new Image;r.onload=function(){var e=r.width,i=r.height,a=e*i,s=4*a,o=new Uint8Array(a*n),l=b(e,i),c=l.getContext("2d");c.drawImage(r,0,0);var h,u,d=c.getImageData(0,0,e,i).data;if(3===n)for(h=0,u=0;s>h;h+=4,u+=3)o[u]=d[h],o[u+1]=d[h+1],o[u+2]=d[h+2];else if(1===n)for(h=0,u=0;s>h;h+=4,u++)o[u]=d[h];t({data:o,width:e,height:i})},r.onerror=function(){i(new Error("JpegDecode failed to load image"))},r.src=e})})},fetchDocument:function(t,e){this.loadingTask=t,e.disableAutoFetch=PDFJS.disableAutoFetch,e.disableStream=PDFJS.disableStream,e.chunkedViewerLoading=!!this.pdfDataRangeTransport,this.pdfDataRangeTransport&&(e.length=this.pdfDataRangeTransport.length,e.initialData=this.pdfDataRangeTransport.initialData),this.messageHandler.send("GetDocRequest",{source:e,disableRange:PDFJS.disableRange,maxImageSize:PDFJS.maxImageSize,cMapUrl:PDFJS.cMapUrl,cMapPacked:PDFJS.cMapPacked,disableFontFace:PDFJS.disableFontFace,disableCreateObjectURL:PDFJS.disableCreateObjectURL,verbosity:PDFJS.verbosity})},getData:function(){return this.messageHandler.sendWithPromise("GetData",null)},getPage:function(t,e){if(0>=t||t>this.numPages||(0|t)!==t)return Promise.reject(new Error("Invalid page request"));var n=t-1;if(n in this.pagePromises)return this.pagePromises[n];var i=this.messageHandler.sendWithPromise("GetPage",{pageIndex:n}).then(function(t){var e=new z(n,t,this);return this.pageCache[n]=e,e}.bind(this));return this.pagePromises[n]=i,i},getPageIndex:function(t){return this.messageHandler.sendWithPromise("GetPageIndex",{ref:t})},getAnnotations:function(t){return this.messageHandler.sendWithPromise("GetAnnotations",{pageIndex:t})},getDestinations:function(){return this.messageHandler.sendWithPromise("GetDestinations",null)},getDestination:function(t){return this.messageHandler.sendWithPromise("GetDestination",{id:t})},getAttachments:function(){return this.messageHandler.sendWithPromise("GetAttachments",null)},getJavaScript:function(){return this.messageHandler.sendWithPromise("GetJavaScript",null)},getOutline:function(){return this.messageHandler.sendWithPromise("GetOutline",null)},getMetadata:function(){return this.messageHandler.sendWithPromise("GetMetadata",null).then(function(t){return{info:t[0],metadata:t[1]?new PDFJS.Metadata(t[1]):null}})},getStats:function(){return this.messageHandler.sendWithPromise("GetStats",null)},startCleanup:function(){this.messageHandler.sendWithPromise("Cleanup",null).then(function(){for(var t=0,e=this.pageCache.length;e>t;t++){var n=this.pageCache[t];n&&n.destroy()}this.commonObjs.clear(),ht.clear()}.bind(this))}},i}(),H=function(){function t(){this.objs={}}return t.prototype={ensureObj:function(t){if(this.objs[t])return this.objs[t];var e={capability:g(),data:null,resolved:!1};return this.objs[t]=e,e},get:function(t,e){if(e)return this.ensureObj(t).capability.promise.then(e),null;var i=this.objs[t];return i&&i.resolved||n("Requesting object that isn't resolved yet "+t),i.data},resolve:function(t,e){var n=this.ensureObj(t);n.resolved=!0,n.data=e,n.capability.resolve(e)},isResolved:function(t){var e=this.objs;return e[t]?e[t].resolved:!1},hasData:function(t){return this.isResolved(t)},getData:function(t){var e=this.objs;return e[t]&&e[t].resolved?e[t].data:null},clear:function(){this.objs={}}},t}(),Q=function(){function t(t){this._internalRenderTask=t,this.onContinue=null}return t.prototype={get promise(){return this._internalRenderTask.capability.promise},cancel:function(){this._internalRenderTask.cancel()},then:function(t,e){return this.promise.then.apply(this.promise,arguments)}},t}(),V=function(){function t(t,e,n,i,r,a){this.callback=t,this.params=e,this.objs=n,this.commonObjs=i,this.operatorListIdx=null,this.operatorList=r,this.pageNumber=a,this.running=!1,this.graphicsReadyCallback=null,this.graphicsReady=!1,this.cancelled=!1,this.capability=g(),this.task=new Q(this),this._continueBound=this._continue.bind(this),this._scheduleNextBound=this._scheduleNext.bind(this),this._nextBound=this._next.bind(this)}return t.prototype={initalizeGraphics:function(t){if(!this.cancelled){PDFJS.pdfBug&&"StepperManager"in k&&k.StepperManager.enabled&&(this.stepper=k.StepperManager.create(this.pageNumber-1),this.stepper.init(this.operatorList),this.stepper.nextBreakPoint=this.stepper.getNextBreakPoint());var e=this.params;this.gfx=new at(e.canvasContext,this.commonObjs,this.objs,e.imageLayer),this.gfx.beginDrawing(e.viewport,t),this.operatorListIdx=0,this.graphicsReady=!0,this.graphicsReadyCallback&&this.graphicsReadyCallback()}},cancel:function(){this.running=!1,this.cancelled=!0,this.callback("cancelled")},operatorListChanged:function(){return this.graphicsReady?(this.stepper&&this.stepper.updateOperatorList(this.operatorList),void(this.running||this._continue())):void(this.graphicsReadyCallback||(this.graphicsReadyCallback=this._continueBound))},_continue:function(){this.running=!0,this.cancelled||(this.task.onContinue?this.task.onContinue.call(this.task,this._scheduleNextBound):this._scheduleNext())},_scheduleNext:function(){window.requestAnimationFrame(this._nextBound)},_next:function(){this.cancelled||(this.operatorListIdx=this.gfx.executeOperatorList(this.operatorList,this.operatorListIdx,this._continueBound,this.stepper),this.operatorListIdx===this.operatorList.argsArray.length&&(this.running=!1,this.operatorList.lastChunk&&(this.gfx.endDrawing(),this.callback())))}},t}(),q=(PDFJS.Metadata=function(){function t(t){return t.replace(/>\\376\\377([^<]+)/g,function(t,e){for(var n=e.replace(/\\([0-3])([0-7])([0-7])/g,function(t,e,n,i){return String.fromCharCode(64*e+8*n+1*i)}),i="",r=0;r<n.length;r+=2){var a=256*n.charCodeAt(r)+n.charCodeAt(r+1);i+="&#x"+(65536+a).toString(16).substring(1)+";"}return">"+i})}function e(e){if("string"==typeof e){e=t(e);var i=new DOMParser;e=i.parseFromString(e,"application/xml")}else e instanceof Document||n("Metadata: Invalid metadata object");this.metaDocument=e,this.metadata={},this.parse()}return e.prototype={parse:function(){var t=this.metaDocument,e=t.documentElement;if("rdf:rdf"!==e.nodeName.toLowerCase())for(e=e.firstChild;e&&"rdf:rdf"!==e.nodeName.toLowerCase();)e=e.nextSibling;var n=e?e.nodeName.toLowerCase():null;if(e&&"rdf:rdf"===n&&e.hasChildNodes()){var i,r,a,s,o,l,c,h=e.childNodes;for(s=0,l=h.length;l>s;s++)if(i=h[s],"rdf:description"===i.nodeName.toLowerCase())for(o=0,c=i.childNodes.length;c>o;o++)"#text"!==i.childNodes[o].nodeName.toLowerCase()&&(r=i.childNodes[o],a=r.nodeName.toLowerCase(),this.metadata[a]=r.textContent.trim())}},get:function(t){return this.metadata[t]||null},has:function(t){return"undefined"!=typeof this.metadata[t]}},e}(),16),K=100,Z=4096,$=.65,tt=!0,et=1e3,nt=16,it=function(){var t={};return{getCanvas:function(e,n,i,r){var a;if(void 0!==t[e])a=t[e],a.canvas.width=n,a.canvas.height=i,a.context.setTransform(1,0,0,1,0,0);else{var s=b(n,i),o=s.getContext("2d");r&&S(o),t[e]=a={canvas:s,context:o}}return a},clear:function(){for(var e in t){var n=t[e];n.canvas.width=0,n.canvas.height=0,delete t[e]}}}}(),rt=function(){function t(t){this.alphaIsShape=!1,this.fontSize=0,this.fontSizeScale=1,this.textMatrix=J,this.textMatrixScale=1,this.fontMatrix=C,this.leading=0,this.x=0,this.y=0,this.lineX=0,this.lineY=0,this.charSpacing=0,this.wordSpacing=0,this.textHScale=1,this.textRenderingMode=F.FILL,this.textRise=0,this.fillColor="#000000",this.strokeColor="#000000",this.patternFill=!1,this.fillAlpha=1,this.strokeAlpha=1,this.lineWidth=1,this.activeSMask=null,this.old=t}return t.prototype={clone:function(){return Object.create(this)},setCurrentPoint:function(t,e){this.x=t,this.y=e}},t}(),at=function(){function i(t,e,n,i){this.ctx=t,this.current=new rt,this.stateStack=[],this.pendingClip=null,this.pendingEOFill=!1,this.res=null,this.xobjs=null,this.commonObjs=e,this.objs=n,this.imageLayer=i,this.groupStack=[],this.processingType3=null,this.baseTransform=null,this.baseTransformStack=[],this.groupLevel=0,this.smaskStack=[],this.smaskCounter=0,this.tempSMask=null,t&&S(t),this.cachedGetSinglePixelWidth=null}function a(t,e){if("undefined"!=typeof ImageData&&e instanceof ImageData)return void t.putImageData(e,0,0);var i,r,a,s,o,l=e.height,c=e.width,h=l%nt,u=(l-h)/nt,d=0===h?u:u+1,f=t.createImageData(c,nt),p=0,A=e.data,g=f.data;if(e.kind===D.GRAYSCALE_1BPP){var m=A.byteLength,v=PDFJS.hasCanvasTypedArrays?new Uint32Array(g.buffer):new N(g),b=v.length,S=c+7>>3,x=4294967295,y=PDFJS.isLittleEndian||!PDFJS.hasCanvasTypedArrays?4278190080:255;for(r=0;d>r;r++){for(s=u>r?nt:h,i=0,a=0;s>a;a++){for(var k=m-p,P=0,C=k>S?c:8*k-7,F=-8&C,w=0,T=0;F>P;P+=8)T=A[p++],v[i++]=128&T?x:y,v[i++]=64&T?x:y,v[i++]=32&T?x:y,v[i++]=16&T?x:y,v[i++]=8&T?x:y,v[i++]=4&T?x:y,v[i++]=2&T?x:y,v[i++]=1&T?x:y;for(;C>P;P++)0===w&&(T=A[p++],w=128),v[i++]=T&w?x:y,w>>=1}for(;b>i;)v[i++]=0;t.putImageData(f,0,r*nt)}}else if(e.kind===D.RGBA_32BPP){for(a=0,o=c*nt*4,r=0;u>r;r++)g.set(A.subarray(p,p+o)),p+=o,t.putImageData(f,0,a),a+=nt;d>r&&(o=c*h*4,g.set(A.subarray(p,p+o)),t.putImageData(f,0,a))}else if(e.kind===D.RGB_24BPP)for(s=nt,o=c*s,r=0;d>r;r++){for(r>=u&&(s=h,o=c*s),i=0,a=o;a--;)g[i++]=A[p++],g[i++]=A[p++],g[i++]=A[p++],g[i++]=255;t.putImageData(f,0,r*nt)}else n("bad image kind: "+e.kind)}function s(t,e){for(var n=e.height,i=e.width,r=n%nt,a=(n-r)/nt,s=0===r?a:a+1,o=t.createImageData(i,nt),l=0,c=e.data,h=o.data,u=0;s>u;u++){for(var d=a>u?nt:r,f=3,p=0;d>p;p++)for(var A=0,g=0;i>g;g++){if(!A){var m=c[l++];A=128}h[f]=m&A?0:255,f+=4,A>>=1}t.putImageData(o,0,u*nt)}}function l(t,e){for(var n=["strokeStyle","fillStyle","fillRule","globalAlpha","lineWidth","lineCap","lineJoin","miterLimit","globalCompositeOperation","font"],i=0,r=n.length;r>i;i++){var a=n[i];void 0!==t[a]&&(e[a]=t[a])}void 0!==t.setLineDash?(e.setLineDash(t.getLineDash()),e.lineDashOffset=t.lineDashOffset):void 0!==t.mozDashOffset&&(e.mozDash=t.mozDash,e.mozDashOffset=t.mozDashOffset)}function c(t,e,n,i){for(var r=t.length,a=3;r>a;a+=4){var s=t[a];if(0===s)t[a-3]=e,t[a-2]=n,t[a-1]=i;else if(255>s){var o=255-s;t[a-3]=t[a-3]*s+e*o>>8,t[a-2]=t[a-2]*s+n*o>>8,t[a-1]=t[a-1]*s+i*o>>8}}}function h(t,e){for(var n=t.length,i=1/255,r=3;n>r;r+=4){var a=t[r];e[r]=e[r]*a*i|0}}function u(t,e){for(var n=t.length,i=3;n>i;i+=4){var r=77*t[i-3]+152*t[i-2]+28*t[i-1];e[i]=e[i]*r>>16}}function d(t,e,n,i,r,a){var s,o=!!a,l=o?a[0]:0,d=o?a[1]:0,f=o?a[2]:0;s="Luminosity"===r?u:h;for(var p=1048576,A=Math.min(i,Math.ceil(p/n)),g=0;i>g;g+=A){var m=Math.min(A,i-g),v=t.getImageData(0,g,n,m),b=e.getImageData(0,g,n,m);o&&c(v.data,l,d,f),s(v.data,b.data),t.putImageData(b,0,g)}}function A(t,e,n){var i=e.canvas,r=e.context;t.setTransform(e.scaleX,0,0,e.scaleY,e.offsetX,e.offsetY);var a=e.backdrop||null;if(st.isEnabled){var s=st.composeSMask(n.canvas,i,{subtype:e.subtype,backdrop:a});return t.setTransform(1,0,0,1,0,0),void t.drawImage(s,e.offsetX,e.offsetY)}d(r,n,i.width,i.height,e.subtype,a),t.drawImage(i,0,0)}var g=15,m=10,v=["butt","round","square"],b=["miter","round","bevel"],k={},P={};i.prototype={beginDrawing:function(t,e){var n=this.ctx.canvas.width,i=this.ctx.canvas.height;e?this.ctx.clearRect(0,0,n,i):(this.ctx.mozOpaque=!0,this.ctx.save(),this.ctx.fillStyle="rgb(255, 255, 255)",this.ctx.fillRect(0,0,n,i),this.ctx.restore());var r=t.transform;this.ctx.save(),this.ctx.transform.apply(this.ctx,r),this.baseTransform=this.ctx.mozCurrentTransform.slice(),this.imageLayer&&this.imageLayer.beginLayout()},executeOperatorList:function(t,e,n,i){var r=t.argsArray,a=t.fnArray,s=e||0,o=r.length;if(o===s)return s;for(var l,c=o-s>m&&"function"==typeof n,h=c?Date.now()+g:0,u=0,d=this.commonObjs,f=this.objs;;){if(void 0!==i&&s===i.nextBreakPoint)return i.breakIt(s,n),s;if(l=a[s],l!==T.dependency)this[l].apply(this,r[s]);else for(var p=r[s],A=0,v=p.length;v>A;A++){var b=p[A],S="g"===b[0]&&"_"===b[1],x=S?d:f;if(!x.isResolved(b))return x.get(b,n),s}if(s++,s===o)return s;if(c&&++u>m){if(Date.now()>h)return n(),s;u=0}}},endDrawing:function(){this.ctx.restore(),it.clear(),st.clear(),this.imageLayer&&this.imageLayer.endLayout()},setLineWidth:function(t){this.current.lineWidth=t,this.ctx.lineWidth=t},setLineCap:function(t){this.ctx.lineCap=v[t]},setLineJoin:function(t){this.ctx.lineJoin=b[t]},setMiterLimit:function(t){this.ctx.miterLimit=t},setDash:function(t,e){var n=this.ctx;void 0!==n.setLineDash?(n.setLineDash(t),n.lineDashOffset=e):(n.mozDash=t,n.mozDashOffset=e)},setRenderingIntent:function(t){},setFlatness:function(t){},setGState:function(t){for(var n=0,i=t.length;i>n;n++){var r=t[n],a=r[0],s=r[1];switch(a){case"LW":this.setLineWidth(s);break;case"LC":this.setLineCap(s);break;case"LJ":this.setLineJoin(s);break;case"ML":this.setMiterLimit(s);break;case"D":this.setDash(s[0],s[1]);break;case"RI":this.setRenderingIntent(s);break;case"FL":this.setFlatness(s);break;case"Font":this.setFont(s[0],s[1]);break;case"CA":this.current.strokeAlpha=r[1];break;case"ca":this.current.fillAlpha=r[1],this.ctx.globalAlpha=r[1];break;case"BM":if(s&&s.name&&"Normal"!==s.name){var o=s.name.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()}).substring(1);this.ctx.globalCompositeOperation=o,this.ctx.globalCompositeOperation!==o&&e('globalCompositeOperation "'+o+'" is not supported')}else this.ctx.globalCompositeOperation="source-over";break;case"SMask":this.current.activeSMask&&this.endSMaskGroup(),this.current.activeSMask=s?this.tempSMask:null,this.current.activeSMask&&this.beginSMaskGroup(),this.tempSMask=null}}},beginSMaskGroup:function(){var t=this.current.activeSMask,e=t.canvas.width,n=t.canvas.height,i="smaskGroupAt"+this.groupLevel,r=it.getCanvas(i,e,n,!0),a=this.ctx,s=a.mozCurrentTransform;this.ctx.save();var o=r.context;o.scale(1/t.scaleX,1/t.scaleY),o.translate(-t.offsetX,-t.offsetY),o.transform.apply(o,s),l(a,o),this.ctx=o,this.setGState([["BM","Normal"],["ca",1],["CA",1]]),this.groupStack.push(a),this.groupLevel++},endSMaskGroup:function(){var t=this.ctx;this.groupLevel--,this.ctx=this.groupStack.pop(),A(this.ctx,this.current.activeSMask,t),this.ctx.restore()},save:function(){this.ctx.save();var t=this.current;this.stateStack.push(t),this.current=t.clone(),this.current.activeSMask=null},restore:function(){0!==this.stateStack.length&&(null!==this.current.activeSMask&&this.endSMaskGroup(),this.current=this.stateStack.pop(),this.ctx.restore(),this.cachedGetSinglePixelWidth=null)},transform:function(t,e,n,i,r,a){this.ctx.transform(t,e,n,i,r,a),this.cachedGetSinglePixelWidth=null},constructPath:function(t,e){for(var n=this.ctx,i=this.current,r=i.x,a=i.y,s=0,o=0,l=t.length;l>s;s++)switch(0|t[s]){case T.rectangle:r=e[o++],a=e[o++];var c=e[o++],h=e[o++];0===c&&(c=this.getSinglePixelWidth()),0===h&&(h=this.getSinglePixelWidth());var u=r+c,d=a+h;this.ctx.moveTo(r,a),this.ctx.lineTo(u,a),this.ctx.lineTo(u,d),this.ctx.lineTo(r,d),this.ctx.lineTo(r,a),this.ctx.closePath();break;case T.moveTo:r=e[o++],a=e[o++],n.moveTo(r,a);break;case T.lineTo:r=e[o++],a=e[o++],n.lineTo(r,a);break;case T.curveTo:r=e[o+4],a=e[o+5],n.bezierCurveTo(e[o],e[o+1],e[o+2],e[o+3],r,a),o+=6;break;case T.curveTo2:n.bezierCurveTo(r,a,e[o],e[o+1],e[o+2],e[o+3]),r=e[o+2],a=e[o+3],o+=4;break;case T.curveTo3:r=e[o+2],a=e[o+3],n.bezierCurveTo(e[o],e[o+1],r,a,r,a),o+=4;break;case T.closePath:n.closePath()}i.setCurrentPoint(r,a)},closePath:function(){this.ctx.closePath()},stroke:function(t){t="undefined"!=typeof t?t:!0;var e=this.ctx,n=this.current.strokeColor;e.lineWidth=Math.max(this.getSinglePixelWidth()*$,this.current.lineWidth),e.globalAlpha=this.current.strokeAlpha,n&&n.hasOwnProperty("type")&&"Pattern"===n.type?(e.save(),e.strokeStyle=n.getPattern(e,this),e.stroke(),e.restore()):e.stroke(),t&&this.consumePath(),e.globalAlpha=this.current.fillAlpha},closeStroke:function(){this.closePath(),this.stroke()},fill:function(t){t="undefined"!=typeof t?t:!0;var e=this.ctx,n=this.current.fillColor,i=this.current.patternFill,r=!1;if(i&&(e.save(),e.fillStyle=n.getPattern(e,this),r=!0),this.pendingEOFill){if(void 0!==e.mozFillRule)e.mozFillRule="evenodd",e.fill(),e.mozFillRule="nonzero";else try{e.fill("evenodd")}catch(a){e.fill()}this.pendingEOFill=!1}else e.fill();r&&e.restore(),t&&this.consumePath()},eoFill:function(){this.pendingEOFill=!0,this.fill()},fillStroke:function(){this.fill(!1),this.stroke(!1),this.consumePath()},eoFillStroke:function(){this.pendingEOFill=!0,this.fillStroke()},closeFillStroke:function(){this.closePath(),this.fillStroke()},closeEOFillStroke:function(){this.pendingEOFill=!0,this.closePath(),this.fillStroke()},endPath:function(){this.consumePath()},clip:function(){this.pendingClip=k},eoClip:function(){this.pendingClip=P},beginText:function(){this.current.textMatrix=J,this.current.textMatrixScale=1,this.current.x=this.current.lineX=0,this.current.y=this.current.lineY=0},endText:function(){var t=this.pendingTextPaths,e=this.ctx;if(void 0===t)return void e.beginPath();e.save(),e.beginPath();for(var n=0;n<t.length;n++){var i=t[n];e.setTransform.apply(e,i.transform),e.translate(i.x,i.y),i.addToPath(e,i.fontSize)}e.restore(),e.clip(),e.beginPath(),delete this.pendingTextPaths},setCharSpacing:function(t){this.current.charSpacing=t},setWordSpacing:function(t){this.current.wordSpacing=t},setHScale:function(t){this.current.textHScale=t/100},setLeading:function(t){this.current.leading=-t},setFont:function(t,i){var r=this.commonObjs.get(t),a=this.current;if(r||n("Can't find font for "+t),a.fontMatrix=r.fontMatrix?r.fontMatrix:C,0!==a.fontMatrix[0]&&0!==a.fontMatrix[3]||e("Invalid font matrix for font "+t),0>i?(i=-i,a.fontDirection=-1):a.fontDirection=1,this.current.font=r,this.current.fontSize=i,!r.isType3Font){var s=r.loadedName||"sans-serif",o=r.black?r.bold?"bolder":"bold":r.bold?"bold":"normal",l=r.italic?"italic":"normal",c='"'+s+'", '+r.fallbackName,h=q>i?q:i>K?K:i;this.current.fontSizeScale=i/h;var u=l+" "+o+" "+h+"px "+c;this.ctx.font=u}},setTextRenderingMode:function(t){this.current.textRenderingMode=t},setTextRise:function(t){this.current.textRise=t},moveText:function(t,e){this.current.x=this.current.lineX+=t,this.current.y=this.current.lineY+=e},setLeadingMoveText:function(t,e){this.setLeading(-e),this.moveText(t,e)},setTextMatrix:function(t,e,n,i,r,a){this.current.textMatrix=[t,e,n,i,r,a],this.current.textMatrixScale=Math.sqrt(t*t+e*e),this.current.x=this.current.lineX=0,this.current.y=this.current.lineY=0},nextLine:function(){this.moveText(0,this.current.leading)},paintChar:function(t,e,n){var i,r=this.ctx,a=this.current,s=a.font,o=a.textRenderingMode,l=a.fontSize/a.fontSizeScale,c=o&F.FILL_STROKE_MASK,h=!!(o&F.ADD_TO_PATH_FLAG);if((s.disableFontFace||h)&&(i=s.getPathGenerator(this.commonObjs,t)),s.disableFontFace?(r.save(),r.translate(e,n),r.beginPath(),i(r,l),c!==F.FILL&&c!==F.FILL_STROKE||r.fill(),c!==F.STROKE&&c!==F.FILL_STROKE||r.stroke(),r.restore()):(c!==F.FILL&&c!==F.FILL_STROKE||r.fillText(t,e,n),c!==F.STROKE&&c!==F.FILL_STROKE||r.strokeText(t,e,n)),h){var u=this.pendingTextPaths||(this.pendingTextPaths=[]);u.push({transform:r.mozCurrentTransform,x:e,y:n,fontSize:l,addToPath:i})}},get isFontSubpixelAAEnabled(){var t=document.createElement("canvas").getContext("2d");t.scale(1.5,1),t.fillText("I",0,10);for(var e=t.getImageData(0,0,10,10).data,n=!1,i=3;i<e.length;i+=4)if(e[i]>0&&e[i]<255){n=!0;break}return o(this,"isFontSubpixelAAEnabled",n)},showText:function(t){var e=this.current,n=e.font;if(n.isType3Font)return this.showType3Text(t);var i=e.fontSize;if(0!==i){var r=this.ctx,a=e.fontSizeScale,s=e.charSpacing,o=e.wordSpacing,l=e.fontDirection,c=e.textHScale*l,h=t.length,u=n.vertical,d=n.defaultVMetrics,p=i*e.fontMatrix[0],A=e.textRenderingMode===F.FILL&&!n.disableFontFace;r.save(),r.transform.apply(r,e.textMatrix),r.translate(e.x,e.y+e.textRise),l>0?r.scale(c,-1):r.scale(c,1);var g=e.lineWidth,m=e.textMatrixScale;if(0===m||0===g){var v=e.textRenderingMode&F.FILL_STROKE_MASK;v!==F.STROKE&&v!==F.FILL_STROKE||(this.cachedGetSinglePixelWidth=null,g=this.getSinglePixelWidth()*$)}else g/=m;1!==a&&(r.scale(a,a),g/=a),r.lineWidth=g;var b,S=0;for(b=0;h>b;++b){var x=t[b];if(null!==x)if(f(x))S+=-x*i*.001;else{var y,k,P,C,D=!1,w=x.fontChar,T=x.accent,L=x.width;if(u){var R,E,I;R=x.vmetric||d,E=x.vmetric?R[1]:.5*L,E=-E*p,I=R[2]*p,L=R?-R[0]:L,y=E/a,k=(S+I)/a}else y=S/a,k=0;if(n.remeasure&&L>0&&this.isFontSubpixelAAEnabled){var M=1e3*r.measureText(w).width/i*a,_=L/M;D=!0,r.save(),r.scale(_,1),y/=_}A&&!T?r.fillText(w,y,k):(this.paintChar(w,y,k),T&&(P=y+T.offset.x/a,C=k-T.offset.y/a,this.paintChar(T.fontChar,P,C)));var O=L*p+s*l;S+=O,D&&r.restore()}else S+=l*o}u?e.y-=S*c:e.x+=S*c,r.restore()}},showType3Text:function(t){var n,i,r,a=this.ctx,s=this.current,o=s.font,l=s.fontSize,c=s.fontDirection,h=s.charSpacing,u=s.wordSpacing,d=s.textHScale*c,p=s.fontMatrix||C,A=t.length,g=s.textRenderingMode===F.INVISIBLE;if(!g&&0!==l){for(a.save(),a.transform.apply(a,s.textMatrix),a.translate(s.x,s.y),a.scale(d,c),n=0;A>n;++n)if(i=t[n],null!==i)if(f(i)){var m=.001*-i*l;this.ctx.translate(m,0),s.x+=m*d}else{var v=o.charProcOperatorList[i.operatorListId];if(v){this.processingType3=i,this.save(),a.scale(l,l),a.transform.apply(a,p),this.executeOperatorList(v),this.restore();var b=B.applyTransform([i.width,0],p);r=b[0]*l+h,a.translate(r,0),s.x+=r*d}else e('Type3 character "'+i.operatorListId+'" is not available')}else this.ctx.translate(u,0),s.x+=u*d;a.restore(),this.processingType3=null}},setCharWidth:function(t,e){},setCharWidthAndBounds:function(t,e,n,i,r,a){this.ctx.rect(n,i,r-n,a-i),this.clip(),this.endPath()},getColorN_Pattern:function(t){var e;if("TilingPattern"===t[0]){var n=t[1];e=new ct(t,n,this.ctx,this.objs,this.commonObjs,this.baseTransform)}else e=y(t);return e},setStrokeColorN:function(){this.current.strokeColor=this.getColorN_Pattern(arguments)},setFillColorN:function(){this.current.fillColor=this.getColorN_Pattern(arguments),this.current.patternFill=!0},setStrokeRGBColor:function(t,e,n){var i=B.makeCssRgb(t,e,n);this.ctx.strokeStyle=i,this.current.strokeColor=i},setFillRGBColor:function(t,e,n){var i=B.makeCssRgb(t,e,n);this.ctx.fillStyle=i,this.current.fillColor=i,this.current.patternFill=!1},shadingFill:function(t){var e=this.ctx;this.save();var n=y(t);e.fillStyle=n.getPattern(e,this,!0);var i=e.mozCurrentTransformInverse;if(i){var r=e.canvas,a=r.width,s=r.height,o=B.applyTransform([0,0],i),l=B.applyTransform([0,s],i),c=B.applyTransform([a,0],i),h=B.applyTransform([a,s],i),u=Math.min(o[0],l[0],c[0],h[0]),d=Math.min(o[1],l[1],c[1],h[1]),f=Math.max(o[0],l[0],c[0],h[0]),p=Math.max(o[1],l[1],c[1],h[1]);this.ctx.fillRect(u,d,f-u,p-d)}else this.ctx.fillRect(-1e10,-1e10,2e10,2e10);this.restore()},beginInlineImage:function(){n("Should not call beginInlineImage")},beginImageData:function(){n("Should not call beginImageData")},paintFormXObjectBegin:function(t,e){if(this.save(),this.baseTransformStack.push(this.baseTransform),p(t)&&6===t.length&&this.transform.apply(this,t),this.baseTransform=this.ctx.mozCurrentTransform,p(e)&&4===e.length){var n=e[2]-e[0],i=e[3]-e[1];this.ctx.rect(e[0],e[1],n,i),this.clip(),this.endPath()}},paintFormXObjectEnd:function(){this.restore(),this.baseTransform=this.baseTransformStack.pop()},beginGroup:function(n){this.save();var i=this.ctx;n.isolated||t("TODO: Support non-isolated groups."),n.knockout&&e("Knockout groups not supported.");var a=i.mozCurrentTransform;n.matrix&&i.transform.apply(i,n.matrix),r(n.bbox,"Bounding box is required.");var s=B.getAxialAlignedBoundingBox(n.bbox,i.mozCurrentTransform),o=[0,0,i.canvas.width,i.canvas.height];s=B.intersect(s,o)||[0,0,0,0];var c=Math.floor(s[0]),h=Math.floor(s[1]),u=Math.max(Math.ceil(s[2])-c,1),d=Math.max(Math.ceil(s[3])-h,1),f=1,p=1;u>Z&&(f=u/Z,u=Z),d>Z&&(p=d/Z,d=Z);var A="groupAt"+this.groupLevel;n.smask&&(A+="_smask_"+this.smaskCounter++%2);var g=it.getCanvas(A,u,d,!0),m=g.context;m.scale(1/f,1/p),m.translate(-c,-h),m.transform.apply(m,a),n.smask?this.smaskStack.push({canvas:g.canvas,context:m,offsetX:c,offsetY:h,scaleX:f,scaleY:p,subtype:n.smask.subtype,backdrop:n.smask.backdrop}):(i.setTransform(1,0,0,1,0,0),i.translate(c,h),i.scale(f,p)),l(i,m),this.ctx=m,this.setGState([["BM","Normal"],["ca",1],["CA",1]]),this.groupStack.push(i),this.groupLevel++},endGroup:function(t){this.groupLevel--;var e=this.ctx;this.ctx=this.groupStack.pop(),void 0!==this.ctx.imageSmoothingEnabled?this.ctx.imageSmoothingEnabled=!1:this.ctx.mozImageSmoothingEnabled=!1,t.smask?this.tempSMask=this.smaskStack.pop():this.ctx.drawImage(e.canvas,0,0),this.restore()},beginAnnotations:function(){this.save(),this.current=new rt},endAnnotations:function(){this.restore()},beginAnnotation:function(t,e,n){if(this.save(),p(t)&&4===t.length){var i=t[2]-t[0],r=t[3]-t[1];this.ctx.rect(t[0],t[1],i,r),this.clip(),this.endPath()}this.transform.apply(this,e),this.transform.apply(this,n)},endAnnotation:function(){this.restore()},paintJpegXObject:function(t,n,i){var r=this.objs.get(t);if(!r)return void e("Dependent image isn't ready yet");this.save();var a=this.ctx;if(a.scale(1/n,-1/i),a.drawImage(r,0,0,r.width,r.height,0,-i,n,i),this.imageLayer){var s=a.mozCurrentTransformInverse,o=this.getCanvasPosition(0,0);this.imageLayer.appendImage({objId:t,left:o[0],top:o[1],width:n/s[0],height:i/s[3]})}this.restore()},paintImageMaskXObject:function(t){var e=this.ctx,n=t.width,i=t.height,r=this.current.fillColor,a=this.current.patternFill,o=this.processingType3;if(tt&&o&&void 0===o.compiled&&(et>=n&&et>=i?o.compiled=x({data:t.data,width:n,height:i}):o.compiled=null),o&&o.compiled)return void o.compiled(e);var l=it.getCanvas("maskCanvas",n,i),c=l.context;c.save(),s(c,t),c.globalCompositeOperation="source-in",c.fillStyle=a?r.getPattern(c,this):r,c.fillRect(0,0,n,i),c.restore(),this.paintInlineImageXObject(l.canvas)},paintImageMaskXObjectRepeat:function(t,e,n,i){var r=t.width,a=t.height,o=this.current.fillColor,l=this.current.patternFill,c=it.getCanvas("maskCanvas",r,a),h=c.context;h.save(),s(h,t),h.globalCompositeOperation="source-in",h.fillStyle=l?o.getPattern(h,this):o,h.fillRect(0,0,r,a),h.restore();for(var u=this.ctx,d=0,f=i.length;f>d;d+=2)u.save(),u.transform(e,0,0,n,i[d],i[d+1]),u.scale(1,-1),u.drawImage(c.canvas,0,0,r,a,0,-1,1,1),u.restore()},paintImageMaskXObjectGroup:function(t){for(var e=this.ctx,n=this.current.fillColor,i=this.current.patternFill,r=0,a=t.length;a>r;r++){var o=t[r],l=o.width,c=o.height,h=it.getCanvas("maskCanvas",l,c),u=h.context;u.save(),s(u,o),u.globalCompositeOperation="source-in",u.fillStyle=i?n.getPattern(u,this):n,u.fillRect(0,0,l,c),u.restore(),e.save(),e.transform.apply(e,o.transform),e.scale(1,-1),e.drawImage(h.canvas,0,0,l,c,0,-1,1,1),e.restore()}},paintImageXObject:function(t){var n=this.objs.get(t);return n?void this.paintInlineImageXObject(n):void e("Dependent image isn't ready yet")},paintImageXObjectRepeat:function(t,n,i,r){var a=this.objs.get(t);if(!a)return void e("Dependent image isn't ready yet");for(var s=a.width,o=a.height,l=[],c=0,h=r.length;h>c;c+=2)l.push({transform:[n,0,0,i,r[c],r[c+1]],x:0,y:0,w:s,h:o});this.paintInlineImageXObjectGroup(a,l)},paintInlineImageXObject:function(t){var e=t.width,n=t.height,i=this.ctx;this.save(),i.scale(1/e,-1/n);var r,s,o=i.mozCurrentTransformInverse,l=o[0],c=o[1],h=Math.max(Math.sqrt(l*l+c*c),1),u=o[2],d=o[3],f=Math.max(Math.sqrt(u*u+d*d),1);if(t instanceof HTMLElement||!t.data)r=t;else{s=it.getCanvas("inlineImage",e,n);var p=s.context;a(p,t),r=s.canvas}for(var A=e,g=n,m="prescale1";h>2&&A>1||f>2&&g>1;){var v=A,b=g;h>2&&A>1&&(v=Math.ceil(A/2),h/=A/v),f>2&&g>1&&(b=Math.ceil(g/2),f/=g/b),s=it.getCanvas(m,v,b),p=s.context,p.clearRect(0,0,v,b),p.drawImage(r,0,0,A,g,0,0,v,b),r=s.canvas,A=v,g=b,m="prescale1"===m?"prescale2":"prescale1"}if(i.drawImage(r,0,0,A,g,0,-n,e,n),this.imageLayer){var S=this.getCanvasPosition(0,-n);this.imageLayer.appendImage({imgData:t,left:S[0],top:S[1],width:e/o[0],height:n/o[3]})}this.restore()},paintInlineImageXObjectGroup:function(t,e){var n=this.ctx,i=t.width,r=t.height,s=it.getCanvas("inlineImage",i,r),o=s.context;a(o,t);for(var l=0,c=e.length;c>l;l++){var h=e[l];if(n.save(),n.transform.apply(n,h.transform),n.scale(1,-1),n.drawImage(s.canvas,h.x,h.y,h.w,h.h,0,-1,1,1),this.imageLayer){var u=this.getCanvasPosition(h.x,h.y);this.imageLayer.appendImage({imgData:t,left:u[0],top:u[1],width:i,height:r})}n.restore()}},paintSolidColorImageMask:function(){this.ctx.fillRect(0,0,1,1)},markPoint:function(t){},markPointProps:function(t,e){},beginMarkedContent:function(t){},beginMarkedContentProps:function(t,e){},endMarkedContent:function(){},beginCompat:function(){},endCompat:function(){},consumePath:function(){var t=this.ctx;if(this.pendingClip){if(this.pendingClip===P)if(void 0!==t.mozFillRule)t.mozFillRule="evenodd",t.clip(),t.mozFillRule="nonzero";else try{t.clip("evenodd")}catch(e){t.clip()}else t.clip();this.pendingClip=null}t.beginPath()},getSinglePixelWidth:function(t){if(null===this.cachedGetSinglePixelWidth){var e=this.ctx.mozCurrentTransformInverse;this.cachedGetSinglePixelWidth=Math.sqrt(Math.max(e[0]*e[0]+e[1]*e[1],e[2]*e[2]+e[3]*e[3]))}return this.cachedGetSinglePixelWidth},getCanvasPosition:function(t,e){var n=this.ctx.mozCurrentTransform;return[n[0]*t+n[2]*e+n[4],n[1]*t+n[3]*e+n[5]]}};for(var w in T)i.prototype[T[w]]=i.prototype[w];return i}(),st=function(){function t(t,e,n){var i=t.createShader(n);t.shaderSource(i,e),t.compileShader(i);var r=t.getShaderParameter(i,t.COMPILE_STATUS);if(!r){var a=t.getShaderInfoLog(i);throw new Error("Error during shader compilation: "+a)}return i}function e(e,n){return t(e,n,e.VERTEX_SHADER)}function n(e,n){return t(e,n,e.FRAGMENT_SHADER)}function i(t,e){for(var n=t.createProgram(),i=0,r=e.length;r>i;++i)t.attachShader(n,e[i]);t.linkProgram(n);var a=t.getProgramParameter(n,t.LINK_STATUS);if(!a){var s=t.getProgramInfoLog(n);throw new Error("Error during program linking: "+s)}return n}function r(t,e,n){t.activeTexture(n);var i=t.createTexture();return t.bindTexture(t.TEXTURE_2D,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),i}function a(){d||(f=document.createElement("canvas"),d=f.getContext("webgl",{premultipliedalpha:!1}))}function s(){var t,r;a(),t=f,f=null,r=d,d=null;var s=e(r,p),o=n(r,A),l=i(r,[s,o]);r.useProgram(l);var c={};c.gl=r,c.canvas=t,c.resolutionLocation=r.getUniformLocation(l,"u_resolution"),c.positionLocation=r.getAttribLocation(l,"a_position"),c.backdropLocation=r.getUniformLocation(l,"u_backdrop"),c.subtypeLocation=r.getUniformLocation(l,"u_subtype");var h=r.getAttribLocation(l,"a_texCoord"),u=r.getUniformLocation(l,"u_image"),m=r.getUniformLocation(l,"u_mask"),v=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,v),r.bufferData(r.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),r.STATIC_DRAW),r.enableVertexAttribArray(h),r.vertexAttribPointer(h,2,r.FLOAT,!1,0,0),r.uniform1i(u,0),r.uniform1i(m,1),g=c}function l(t,e,n){var i=t.width,a=t.height;g||s();var o=g,l=o.canvas,c=o.gl;l.width=i,l.height=a,c.viewport(0,0,c.drawingBufferWidth,c.drawingBufferHeight),c.uniform2f(o.resolutionLocation,i,a),n.backdrop?c.uniform4f(o.resolutionLocation,n.backdrop[0],n.backdrop[1],n.backdrop[2],1):c.uniform4f(o.resolutionLocation,0,0,0,0),c.uniform1i(o.subtypeLocation,"Luminosity"===n.subtype?1:0);var h=r(c,t,c.TEXTURE0),u=r(c,e,c.TEXTURE1),d=c.createBuffer();return c.bindBuffer(c.ARRAY_BUFFER,d),c.bufferData(c.ARRAY_BUFFER,new Float32Array([0,0,i,0,0,a,0,a,i,0,i,a]),c.STATIC_DRAW),c.enableVertexAttribArray(o.positionLocation),c.vertexAttribPointer(o.positionLocation,2,c.FLOAT,!1,0,0),c.clearColor(0,0,0,0),
c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.clear(c.COLOR_BUFFER_BIT),c.drawArrays(c.TRIANGLES,0,6),c.flush(),c.deleteTexture(h),c.deleteTexture(u),c.deleteBuffer(d),l}function c(){var t,r;a(),t=f,f=null,r=d,d=null;var s=e(r,m),o=n(r,v),l=i(r,[s,o]);r.useProgram(l);var c={};c.gl=r,c.canvas=t,c.resolutionLocation=r.getUniformLocation(l,"u_resolution"),c.scaleLocation=r.getUniformLocation(l,"u_scale"),c.offsetLocation=r.getUniformLocation(l,"u_offset"),c.positionLocation=r.getAttribLocation(l,"a_position"),c.colorLocation=r.getAttribLocation(l,"a_color"),b=c}function h(t,e,n,i,r){b||c();var a=b,s=a.canvas,o=a.gl;s.width=t,s.height=e,o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),o.uniform2f(a.resolutionLocation,t,e);var l,h,u,d=0;for(l=0,h=i.length;h>l;l++)switch(i[l].type){case"lattice":u=i[l].coords.length/i[l].verticesPerRow|0,d+=(u-1)*(i[l].verticesPerRow-1)*6;break;case"triangles":d+=i[l].coords.length}var f=new Float32Array(2*d),p=new Uint8Array(3*d),A=r.coords,g=r.colors,m=0,v=0;for(l=0,h=i.length;h>l;l++){var S=i[l],x=S.coords,y=S.colors;switch(S.type){case"lattice":var k=S.verticesPerRow;u=x.length/k|0;for(var P=1;u>P;P++)for(var C=P*k+1,F=1;k>F;F++,C++)f[m]=A[x[C-k-1]],f[m+1]=A[x[C-k-1]+1],f[m+2]=A[x[C-k]],f[m+3]=A[x[C-k]+1],f[m+4]=A[x[C-1]],f[m+5]=A[x[C-1]+1],p[v]=g[y[C-k-1]],p[v+1]=g[y[C-k-1]+1],p[v+2]=g[y[C-k-1]+2],p[v+3]=g[y[C-k]],p[v+4]=g[y[C-k]+1],p[v+5]=g[y[C-k]+2],p[v+6]=g[y[C-1]],p[v+7]=g[y[C-1]+1],p[v+8]=g[y[C-1]+2],f[m+6]=f[m+2],f[m+7]=f[m+3],f[m+8]=f[m+4],f[m+9]=f[m+5],f[m+10]=A[x[C]],f[m+11]=A[x[C]+1],p[v+9]=p[v+3],p[v+10]=p[v+4],p[v+11]=p[v+5],p[v+12]=p[v+6],p[v+13]=p[v+7],p[v+14]=p[v+8],p[v+15]=g[y[C]],p[v+16]=g[y[C]+1],p[v+17]=g[y[C]+2],m+=12,v+=18;break;case"triangles":for(var D=0,w=x.length;w>D;D++)f[m]=A[x[D]],f[m+1]=A[x[D]+1],p[v]=g[y[l]],p[v+1]=g[y[D]+1],p[v+2]=g[y[D]+2],m+=2,v+=3}}n?o.clearColor(n[0]/255,n[1]/255,n[2]/255,1):o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT);var T=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,T),o.bufferData(o.ARRAY_BUFFER,f,o.STATIC_DRAW),o.enableVertexAttribArray(a.positionLocation),o.vertexAttribPointer(a.positionLocation,2,o.FLOAT,!1,0,0);var L=o.createBuffer();return o.bindBuffer(o.ARRAY_BUFFER,L),o.bufferData(o.ARRAY_BUFFER,p,o.STATIC_DRAW),o.enableVertexAttribArray(a.colorLocation),o.vertexAttribPointer(a.colorLocation,3,o.UNSIGNED_BYTE,!1,0,0),o.uniform2f(a.scaleLocation,r.scaleX,r.scaleY),o.uniform2f(a.offsetLocation,r.offsetX,r.offsetY),o.drawArrays(o.TRIANGLES,0,d),o.flush(),o.deleteBuffer(T),o.deleteBuffer(L),s}function u(){g&&g.canvas&&(g.canvas.width=0,g.canvas.height=0),b&&b.canvas&&(b.canvas.width=0,b.canvas.height=0),g=null,b=null}var d,f,p="  attribute vec2 a_position;                                      attribute vec2 a_texCoord;                                                                                                      uniform vec2 u_resolution;                                                                                                      varying vec2 v_texCoord;                                                                                                        void main() {                                                     vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);                                                                              v_texCoord = a_texCoord;                                      }                                                             ",A="  precision mediump float;                                                                                                        uniform vec4 u_backdrop;                                        uniform int u_subtype;                                          uniform sampler2D u_image;                                      uniform sampler2D u_mask;                                                                                                       varying vec2 v_texCoord;                                                                                                        void main() {                                                     vec4 imageColor = texture2D(u_image, v_texCoord);               vec4 maskColor = texture2D(u_mask, v_texCoord);                 if (u_backdrop.a > 0.0) {                                         maskColor.rgb = maskColor.rgb * maskColor.a +                                   u_backdrop.rgb * (1.0 - maskColor.a);         }                                                               float lum;                                                      if (u_subtype == 0) {                                             lum = maskColor.a;                                            } else {                                                          lum = maskColor.r * 0.3 + maskColor.g * 0.59 +                        maskColor.b * 0.11;                                     }                                                               imageColor.a *= lum;                                            imageColor.rgb *= imageColor.a;                                 gl_FragColor = imageColor;                                    }                                                             ",g=null,m="  attribute vec2 a_position;                                      attribute vec3 a_color;                                                                                                         uniform vec2 u_resolution;                                      uniform vec2 u_scale;                                           uniform vec2 u_offset;                                                                                                          varying vec4 v_color;                                                                                                           void main() {                                                     vec2 position = (a_position + u_offset) * u_scale;              vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;         gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);                                                                              v_color = vec4(a_color / 255.0, 1.0);                         }                                                             ",v="  precision mediump float;                                                                                                        varying vec4 v_color;                                                                                                           void main() {                                                     gl_FragColor = v_color;                                       }                                                             ",b=null;return{get isEnabled(){if(PDFJS.disableWebGL)return!1;var t=!1;try{a(),t=!!d}catch(e){}return o(this,"isEnabled",t)},composeSMask:l,drawFigures:h,clear:u}}(),ot={};ot.RadialAxial={fromIR:function(t){var e=t[1],n=t[2],i=t[3],r=t[4],a=t[5],s=t[6];return{type:"Pattern",getPattern:function(t){var o;"axial"===e?o=t.createLinearGradient(i[0],i[1],r[0],r[1]):"radial"===e&&(o=t.createRadialGradient(i[0],i[1],a,r[0],r[1],s));for(var l=0,c=n.length;c>l;++l){var h=n[l];o.addColorStop(h[0],h[1])}return o}}}};var lt=function(){function t(t,e,n,i,r,a,s,o){var l,c=e.coords,h=e.colors,u=t.data,d=4*t.width;c[n+1]>c[i+1]&&(l=n,n=i,i=l,l=a,a=s,s=l),c[i+1]>c[r+1]&&(l=i,i=r,r=l,l=s,s=o,o=l),c[n+1]>c[i+1]&&(l=n,n=i,i=l,l=a,a=s,s=l);var f=(c[n]+e.offsetX)*e.scaleX,p=(c[n+1]+e.offsetY)*e.scaleY,A=(c[i]+e.offsetX)*e.scaleX,g=(c[i+1]+e.offsetY)*e.scaleY,m=(c[r]+e.offsetX)*e.scaleX,v=(c[r+1]+e.offsetY)*e.scaleY;if(!(p>=v))for(var b,S,x,y,k,P,C,F,D,w=h[a],T=h[a+1],L=h[a+2],R=h[s],E=h[s+1],I=h[s+2],M=h[o],_=h[o+1],O=h[o+2],j=Math.round(p),N=Math.round(v),J=j;N>=J;J++){g>J?(D=p>J?0:p===g?1:(p-J)/(p-g),b=f-(f-A)*D,S=w-(w-R)*D,x=T-(T-E)*D,y=L-(L-I)*D):(D=J>v?1:g===v?0:(g-J)/(g-v),b=A-(A-m)*D,S=R-(R-M)*D,x=E-(E-_)*D,y=I-(I-O)*D),D=p>J?0:J>v?1:(p-J)/(p-v),k=f-(f-m)*D,P=w-(w-M)*D,C=T-(T-_)*D,F=L-(L-O)*D;for(var B=Math.round(Math.min(b,k)),W=Math.round(Math.max(b,k)),G=d*J+4*B,U=B;W>=U;U++)D=(b-U)/(b-k),D=0>D?0:D>1?1:D,u[G++]=S-(S-P)*D|0,u[G++]=x-(x-C)*D|0,u[G++]=y-(y-F)*D|0,u[G++]=255}}function e(e,i,r){var a,s,o=i.coords,l=i.colors;switch(i.type){case"lattice":var c=i.verticesPerRow,h=Math.floor(o.length/c)-1,u=c-1;for(a=0;h>a;a++)for(var d=a*c,f=0;u>f;f++,d++)t(e,r,o[d],o[d+1],o[d+c],l[d],l[d+1],l[d+c]),t(e,r,o[d+c+1],o[d+1],o[d+c],l[d+c+1],l[d+1],l[d+c]);break;case"triangles":for(a=0,s=o.length;s>a;a+=3)t(e,r,o[a],o[a+1],o[a+2],l[a],l[a+1],l[a+2]);break;default:n("illigal figure")}}function i(t,n,i,r,a,s){var o,l,c,h,u=1.1,d=3e3,f=Math.floor(t[0]),p=Math.floor(t[1]),A=Math.ceil(t[2])-f,g=Math.ceil(t[3])-p,m=Math.min(Math.ceil(Math.abs(A*n[0]*u)),d),v=Math.min(Math.ceil(Math.abs(g*n[1]*u)),d),b=A/m,S=g/v,x={coords:i,colors:r,offsetX:-f,offsetY:-p,scaleX:1/b,scaleY:1/S};if(st.isEnabled)o=st.drawFigures(m,v,s,a,x),l=it.getCanvas("mesh",m,v,!1),l.context.drawImage(o,0,0),o=l.canvas;else{l=it.getCanvas("mesh",m,v,!1);var y=l.context,k=y.createImageData(m,v);if(s){var P=k.data;for(c=0,h=P.length;h>c;c+=4)P[c]=s[0],P[c+1]=s[1],P[c+2]=s[2],P[c+3]=255}for(c=0;c<a.length;c++)e(k,a[c],x);y.putImageData(k,0,0),o=l.canvas}return{canvas:o,offsetX:f,offsetY:p,scaleX:b,scaleY:S}}return i}();ot.Mesh={fromIR:function(t){var e=t[2],n=t[3],i=t[4],r=t[5],a=t[6],s=t[8];return{type:"Pattern",getPattern:function(t,o,l){var c;if(l)c=B.singularValueDecompose2dScale(t.mozCurrentTransform);else if(c=B.singularValueDecompose2dScale(o.baseTransform),a){var h=B.singularValueDecompose2dScale(a);c=[c[0]*h[0],c[1]*h[1]]}var u=lt(r,c,e,n,i,l?null:s);return l||(t.setTransform.apply(t,o.baseTransform),a&&t.transform.apply(t,a)),t.translate(u.offsetX,u.offsetY),t.scale(u.scaleX,u.scaleY),t.createPattern(u.canvas,"no-repeat")}}}},ot.Dummy={fromIR:function(){return{type:"Pattern",getPattern:function(){return"hotpink"}}}};var ct=function(){function e(t,e,n,i,r,a){this.operatorList=t[2],this.matrix=t[3]||[1,0,0,1,0,0],this.bbox=t[4],this.xstep=t[5],this.ystep=t[6],this.paintType=t[7],this.tilingType=t[8],this.color=e,this.objs=i,this.commonObjs=r,this.baseTransform=a,this.type="Pattern",this.ctx=n}var i={COLORED:1,UNCOLORED:2},r=3e3;return e.prototype={createPatternCanvas:function(e){var n=this.operatorList,i=this.bbox,a=this.xstep,s=this.ystep,o=this.paintType,l=this.tilingType,c=this.color,h=this.objs,u=this.commonObjs;t("TilingType: "+l);var d=i[0],f=i[1],p=i[2],A=i[3],g=[d,f],m=[d+a,f+s],v=m[0]-g[0],b=m[1]-g[1],S=B.singularValueDecompose2dScale(this.matrix),x=B.singularValueDecompose2dScale(this.baseTransform),y=[S[0]*x[0],S[1]*x[1]];v=Math.min(Math.ceil(Math.abs(v*y[0])),r),b=Math.min(Math.ceil(Math.abs(b*y[1])),r);var k=it.getCanvas("pattern",v,b,!0),P=k.context,C=new at(P,u,h);C.groupLevel=e.groupLevel,this.setFillAndStrokeStyleToContext(P,o,c),this.setScale(v,b,a,s),this.transformToScale(C);var F=[1,0,0,1,-g[0],-g[1]];return C.transform.apply(C,F),this.clipBbox(C,i,d,f,p,A),C.executeOperatorList(n),k.canvas},setScale:function(t,e,n,i){this.scale=[t/n,e/i]},transformToScale:function(t){var e=this.scale,n=[e[0],0,0,e[1],0,0];t.transform.apply(t,n)},scaleToContext:function(){var t=this.scale;this.ctx.scale(1/t[0],1/t[1])},clipBbox:function(t,e,n,i,r,a){if(e&&p(e)&&4===e.length){var s=r-n,o=a-i;t.ctx.rect(n,i,s,o),t.clip(),t.endPath()}},setFillAndStrokeStyleToContext:function(t,e,r){switch(e){case i.COLORED:var a=this.ctx;t.fillStyle=a.fillStyle,t.strokeStyle=a.strokeStyle;break;case i.UNCOLORED:var s=B.makeCssRgb(r[0],r[1],r[2]);t.fillStyle=s,t.strokeStyle=s;break;default:n("Unsupported paint type: "+e)}},getPattern:function(t,e){var n=this.createPatternCanvas(e);return t=this.ctx,t.setTransform.apply(t,this.baseTransform),t.transform.apply(t,this.matrix),this.scaleToContext(),t.createPattern(n,"repeat")}},e}();PDFJS.disableFontFace=!1;var ht={insertRule:function(t){var e=document.getElementById("PDFJS_FONT_STYLE_TAG");e||(e=document.createElement("style"),e.id="PDFJS_FONT_STYLE_TAG",document.documentElement.getElementsByTagName("head")[0].appendChild(e));var n=e.sheet;n.insertRule(t,n.cssRules.length)},clear:function(){var t=document.getElementById("PDFJS_FONT_STYLE_TAG");t&&t.parentNode.removeChild(t),this.nativeFontFaces.forEach(function(t){document.fonts["delete"](t)}),this.nativeFontFaces.length=0},get loadTestFont(){return o(this,"loadTestFont",atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA=="))},loadTestFontId:0,loadingContext:{requests:[],nextRequestId:0},isSyncFontLoadingSupported:function(){if(P)return!1;var t=window.navigator.userAgent,e=/Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(t);return e&&e[1]>=14?!0:"node"===t}(),nativeFontFaces:[],isFontLoadingAPISupported:!P&&"undefined"!=typeof document&&!!document.fonts,addNativeFontFace:function(t){this.nativeFontFaces.push(t),document.fonts.add(t)},bind:function(t,e){r(!P,"bind() shall be called from main thread");for(var n=[],i=[],a=[],s=0,o=t.length;o>s;s++){var l=t[s];if(!l.attached&&l.loading!==!1)if(l.attached=!0,this.isFontLoadingAPISupported){var c=l.createNativeFontFace();c&&a.push(c.loaded)}else{var h=l.bindDOM();h&&(n.push(h),i.push(l))}}var u=ht.queueLoadingCallback(e);this.isFontLoadingAPISupported?Promise.all(i).then(function(){u.complete()}):n.length>0&&!this.isSyncFontLoadingSupported?ht.prepareFontLoadEvent(n,i,u):u.complete()},queueLoadingCallback:function(t){function e(){for(r(!a.end,"completeRequest() cannot be called twice"),a.end=Date.now();n.requests.length>0&&n.requests[0].end;){var t=n.requests.shift();setTimeout(t.callback,0)}}var n=ht.loadingContext,i="pdfjs-font-loading-"+n.nextRequestId++,a={id:i,complete:e,callback:t,started:Date.now()};return n.requests.push(a),a},prepareFontLoadEvent:function(t,n,i){function r(t,e){return t.charCodeAt(e)<<24|t.charCodeAt(e+1)<<16|t.charCodeAt(e+2)<<8|255&t.charCodeAt(e+3)}function a(t,e,n,i){var r=t.substr(0,e),a=t.substr(e+n);return r+i+a}function s(t,n){if(d++,d>30)return e("Load test font never loaded."),void n();u.font="30px "+t,u.fillText(".",0,20);var i=u.getImageData(0,0,1,1);return i.data[3]>0?void n():void setTimeout(s.bind(null,t,n))}var o,l,c=document.createElement("canvas");c.width=1,c.height=1;var u=c.getContext("2d"),d=0,f="lt"+Date.now()+this.loadTestFontId++,p=this.loadTestFont,A=976;p=a(p,A,f.length,f);var g=16,m=1482184792,v=r(p,g);for(o=0,l=f.length-3;l>o;o+=4)v=v-m+r(f,o)|0;o<f.length&&(v=v-m+r(f+"XXX",o)|0),p=a(p,g,4,h(v));var b="url(data:font/opentype;base64,"+btoa(p)+");",S='@font-face { font-family:"'+f+'";src:'+b+"}";ht.insertRule(S);var x=[];for(o=0,l=n.length;l>o;o++)x.push(n[o].loadedName);x.push(f);var y=document.createElement("div");for(y.setAttribute("style","visibility: hidden;width: 10px; height: 10px;position: absolute; top: 0px; left: 0px;"),o=0,l=x.length;l>o;++o){var k=document.createElement("span");k.textContent="Hi",k.style.fontFamily=x[o],y.appendChild(k)}document.body.appendChild(y),s(f,function(){document.body.removeChild(y),i.complete()})}},ut=function(){function t(t,e,n){if(this.compiledGlyphs={},1!==arguments.length);else{var i=arguments[0];for(var r in i)this[r]=i[r]}}return t.prototype={createNativeFontFace:function(){if(!this.data)return null;if(PDFJS.disableFontFace)return this.disableFontFace=!0,null;var t=new FontFace(this.loadedName,this.data,{});return ht.addNativeFontFace(t),PDFJS.pdfBug&&"FontInspector"in k&&k.FontInspector.enabled&&k.FontInspector.fontAdded(this),t},bindDOM:function(){if(!this.data)return null;if(PDFJS.disableFontFace)return this.disableFontFace=!0,null;var t=l(new Uint8Array(this.data)),e=this.loadedName,n="url(data:"+this.mimetype+";base64,"+window.btoa(t)+");",i='@font-face { font-family:"'+e+'";src:'+n+"}";return ht.insertRule(i),PDFJS.pdfBug&&"FontInspector"in k&&k.FontInspector.enabled&&k.FontInspector.fontAdded(this,n),i},getPathGenerator:function(t,e){if(!(e in this.compiledGlyphs)){var n=t.get(this.loadedName+"_path_"+e);this.compiledGlyphs[e]=new Function("c","size",n)}return this.compiledGlyphs[e]}},t}(),dt=10,ft=function(){function t(t,e,n){var i=t.style;if(i.fontSize=e.fontSize+"px",i.direction=e.fontDirection<0?"rtl":"ltr",n){i.fontWeight=n.black?n.bold?"bolder":"bold":n.bold?"bold":"normal",i.fontStyle=n.italic?"italic":"normal";var r=n.loadedName,a=r?'"'+r+'", ':"",s=n.fallbackName||"Helvetica, sans-serif";i.fontFamily=a+s}}function e(t,e){var n=document.createElement("section"),i=n.style,r=t.rect[2]-t.rect[0],a=t.rect[3]-t.rect[1],s=t.borderWidth||0;if(s){r-=2*s,a-=2*s,i.borderWidth=s+"px";var o=t.color;e&&o&&(i.borderStyle="solid",i.borderColor=B.makeCssRgb(Math.round(255*o[0]),Math.round(255*o[1]),Math.round(255*o[2])))}return i.width=r+"px",i.height=a+"px",n}function n(e,n){var i=document.createElement("div"),r=e.rect[2]-e.rect[0],a=e.rect[3]-e.rect[1];i.style.width=r+"px",i.style.height=a+"px",i.style.display="table";var s=document.createElement("div");s.textContent=e.fieldValue;var o=e.textAlignment;s.style.textAlign=["left","center","right"][o],s.style.verticalAlign="middle",s.style.display="table-cell";var l=e.fontRefName?n.getData(e.fontRefName):null;return t(s,e,l),i.appendChild(s),i}function i(t){var n=t.rect;n[3]-n[1]<dt&&(n[3]=n[1]+dt),n[2]-n[0]<dt&&(n[2]=n[0]+(n[3]-n[1]));var i=e(t,!1);i.className="annotText";var r=document.createElement("img");r.style.height=i.style.height,r.style.width=i.style.width;var a=t.name;r.src=PDFJS.imageResourcesPath+"annotation-"+a.toLowerCase()+".svg",r.alt="[{{type}} Annotation]",r.dataset.l10nId="text_annotation_type",r.dataset.l10nArgs=JSON.stringify({type:a});var s=document.createElement("div");s.className="annotTextContentWrapper",s.style.left=Math.floor(n[2]-n[0]+5)+"px",s.style.top="-10px";var o=document.createElement("div");o.className="annotTextContent",o.setAttribute("hidden",!0);var l,c;if(t.hasBgColor){var h=t.color,u=.7,d=u*(1-h[0])+h[0],f=u*(1-h[1])+h[1],p=u*(1-h[2])+h[2];o.style.backgroundColor=B.makeCssRgb(255*d|0,255*f|0,255*p|0)}var A=document.createElement("h1"),g=document.createElement("p");if(A.textContent=t.title,t.content||t.title){var m=document.createElement("span"),v=t.content.split(/(?:\r\n?|\n)/);for(l=0,c=v.length;c>l;++l){var b=v[l];m.appendChild(document.createTextNode(b)),c-1>l&&m.appendChild(document.createElement("br"))}g.appendChild(m);var S=!1,x=function(t){t&&(S=!0),o.hasAttribute("hidden")&&(i.style.zIndex+=1,o.removeAttribute("hidden"))},y=function(t){t&&(S=!1),o.hasAttribute("hidden")||S||(i.style.zIndex-=1,o.setAttribute("hidden",!0))},k=function(){S?y(!0):x(!0)};r.addEventListener("click",function(){k()},!1),r.addEventListener("mouseover",function(){x()},!1),r.addEventListener("mouseout",function(){y()},!1),o.addEventListener("click",function(){y(!0)},!1)}else o.setAttribute("hidden",!0);return o.appendChild(A),o.appendChild(g),s.appendChild(o),i.appendChild(r),i.appendChild(s),i}function r(t){var n=e(t,!0);n.className="annotLink";var i=document.createElement("a");return i.href=i.title=t.url||"",t.url&&PDFJS.openExternalLinksInNewWindow&&(i.target="_blank"),n.appendChild(i),n}function a(t,e){switch(t.annotationType){case w.WIDGET:return n(t,e);case w.TEXT:return i(t);case w.LINK:return r(t);default:throw new Error("Unsupported annotationType: "+t.annotationType)}}return{getHtmlElement:a}}();PDFJS.AnnotationUtils=ft;var pt={fontStyle:"normal",fontWeight:"normal",fillColor:"#000000"},At=function(){function t(t,e,n){for(var i=-1,r=e;n>r;r++){var a=255&(i^t[r]),o=s[a];i=i>>>8^o}return-1^i}function e(e,n,i,r){var a=r,s=n.length;i[a]=s>>24&255,i[a+1]=s>>16&255,i[a+2]=s>>8&255,i[a+3]=255&s,a+=4,i[a]=255&e.charCodeAt(0),i[a+1]=255&e.charCodeAt(1),i[a+2]=255&e.charCodeAt(2),i[a+3]=255&e.charCodeAt(3),a+=4,i.set(n,a),a+=n.length;var o=t(i,r+4,a);i[a]=o>>24&255,i[a+1]=o>>16&255,i[a+2]=o>>8&255,i[a+3]=255&o}function n(t,e,n){for(var i=1,r=0,a=e;n>a;++a)i=(i+(255&t[a]))%65521,r=(r+i)%65521;return r<<16|i}function i(t,i){var s,o,l,c=t.width,h=t.height,u=t.data;switch(i){case D.GRAYSCALE_1BPP:o=0,s=1,l=c+7>>3;break;case D.RGB_24BPP:o=2,s=8,l=3*c;break;case D.RGBA_32BPP:o=6,s=8,l=4*c;break;default:throw new Error("invalid format")}var d,f,p=new Uint8Array((1+l)*h),A=0,g=0;for(d=0;h>d;++d)p[A++]=0,p.set(u.subarray(g,g+l),A),g+=l,A+=l;if(i===D.GRAYSCALE_1BPP)for(A=0,d=0;h>d;d++)for(A++,f=0;l>f;f++)p[A++]^=255;var m=new Uint8Array([c>>24&255,c>>16&255,c>>8&255,255&c,h>>24&255,h>>16&255,h>>8&255,255&h,s,o,0,0,0]),v=p.length,b=65535,S=Math.ceil(v/b),x=new Uint8Array(2+v+5*S+4),y=0;x[y++]=120,x[y++]=156;for(var k=0;v>b;)x[y++]=0,x[y++]=255,x[y++]=255,x[y++]=0,x[y++]=0,x.set(p.subarray(k,k+b),y),y+=b,k+=b,v-=b;x[y++]=1,x[y++]=255&v,x[y++]=v>>8&255,x[y++]=65535&~v&255,x[y++]=(65535&~v)>>8&255,x.set(p.subarray(k),y),y+=p.length-k;var P=n(p,0,p.length);x[y++]=P>>24&255,x[y++]=P>>16&255,x[y++]=P>>8&255,x[y++]=255&P;var C=r.length+3*a+m.length+x.length,F=new Uint8Array(C),w=0;return F.set(r,w),w+=r.length,e("IHDR",m,F,w),w+=a+m.length,e("IDATA",x,F,w),w+=a+x.length,e("IEND",new Uint8Array(0),F,w),PDFJS.createObjectURL(F,"image/png")}for(var r=new Uint8Array([137,80,78,71,13,10,26,10]),a=12,s=new Int32Array(256),o=0;256>o;o++){for(var l=o,c=0;8>c;c++)l=1&l?3988292384^l>>1&2147483647:l>>1&2147483647;s[o]=l}return function(t){var e=void 0===t.kind?D.GRAYSCALE_1BPP:t.kind;return i(t,e)}}(),gt=function(){function t(){this.fontSizeScale=1,this.fontWeight=pt.fontWeight,this.fontSize=0,this.textMatrix=J,this.fontMatrix=C,this.leading=0,this.x=0,this.y=0,this.lineX=0,this.lineY=0,this.charSpacing=0,this.wordSpacing=0,this.textHScale=1,this.textRise=0,this.fillColor=pt.fillColor,this.strokeColor="#000000",this.fillAlpha=1,this.strokeAlpha=1,this.lineWidth=1,this.lineJoin="",this.lineCap="",this.miterLimit=0,this.dashArray=[],this.dashPhase=0,this.dependencies=[],this.clipId="",this.pendingClip=!1,this.maskId=""}return t.prototype={clone:function(){return Object.create(this)},setCurrentPoint:function(t,e){this.x=t,this.y=e}},t}(),mt=function(){function t(t,e){var n="http://www.w3.org/2000/svg",i=document.createElementNS(n,"svg:svg");return i.setAttributeNS(null,"version","1.1"),i.setAttributeNS(null,"width",t+"px"),i.setAttributeNS(null,"height",e+"px"),i.setAttributeNS(null,"viewBox","0 0 "+t+" "+e),i}function n(t){for(var e=[],n=[],i=t.length,r=0;i>r;r++)"save"!==t[r].fn?"restore"===t[r].fn?e=n.pop():e.push(t[r]):(e.push({fnId:92,fn:"group",items:[]}),n.push(e),e=e[e.length-1].items);return e}function i(t){if(t===(0|t))return t.toString();var e=t.toFixed(10),n=e.length-1;if("0"!==e[n])return e;do n--;while("0"===e[n]);return e.substr(0,"."===e[n]?n:n+1)}function r(t){if(0===t[4]&&0===t[5]){if(0===t[1]&&0===t[2])return 1===t[0]&&1===t[3]?"":"scale("+i(t[0])+" "+i(t[3])+")";if(t[0]===t[3]&&t[1]===-t[2]){var e=180*Math.acos(t[0])/Math.PI;return"rotate("+i(e)+")"}}else if(1===t[0]&&0===t[1]&&0===t[2]&&1===t[3])return"translate("+i(t[4])+" "+i(t[5])+")";return"matrix("+i(t[0])+" "+i(t[1])+" "+i(t[2])+" "+i(t[3])+" "+i(t[4])+" "+i(t[5])+")"}function a(t,e){this.current=new gt,this.transformMatrix=J,this.transformStack=[],this.extraStack=[],this.commonObjs=t,this.objs=e,this.pendingEOFill=!1,this.embedFonts=!1,this.embeddedFonts={},this.cssStyle=null}var s="http://www.w3.org/2000/svg",o="http://www.w3.org/XML/1998/namespace",l="http://www.w3.org/1999/xlink",c=["butt","round","square"],h=["miter","round","bevel"],u=0,d=0;return a.prototype={save:function(){this.transformStack.push(this.transformMatrix);var t=this.current;this.extraStack.push(t),this.current=t.clone()},restore:function(){this.transformMatrix=this.transformStack.pop(),this.current=this.extraStack.pop(),this.tgrp=document.createElementNS(s,"svg:g"),this.tgrp.setAttributeNS(null,"transform",r(this.transformMatrix)),this.pgrp.appendChild(this.tgrp)},group:function(t){this.save(),this.executeOpTree(t),this.restore()},loadDependencies:function(t){for(var e=t.fnArray,n=e.length,i=t.argsArray,r=this,a=0;n>a;a++)if(T.dependency===e[a])for(var s=i[a],o=0,l=s.length;l>o;o++){var c,h=s[o],u="g_"===h.substring(0,2);c=u?new Promise(function(t){r.commonObjs.get(h,t)}):new Promise(function(t){r.objs.get(h,t)}),this.current.dependencies.push(c)}return Promise.all(this.current.dependencies)},transform:function(t,e,n,i,a,o){var l=[t,e,n,i,a,o];this.transformMatrix=PDFJS.Util.transform(this.transformMatrix,l),this.tgrp=document.createElementNS(s,"svg:g"),this.tgrp.setAttributeNS(null,"transform",r(this.transformMatrix))},getSVG:function(e,n){return this.svg=t(n.width,n.height),this.viewport=n,this.loadDependencies(e).then(function(){this.transformMatrix=J,this.pgrp=document.createElementNS(s,"svg:g"),this.pgrp.setAttributeNS(null,"transform",r(n.transform)),this.tgrp=document.createElementNS(s,"svg:g"),this.tgrp.setAttributeNS(null,"transform",r(this.transformMatrix)),this.defs=document.createElementNS(s,"svg:defs"),this.pgrp.appendChild(this.defs),this.pgrp.appendChild(this.tgrp),this.svg.appendChild(this.pgrp);var t=this.convertOpList(e);return this.executeOpTree(t),this.svg}.bind(this))},convertOpList:function(t){var e=t.argsArray,i=t.fnArray,r=i.length,a=[],s=[];for(var o in T)a[T[o]]=o;for(var l=0;r>l;l++){var c=i[l];s.push({fnId:c,fn:a[c],args:e[l]})}return n(s)},executeOpTree:function(t){for(var n=t.length,i=0;n>i;i++){var r=t[i].fn,a=t[i].fnId,s=t[i].args;switch(0|a){case T.beginText:this.beginText();break;case T.setLeading:this.setLeading(s);break;case T.setLeadingMoveText:this.setLeadingMoveText(s[0],s[1]);break;case T.setFont:this.setFont(s);break;case T.showText:this.showText(s[0]);break;case T.showSpacedText:this.showText(s[0]);break;case T.endText:this.endText();break;case T.moveText:this.moveText(s[0],s[1]);break;case T.setCharSpacing:this.setCharSpacing(s[0]);break;case T.setWordSpacing:this.setWordSpacing(s[0]);break;case T.setHScale:this.setHScale(s[0]);break;case T.setTextMatrix:this.setTextMatrix(s[0],s[1],s[2],s[3],s[4],s[5]);break;case T.setLineWidth:this.setLineWidth(s[0]);break;case T.setLineJoin:this.setLineJoin(s[0]);break;case T.setLineCap:this.setLineCap(s[0]);break;case T.setMiterLimit:this.setMiterLimit(s[0]);break;case T.setFillRGBColor:this.setFillRGBColor(s[0],s[1],s[2]);break;case T.setStrokeRGBColor:this.setStrokeRGBColor(s[0],s[1],s[2]);break;case T.setDash:this.setDash(s[0],s[1]);break;case T.setGState:this.setGState(s[0]);break;case T.fill:this.fill();break;case T.eoFill:this.eoFill();break;case T.stroke:this.stroke();break;case T.fillStroke:this.fillStroke();break;case T.eoFillStroke:this.eoFillStroke();break;case T.clip:this.clip("nonzero");break;case T.eoClip:this.clip("evenodd");break;case T.paintSolidColorImageMask:this.paintSolidColorImageMask();break;case T.paintJpegXObject:this.paintJpegXObject(s[0],s[1],s[2]);break;case T.paintImageXObject:this.paintImageXObject(s[0]);break;case T.paintInlineImageXObject:this.paintInlineImageXObject(s[0]);break;case T.paintImageMaskXObject:this.paintImageMaskXObject(s[0]);break;case T.paintFormXObjectBegin:this.paintFormXObjectBegin(s[0],s[1]);break;case T.paintFormXObjectEnd:this.paintFormXObjectEnd();break;case T.closePath:this.closePath();break;case T.closeStroke:this.closeStroke();break;case T.closeFillStroke:this.closeFillStroke();break;case T.nextLine:this.nextLine();break;case T.transform:this.transform(s[0],s[1],s[2],s[3],s[4],s[5]);break;case T.constructPath:this.constructPath(s[0],s[1]);break;case T.endPath:this.endPath();break;case 92:this.group(t[i].items);break;default:e("Unimplemented method "+r)}}},setWordSpacing:function(t){this.current.wordSpacing=t},setCharSpacing:function(t){this.current.charSpacing=t},nextLine:function(){this.moveText(0,this.current.leading)},setTextMatrix:function(t,e,n,r,a,o){var l=this.current;this.current.textMatrix=this.current.lineMatrix=[t,e,n,r,a,o],this.current.x=this.current.lineX=0,this.current.y=this.current.lineY=0,l.xcoords=[],l.tspan=document.createElementNS(s,"svg:tspan"),l.tspan.setAttributeNS(null,"font-family",l.fontFamily),l.tspan.setAttributeNS(null,"font-size",i(l.fontSize)+"px"),l.tspan.setAttributeNS(null,"y",i(-l.y)),l.txtElement=document.createElementNS(s,"svg:text"),l.txtElement.appendChild(l.tspan)},beginText:function(){this.current.x=this.current.lineX=0,this.current.y=this.current.lineY=0,this.current.textMatrix=J,this.current.lineMatrix=J,this.current.tspan=document.createElementNS(s,"svg:tspan"),this.current.txtElement=document.createElementNS(s,"svg:text"),this.current.txtgrp=document.createElementNS(s,"svg:g"),this.current.xcoords=[]},moveText:function(t,e){var n=this.current;this.current.x=this.current.lineX+=t,this.current.y=this.current.lineY+=e,n.xcoords=[],n.tspan=document.createElementNS(s,"svg:tspan"),n.tspan.setAttributeNS(null,"font-family",n.fontFamily),n.tspan.setAttributeNS(null,"font-size",i(n.fontSize)+"px"),n.tspan.setAttributeNS(null,"y",i(-n.y))},showText:function(t){var e=this.current,n=e.font,a=e.fontSize;if(0!==a){var s,l=e.charSpacing,c=e.wordSpacing,h=e.fontDirection,u=e.textHScale*h,d=t.length,p=n.vertical,A=a*e.fontMatrix[0],g=0;for(s=0;d>s;++s){var m=t[s];if(null!==m)if(f(m))g+=-m*a*.001;else{e.xcoords.push(e.x+g*u);var v=m.width,b=m.fontChar,S=v*A+l*h;g+=S,e.tspan.textContent+=b}else g+=h*c}p?e.y-=g*u:e.x+=g*u,e.tspan.setAttributeNS(null,"x",e.xcoords.map(i).join(" ")),e.tspan.setAttributeNS(null,"y",i(-e.y)),e.tspan.setAttributeNS(null,"font-family",e.fontFamily),e.tspan.setAttributeNS(null,"font-size",i(e.fontSize)+"px"),e.fontStyle!==pt.fontStyle&&e.tspan.setAttributeNS(null,"font-style",e.fontStyle),e.fontWeight!==pt.fontWeight&&e.tspan.setAttributeNS(null,"font-weight",e.fontWeight),e.fillColor!==pt.fillColor&&e.tspan.setAttributeNS(null,"fill",e.fillColor),e.txtElement.setAttributeNS(null,"transform",r(e.textMatrix)+" scale(1, -1)"),e.txtElement.setAttributeNS(o,"xml:space","preserve"),e.txtElement.appendChild(e.tspan),e.txtgrp.appendChild(e.txtElement),this.tgrp.appendChild(e.txtElement)}},setLeadingMoveText:function(t,e){this.setLeading(-e),this.moveText(t,e)},addFontStyle:function(t){this.cssStyle||(this.cssStyle=document.createElementNS(s,"svg:style"),this.cssStyle.setAttributeNS(null,"type","text/css"),this.defs.appendChild(this.cssStyle));var e=PDFJS.createObjectURL(t.data,t.mimetype);this.cssStyle.textContent+='@font-face { font-family: "'+t.loadedName+'"; src: url('+e+"); }\n"},setFont:function(t){var e=this.current,n=this.commonObjs.get(t[0]),r=t[1];this.current.font=n,this.embedFonts&&n.data&&!this.embeddedFonts[n.loadedName]&&(this.addFontStyle(n),this.embeddedFonts[n.loadedName]=n),e.fontMatrix=n.fontMatrix?n.fontMatrix:C;
var a=n.black?n.bold?"bolder":"bold":n.bold?"bold":"normal",o=n.italic?"italic":"normal";0>r?(r=-r,e.fontDirection=-1):e.fontDirection=1,e.fontSize=r,e.fontFamily=n.loadedName,e.fontWeight=a,e.fontStyle=o,e.tspan=document.createElementNS(s,"svg:tspan"),e.tspan.setAttributeNS(null,"y",i(-e.y)),e.xcoords=[]},endText:function(){this.current.pendingClip?(this.cgrp.appendChild(this.tgrp),this.pgrp.appendChild(this.cgrp)):this.pgrp.appendChild(this.tgrp),this.tgrp=document.createElementNS(s,"svg:g"),this.tgrp.setAttributeNS(null,"transform",r(this.transformMatrix))},setLineWidth:function(t){this.current.lineWidth=t},setLineCap:function(t){this.current.lineCap=c[t]},setLineJoin:function(t){this.current.lineJoin=h[t]},setMiterLimit:function(t){this.current.miterLimit=t},setStrokeRGBColor:function(t,e,n){var i=B.makeCssRgb(t,e,n);this.current.strokeColor=i},setFillRGBColor:function(t,e,n){var i=B.makeCssRgb(t,e,n);this.current.fillColor=i,this.current.tspan=document.createElementNS(s,"svg:tspan"),this.current.xcoords=[]},setDash:function(t,e){this.current.dashArray=t,this.current.dashPhase=e},constructPath:function(t,e){var n=this.current,r=n.x,a=n.y;n.path=document.createElementNS(s,"svg:path");for(var o=[],l=t.length,c=0,h=0;l>c;c++)switch(0|t[c]){case T.rectangle:r=e[h++],a=e[h++];var u=e[h++],d=e[h++],f=r+u,p=a+d;o.push("M",i(r),i(a),"L",i(f),i(a),"L",i(f),i(p),"L",i(r),i(p),"Z");break;case T.moveTo:r=e[h++],a=e[h++],o.push("M",i(r),i(a));break;case T.lineTo:r=e[h++],a=e[h++],o.push("L",i(r),i(a));break;case T.curveTo:r=e[h+4],a=e[h+5],o.push("C",i(e[h]),i(e[h+1]),i(e[h+2]),i(e[h+3]),i(r),i(a)),h+=6;break;case T.curveTo2:r=e[h+2],a=e[h+3],o.push("C",i(r),i(a),i(e[h]),i(e[h+1]),i(e[h+2]),i(e[h+3])),h+=4;break;case T.curveTo3:r=e[h+2],a=e[h+3],o.push("C",i(e[h]),i(e[h+1]),i(r),i(a),i(r),i(a)),h+=4;break;case T.closePath:o.push("Z")}n.path.setAttributeNS(null,"d",o.join(" ")),n.path.setAttributeNS(null,"stroke-miterlimit",i(n.miterLimit)),n.path.setAttributeNS(null,"stroke-linecap",n.lineCap),n.path.setAttributeNS(null,"stroke-linejoin",n.lineJoin),n.path.setAttributeNS(null,"stroke-width",i(n.lineWidth)+"px"),n.path.setAttributeNS(null,"stroke-dasharray",n.dashArray.map(i).join(" ")),n.path.setAttributeNS(null,"stroke-dashoffset",i(n.dashPhase)+"px"),n.path.setAttributeNS(null,"fill","none"),this.tgrp.appendChild(n.path),n.pendingClip?(this.cgrp.appendChild(this.tgrp),this.pgrp.appendChild(this.cgrp)):this.pgrp.appendChild(this.tgrp),n.element=n.path,n.setCurrentPoint(r,a)},endPath:function(){var t=this.current;t.pendingClip?(this.cgrp.appendChild(this.tgrp),this.pgrp.appendChild(this.cgrp)):this.pgrp.appendChild(this.tgrp),this.tgrp=document.createElementNS(s,"svg:g"),this.tgrp.setAttributeNS(null,"transform",r(this.transformMatrix))},clip:function(t){var e=this.current;e.clipId="clippath"+u,u++,this.clippath=document.createElementNS(s,"svg:clipPath"),this.clippath.setAttributeNS(null,"id",e.clipId);var n=e.element.cloneNode();"evenodd"===t?n.setAttributeNS(null,"clip-rule","evenodd"):n.setAttributeNS(null,"clip-rule","nonzero"),this.clippath.setAttributeNS(null,"transform",r(this.transformMatrix)),this.clippath.appendChild(n),this.defs.appendChild(this.clippath),e.pendingClip=!0,this.cgrp=document.createElementNS(s,"svg:g"),this.cgrp.setAttributeNS(null,"clip-path","url(#"+e.clipId+")"),this.pgrp.appendChild(this.cgrp)},closePath:function(){var t=this.current,e=t.path.getAttributeNS(null,"d");e+="Z",t.path.setAttributeNS(null,"d",e)},setLeading:function(t){this.current.leading=-t},setTextRise:function(t){this.current.textRise=t},setHScale:function(t){this.current.textHScale=t/100},setGState:function(t){for(var e=0,n=t.length;n>e;e++){var i=t[e],r=i[0],a=i[1];switch(r){case"LW":this.setLineWidth(a);break;case"LC":this.setLineCap(a);break;case"LJ":this.setLineJoin(a);break;case"ML":this.setMiterLimit(a);break;case"D":this.setDash(a[0],a[1]);break;case"RI":break;case"FL":break;case"Font":this.setFont(a);break;case"CA":break;case"ca":break;case"BM":break;case"SMask":}}},fill:function(){var t=this.current;t.element.setAttributeNS(null,"fill",t.fillColor)},stroke:function(){var t=this.current;t.element.setAttributeNS(null,"stroke",t.strokeColor),t.element.setAttributeNS(null,"fill","none")},eoFill:function(){var t=this.current;t.element.setAttributeNS(null,"fill",t.fillColor),t.element.setAttributeNS(null,"fill-rule","evenodd")},fillStroke:function(){this.stroke(),this.fill()},eoFillStroke:function(){this.current.element.setAttributeNS(null,"fill-rule","evenodd"),this.fillStroke()},closeStroke:function(){this.closePath(),this.stroke()},closeFillStroke:function(){this.closePath(),this.fillStroke()},paintSolidColorImageMask:function(){var t=this.current,e=document.createElementNS(s,"svg:rect");e.setAttributeNS(null,"x","0"),e.setAttributeNS(null,"y","0"),e.setAttributeNS(null,"width","1px"),e.setAttributeNS(null,"height","1px"),e.setAttributeNS(null,"fill",t.fillColor),this.tgrp.appendChild(e)},paintJpegXObject:function(t,e,n){var r=this.current,a=this.objs.get(t),o=document.createElementNS(s,"svg:image");o.setAttributeNS(l,"xlink:href",a.src),o.setAttributeNS(null,"width",a.width+"px"),o.setAttributeNS(null,"height",a.height+"px"),o.setAttributeNS(null,"x","0"),o.setAttributeNS(null,"y",i(-n)),o.setAttributeNS(null,"transform","scale("+i(1/e)+" "+i(-1/n)+")"),this.tgrp.appendChild(o),r.pendingClip?(this.cgrp.appendChild(this.tgrp),this.pgrp.appendChild(this.cgrp)):this.pgrp.appendChild(this.tgrp)},paintImageXObject:function(t){var n=this.objs.get(t);return n?void this.paintInlineImageXObject(n):void e("Dependent image isn't ready yet")},paintInlineImageXObject:function(t,e){var n=this.current,r=t.width,a=t.height,o=At(t),c=document.createElementNS(s,"svg:rect");c.setAttributeNS(null,"x","0"),c.setAttributeNS(null,"y","0"),c.setAttributeNS(null,"width",i(r)),c.setAttributeNS(null,"height",i(a)),n.element=c,this.clip("nonzero");var h=document.createElementNS(s,"svg:image");h.setAttributeNS(l,"xlink:href",o),h.setAttributeNS(null,"x","0"),h.setAttributeNS(null,"y",i(-a)),h.setAttributeNS(null,"width",i(r)+"px"),h.setAttributeNS(null,"height",i(a)+"px"),h.setAttributeNS(null,"transform","scale("+i(1/r)+" "+i(-1/a)+")"),e?e.appendChild(h):this.tgrp.appendChild(h),n.pendingClip?(this.cgrp.appendChild(this.tgrp),this.pgrp.appendChild(this.cgrp)):this.pgrp.appendChild(this.tgrp)},paintImageMaskXObject:function(t){var e=this.current,n=t.width,r=t.height,a=e.fillColor;e.maskId="mask"+d++;var o=document.createElementNS(s,"svg:mask");o.setAttributeNS(null,"id",e.maskId);var l=document.createElementNS(s,"svg:rect");l.setAttributeNS(null,"x","0"),l.setAttributeNS(null,"y","0"),l.setAttributeNS(null,"width",i(n)),l.setAttributeNS(null,"height",i(r)),l.setAttributeNS(null,"fill",a),l.setAttributeNS(null,"mask","url(#"+e.maskId+")"),this.defs.appendChild(o),this.tgrp.appendChild(l),this.paintInlineImageXObject(t,o)},paintFormXObjectBegin:function(t,e){if(this.save(),p(t)&&6===t.length&&this.transform(t[0],t[1],t[2],t[3],t[4],t[5]),p(e)&&4===e.length){var n=e[2]-e[0],r=e[3]-e[1],a=document.createElementNS(s,"svg:rect");a.setAttributeNS(null,"x",e[0]),a.setAttributeNS(null,"y",e[1]),a.setAttributeNS(null,"width",i(n)),a.setAttributeNS(null,"height",i(r)),this.current.element=a,this.clip("nonzero"),this.endPath()}},paintFormXObjectEnd:function(){this.restore()}},a}();PDFJS.SVGGraphics=mt}.call("undefined"==typeof window?this:window),PDFJS.workerSrc||"undefined"==typeof document||(PDFJS.workerSrc=function(){"use strict";var t=document.body||document.getElementsByTagName("head")[0],e=t.lastChild.src;return e&&e.replace(/\.js$/i,".worker.js")}());

//CUSTOM PDF.JS TEXT LAYERS
var CSS_UNITS=96/72,DEFAULT_SCALE="auto",UNKNOWN_SCALE=0,MAX_AUTO_SCALE=1,SCROLLBAR_PADDING=40,VERTICAL_PADDING=5,CustomStyle=function t(){var e=["ms","Moz","Webkit","O"],i={};function n(){}return n.getProp=function t(n,r){if(1===arguments.length&&"string"==typeof i[n])return i[n];var s,a,o=(r=r||document.documentElement).style;if("string"==typeof o[n])return i[n]=n;a=n.charAt(0).toUpperCase()+n.slice(1);for(var l=0,d=e.length;l<d;l++)if("string"==typeof o[s=e[l]+a])return i[n]=s;return i[n]="undefined"},n.setProp=function t(e,i,n){var r=this.getProp(e);"undefined"!==r&&(i.style[r]=n)},n}();function getFileName(t){var e=t.indexOf("#"),i=t.indexOf("?"),n=Math.min(e>0?e:t.length,i>0?i:t.length);return t.substring(t.lastIndexOf("/",n)+1,n)}function getOutputScale(t){var e,i=(window.devicePixelRatio||1)/(t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1);return{sx:i,sy:i,scaled:1!==i}}function scrollIntoView(t,e){var i=t.offsetParent,n=t.offsetTop+t.clientTop,r=t.offsetLeft+t.clientLeft;if(!i){console.error("offsetParent is not set -- cannot scroll");return}for(;i.clientHeight===i.scrollHeight;)if(i.dataset._scaleY&&(n/=i.dataset._scaleY,r/=i.dataset._scaleX),n+=i.offsetTop,r+=i.offsetLeft,!(i=i.offsetParent))return;e&&(void 0!==e.top&&(n+=e.top),void 0!==e.left&&(r+=e.left,i.scrollLeft=r)),i.scrollTop=n}function watchScroll(t,e){var i=function i(s){!r&&(r=window.requestAnimationFrame(function i(){r=null;var s=t.scrollTop,a=n.lastY;s!==a&&(n.down=s>a),n.lastY=s,e(n)}))},n={down:!0,lastY:t.scrollTop,_eventHandler:i},r=null;return t.addEventListener("scroll",i,!0),n}function binarySearchFirstItem(t,e){var i=0,n=t.length-1;if(0===t.length||!e(t[n]))return t.length;if(e(t[i]))return i;for(;i<n;){var r=i+n>>1;e(t[r])?n=r:i=r+1}return i}function getVisibleElements(t,e,i){var n,r,s,a,o,l,d=t.scrollTop,h=d+t.clientHeight,f=t.scrollLeft,c=f+t.clientWidth;function v(t){var e=t.div;return e.offsetTop+e.clientTop+e.clientHeight>d}for(var u,p,g=[],x=0===e.length?0:binarySearchFirstItem(e,v),m=x,$=e.length;m<$&&(n=(p=(u=e[m]).div).offsetTop+p.clientTop,r=p.clientHeight,!(n>h));m++)!((o=p.offsetLeft+p.clientLeft)+(l=p.clientWidth)<f)&&!(o>c)&&(s=Math.max(0,d-n)+Math.max(0,n+r-h),a=(r-s)*100/r|0,g.push({id:u.id,x:o,y:n,view:u,percent:a}));var y=g[0],C=g[g.length-1];return i&&g.sort(function(t,e){var i=t.percent-e.percent;return Math.abs(i)>.001?-i:t.id-e.id}),{first:y,last:C,views:g}}function noContextMenuHandler(t){t.preventDefault()}function getPDFFileNameFromURL(t){var e=/[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i,i=/^(?:([^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/.exec(t),n=e.exec(i[1])||e.exec(i[2])||e.exec(i[3]);if(n&&-1!==(n=n[0]).indexOf("%"))try{n=e.exec(decodeURIComponent(n))[0]}catch(r){}return n||"document.pdf"}var ProgressBar=function t(){function e(t,e){this.visible=!0,this.div=document.querySelector(t+" .progress"),this.bar=this.div.parentNode,this.height=e.height||100,this.width=e.width||100,this.units=e.units||"%",this.div.style.height=this.height+this.units,this.percent=0}return e.prototype={updateBar:function t(){if(this._indeterminate){this.div.classList.add("indeterminate"),this.div.style.width=this.width+this.units;return}this.div.classList.remove("indeterminate");var e=this.width*this._percent/100;this.div.style.width=e+this.units},get percent(){return this._percent},set percent(val){var i;this._indeterminate=isNaN(val),this._percent=Math.min(Math.max(i=val,0),100),this.updateBar()},setWidth:function t(e){if(e){var i=e.parentNode.offsetWidth-e.offsetWidth;i>0&&this.bar.setAttribute("style","width: calc(100% - "+i+"px);")}},hide:function t(){this.visible&&(this.visible=!1,this.bar.classList.add("hidden"),document.body.classList.remove("loadingInProgress"))},show:function t(){!this.visible&&(this.visible=!0,document.body.classList.add("loadingInProgress"),this.bar.classList.remove("hidden"))}},e}(),MAX_TEXT_DIVS_TO_RENDER=1e5,NonWhitespaceRegexp=/\S/;function isAllWhitespace(t){return!NonWhitespaceRegexp.test(t)}var TextLayerBuilder=function t(){function e(t){this.textLayerDiv=t.textLayerDiv,this.renderingDone=!1,this.divContentDone=!1,this.pageIdx=t.pageIndex,this.pageNumber=this.pageIdx+1,this.matches=[],this.viewport=t.viewport,this.textDivs=[],this.findController=t.findController||null}return e.prototype={_finishRendering:function t(){this.renderingDone=!0;var e=document.createEvent("CustomEvent");e.initCustomEvent("textlayerrendered",!0,!0,{pageNumber:this.pageNumber}),this.textLayerDiv.dispatchEvent(e)},renderLayer:function t(){var e=document.createDocumentFragment(),i=this.textDivs,n=i.length,r=document.createElement("canvas").getContext("2d");if(n>MAX_TEXT_DIVS_TO_RENDER){this._finishRendering();return}for(var s=0;s<n;s++){var a,o,l,d=i[s];if(void 0===d.dataset.isWhitespace){var h=d.style.fontSize,f=d.style.fontFamily;(h!==a||f!==o)&&(r.font=h+" "+f,a=h,o=f);var c=r.measureText(d.textContent).width;if(c>0){e.appendChild(d),l=void 0!==d.dataset.canvasWidth?"scaleX("+d.dataset.canvasWidth/c+")":"";var v=d.dataset.angle;v&&(l="rotate("+v+"deg) "+l),l&&CustomStyle.setProp("transform",d,l)}}}this.textLayerDiv.appendChild(e),this._finishRendering(),this.updateMatches()},render:function t(e){if(this.divContentDone&&!this.renderingDone){if(this.renderTimer&&(clearTimeout(this.renderTimer),this.renderTimer=null),e){var i=this;this.renderTimer=setTimeout(function(){i.renderLayer(),i.renderTimer=null},e)}else this.renderLayer()}},appendText:function t(e,i){var n,r,s=i[e.fontName],a=document.createElement("div");if(this.textDivs.push(a),isAllWhitespace(e.str)){a.dataset.isWhitespace=!0;return}var o=PDFJS.Util.transform(this.viewport.transform,e.transform),l=Math.atan2(o[1],o[0]);s.vertical&&(l+=Math.PI/2);var d=Math.sqrt(o[2]*o[2]+o[3]*o[3]),h=d;s.ascent?h=s.ascent*h:s.descent&&(h=(1+s.descent)*h),0===l?(n=o[4],r=o[5]-h):(n=o[4]+h*Math.sin(l),r=o[5]-h*Math.cos(l)),a.style.left=n+"px",a.style.top=r+"px",a.style.fontSize=d+"px",a.style.fontFamily=s.fontFamily,a.textContent=e.str,PDFJS.pdfBug&&(a.dataset.fontName=e.fontName),0!==l&&(a.dataset.angle=l*(180/Math.PI)),a.textContent.length>1&&(s.vertical?a.dataset.canvasWidth=e.height*this.viewport.scale:a.dataset.canvasWidth=e.width*this.viewport.scale)},setTextContent:function t(e){this.textContent=e;for(var i=e.items,n=0,r=i.length;n<r;n++)this.appendText(i[n],e.styles);this.divContentDone=!0},convertMatches:function t(e){for(var i=0,n=0,r=this.textContent.items,s=r.length-1,a=null===this.findController?0:this.findController.state.query.length,o=[],l=0,d=e.length;l<d;l++){for(var h=e[l];i!==s&&h>=n+r[i].str.length;)n+=r[i].str.length,i++;i===r.length&&console.error("Could not find a matching mapping");var f={begin:{divIdx:i,offset:h-n}};for(h+=a;i!==s&&h>n+r[i].str.length;)n+=r[i].str.length,i++;f.end={divIdx:i,offset:h-n},o.push(f)}return o},renderMatches:function t(e){if(0!==e.length){var i=this.textContent.items,n=this.textDivs,r=null,s=this.pageIdx,a=null!==this.findController&&s===this.findController.selected.pageIdx,o=null===this.findController?-1:this.findController.selected.matchIdx,l=null!==this.findController&&this.findController.state.highlightAll,d={divIdx:-1,offset:void 0},h=o,f=h+1;if(l)h=0,f=e.length;else if(!a)return;for(var c=h;c<f;c++){var v=e[c],u=v.begin,p=v.end,g=a&&c===o?" selected":"";if(this.findController&&this.findController.updateMatchPosition(s,c,n,u.divIdx,p.divIdx),r&&u.divIdx===r.divIdx?y(r.divIdx,r.offset,u.offset):(null!==r&&y(r.divIdx,r.offset,d.offset),$(u)),u.divIdx===p.divIdx)y(u.divIdx,u.offset,p.offset,"highlight"+g);else{y(u.divIdx,u.offset,d.offset,"highlight begin"+g);for(var x=u.divIdx+1,m=p.divIdx;x<m;x++)n[x].className="highlight middle"+g;$(p,"highlight end"+g)}r=p}r&&y(r.divIdx,r.offset,d.offset)}function $(t,e){var i=t.divIdx;n[i].textContent="",y(i,0,t.offset,e)}function y(t,e,r,s){var a=n[t],o=i[t].str.substring(e,r),l=document.createTextNode(o);if(s){var d=document.createElement("span");d.className=s,d.appendChild(l),a.appendChild(d);return}a.appendChild(l)}},updateMatches:function t(){if(this.renderingDone){for(var e=this.matches,i=this.textDivs,n=this.textContent.items,r=-1,s=0,a=e.length;s<a;s++){for(var o=e[s],l=Math.max(r,o.begin.divIdx),d=l,h=o.end.divIdx;d<=h;d++){var f=i[d];f.textContent=n[d].str,f.className=""}r=o.end.divIdx+1}null!==this.findController&&this.findController.active&&(this.matches=this.convertMatches(null===this.findController?[]:this.findController.pageMatches[this.pageIdx]||[]),this.renderMatches(this.matches))}}},e}();function DefaultTextLayerFactory(){}DefaultTextLayerFactory.prototype={createTextLayerBuilder:function(t,e,i){return new TextLayerBuilder({textLayerDiv:t,pageIndex:e,viewport:i})}};

PDFJS.verbosity = 0;
PDFJS.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/1.1.114/pdf.worker.min.js";
