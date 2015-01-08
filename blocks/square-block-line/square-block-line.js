Polymer(
	{
		labelChanged: function () {
			this.label = 'Line';
		},
		ready: function () {
			this.super();
			this.$.content.appendChild(this.$.lineContainer);
		}
	}
);