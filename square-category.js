Polymer(
	{
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