Polymer(
	{
		ready: function () {
		  this.super();
		  this.$.scroller.parentNode.insertBefore(this.$.scroller.querySelector('h1'), this.$.scroller);
		}
	}
);