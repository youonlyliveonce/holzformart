import View from './Base';

let BoxBase = View.extend({
	props: {
		id: ['string', true, '']
		,active: ['boolean', true, true]
		,isscrollable: ['boolean', true, false]
		,parentview: ['object', true, function(){ return {} }]
	},
	events: {},

	handleMouseWheel: function(event){
		let e = window.event || event || event.originalEvent;
		let delta = e.deltaY || -1*e.wheelDelta;

		// FF Y-Achse
		if(e.axis == 2){
			delta = e.detail*e.detail*(e.detail/2);
		}

		if(event.target && event.target.offsetParent &&
			( event.target.offsetParent.classList.contains('Textbox__wrapper') 
				|| event.target.offsetParent.classList.contains('Textbox__body')
				|| event.target.classList.contains('Textbox__body')
				|| event.target.classList.contains('Textbox__wrapper') ) ){

				let cH = this.textboxbar.clientHeight,
						bH = this.textbox.clientHeight,
						dH = cH-bH;
			if(bH > cH){
				if(delta < 0){
					if(this.textbox._gsTransform && this.textbox._gsTransform.y-delta > 0){
						TweenMax.set(this.textbox, {y: 0});
						TweenMax.set(this.textboxhandler, {y: 0});
					} else {
						TweenMax.set(this.textbox, {y:`-=${delta}`});
						TweenMax.set(this.textboxhandler, {y:`+=${delta*this.textboxfaktor}`});
					}
				} else if (delta > 0) {
					if(this.textbox._gsTransform && this.textbox._gsTransform.y-delta < dH){
						TweenMax.set(this.textbox, {y: dH});
						TweenMax.set(this.textboxhandler, {y: -1*dH*this.textboxfaktor});
					} else {
						TweenMax.set(this.textbox, {y:`-=${delta}`});
						TweenMax.set(this.textboxhandler, {y:`+=${delta*this.textboxfaktor}`});
					}
				}
			}
		} else {
			if(delta < -19){
				this.parentview.previousSlide()
			} else if(delta > 19) {
				this.parentview.nextSlide()
			}
		}
	}

})

export default BoxBase;
