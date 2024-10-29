//DEFINE THE VIEWERS
window.slickPdfViewers = {};

//const slickPdfModulePath = '//cdn.jsdelivr.net/gh/bmooreitul/slickPdfViewer/slickPdfViewer.min.mjs';
const slickPdfModulePath = document.currentScript.src.replace('slickPdfLoader.js', 'slickPdfViewer.min.mjs').replace('slickPdfLoader.min.js', 'slickPdfViewer.min.mjs');

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

    //CREATE AN IFRAME ELEMENT
    var iframe          = document.createElement('iframe');

    //SET THE IFRAME ATTRIBUTES
    iframe.setAttribute('style', 'width:100%; height:100%; border:0; margin:0; padding:0;display:block;');
    iframe.classList.add('sp-viewer-iframe');

    //GET THE WRAPPER ELEMENT
    var wrapperEle      = document.querySelector(wrapperSelector);

    //CHECK IF THE WRAPPER ELEMENT IS BODY
    if(wrapperEle.tagName == 'BODY'){

        //CHECK IF THE BODY ALREADY HAS THE CLASS
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

    //SET THE IFRAME CONTENT
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(`<!DOCTYPE html>
<html lang="en-US" style="position:relative; height:100%; width:100%;">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"/>
    </head>
    <body style="margin:0;padding:0;height:100%;width:100%;overflow:hidden;position:relative;">
        <script type="module">
            import '`+slickPdfModulePath+`';
            slickPdfView('body', `+JSON.stringify(settings)+`);
        </script>
    </body>
</html>`);
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
            options         : config
        };

        //ADD THE LOADED VIEWER TO THE LIST OF VIEWERS
        window.slickPdfViewers[config.uniqueId] = res;

        //RETURN THE VIEWER
        return res;
    });
}
