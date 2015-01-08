Polymer(
	{
	  publish: {
	    src: {
	      value: '',
	      reflect: true
	    }
	  },
		iconChanged: function () {
			this.icon = 'av:videocam';
		},
		labelChanged: function () {
			this.label = 'Video';
		},
		ready: function () {
			this.super();
			this.$.content.appendChild(this.$.videoContainer);
		},
		showOptions: function () {
		  var that = this;

      this.$.srcInput.value = this.src;

      this.$.save.addEventListener(
        'click',
        function () {
          that.src = that.$.srcInput.value;
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