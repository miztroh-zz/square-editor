Polymer(
	{
    childrenUpdated: function () {
      this.onMutation(this, this.childrenUpdated);

      if (this.parentNode) {
        if (this.children.length > 0 && this.parentNode.tagName.toLowerCase() === 'square-editor' && this.direction === 'vertical') {
          var children = Array.prototype.slice.call(this.children);

          for (var i = 0; i < children.length; i += 1) {
            this.parentNode.insertBefore(children[i], this);
          }
        } else {
          switch (this.children.length) {
            case 0:
              this.parentNode.removeChild(this);
              break;
            case 1:
              var child = this.children[0];
              this.parentNode.insertBefore(child, this);
              if (child.tagName.toLowerCase() === 'square-block-layout') child.childrenUpdated();
              break;
          }
        }
      }
    },
    directionChanged: function () {
      if (['horizontal', 'vertical'].indexOf(this.direction) === -1) {
        this.direction = 'horizontal';
        return;
      }
    },
		labelChanged: function () {
			this.label = this.direction + ' Layout';
		},
    publish: {
      direction: {
        value: 'horizontal',
        reflect: true
      }
    },
    ready: function () {
      var that = this;

      this.super();
      this.$.layout.appendChild(this.$.content.querySelector('content'));
      this.$.content.appendChild(this.$.layout);
      this.$.toolbar.appendChild(this.$.remove);
      this.onMutation(this, this.childrenUpdated);

      this.$.remove.addEventListener(
        'click',
        function () {
          that.parentNode.removeChild(that);
        }
      );
    },
		save: function () {
		  var clone = this.cloneNode();
		  clone.mode = 'view';
		  clone.removeAttribute('mode');
    	clone.removeAttribute('contenteditable');
    	var innerHTML = '';

      for (var i = 0; i < this.children.length; i += 1) {
        if (typeof this.children[i].save === 'function') innerHTML += this.children[i].save();
      }

		  clone.innerHTML = innerHTML;
		  return clone.outerHTML;
		}
	}
);