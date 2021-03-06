import { SVGFilter } from "../svg-property/SVGFilter";
import { clone } from "../../util/functions/func";
import { Item } from "./Item";
import { Keyframe } from "../css-property/Keyframe";

export class AssetItem extends Item {

  getDefaultObject(obj = {}) { 
    return super.getDefaultObject({
      colors: [],
      gradients: [],
      svgfilters: [],
      svgimages: [],
      keyframes: [],      
      images: [],     //  { id: xxxx, url : '' }
      videos: [],     //  { id: xxxx, url : '' }
      audios: [],     //  { id: xxxx, url : '' }
      ...obj
    });
  }


  addKeyframe(keyframe) {
    this.json.keyframes.push(keyframe);
    return keyframe;
  }     


  createKeyframe(data = {}) {
    return this.addKeyframe(
      new Keyframe({
        checked: true,
        ...data
      })
    );
  }    
  

  removeKeyframe(removeIndex) {
    this.removePropertyList(this.json.keyframes, removeIndex);
  }    


  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortKeyframe(startIndex, targetIndex) {
    this.sortItem(this.json.keyframes, startIndex, targetIndex);
  }    


  updateKeyframe(index, data = {}) {
    this.json.keyframes[+index].reset(data);
  }      


/**
   * `@keyframes` 문자열만 따로 생성 
   */
  toKeyframeString (isAnimate = false) {
    return this.json.keyframes
              .map(keyframe => keyframe.toString(isAnimate))
              .join('\n\n')
  }  


  // 모든 Assets 은  JSON 포맷만가진다. 따로 문자열화 하지 않는다. 
  // {color, name, variable}
  // {gradient,name,variable}
  // {filters: [],id,name}
  // {mimeType, original(data or url), local, name}

  // 파싱은 
  // var asset = AssetParser.parse(data);
  // asset.color, name, variable 


  copyPropertyList(arr, index) {
    var copyObject = {...arr[index]};
    arr.splice(index, 0, copyObject);
  }
 
  toSVGString () {

    var filterString = this.json.svgfilters.map(svgfilter => {

      var filters = svgfilter.filters.map(filter => {
        return SVGFilter.parse(filter);
      })

      return /*html*/`<filter id='${svgfilter.id}'>
  ${filters.join('\n')}
</filter>
`

    }).join('\n\n')

    return filterString
  }

  toCloneObject() {
    var json = this.json; 
    return {
      ...super.toCloneObject(),
      colors: clone(json.colors),
      gradients: clone(json.gradients),
      svgfilters: clone(json.svgfilters),
      svgimages: clone(json.svgimages),
      images: clone(json.images),
      keyframes: json.keyframes.map(keyframe => keyframe.clone()),      
    }
  }


  removePropertyList(arr, removeIndex) {
    arr.splice(removeIndex, 1);
  }  

  /* color assets manage */ 

  removeColor(removeIndex) {
    this.removePropertyList(this.json.colors, removeIndex);
  }      


  copyColor(index) {
    this.copyPropertyList(this.json.colors, index);
  }        

  sortColor(startIndex, targetIndex) {
    this.sortItem(this.json.colors, startIndex, targetIndex);
  }    

  setColorValue(index, value = {}) {
    this.json.colors[index] = {...this.json.colors[index], ...value}
  }

  getColorIndex (index) {
    return this.json.colors[index]
  }

  getColor (name) {
    return this.json.colors.filter(item => item.name === name)[0];
  }

  addColor (obj) {
    this.json.colors.push(obj);
    return obj; 
  }

  createColor(data = {}) {
    return this.addColor(data)
  }  


  /* image assets manage */ 

  removeImage(removeIndex) {
    this.removePropertyList(this.json.images, removeIndex);
  }      


  copyImage(index) {
    this.copyPropertyList(this.json.images, index);
  }        

  sortImage(startIndex, targetIndex) {
    this.sortItem(this.json.images, startIndex, targetIndex);
  }    


  setImageValue(index, value = {}) {
    this.json.images[index] = {...this.json.images[index], ...value}
  }  

  addImage(obj) {
    this.json.images.push(obj)
    return obj; 
  }

  createImage(data = {}) {
    return this.addImage(data)
  }  



  /* video assets manage */ 

  removeVideo(removeIndex) {
    this.removePropertyList(this.json.videos, removeIndex);
  }      


  copyVideo(index) {
    this.copyPropertyList(this.json.videos, index);
  }        

  sortVideo(startIndex, targetIndex) {
    this.sortItem(this.json.videos, startIndex, targetIndex);
  }    


  setVideoValue(index, value = {}) {
    this.json.videos[index] = {...this.json.videos[index], ...value}
  }  

  addVideo(obj) {
    this.json.videos.push(obj)
    return obj; 
  }

  createVideo(data = {}) {
    return this.addVideo(data)
  }    

  /* gradient assets manage */ 


  removeGradient(removeIndex) {
    this.removePropertyList(this.json.gradients, removeIndex);
  }      


  copyGradient(index) {
    this.copyPropertyList(this.json.gradients, index);
  }        

  sortGradient(startIndex, targetIndex) {
    this.sortItem(this.json.gradients, startIndex, targetIndex);
  }    

  setGradientValue(index, value) {
    this.json.gradients[index] = {...this.json.gradients[index], ...value}
  }

  getGradientIndex (index) {
    return this.json.gradients[index]
  }

  getGradient (name) {
    return this.json.gradients.filter(item => item.name === name)[0]
  }

  addGradient(obj = {}) {
    this.json.gradients.push(obj)
    return obj; 
  }

  createGradient(data = {}) {
    return this.addGradient(data)
  }  


  /* svg filters  */

  getSVGFilterIndex (id) {

    var filter = this.json.svgfilters.map( (it, index) => {
      return { id: it.id, index }
    }).filter(it => {
      return it.id === id 
    })[0];

    return filter ? filter.index : -1;
  }

  removeSVGFilter(removeIndex) {
    this.removePropertyList(this.json.svgfilters, removeIndex);
  }      


  copySVGFilter(index) {
    this.copyPropertyList(this.json.svgfilters, index);    
  }        

  sortSVGFilter(startIndex, targetIndex) {
    this.sortItem(this.json.svgfilters, startIndex, targetIndex);
  }    

  setSVGFilterValue(index, value) {
    this.json.svgfilters[index] = {...this.json.svgfilters[index], ...value}
  }

  addSVGFilter(obj = {}) {
    this.json.svgfilters.push(obj)
    var index = this.json.svgfilters.length - 1;
    return index; 
  }

  createSVGFilter(data = {}) {
    return this.addSVGFilter(data)
  }  

 

  /* svg clip-path images   */

  getSVGImageIndex (id) {

    var filter = this.json.svgimages.map( (it, index) => {
      return { id: it.id, index }
    }).filter(it => {
      return it.id === id 
    })[0];

    return filter ? filter.index : -1;
  }

  removeSVGImage(removeIndex) {
    this.removePropertyList(this.json.svgimages, removeIndex);
  }      


  copySVGImage(index) {
    this.copyPropertyList(this.json.svgimages, index);    
  }        

  sortSVGImage(startIndex, targetIndex) {
    this.sortItem(this.json.svgimages, startIndex, targetIndex);
  }    

  setSVGImageValue(index, value) {
    this.json.svgimages[index] = {...this.json.svgimages[index], ...value}
  }

  addSVGImage(obj = {}) {
    this.json.svgimages.push(obj)
    var index = this.json.svgimages.length - 1;
    return index; 
  }

  createSVGImage(data = {}) {
    return this.addSVGImage(data)
  }   
}
