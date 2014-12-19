Polymer(
	{
		iconChanged: function () {
			this.icon = 'text-format';
		},
		labelChanged: function () {
			this.label = 'Text';
		},
		modeChanged: function () {
		  this.super();

      switch (this.mode) {
        case 'edit':
          this.$.textContainer.setAttribute('contenteditable', '');
          break;
        default:
          this.$.textContainer.removeAttribute('contenteditable');
          break;
      }
		},
		ready: function () {
			this.super();
			this.$.content.appendChild(this.$.textContainer);
		}
	}
);