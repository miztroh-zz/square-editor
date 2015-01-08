Polymer(
	{
		iconChanged: function () {
			this.icon = 'editor:insert-photo';
		},
		labelChanged: function () {
			this.label = 'Image';
		},
		publish: {
		  src: {
		    value: '',
		    reflect: true
		  },
		  caption: {
		    value: '',
		    reflect: true
		  }
		},
		ready: function () {
		  this.super();
			this.$.content.appendChild(this.$.imageContainer);
		},
		showOptions: function () {
		  var that = this;

      this.$.srcInput.value = this.src;
      this.$.captionInput.value = this.caption;

      this.$.save.addEventListener(
        'click',
        function () {
          that.src = that.$.srcInput.value;
          that.caption = that.$.captionInput.value;
        }
      );

      this.$.remove.addEventListener(
        'click',
        function () {
          that.parentNode.removeChild(that);
        }
      );

      this.$.dialog.opened = true;
		}
	}
);