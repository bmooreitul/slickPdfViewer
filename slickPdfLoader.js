//DEFINE THE VIEWERS
window.slickPdfViewers = {};

const slickPdfModulePath = document.currentScript.src.replace('slickPdfLoader.js', 'slickPdfViewer.min.mjs').replace('slickPdfLoader.min.js', 'slickPdfViewer.min.mjs');

//LOAD A VIEWER LEGACY
async function slickPdfLoader(wrapperSelector, settings){
    return slickPdfView(wrapperSelector, settings);
}

//LOAD A VIEWER
async function slickPdfView(wrapperSelector, settings){
    return new SlickPdfViewer(wrapperSelector, settings);
}

//VIEWER CLASS
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
        fitWrapper      : null,
    };
    elements            = {
        frame           : null,
        wrapper         : null
    };
    dimensions          = {
        px              : {width : (72/96)*612,  height : (72/96)*792},
        pt              : {width : 612,          height : 792},
        scale           : 1,
    }
    currentPage = 1;
    onPageChange       = function(pageNumber){};
    onZoomChange       = function(zoom){};
    onLoaded           = function(){};

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

        //DEFINE THE WRAPPER SELECTOR AND SETTINGS
        this.wrapperSelector    = wrapperSelector;
        this.settings           = {...this.settings, ...settings};

        if(typeof this.settings.onPageChange == 'function'){
            this.onPageChange = this.settings.onPageChange;
            delete this.settings.onPageChange;
        }

        if(typeof this.settings.onZoomChange == 'function'){
            this.onZoomChange = this.settings.onZoomChange;
            delete this.settings.onZoomChange;
        }

        if(typeof this.settings.onLoaded == 'function'){
            this.onLoaded = this.settings.onLoaded;
            delete this.settings.onLoaded;
        }

        //AUTORUN IF THE FILE URL EXISTS
        if(typeof this.settings.fileUrl == 'string' && this.settings.fileUrl.length > 0) return this.run();

        //DEFAULT TO RETURNING THE CLASS
        return this;
    }

    //GET THE WRAPPER ELEMENT
    get wrapperEle(){
        if(this.elements.wrapper == null) this.elements.wrapper = document.querySelector(this.wrapperSelector);
        return this.elements.wrapper;
    }

    //GET THE IFRAME ELEMENT
    get frameEle(){
        if(this.elements.frame == null) this.#_generateIframe();
        return this.elements.frame;
    }

    //GET THE PDFJS VIEWER APP
    get viewerApp(){
        return this.frameEle.contentWindow.PDFViewerApplication;
    }

    //GET THE NUMBER OF PAGES
    get pageCount(){
        return this.viewerApp.pagesCount;
    }

    //GET THE CURRENT PAGE NUMBER
    //get currentPage(){
    //    return this.viewerApp.page;
    //}

    //GET THE CURRENT ZOOM LEVEL
    get zoom(){
        //this.settings.zoom = Number(this.viewerApp.appConfig.toolbar.scaleSelectInput.value);
        return this.settings.zoom;
    }

    //SET THE ZOOM LEVEL FROM A LEFT HAND ASSIGNMENT
    set zoom(val){
        this.zoomTo(val);
        return this;
    }

    //GET THE FILE NAME
    get fileName(){
        return this.viewerApp._title;
    }

    //SET THE FILE NAME FROM A LEFT HAND ASSIGNMENT
    set fileName(title = this.settings.fileName){
        this.settings.fileName = title;
        this.viewerApp.setTitle(title);
    }

    //GET THE DOCUMENT INFO
    get info(){
        return this.viewerApp.documentInfo;
    }

    //GET THE UNIQUE ID
    Id(){
        return this.settings.uniqueId;
    }

    //ZOOM IN
    zoomIn(){
        this.viewerApp.zoomIn();
        return this;
    }

    //ZOOM OUT
    zoomOut(){
        this.viewerApp.zoomOut();
        return this;
    }

    //SCALE ZOOMING TO A SPECIFIC VALUE
    zoomTo(val){
        if(val == 'page-height') this.fitPageHeight();
        else if(val == 'page-width') this.fitPageWidth();
        else if(val == 'page-fit' || val == "auto") this.fitPageHeight();
        else{
            if(val.indexOf('%')) val = parseFloat(val.replace('%'));
            else if(typeof val == 'string') val = parseFloat(val);
            this.viewerApp.updateZoom(null, (val/100));
        }
        return this;
    }

    //RESIZE TO FIT THE CURRENT PAGE WIDTH
    fitPageWidth(){
        return this.viewerApp.fitPageWidth();
    }

    //RESIZE TO FIT THE CURRENT PAGE HEIGHT
    fitPageHeight(){
        return this.viewerApp.fitPageHeight();
    }

    //GET ALL PAGES AS OBJECTS
    pages(){
        return this.viewerApp.pdfViewer._pages;
    }

    //GET THE CURRENT PAGE AS AN OBJECT
    currentPageObj(){
        return this.pages()[this.currentPage-1];
    }

    //JUMP TO A SPECIFIC PAGE
    goToPage(val){
        this.viewerApp.pdfViewer._setCurrentPageNumber(val, true);
    }

    //DOWNLOAD THE DOCUMENT
    download(){
        return this.viewerApp.download();
    }

    //PRINT THE DOCUMENT
    print(){
        return this.viewerApp.triggerPrinting();
    }

    //CALCULATE DIMENSIONS
    calcDimensions(){
        var rawDims = this.currentPageObj().viewport.rawDims;
        this.dimensions = {
            px      : {width : (72/96)*rawDims.pageWidth,    height : (72/96)*rawDims.pageHeight},
            pt      : {width : rawDims.pageWidth,            height : rawDims.pageHeight},
            scale   : this.zoom/100,
        };

        return this.dimensions;
    }

    //RUN THE CLASS
    async run(){
        var that = this;
        if(this.elements.frame == null) return await this.#_generateIframe();
        return await (new Promise(resolve => setTimeout(() => {return that}, 1)));
    }

    //CREATE AN IFRAME ELEMENT IF NEEDED
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

        iframe.contentWindow.addEventListener('viewer.pageNumber.changed', (e) => {
            that.currentPage = e.detail.pageNumber;
            if(that.loaded) that.onPageChange.call(that, that.currentPage);
        });

        iframe.contentWindow.addEventListener('viewer.zoom.changed', (e) => {
            that.settings.zoom = e.detail.zoom;
            if(that.loaded) that.onZoomChange.call(that, that.settings.zoom);
        });

        iframe.contentWindow.addEventListener('sp.viewer.updated', e => {
            if(that.settings.zoom != e.detail.zoom){
                iframe.contentWindow.dispatchEvent(new CustomEvent("viewer.zoom.changed", {detail: {zoom: Number(e.detail.zoom)}}));
            }
        });



        //WAIT FOR THE IFRAME TO LOAD
        return await (new Promise(resolve => iframe.contentWindow.addEventListener('viewer.pages.loaded', () => resolve()))).then(() => {
        //return await (new Promise(resolve => iframe.contentWindow.addEventListener('viewerFileLoaded', () => resolve()))).then(() => {

            //DEFINE SOME ATTRIBUTES
            iframe.setAttribute('data-slickpdf-id', that.settings.uniqueId);
            that.settings.fileName                          = that.viewerApp._title;
            window.slickPdfViewers[that.settings.uniqueId]  = that;
            that.loaded                                     = true;

            return (new Promise(r => setTimeout(r, 1))).then(() => {

                that.calcDimensions();
                if(that.settings.fitWrapper === null && !that.wrapperEle.style.height) that.settings.fitWrapper = true;
                if(that.wrapperSelector.toLowerCase() !== 'body' && that.settings.fitWrapper == true){
                    that.frameEle.style.height      = that.dimensions.pt.height+'pt';
                    that.frameEle.style.maxHeight   = '100vh';
                    that.wrapperEle.style.height    = 'fit-content';
                }


                return that;
            });
        }).then(() => {
            that.onLoaded(that);
            return that;
        });
    }
}
