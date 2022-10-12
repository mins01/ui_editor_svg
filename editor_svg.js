import SvgEditor from './assets/SvgEditor.js'
globalThis.svgEditor = new SvgEditor()
svgEditor.debug = true;
svgEditor.init(document.querySelector('#svgbox'));


window.addEventListener('load',(event)=>{
    svgEditor.syncImgDataUrl()
})
// svgEditor.test();