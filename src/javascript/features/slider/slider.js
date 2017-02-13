import Base from '../boxbase';

let Slider = Base.extend({
	props: {
		id: ['string', true, '']
		,filter: ['object', true, function(){ return {}; }]
		,isscrollable: ['boolean', true, true]
		,active: ['boolean', true, false]
		,parentview: ['object', true, function(){ return {} }]
		,swiper: ['object', true, function(){ return undefined }]
		,activeindex: ['number', true, -1]
		,layer: ['array', true, function(){ return [] }]
		,navigation: ['array', true, function(){ return [] }]
		,textbox: ['object', true, function(){ return undefined }]
		,textboxhandler: ['object', true, function(){ return undefined }]
		,textboxbar: ['object', true, function(){ return undefined }]
		,textboxfaktor: ['number', true, function(){ return 0 }]
		,textboxes: ['array', true, function(){ return [] }]
		,settings: ['object', true, function(){ return {
						speed: 600,
						// effect: 'fade',
						loop: true,
						pagination: '.Slider .swiper-pagination',
						paginationClickable: true
					}
		}]
	},

	events: {
		'click .Button--right':'handleRightClick',
		'click .Button--left':'handleLeftClick',
		'mousemove .swiper-container':'handleMouseMove',
		'click .Contentnavigation li':'handleClickContentnaviItem',
		// 'click .Contentnavigation':'handleClickContentnavi',
		'click .Contentnavigation__background':'handleClickContentnaviClose',
		'click .Button--contentnavi':'handleClickContentnavi',
	},

	render: function(){
		this.cacheElements({
			'navigationContainer': '.Contentnavigation'
		});
		this.on('change:active', this.onActiveChange, this);
		TweenMax.delayedCall(0.15, function(){
				this.swiper = new Swiper('#'+this.id+' .swiper-container', this.settings);
				if(this.active){
					this.bindChangeStart();
				}
		}, [], this);
		this.layer = this.queryAll('#'+this.id+' .Slider__layer > div');
		this.navigation = this.queryAll('#'+this.id+' .Contentnavigation li');
		for(let i=0; i<this.layer.length; i++){
			let scrollbar = this.layer[i].getElementsByClassName('Textbox__scroller')[0] || [];
			let boxbody = this.layer[i].getElementsByClassName('Textbox__body')[0] || [];
			let handler = typeof scrollbar.getElementsByTagName == 'function' ? scrollbar.getElementsByTagName('span')[0] : [];
			this.textboxes.push({scrollbar:scrollbar, body:boxbody , handler:handler, faktor:0});
		}
		return this;
	},

	onActiveChange: function(view, value){
		if(value){
			TweenMax.delayedCall(1.25, function(){
				if(this.active){
					this.bindChangeStart();
					if(!CM.App._mobile){
						this.handleResize();
					}
				}
			}, [], this);
		} else {
			this.layer[this.swiper.realIndex].classList.remove('active');
			this.navigation[this.swiper.realIndex].classList.remove('active');
			this.swiper.off('slideChangeStart');
		}
	},

	bindChangeStart: function(){
		let self = this;
		if(self.swiper != undefined){
			self.setActiveIndex(self.swiper.realIndex);
			self.swiper.on('slideChangeStart', function (event) {
				self.setActiveIndex(event.realIndex);
			});
		}
	},

	gfxIn: function(){
		this.layer[this.activeindex].classList.add('active');
		this.navigation[this.activeindex].classList.add('active');
		this.gfxLinesIn(this.layer[this.activeindex]);
	},

	gfxLinesIn: function(node){
		let lines = node.getElementsByTagName('line');
		if(lines.length > 0){
			TweenMax.set(lines, {drawSVG:"0% 0%"});
			TweenMax.staggerTo(lines, 0.5, {drawSVG:"0% 100%", delay:0.5, onComplete:function(){
				TweenMax.to(this.target, 0.5, {drawSVG:"100% 100%", onComplete:function(){
					let tlength = Math.random()*100;
					TweenMax.set(this.target, {drawSVG:"0% 0%"});
					TweenMax.to(this.target, 1.2, {drawSVG:`0% ${tlength}%`});
				}});
			}}, 0.15);
		}
	},

	setActiveIndex: function(newIndex){
		if(this.activeindex != -1){
			this.layer[this.activeindex].classList.remove('active');
			this.navigation[this.activeindex].classList.remove('active');
		}
		this.activeindex = newIndex;
		this.gfxIn();
		this.textbox = (this.textboxes[this.activeindex].body == undefined) ? [] : this.textboxes[this.activeindex].body;
		this.textboxhandler = (this.textboxes[this.activeindex].handler == undefined) ? [] : this.textboxes[this.activeindex].handler;
		this.textboxbar = this.textboxes[this.activeindex].scrollbar == undefined ? [] : this.textboxes[this.activeindex].scrollbar;
		this.textboxfaktor = this.textboxes[this.activeindex].faktor
	},

	handleResize: function(){
		var newWidth = document.body.clientHeight/9*16,
				newHeight = document.body.clientHeight;
		if(newWidth < document.body.clientWidth) {
			newWidth = document.body.clientWidth,
			newHeight = document.body.clientWidth/16*9;
		}
		this.el.setAttribute("style", "height:"+document.body.clientHeight+"px");
		// resize all textboxen
		TweenMax.delayedCall(0.25, function(){
			for(let i=0; i<this.textboxes.length; i++){
				if(this.textboxes[i].scrollbar.clientHeight != undefined){
					let tbh = this.textboxes[i].scrollbar.clientHeight;
					let tbbh = this.textboxes[i].body.clientHeight;
					let handlerHeight = (tbh / (tbbh/100)) * (tbh/100);
					let faktor = (tbh / (tbbh/100)) / 100;
					if(handlerHeight >= tbh){
							TweenMax.to(this.textboxes[i].scrollbar, 0.25, {opacity: 0});
							TweenMax.to(this.textboxes[i].body, 0.25, {y: 0});
							TweenMax.to(this.textboxes[i].handler, 0.25, {y: 0});
					} else {
						TweenMax.to(this.textboxes[i].scrollbar, 0.25, {opacity: 1});
						TweenMax.to(this.textboxes[i].handler, 0.25, {height:handlerHeight});
					}
					this.textboxes[i].faktor = faktor;
				}
			}
			if(this.textboxfaktor != 0){
				this.textboxfaktor = this.textboxes[this.activeindex].faktor
			}

		}, [], this);
	},

	handleRightClick: function(){
		this.swiper.slideNext();
	},

	handleLeftClick: function(){
		this.swiper.slidePrev();
	},
	handleMouseMove: function(event){
		if(this.active){
			let faktor = event.clientX - document.body.clientWidth/2;
			TweenMax.set(this.swiper.container, {x:-0.008*faktor});
			TweenMax.set(this.layer[this.activeindex].children, {x:0.015*faktor});
		}
	},
	handleClickContentnavi: function(event){
		event.preventDefault();
		this.navigationContainer.classList.add('open');
	},
	handleClickContentnaviClose: function(event){
		this.navigationContainer.classList.remove('open');
	},
	handleKeyDown: function(direction){
		if(direction == "left"){
			this.swiper.slidePrev();
		}else {
			this.swiper.slideNext();
		}
	},
	handleClickContentnaviItem: function(event){
		let newIndex = Number(event.delegateTarget.getAttribute('data-index'))+1;
		TweenMax.delayedCall(1.25, function(){
			this.navigationContainer.classList.remove('open');
		}, [], this);
		this.swiper.slideTo(newIndex);
	}
})

export default Slider;
