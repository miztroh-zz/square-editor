Polymer(
	{
		modeChanged: function () {
			if (['edit', 'add', 'view'].indexOf(this.mode) === -1) {
				this.mode = 'add';
				return;
			}

			this.fire('modeChanged');
		},
		publish: {
			icon: {
				value: '',
				reflect: true
			},
			label: {
				value: '',
				reflect: true,
			},
			mode: {
				value: 'add',
				reflect: true
			}
		},
		ready: function () {
			var that = this;

			this.addEventListener(
				'trackstart',
				function (event) {
					if (this.mode === 'edit' && Array.prototype.indexOf.call(event.path, this.$.container.querySelector('#border1')) >= 0) {
						event.stopPropagation();
					}
				}
			);

			var topDropletDistance = 61;
			var bottomDropletDistance = 61;

			document.addEventListener(
				'mousemove',
				function (event) {
					var border3 = that.$.container.querySelector('#border3');

					if (that.mode === 'edit' && border3) {
						var border3Rect = border3.getBoundingClientRect();

						var new_topDropletDistance = parseInt(Math.abs(Math.sqrt(Math.pow(event.pageX - border3Rect.left, 2) + Math.pow(event.pageY - border3Rect.top, 2))));

						if (new_topDropletDistance <= 60 && topDropletDistance > 60) {
							that.$.container.querySelector('#topDropletAnimation').pause();
							that.$.container.querySelector('#topDropletAnimation').direction = 'normal';
							that.$.container.querySelector('#topDropletAnimation').play();
						} else if (new_topDropletDistance > 60 && topDropletDistance <= 60) {
							that.$.container.querySelector('#topDropletAnimation').pause();
							that.$.container.querySelector('#topDropletAnimation').direction = 'reverse';
							that.$.container.querySelector('#topDropletAnimation').play();
						}

						topDropletDistance = new_topDropletDistance;

						var bottomDropletRect = that.$.container.querySelector('#bottomDroplet').getBoundingClientRect();

						var bottomDropletCenter = {
							x: (bottomDropletRect.right - bottomDropletRect.left) / 2 + bottomDropletRect.right,
							y: (bottomDropletRect.top - bottomDropletRect.bottom) / 2 + bottomDropletRect.top,
						};

						var new_bottomDropletDistance = parseInt(Math.abs(Math.sqrt(Math.pow(event.pageX - border3Rect.left, 2) + Math.pow(event.pageY - border3Rect.bottom, 2))));

						if (new_bottomDropletDistance <= 60 && bottomDropletDistance > 60) {
							that.$.container.querySelector('#bottomDropletAnimation').pause();
							that.$.container.querySelector('#bottomDropletAnimation').direction = 'normal';
							that.$.container.querySelector('#bottomDropletAnimation').play();
						} else if (new_bottomDropletDistance > 60 && bottomDropletDistance <= 60) {
							that.$.container.querySelector('#bottomDropletAnimation').pause();
							that.$.container.querySelector('#bottomDropletAnimation').direction = 'reverse';
							that.$.container.querySelector('#bottomDropletAnimation').play();
						}

						bottomDropletDistance = new_bottomDropletDistance;
					}
				}
			);

			this.$.container.addEventListener(
				'click',
				function (event) {
					if (that.mode === 'edit') {
						if (event.target === this.querySelector('#topDroplet')) that.fire('insertAbove');
						if (event.target === this.querySelector('#bottomDroplet')) that.fire('insertBelow');
					}
				}
			);

			this.$.container.addEventListener(
				'mouseover',
				function (event) {
					if (that.mode === 'edit') {
						if (event.target === this.querySelector('#topDroplet')) this.querySelector('#matting').setAttribute('topDroplet', '');
						if (event.target === this.querySelector('#bottomDroplet')) this.querySelector('#matting').setAttribute('bottomDroplet', '');
					}
				}
			);

			this.$.container.addEventListener(
				'mouseout',
				function (event) {
					if (that.mode === 'edit') {
						if (event.target === this.querySelector('#topDroplet')) this.querySelector('#matting').removeAttribute('topDroplet');
						if (event.target === this.querySelector('#bottomDroplet')) this.querySelector('#matting').removeAttribute('bottomDroplet');
					}
				}
			);

			this.modeChanged();
		},
		save: function () {
			return '';
		}
	}
);