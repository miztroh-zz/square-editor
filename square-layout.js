Polymer(
  {
    childrenUpdated: function () {
      this.onMutation(this, this.childrenUpdated);
      if (this.parentNode && this.children.length === 0) this.parentNode.removeChild(this);
    },
    directionChanged: function () {
      if (['horizontal', 'vertical'].indexOf(this.direction) === -1) this.direction = 'horizontal';
    },
		modeChanged: function () {
			if (['edit', 'view'].indexOf(this.mode) === -1) {
				this.mode = 'view';
				return;
			}

			this.fire('modeChanged');
		},
    publish: {
      direction: {
        value: 'horizontal',
        reflect: true
      },
      mode: {
        value: 'view',
        reflect: true
      }
    },
    ready: function () {
      this.onMutation(this, this.childrenUpdated);
    }
  }
);