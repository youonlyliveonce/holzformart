import Base from './base';

let Longbase = Base.extend({
	props: {
		id: ['string', true, '']
		,isscrollable: ['boolean', true, true]
		,parentview: ['object', true, function(){ return {} }]
		,topend: ['boolean', true, true]
		,bottomend: ['boolean', true, false]
		,mousebreak: ['boolean', true, false]
		,timeto: ['array', true, function(){ return [] }]
	},
	events: {
	},
	render: function(){
		this.on('change:active', this.onActiveChange, this);
		return this;
	},
	onActiveChange: function(view, value){
		this.mousebreak = false;
		this.topend = false;
		this.bottomend = false;
	},
	delayMouseWheelBreak: function(delay){
		this.mousebreak = false;
		TweenMax.killDelayedCallsTo(this.setMouseWheelBreak);
		TweenMax.delayedCall(delay, this.setMouseWheelBreak, [], this);
	},
	setMouseWheelBreak: function(){
		this.mousebreak = true;
	},
	flashBackground: function(){
		TweenMax.to(this.gridBackground, 0.15, {css: {'opacity':0.1}, yoyo:true, repeat:1});
	},
	handleMouseWheel: function(event){
		let self = this;
		let e = window.event || event || event.originalEvent;
		let delta = e.deltaY || -1*e.wheelDelta;
		let breakDelay = 0.1;

		// FF Y-Achse
		if(e.axis == 2){
			delta = e.detail*e.detail*(e.detail/2);
			breakDelay = 0.3;
		}
		// let now = Math.floor(Date.now());
		// if(this.timeto.length != 0){
		// 	this.timeto.push(this.timeto[0] - now);
		// }
		// this.timeto[0] = now;

		// console.log(this.timeto);

		if(delta < 0){
			self.bottomend = false;
			if(self.gridBody._gsTransform && self.gridBody._gsTransform.y-delta > 0){
					if(self.topend){
						if(self.mousebreak){
							self.parentview.previousSlide();
						} else {
							self.delayMouseWheelBreak(breakDelay);
						}
					} else if(!self.topend){
						self.delayMouseWheelBreak(breakDelay);
						TweenMax.set(this.gridBody, {y:0});
						self.flashBackground();
						self.topend = true;
					}
			} else {
				self.mousebreak = false;
				TweenMax.set(this.gridBody, {y:`-=${delta}`});
			}
		} else if(delta > 0) {
			// console.log("scroll gen bottom", self.topend);
			self.topend = false;
			let cH = document.body.clientHeight - self.gridHead.clientHeight,
					bH = self.gridBody.clientHeight,
					dH = cH-bH;

			if(self.gridBody._gsTransform && self.gridBody._gsTransform.y-delta <= cH-bH){
				if(self.bottomend){
					if(self.mousebreak){
						self.parentview.nextSlide();
					} else {
						self.delayMouseWheelBreak(breakDelay);
					}
				} else if(!self.bottomend) {
					self.delayMouseWheelBreak(breakDelay);
					self.bottomend = true;
					TweenMax.set(self.gridBody, {y:dH});
					self.flashBackground();

				}
			} else {
				self.mousebreak = false;
				TweenMax.set(self.gridBody, {y:`-=${delta}`});
			}
		}

	}
})

export default Longbase;
