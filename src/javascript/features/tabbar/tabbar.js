import Base from '../base';

let Tabbar = Base.extend({
	props: {
		id: ['string', true, '']
		,active: ['boolean', true, false]
		,parentview: ['object', true, function(){ return {} }]
		,swiper: ['object', true, function(){ return undefined }]
		,activeindex: ['number', true, -1]
		,type: ['string', true, "full"]
	},

	events: {
		'click .Tabbar__item': 'handleItemClick'
	},

	render: function(){
		console.log("render Tabbar");
		return this;
	},

	handleItemClick: function(event){
		let classname = event.delegateTarget.getAttribute("data-tab");
		this.query('.Tabbar').setAttribute('class', 'Tabbar ' + classname);
		console.log(classname);
	}

})

export default Tabbar;
