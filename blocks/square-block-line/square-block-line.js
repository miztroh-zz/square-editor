Polymer(
	{
		iconChanged: function () {
			this.icon = 'square-editor:line-block';
		},
		labelChanged: function () {
			this.label = 'Line';
		},
		ready: function () {
			this.super();
			this.$.content.appendChild(this.$.lineContainer);
		}
	}
);