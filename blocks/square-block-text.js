Polymer(
	{
		iconChanged: function () {
			this.icon = 'editor:mode-edit';
		},
		labelChanged: function () {
			this.label = 'Text';
		},
		ready: function () {
			this.super();
			this.modeChanged();
			this.innerHTML = '<div contenteditable><p>Write here...</p></div>';
		}
	}
);