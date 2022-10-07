import SvgEditor from './assets/SvgEditor.js'
globalThis.svgeditor = new SvgEditor()
svgeditor.debug = true;
svgeditor.init(document.querySelector('#svgbox'));
svgeditor.test();