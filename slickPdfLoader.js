//DEFINE THE LOADER VERSION
var slickPdfLoaderVersion   = '2.0.1';

//DEFINE THE VIEWERS
window.slickPdfViewers = {};

//LOAD A VIEWER
async function slickPdfLoader(wrapperSelector, settings){

    //SET THE FILEURL SETTING IF SETTINGS IS A STRING
    if(typeof settings == 'string') settings = {fileUrl: settings};
    
    //IF THE WRAPPERSELECTOR IS AN OBJECT AND NO SETTINGS WERE USE IT AS SETTINGS AND SET WRAPPERSELECTOR TO USE BODY
    if(typeof wrapperSelector == 'object' && typeof settings == 'undefined'){
        settings        = wrapperSelector;
        wrapperSelector = 'body';
    }

    //IF THE WRAPPERSELECTOR IS A STRING AND NO SETTINGS WERE PASSED THEN ASSUME IT IS THE FILEURL
    if(typeof wrapperSelector == 'string' && typeof settings == 'undefined'){
        settings        = {fileUrl: wrapperSelector};
        wrapperSelector = 'body';
    }

    //IF NO SETTINGS WERE PASSED THEN INIT AN EMPTY OBJECT
    if(typeof settings !== 'object') settings = {};

    //ALLOW EXPLICIT DEFINITION OF MODULE LOCATION
    var slickPdfViewerCDN = typeof settings.moduleUrl != 'undefined' ? settings.moduleUrl : ('//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer@'+(typeof settings.moduleVersion != 'undefined' ? settings.moduleVersion : slickPdfLoaderVersion)+'/slickPdfViewer.min.mjs');

    //BUILD THE IFRAME
    var iframe          = document.createElement('iframe');
    var wrapperEle      = document.querySelector(wrapperSelector);
    var loaded          = false;
    var viewerInstance  = null;

    if(wrapperEle.tagName == 'BODY'){
        if(!document.body.classList.contains('sp-main-body')){
            document.body.classList.add('sp-main-body');
            document.body.style.margin              = 0;
            document.body.style.height              = '100%';
            document.body.parentNode.style.position = 'relative';
            document.body.parentNode.style.height   = '100vh';
            document.body.parentNode.style.overflow = 'hidden';
            document.body.style.overflow            = 'auto';
        }
    }
    
    //ADD THE IFRAME TO THE WRAPPER ELEMENT
    wrapperEle.appendChild(iframe);

    //SET THE IFRAME ATTRIBUTES
    iframe.setAttribute('style', 'width:100%; height:100%; border:0; margin:0; padding:0;display:block;');
    iframe.classList.add('sp-viewer-iframe');
    //iframe.sandbox = '';

    //BUILD THE IFRAME HTML
    var html = `<!DOCTYPE html>
<html lang="en-US" style="position:relative; height:100%; width:100%;">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"/>
    </head>
    <body style="margin:0; padding:0; height:100%; width:100%; overflow:hidden; position:relative;">
        <script type="module">
            import '`+slickPdfViewerCDN+`';
            slickPdfView('body', `+JSON.stringify(settings)+`);
        </script>
    </body>
</html>`;

    //SET THE IFRAME CONTENT
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();

    //WAIT FOR THE IFRAME TO LOAD
    return await (new Promise(resolve => iframe.addEventListener('load', () => resolve()))).then(() => {

        //DEFINE SOME ATTRIBUTES
        var contentWindow   = iframe.contentWindow;
        var config          = contentWindow.slickPdfViewConfig;
        iframe.setAttribute('data-slickpdf-id', config.uniqueId);

        //SEND BACK THE LOADED VIEWER VARS
        var res = {
            Id              : () => {return config.uniqueId; },
            element         : iframe,
            settings        : config,
            viewer          : {
                application : contentWindow.PDFViewerApplication,
                constants   : contentWindow.PDFViewerApplicationConstants,
                options     : contentWindow.PDFViewerApplicationOptions,
            }
        };

        //ADD THE LOADED VIEWER TO THE LIST OF VIEWERS
        window.slickPdfViewers[config.uniqueId] = res;

        //RETURN THE VIEWER
        return res;
    });
}
