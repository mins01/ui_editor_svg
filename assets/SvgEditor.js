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
        this.svgNS = "http://www.w3.org/2000/svg";
        this.xlinkNS = 'http://www.w3.org/1999/xlink'

    }

    init(rootNode){
        if(this.debug) console.log('init',Array.from(arguments).join(','))
        this.rootNode = rootNode;
        rootNode.svgEditor = this;
        let svg = this.rootNode.querySelector('svg');
        if(!svg){
            alert('SVG 포함되지 않았습니다.');
            return false;
        }
        this.svg = svg
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
    imgToDataUrl(img){
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Set width and height
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        // Draw the image
        ctx.drawImage(img, 0, 0);
        var dataUrl = canvas.toDataURL('image/png');
        return dataUrl;
    }
    syncImgDataUrlToImage(img){
        if(document.querySelectorAll('image[data-from="#'+img.id+'"]').length==0) return;
        const dataUrl = this.imgToDataUrl(img);
        document.querySelectorAll('image[data-from="#'+img.id+'"]').forEach((el)=>{
            el.setAttribute('href', dataUrl);
            delete el.dataset.from
            // el.setAttributeNS(this.xlinkNS, 'href', dataUrl);
        })
        
    }
    syncImgDataUrl(){ // img.data-from-img 를 가져와서 image[data-from="#'+img.id+'"] 의 href 를 dataURL로 변경한다.
        document.querySelectorAll('img.data-from-img').forEach((el)=>{
            this.syncImgDataUrlToImage(el)
        })
    }
    

    removeAllTfTarget(){
        // this.svg.
    }

    
    // attrTransform(node,transform){
    //     for(let k in attrs){
    //         node.setAttribute(k,attrs[k])
    //     }
    // }
    appendByClone(el,x,y,tfTarget){
        let target = el.cloneNode(true);
        this.attrs(target,{
            'x':0,
            'y':0,
        })
        if(tfTarget) target.classList.add('tf-target')
        target.style.setProperty('--translate-x',x+'px');
        target.style.setProperty('--translate-y',y+'px');
        this.svg.append(target);
        return;
    }
    appendByUse(id,x,y,tfTarget){
        let target = document.createElementNS(this.svgNS, "use");
        this.attrs(target,{
            'href':'#'+id,
            'x':0,
            'y':0,
        })
        if(tfTarget) target.classList.add('tf-target')
        target.style.setProperty('--translate-x',x+'px');
        target.style.setProperty('--translate-y',y+'px');
        this.svg.append(target);
    }

}
export default SvgEditor;