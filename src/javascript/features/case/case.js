import Base from '../base';

let Case = Base.extend({
	props: {
		id: ['string', true, '']
		,isscrollable: ['boolean', true, true]
		,parentview: ['object', true, function(){ return {} }]
		,swiper: ['object', true, function(){ return undefined }]
		,settings: ['object', true, function(){ return {
						speed: 600,
						// effect: 'fade',
						pagination: '.Case .swiper-pagination',
						paginationClickable: true,
						nextButton: '.Case .swiper-button-next',
						prevButton: '.Case .swiper-button-prev',
						loop: true
					}
		}]
		,topend: ['boolean', true, true]
		,bottomend: ['boolean', true, false]
		,caseBoardVideo: ['object', true, function(){ return undefined }]

	},

	events: { },

	render: function(){
		this.cacheElements({
				caseBody: '.Case__body',
				caseVideo : '.Videobox__background',
		});
		if(this.queryAll('#'+this.id+' .swiper-slide').length > 1){
			TweenMax.delayedCall(0.15, function(){
					this.swiper = new Swiper('#'+this.id+' .swiper-container', this.settings);
			}, [], this);
		}
		this.caseBoardVideo = this.queryAll('.Case__item--youtube > div');

		return this;

	},
	handleResize: function(){
		if(!CM.App._mobile) {
			this.el.setAttribute("style", "height:"+document.body.clientHeight+"px");
			if(this.caseVideo != undefined){
				let newWidth = this.caseVideo.clientWidth,
						newHeight = newWidth/16*9;
				this.caseVideo.setAttribute("style", "height:"+newHeight+"px;");
			}
			if(this.caseBoardVideo != undefined){
				for(let i=0; i<this.caseBoardVideo.length; i++){
					let newWidth = this.caseBoardVideo[i].clientWidth,
							newHeight = newWidth/16*9;
					this.caseBoardVideo[i].setAttribute("style", "height:"+newHeight+"px;");
				}
			}
		}
	},
	handleMouseWheel: function(event){
		let self = this;
		let e = window.event || event || event.originalEvent;
		let delta = e.deltaY || -1*e.wheelDelta;

		// FF Y-Achse
		if(e.axis == 2){
			delta = e.detail*e.detail*(e.detail/2);
		}
		if(delta < 0){
			self.bottomend = false;
			if(self.caseBody._gsTransform && self.caseBody._gsTransform.y-delta > 0){
					TweenMax.to(self.caseBody, 0.1, {y:0, overwrite:true});
			} else {
				TweenMax.set(this.caseBody, {y:`-=${delta}`});
			}
		} else if(delta > 0) {
			self.topend = false;
			let cH = document.body.clientHeight,
					bH = self.caseBody.clientHeight,
					dH = cH-bH;
			if(self.caseBody._gsTransform && self.caseBody._gsTransform.y-delta < cH-bH){
					TweenMax.to(self.caseBody, 0.1, {y:dH, overwrite:true});
			} else {
				TweenMax.set(self.caseBody, {y:`-=${delta}`});
			}
		}

	}
})

export default Case;
