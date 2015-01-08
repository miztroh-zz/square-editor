Polymer(
	{
		labelChanged: function () {
			this.label = 'Quote';
		},
	  publish: {
	    text: {
	      value: '',
	      reflect: true
	    },
	    attribution: {
	      value: '',
	      reflect: true
	    }
	  },
		ready: function () {
			this.super();
			this.$.content.appendChild(this.$.quoteContainer);
		},
		showOptions: function () {
		  var that = this;

      this.$.textInput.value = this.text;
      this.$.attributionInput.value = this.attribution;

      this.$.save.addEventListener(
        'click',
        function () {
          that.text = that.$.textInput.value;
          that.attribution = that.$.attributionInput.value;
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