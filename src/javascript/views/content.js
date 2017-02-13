import PageView from './base';
import View from 'ampersand-view';
import YoutubeView from '../features/youtube/youtube';
import FilterGridView from '../features/filtergrid/filtergrid';
import LinkGridView from '../features/linkgrid/linkgrid';
import SliderView from '../features/slider/slider';
import CaseView from '../features/case/case';
import TextpageView from '../features/textbox/textbox';
import dom from 'ampersand-dom';

let Content = PageView.extend({

	props:{
		isInitial: ['boolean', true, false]
		,isScrollTop: ['boolean', true, false]
		,subViews: ['array', true, function(){ return []; }]
		,activeElement: ['object', true, function(){ return {}; }]
		,viewportInterval: ['number', true, 0]
	},

	events: {
		'click .Button--down' : 'handleDownClick'
	},

	hookBeforeHide: function() {

	},

	hookInRender: function () {
		let self = this;
		let elements = this.queryAll('.Element');
		if(elements.length > 0){
			elements.forEach(function(element, index, array){

				let view = {};
				switch(element.dataset.view){
					case "VideoView" :
						element.getElementsByTagName('iframe')[0].setAttribute('id', 'videobox'+index)
						view = new YoutubeView({el:element, id:element.getAttribute('id'), videoid:'videobox'+index, parentview:self});
						view.render();
						break;
					case "FilterGridView" :
						view = new FilterGridView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "LinkGridView" :
						view = new LinkGridView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "SliderView" :
						view = new SliderView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "CaseView" :
						view = new CaseView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "TextpageView" :
						view = new TextpageView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					default:
				}
				self.registerSubview(view);
				self.subViews.push({id:view.id, view:view});
				if(index == 0){
					view.on('change:active', self.onFirstSubViewActiveChange, self);
				}
			});
		}

		this.updateActiveView();


	},

	killInterval: function(){
		clearInterval(this.viewportInterval);
	},

	startInterval: function(){

		if(CM.App._mobile){
			let self = this;
			this.viewportInterval = setInterval(function(){
				let viewportActive = null;
				self.subViews.forEach(function(element){
					if(element.view.el.offsetTop-CM.App.mainView.pageinner.clientHeight/2<=CM.App.mainView.pageinner.scrollTop){
						viewportActive = element;
					};
				});
				if(viewportActive.view){
					let lastActiveElement = self.activeElement;
					viewportActive.view.active = true;
					CM.App._params.section = viewportActive.id;
					CM.App.mainView.updateActiveNav();
					self.activeElement = viewportActive;
					if(lastActiveElement.view && (lastActiveElement.view != self.activeElement.view)){
						lastActiveElement.view.active = false;
					}
				}
			}, 250);
		}
	},

	handleResize: function(){
		this.subViews.forEach(function(element){
			element.view.handleResize();
		});
	},
	hookAfterShow: function(){

	},
	handleMouseWheel: function(event){
		this.activeElement.view.handleMouseWheel(event);
	},
	handleDownClick: function(event){
		this.nextSlide();
	},
	handleSwipeUp: function(event){
		this.nextSlide();
	},
	handleSwipeDown: function(event){
		this.previousSlide();
	},
	previousSlide: function(){
		let index  = this.subViews.indexOf(this.activeElement);
		if(index != 0){
			CM.App.navigate(`/${this.model.lang}/?section=${this.subViews[index-1].view.el.getAttribute('id')}`);
		}
	},
	nextSlide: function(){
		// nächstes Element ermitteln
		let index  = this.subViews.indexOf(this.activeElement);
		if(index != this.subViews.length-1){
			CM.App.navigate(`/${this.model.lang}/?section=${this.subViews[index+1].view.el.getAttribute('id')}`);
		}
	},
	onFirstSubViewActiveChange: function(view, value){
		if(value) {
			dom.addClass(document.body, 'Navigation--home');
		} else {
			dom.removeClass(document.body, 'Navigation--home');
		}
	},
	handleKeyDown: function(event){
		switch(event.key){
			case 'ArrowLeft' :
				this.activeElement.view.handleKeyDown("left");
				break;
			case 'ArrowRight' :
				this.activeElement.view.handleKeyDown("right");
				break;
			case 'ArrowDown' :
				this.nextSlide();
				break;
			case 'ArrowUp' :
				this.previousSlide();
				break;
			case 'Left' :
				this.activeElement.view.handleKeyDown("left");
				break;
			case 'Right' :
				this.activeElement.view.handleKeyDown("right");
				break;
			case 'Down' :
				this.nextSlide();
				break;
			case 'Up' :
				this.previousSlide();
				break;
		}
	},
	updateActiveView: function(){
		let lastActiveElement = this.activeElement;

		if (CM.App._params != {} && CM.App._params.section != null){
			let newActiveElement = this.subViews.filter(element => { return element.id == CM.App._params.section })[0]
			if(newActiveElement != null){
				this.activeElement = newActiveElement
			} else {
				this.activeElement = this.subViews[0];
			}
		} else {
			this.activeElement = this.subViews[0]
		}
		this.activeElement.view.active = true;

		if(lastActiveElement.view && (lastActiveElement.view != this.activeElement.view)){
			lastActiveElement.view.active = false;
		}

	}

});

export default Content;
