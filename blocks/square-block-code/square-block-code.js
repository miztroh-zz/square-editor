Polymer(
	{
		iconChanged: function () {
			this.icon = 'square-editor:code-block';
		},
		labelChanged: function () {
			this.label = 'Code';
		},
		publish: {
		  code: '',
		},
		ready: function () {
			this.super();
			this.$.content.appendChild(this.$.codeContainer);

      this.$.codeInput.addEventListener(
        'keydown',
        function(e) {
          if(e.keyCode === 9) {
            this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionStart = this.selectionEnd = this.selectionStart + 1;
            e.preventDefault();
          }
        }
      );
		},
		showOptions: function () {
		  var that = this;

      this.$.codeInput.value = this.code;

      this.$.save.addEventListener(
        'click',
        function () {
          that.code = that.$.codeInput.value;
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