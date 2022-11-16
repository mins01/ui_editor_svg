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
        this.toImageElementDelay = 500;  //사라리의 경우 svg 그려지기전 img 가 onload를 발생시켜서 문제가 된다.


    }

    init(rootNode){
        if(this.debug) console.log('init',Array.from(arguments).join(','))
        this.rootNode = rootNode;
        rootNode.svgEditor = this;
        let svg;
        if(this.rootNode.contentDocument){ //object 등으로 불러온 경우
            svg = this.rootNode.contentDocument.querySelector('svg');
        }else{
            svg = this.rootNode.querySelector('svg');
        }
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
    blobToBase64(blob) {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
    }
    toImageElement(cb){
        
        let img = new Image();
        img.crossOrigin="anonymous"
        let data = (new XMLSerializer()).serializeToString(this.svg);
        let blob = new Blob([data], { type: 'image/svg+xml' });

        img.onload = (event)=>{
            console.log('img.onload');
            // document.body.append(img)
            // URL.revokeObjectURL(url);
            setTimeout(()=>{ // 아이폰이 느려서 SVG 재 계산에 이슈가 있는 듯
                cb(img);
            },this.toImageElementDelay)
            // document.body.append(img);
        }

        // error: Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
        // let url = URL.createObjectURL(blob);
        // img.src = url

        this.blobToBase64(blob).then((dataUrl)=>{
            console.log('base64Blob');
            // console.log(dataUrl);
            img.src = dataUrl;
        });        
    }
    toBlob(arg_cb,type){
        if(!type) type = 'image/png'
        const cb = (img)=>{
            let canvas = document.createElement('canvas');
            canvas.width = this.svg.getAttribute('width');
            canvas.height = this.svg.getAttribute('height');

            canvas.getContext('2d').drawImage(img, 0, 0);
            // let uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
            canvas.toBlob((blob)=>{ 
                console.log('canvas.toBlob',blob)
                arg_cb(blob) 
            },type)
        }
        this.toImageElement(cb);
    }
    downloadImage(filename,type){
        if(!type) type = 'image/png'
        const cb = (img)=>{
            let canvas = document.createElement('canvas');
            canvas.width = this.svg.getAttribute('width');
            canvas.height = this.svg.getAttribute('height');

            canvas.getContext('2d').drawImage(img, 0, 0);
            // let uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
            let uri = canvas.toDataURL(type);
            // console.log(uri);
            let a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.href = uri
            // a.download = filename + '.png';
            a.download = filename;
            a.click();
            // URL.revokeObjectURL(uri);
            document.body.removeChild(a);
        }
        this.toImageElement(cb);
    }
    downloadPng(filename){
        let type = 'image/png';
        filename += '.png';
        return this.downloadImage(filename,type)
    }
    downloadJpg(filename){
        let type = 'image/jpeg';
        filename +='.jpg';
        return this.downloadImage(filename,type)
    }
    imgToDataUrl(img){
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Set width and height
        // canvas.width = img.naturalWidth;
        // canvas.height = img.naturalHeight;
        // console.log(img.naturalWidth);
        // console.log(img.width);
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw the image
        ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight, 0, 0 ,img.width,img.height);
        var dataUrl = canvas.toDataURL('image/png');
        return dataUrl;
    }
    syncFromImgDataUrlToImage(img){
        if(this.svg.querySelectorAll('image[data-from="#'+img.id+'"]').length==0) return;
        const dataUrl = this.imgToDataUrl(img);
        this.svg.querySelectorAll('image[data-from="#'+img.id+'"]').forEach((el)=>{
            el.setAttribute('href', dataUrl);
            delete el.dataset.from
            // el.setAttributeNS(this.xlinkNS, 'href', dataUrl);
        })
        
    }
    syncFromImgDataUrl(){ // img.data-from-img 를 가져와서 image[data-from="#'+img.id+'"] 의 href 를 dataURL로 변경한다.
        document.querySelectorAll('img.data-from-img').forEach((el)=>{
            this.syncFromImgDataUrlToImage(el)
        })
    }
    syncFromSvgToSvg(object){
        // const xml_svg = object.contentDocument.firstElementChild.outerHTML
        const xml_svg = object.contentDocument.firstElementChild.innerHTML
        // console.log(object.contentDocument);
        if(this.svg.querySelectorAll('svg[data-from-svg="#'+object.id+'"]').length==0) return;
        this.svg.querySelectorAll('svg[data-from-svg="#'+object.id+'"]').forEach((el)=>{
            el.innerHTML = xml_svg;
            delete el.dataset.fromSvg
            // el.setAttributeNS(this.xlinkNS, 'href', dataUrl);
        })
    }
    syncFromSvg(){
        document.querySelectorAll('object.data-from-svg').forEach((el)=>{
            this.syncFromSvgToSvg(el)
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
        return target;
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
        return target;
    }

}
export default SvgEditor;