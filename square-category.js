Polymer(
	{
	  modeChanged: function () {
	    if (['view', 'search'].indexOf(this.mode) === -1) {
	      this.mode = 'view';
	      return;
	    }
	  },
	  publish: {
			mode: {
				value: 'view',
				reflect: true
			}
	  },
		ready: function () {
			this.addEventListener(
				'trackstart',
				function (event) {
					if (event.target === this) event.stopPropagation();
				}
			);
		}
	}
);