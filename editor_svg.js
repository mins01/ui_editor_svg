import SvgEditor from './assets/SvgEditor.js'
globalThis.svgEditor = new SvgEditor()
svgEditor.debug = true;
svgEditor.init(document.querySelector('#svgbox'));
// svgEditor.test();