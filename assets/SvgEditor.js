/**
 * SVG EDITOR
 * 임의 사용 금지!
 * createdAt: 2022-10-07
 * updatedAt:
 * whoAmI: 공대여자
 */
/**
 * https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Getting_Started 를 참고하면서 만듬
 */

class SvgEditor{
    constructor() {
        // super();
        this.debug = false;
        this.width = null;
        this.height = null;
        this.zoom = 1;
        this.rootNode = null
        this.svg = null
        this.svgns = "http://www.w3.org/2000/svg";

    }
    toImageElement(cb){
        
        let img = new Image();
        let data = new XMLSerializer().serializeToString(this.svg);
        let blob = new Blob([data], { type: 'image/svg+xml' });
        let url = URL.createObjectURL(blob);
        img.onload = (event)=>{
            URL.revokeObjectURL(url);
            cb(img);
        }
        img.src = url;
    }
    downloadPng(filename){
        const cb = (img)=>{
            let canvas = document.createElement('canvas');
            canvas.width = this.svg.getAttribute('width');
            canvas.height = this.svg.getAttribute('height');

            canvas.getContext('2d').drawImage(img, 0, 0);
            let uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
            let a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.href = uri
            a.download = filename + '.png';
            a.click();
            URL.revokeObjectURL(uri);
            document.body.removeChild(a);
        }
        this.toImageElement(cb);
    }
    init(rootNode){
        if(this.debug) console.log('init',Array.from(arguments).join(','))
        this.rootNode = rootNode;
        let svg = this.rootNode.querySelector('svg');
        if(!svg){
            // svg = document.createElement('svg');
            svg = document.createElementNS(this.svgns, "svg");
            svg.setAttribute('width',300);
            svg.setAttribute('height',300);
            svg.setAttribute('version',1.1);
            svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
            this.rootNode.append(svg);
            if(this.debug) console.log('init # generated svg',Array.from(arguments).join(','))

        }
        this.svg = svg
    }

    test(){
        // let rect = document.createElement('rect');
        let rect = document.createElementNS(this.svgns, "rect");
        this.attrs(rect,{
            'x':50,
            'y':50,
            'width':'50',
            'height':'50',
            'fill':'red',
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            'transform':"rotate(-10, 50, 100)",
        })
        this.svg.append(rect);
    }

    attrs(node,attrs){
        for(let k in attrs){
            node.setAttribute(k,attrs[k])
        }
    }
    attrTransform(node,transform){
        for(let k in attrs){
            node.setAttribute(k,attrs[k])
        }
    }


}
export default SvgEditor;