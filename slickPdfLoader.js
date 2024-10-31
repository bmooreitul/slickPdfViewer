//DEFINE THE VIEWERS
window.slickPdfViewers = {};

const slickPdfModulePath = document.currentScript.src.replace('slickPdfLoader.js', 'slickPdfViewer.min.mjs').replace('slickPdfLoader.min.js', 'slickPdfViewer.min.mjs');

//LOAD A VIEWER
async function slickPdfLoader(wrapperSelector, settings){
    return slickPdfView(wrapperSelector, settings);
}

async function slickPdfView(wrapperSelector, settings){
    return new SlickPdfViewer(wrapperSelector, settings);
}

class SlickPdfViewer {
    loaded              = false;
    wrapperSelector     = 'body';
    settings            = {
        fileName        : null,
        fileUrl         : null,
        zoom            : 'auto',
        startpage       : 1,
        padding         : 40,
        minScale        : 0.25,
        maxScale        : 4,
        uniqueId        : null,
        thumbnails      : null,
    };
    elements            = {
        frame           : null,
        wrapper         : null
    };

    constructor(wrapperSelector, settings){

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

        //GENERATE A UNIQUE ID IF NEEDED
        if(typeof settings.uniqueId == 'undefined') settings.uniqueId = Date.now().toString(36)+Math.random().toString(36).substring(2, 12).padStart(12, 0);

        this.wrapperSelector    = wrapperSelector;
        this.settings           = {...this.settings, ...settings};

        if(typeof this.settings.fileUrl == 'string' && this.settings.fileUrl.length > 0) return this.run();

        return this;
    }

    get wrapperEle(){
        if(this.elements.wrapper == null) this.elements.wrapper = document.querySelector(this.wrapperSelector);
        return this.elements.wrapper;
    }

    get frameEle(){
        if(this.elements.frame == null) this.#_generateIframe();
        return this.elements.frame;
    }

    get viewerApp(){
        return this.frameEle.contentWindow.PDFViewerApplication;
    }

    get pageCount(){
        return this.viewerApp.pagesCount;
    }

    get currentPage(){
        return this.viewerApp.page;
    }

    get fileName(){
        return this.viewerApp._title;
    }

    set fileName(title = this.settings.fileName){
        this.settings.fileName = title;
        this.viewerApp.setTitle(title);
    }

    Id(){
        return this.settings.uniqueId;
    }

    zoomIn(){
        return this.viewerApp.zoomIn();
    }

    zoomOut(){
        return this.viewerApp.zoomOut();
    }

    fitPageWidth(){
        return this.viewerApp.fitPageWidth();
    }

    fitPageHeight(){
        return this.viewerApp.fitPageHeight();
    }

    download(){
        return this.viewerApp.download();
    }

    print(){
        return this.viewerApp.triggerPrinting();
    }

    async run(){
        var that = this;
        if(this.elements.frame == null) return await this.#_generateIframe();
        return await (new Promise(resolve => setTimeout(() => {return that}, 1)));
    }

    async #_generateIframe(){

        var that = this;

        if(this.elements.frame !== null) return new Promise(resolve => setTimeout(() => {return that}, 1));

        //CREATE AN IFRAME ELEMENT
        var iframe          = document.createElement('iframe');

        //SET THE IFRAME ATTRIBUTES
        iframe.setAttribute('style', 'width:100%; height:100%; border:0; margin:0; padding:0;display:block;');
        iframe.classList.add('sp-viewer-iframe');

        //GET THE WRAPPER ELEMENT
        var wrapperEle      = document.querySelector(this.wrapperSelector);

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

        this.elements.frame = iframe;

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
            slickPdfView('body', `+JSON.stringify(this.settings)+`);
        </script>
    </body>
</html>`);
        iframe.contentWindow.document.close();

        //WAIT FOR THE IFRAME TO LOAD
        return await (new Promise(resolve => iframe.contentWindow.addEventListener('viewerFileLoaded', () => resolve()))).then(() => {

            //DEFINE SOME ATTRIBUTES
            var contentWindow   = iframe.contentWindow;
            var config          = contentWindow.slickPdfViewConfig;
            iframe.setAttribute('data-slickpdf-id', config.uniqueId);
            that.settings.fileName = that.viewerApp._title;

            window.slickPdfViewers[config.uniqueId] = that;
            that.loaded = true;

            return that;
        });
    }
}
