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
        console.log(blob,data);
        let url = URL.createObjectURL(blob);
        img.onload = (event)=>{
            URL.revokeObjectURL(url);
            cb(img);
            document.body.append(img);
        }
        img.src = url;
    }
    downloadPng(filename){
        const cb = (img)=>{
            let canvas = document.createElement('canvas');
            canvas.width = this.svg.getAttribute('width');
            canvas.height = this.svg.getAttribute('height');

            canvas.getContext('2d').drawImage(img, 0, 0);
            // let uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
            let uri = canvas.toDataURL('image/png');
            // console.log(uri);
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
        rootNode.svgEditor = this;
        let svg = this.rootNode.querySelector('svg');
        if(!svg){
            // svg = document.createElement('svg');
            svg = document.createElementNS(this.svgns, "svg");
            svg.setAttribute('xmlns',this.svgns);
            svg.setAttribute('version',1.1);
            svg.setAttribute('width','300');
            svg.setAttribute('height','300');
            // svg.setAttribute('viewBox','0 0 300 300');
            svg.setAttribute('fill','gray');
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
            'stroke':'blue',
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            'transform':"rotate(-10, 50, 100)",
        })
        this.svg.append(rect);
        let text = document.createElementNS(this.svgns, "text");
        text.textContent="테스트값"
        this.attrs(text,{
            'x':50,
            'y':50,
            // 'width':'50',
            // 'height':'50',
            'fill':'red',
            'stroke':'blue',
            'stroke-width':"2",
            'style':'font-size:30px;font-weight:bold'
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            // 'transform':"rotate(-10, 50, 100)",
        })
        this.svg.append(text);

        let rect2 = document.createElementNS(this.svgns, "g");
        this.attrs(rect2,{
            'id':'g100'
            // 'x':100,
            // 'y':100,
            // 'width':'50',
            // 'height':'50',
            // 'fill':'red',
            // 'stroke':'blue',
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            // 'transform':"rotate(-10, 50, 100)",
        })
        this.svg.append(rect2);
        let text2 = document.createElementNS(this.svgns, "text");
        text2.textContent="테스트값"
        this.attrs(text2,{
            'x':50,
            'y':50,
            // 'width':'50',
            // 'height':'50',
            'fill':'red',
            'stroke':'blue',
            'stroke-width':"2",
            // 'style':'font-size:30px;font-weight:bold'
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            // 'transform':"rotate(-10, 50, 100)",
        })
        this.styles(text2,{
            'fontSize':'30px',
            'font-weight':'bold',
        });
        rect2.append(text2);
        let use = document.createElementNS(this.svgns, "use");
        this.attrs(use,{
            'href':'#g100',
            'x':100,
            'y':100,
            // 'width':'50',
            // 'height':'50',
            // 'fill':'red',
            // 'stroke':'blue',
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            // 'transform':"rotate(-10, 50, 100)",
        })
        this.svg.append(use);

    }

    attrs(node,attrs){
        for(let k in attrs){
            node.setAttribute(k,attrs[k])
        }
    }
    styles(node,styles){
        for(let k in styles){
            node.style[k]= styles[k]
        }
    }
    attrTransform(node,transform){
        for(let k in attrs){
            node.setAttribute(k,attrs[k])
        }
    }
    appendUse(id,x,y){
        let target = document.querySelector('#'+id).cloneNode(true);
        this.svg.append(target);
        return;

        let use = document.createElementNS(this.svgns, "use");
        this.attrs(use,{
            'href':'#'+id,
            'x':x,
            'y':y,
            // 'width':'50',
            // 'height':'50',
            // 'fill':'red',
            // 'stroke':'blue',
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            // 'transform':"rotate(-10, 50, 100)",
        })
        this.svg.append(use);
    }
    appendUse2(id,x,y){
        let use = document.createElementNS(this.svgns, "use");
        this.attrs(use,{
            'href':'#'+id,
            'x':x,
            'y':y,
            // 'width':'50',
            // 'height':'50',
            // 'fill':'red',
            // 'stroke':'blue',
            // 'transform':"rotate(-10, 50, 100) translate(-36 45.5) skewX(40) scale(1 0.5)",
            // 'transform':"rotate(-10, 50, 100)",
        })
        this.svg.append(use);
    }

}
export default SvgEditor;