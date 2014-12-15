(
	function () {
		var styleAdded = false;

		Polymer(
			{
				modeChanged: function () {
					if (['edit', 'view'].indexOf(this.mode) === -1) {
						this.mode = 'view';
						return;
					}

					var blocks = this.$.mounting.querySelector('content').getDistributedNodes();

					for (var i = 0; i < blocks.length; i += 1) {
						blocks[i].mode = this.mode;
					}
				},
				publish: {
					defaultBlock: 'square-block-text',
					mode: {
						value: 'view',
						reflect: true
					}
				},
				ready: function () {
					var that = this, insertBefore;

					this.addEventListener(
						'modeChanged',
						this.modeChanged
					);

					this.$.fullscreenLayout.addEventListener(
						'trackstart',
						function (event) {
							event.stopPropagation();
						}
					);

					this.$.blocks.addEventListener(
						'trackstart',
						function (event) {
							if (that.mode === 'view') event.stopPropagation();
						}
					);

					this.$.blockChooser.addEventListener(
						'trackstart',
						function (event) {
							event.stopPropagation();
						}
					);

					this.$.fabLayout.addEventListener(
						'trackstart',
						function (event) {
							event.stopPropagation();
						}
					);

					function fullscreenAnimationPrep() {
						if (that.$.fullscreenAnimation.direction === 'reverse') {
							setTimeout(
								function () {
									that.$.mounting.style.position = '';
									that.$.mounting.setAttribute('resting', '');
								},
								10
							);
						} else {
							setTimeout(
								function () {
									that.$.mounting.removeAttribute('relative');
								}
							);
						}
					}

					this.$.fullscreenAnimation.addEventListener(
						'core-animation-finish',
						fullscreenAnimationPrep
					);

					fullscreenAnimationPrep();

					if (!styleAdded) {
						styleAdded = true;
						var css = 'core-drag-avatar.square-editor {z-index: 10; margin: -50px 0 0 -50px; opacity: 0.7;} core-drag-avatar.square-editor > paper-shadow {cursor: pointer;};';
						var style = document.createElement('style');
						if (style.styleSheet) style.styleSheet.cssText = css;
						else style.appendChild(document.createTextNode(css));
						document.getElementsByTagName('head')[0].appendChild(style);
					}

					this.addEventListener(
						'insertAbove',
						function (event) {
							if (Array.prototype.indexOf.call(this.$.mounting.querySelector('content').getDistributedNodes(), event.path[0]) >= 0) {
								insertBefore = event.path[0];
								this.$.blockChooser.opened = false;
								this.$.blockChooser.relatedTarget = event.path[0];
								this.$.blockChooser.opened = true;
							}
						}
					);

					this.addEventListener(
						'insertBelow',
						function (event) {
							if (Array.prototype.indexOf.call(this.$.mounting.querySelector('content').getDistributedNodes(), event.path[0]) >= 0) {
								insertBefore = event.path[0].nextSibling;
								this.$.blockChooser.opened = false;
								this.$.blockChooser.relatedTarget = event.path[0];
								this.$.blockChooser.opened = true;
							}
						}
					);

					this.$.blockChooser.addEventListener(
						'click',
						function (event) {
							if (event.target.hasAttribute('square-block')) {
								that.$.blockChooser.opened = false;
								var clone = event.target.cloneNode();
								clone.mode = 'edit';
								that.insertBefore(clone, insertBefore);
							}
						}
					);

					this.$.fab.addEventListener(
						'mouseover',
						function () {
							that.$.fabBackgroundAnimation.pause();
							that.$.fabBackgroundAnimation.direction = 'normal';
							that.$.fabBackgroundAnimation.play();
						}
					);

					this.$.fab.addEventListener(
						'mouseout',
						function () {
							that.$.fabBackgroundAnimation.pause();
							that.$.fabBackgroundAnimation.direction = 'reverse';
							that.$.fabBackgroundAnimation.play();
						}
					);

					var shadow = document.createElement('paper-shadow');
					shadow.setAttribute('z', '5');

					var add = document.createElement('div');
					add.style.cssText = 'color: #636363; padding: 15px; width: 70px; height: 70px; background: white;';
					shadow.appendChild(add);

					var layout = document.createElement('div');
					layout.setAttribute('vertical', '');
					layout.setAttribute('center', '');
					layout.setAttribute('layout', '');
					layout.style.cssText = 'overflow: hidden; max-width: 100%; max-height: 100%;';
					add.appendChild(layout);

					var icon = document.createElement('core-icon');
					icon.style.cssText = 'width: 50px; height: 50px;';
					layout.appendChild(icon);

					var label = document.createElement('label');
					layout.style.cssText = 'font-family: RobotoDraft; font-size: 11px;';
					layout.appendChild(label);

					this.$.mounting.addEventListener(
						'drag-start',
						function (event) {
							if (Array.prototype.indexOf.call(event.path, that.$.blockChooser) >= 0) {
								that.$.blockChooser.opened = false;
								event.detail.avatar.innerHTML = '';
								event.detail.avatar.classList.toggle('square-editor', true);
								event.detail.avatar.appendChild(shadow);
								icon.icon = event.detail.event.target.icon;
								label.innerHTML = '';
								label.innerText = event.detail.event.target.label;
								that.$.blocks.style.pointerEvents = 'none';

								event.detail.drag = function (event) {
								};

								event.detail.drop = function (event) {
									event.avatar.classList.toggle('square-editor', false);
									event.avatar.innerHTML = '';
									that.$.blocks.style.pointerEvents = '';
								};
							} else {
								that.$.blockChooser.opened = false;
								event.detail.avatar.innerHTML = '';
								event.detail.avatar.classList.toggle('square-editor', true);
								event.detail.avatar.appendChild(shadow);
								icon.icon = event.detail.event.target.icon;
								label.innerHTML = '';
								label.innerText = event.detail.event.target.label;
								that.$.fabPositionAnimation.pause();
								that.$.fabPositionAnimation.direction = 'normal';
								that.$.fabPositionAnimation.play();
								that.$.mounting.style.overflow = 'hidden';
								that.$.blocks.style.pointerEvents = 'none';

								event.detail.drag = function (event) {
								};

								event.detail.drop = function (event) {
									that.$.blocks.style.pointerEvents = '';
									that.$.mounting.style.overflow = '';

									if (event.event.relatedTarget === that.$.fab && event.event.target.parentNode === that) {
										that.removeChild(event.event.target);

										if (that.querySelectorAll('[square-block][mode="edit"]').length === 0) {
											var defaultBlock = document.createElement(that.defaultBlock);

											if (defaultBlock && defaultBlock.mode === 'add') {
												defaultBlock.mode = 'edit';
												that.appendChild(defaultBlock);
											}
										}
									}

									event.avatar.classList.toggle('square-editor', false);
									event.avatar.innerHTML = '';
									that.$.fabPositionAnimation.pause();
									that.$.fabPositionAnimation.direction = 'reverse';
									that.$.fabPositionAnimation.play();
								};
							}
						}
					);
				},
				toggleFullscreen: function () {
					this.$.fullscreenAnimation.finish();

					var findPos = function (element) {
						var pos = {
							x: 0,
							y: 0
						};

						while (element) {
							pos.x += element.offsetLeft;
							pos.y += element.offsetTop;
							element = element.offsetParent;
						}

						return pos;
					};

					var position = findPos(this.$.mounting);

					switch (this.$.fullscreenAnimation.direction) {
						case 'reverse':
							this.$.fullscreenAnimation.direction = 'normal';
							this.$.mounting.removeAttribute('resting');
							this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="top"]').value = position.y + 'px';
							this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="right"]').value = (position.x + this.$.mounting.offsetWidth) + 'px';
							this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="bottom"]').value = (position.y + this.$.mounting.offsetHeight) + 'px';
							this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="left"]').value = position.x + 'px';
							this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="width"]').value = this.$.mounting.offsetWidth + 'px';
							this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="height"]').value = this.$.mounting.offsetHeight + 'px';
							this.$.mounting.style.position = 'fixed';
							this.$.fullscreenButton.icon = 'fullscreen-exit';
							this.$.fullscreenAnimation.play();
							break;
						case 'normal':
							this.$.fullscreenAnimation.direction = 'reverse';
							this.$.mounting.removeAttribute('resting');
							this.$.fullscreenButton.icon = 'fullscreen';
							break;
					}

					this.$.fullscreenAnimation.play();
				}
			}
		);
	}
)();