import Base from '../boxbase';

let Textbox = Base.extend({
	props: {
		id: ['string', true, '']
		,filter: ['object', true, function(){ return {}; }]
		,isscrollable: ['boolean', true, true]
		,active: ['boolean', true, false]
		,parentview: ['object', true, function(){ return {} }]
		,textboxfaktor: ['number', true, 0]
	},

	events: { },

	render: function(){

		this.cacheElements({
			'textbox': '.Textbox__body',
			'textboxbar': '.Textbox__scroller',
			'textboxhandler': '.Textbox__scroller span'
		});
		this.on('change:active', this.onActiveChange, this);
		return this;
	},

	onActiveChange: function(view, value){
		if(value){
			TweenMax.delayedCall(1.25, function(){
				if(this.active){
					if(!CM.App._mobile){
						this.handleResize();
					}
				}
			}, [], this);
		} else {

		}
	},

	handleResize: function(){
		var newWidth = document.body.clientHeight/9*16,
				newHeight = document.body.clientHeight;
		if(newWidth < document.body.clientWidth) {
			newWidth = document.body.clientWidth,
			newHeight = document.body.clientWidth/16*9;
		}
		this.el.setAttribute("style", "height:"+document.body.clientHeight+"px");
		console.log(this.textboxbar.clientHeight);
		if(this.textboxbar.clientHeight != undefined){
			let tbh = this.textboxbar.clientHeight;
			let tbbh = this.textbox.clientHeight;
			let handlerHeight = (tbh / (tbbh/100)) * (tbh/100);
			let faktor = (tbh / (tbbh/100)) / 100;
			if(handlerHeight >= tbh){
					TweenMax.to(this.textboxbar, 0.25, {opacity: 0});
					TweenMax.to(this.textbox, 0.25, {y: 0});
					TweenMax.to(this.textboxhandler, 0.25, {y: 0});
			} else {
				TweenMax.to(this.textboxbar, 0.25, {opacity: 1});
				TweenMax.to(this.textboxhandler, 0.25, {height:handlerHeight});
			}
			this.textboxfaktor = faktor;
		}

	}

})

export default Textbox;
