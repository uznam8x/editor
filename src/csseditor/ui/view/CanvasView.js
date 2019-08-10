import UIElement, { EVENT, COMMAND } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { Project } from "../../../editor/items/Project";
import { ArtBoard } from "../../../editor/items/ArtBoard";
import { DEBOUNCE, PREVENT, STOP, WHEEL, ALT, THROTTLE, IF, KEYUP, CONTROL, KEY, ANIMATIONITERATION } from "../../../util/Event";

import { StyleParser } from "../../../editor/parse/StyleParser";
import ElementView from "./ElementView";
import { Layer } from "../../../editor/items/Layer";
import NumberRangeEditor from "../property-editor/NumberRangeEditor";
import { Length } from "../../../editor/unit/Length";
import { rgb } from "../../../util/functions/formatter";
import { FileImageResource } from "../../../editor/image-resource/URLImageResource";
import { BackgroundImage } from "../../../editor/css-property/BackgroundImage";
import { Sketch, SketchUtil } from "../../../editor/parse/Sketch";
import Color from "../../../util/Color";
import Dom from "../../../util/Dom";
import PageTools from "../view-items/PageTools";
import PageSubEditor from "../view-items/PageSubEditor";



export default class CanvasView extends UIElement {

  components() {
    return {
      PageTools,
      NumberRangeEditor,
      ElementView,
      PageSubEditor
    }
  }

  afterRender() {
    var project = editor.add(new Project({
      name: 'New project'
    }));

    editor.selection.selectProject(project);

    var artboard = project.add(new ArtBoard({
      name: 'New ArtBoard',
      x: Length.px(300),
      y: Length.px(300)
    }));
    editor.selection.selectArtboard(artboard);

    // var layer = artboard.add(new Layer({
    //   name: 'New layer',
    //   'background-color': Color.random()
    // }));
    editor.selection.select(artboard);

    this.parser = this;

    this.emit('refreshAll')
    this.emit('refreshSelection')
  }
  template() {
    return/*html*/`
      <div class='page-container' tabIndex="-1">
        <div class='page-view'>
          <div class='page-lock' ref='$lock'>
            <ElementView ref='$elementView' />
          </div>
        </div>
        <PageSubEditor />
        <PageTools />
      </div>
    `;
  }

  // [ANIMATIONITERATION()] (e) {
  //   // console.log(e.elapsedTime, e);
  // }

  [KEYUP('$el') + CONTROL + KEY('c')  + PREVENT ] (e) {
    this.emit('copy');
  }

  [KEYUP('$el') + CONTROL + KEY('v') + PREVENT ] () {
    this.emit('paste');
  }  

  isNumberKey(e) {
    return ((+e.key) + "") === e.key;
  }  

  isNotFormElement(e) {
    var tagName = e.target.tagName.toLowerCase();

    return ['input'].includes(tagName) === false;
  }

  [KEYUP('$el') + IF('isNumberKey') + IF('isNotFormElement') + PREVENT+ STOP] (e) {
    this.emit('keyup.canvas.view', e.key);
  }

  [WHEEL('$lock') + ALT + PREVENT + THROTTLE(10)] (e) {

    var dt = e.deltaY < 0 ? 1.1 : 0.9;
    this.emit('changeScaleValue', editor.scale * dt);
  }

  getScrollTop() {
    if (this.refs.$lock) {
      return this.refs.$lock.scrollTop()
    }

    return 0;
  }

  getScrollLeft() {
    if (this.refs.$lock) {
      return this.refs.$lock.scrollLeft()
    }
    
    return 0; 
  }  

  get scrollXY () {
    return {
      screenX: Length.px(this.getScrollLeft()),
      screenY: Length.px(this.getScrollTop())
    }
  }

  get screenSize () {
    if (this.refs.$lock) {
      return this.refs.$lock.rect()
    }

    return {
      width: 0,
      height: 0
    }
  } 

  setScrollTop (value) {
    this.refs.$lock.setScrollTop(value);
  }

  addScrollTop (value) {
    this.setScrollTop(this.getScrollTop() + value)
  }

  setScrollLeft (value) {
    this.refs.$lock.setScrollLeft(value);
  }  

  addScrollLeft (value) {
    this.setScrollLeft(this.getScrollLeft() + value)
  }

  [EVENT('focusCanvasView')] () {
    this.$el.focus()
  }


  // 단축키 적용하기 
  [KEYUP() + IF('Backspace')] (e) {
    var $target = Dom.create(e.target);
    if ($target.attr('contenteditable')) {

    } else {
      editor.selection.remove()
      this.emit('refreshAllSelectArtBoard')
    }
  }



  [EVENT('refreshComputedStyle') + DEBOUNCE(100)] (last) {
    var computedCSS = this.refs.$canvas.getComputedStyle(...last)
    
    this.emit('refreshComputedStyleCode', computedCSS)
  }

  // [EVENT('loadSketchData')] (sketchData) {
  //   var projects = SketchUtil.parse (sketchData);

  //   projects.forEach(p => {
  //     editor.add(p);
  //   })

  //   this.refresh();
  //   this.emit('addElement');    
  //   this.emit('refreshCanvas')
  //   this.emit('refreshStyleView')

  // }

}
