(
	function () {
	  var css = 'core-drag-avatar.square-editor {z-index: 100; margin: -50px 0 0 -50px; opacity: 0.7; pointer-events: all;} core-drag-avatar.square-editor > paper-shadow {background: white; cursor: move; cursor: url(/bower_components/square-editor/closedhand.cur), move; cursor: url(/bower_components/square-editor/closedhand.cur) 4 4, move;}';
		var style = document.createElement('style');
		if (style.styleSheet) style.styleSheet.cssText = css;
		else style.appendChild(document.createTextNode(css));
		document.getElementsByTagName('head')[0].appendChild(style);

		Polymer(
			{
			  absolutePosition: function () {
			    var element = this, pos = {x: 0, y: 0};

          while (element) {
            pos.x += element.offsetLeft;
            pos.y += element.offsetTop;
            element = element.offsetParent;
          }

          return pos;
			  },
			  childrenUpdated: function (observer, mutations) {
			    this.onMutation(this, this.childrenUpdated);

			    if (this.$.blocks.querySelector('content').getDistributedNodes().length === 0) {
  					var defaultBlock = document.createElement(this.defaultBlock);

  					if (defaultBlock) {
  						defaultBlock.mode = this.mode;
  						this.appendChild(defaultBlock);
  					}
			    }
			  },
			  clearBlocks: function () {
			    var blocks = this.$.blocks.querySelector('content').getDistributedNodes();

					for (var i = 0; i < blocks.length; i += 1) {
						this.removeChild(blocks[i]);
					}
			  },
				modeChanged: function () {
					if (['edit', 'view'].indexOf(this.mode) === -1) {
						this.mode = 'view';
						return;
					}

          var that = this;

          function setMode(blocks, mode) {
            for (var i = 0; i < blocks.length; i += 1) {
  						blocks[i].mode = mode;

              if (blocks[i].shadowRoot) {
                var content = blocks[i].shadowRoot.querySelector('content[select="[square-block],square-layout"]');

                if (content && content.getDistributedNodes) {
                  var child_blocks = content.getDistributedNodes();
                  setMode(child_blocks, mode);
                }
              }
  					}
          }

          setMode(this.$.blocks.querySelector('content').getDistributedNodes(), this.mode);
				},
				publish: {
					defaultBlock: 'square-block-text',
					mode: {
						value: 'view',
						reflect: true
					}
				},
				ready: function () {
					var that = this, insertionParent, insertionPoint;

          this.onMutation(this, this.childrenUpdated);

          this.$.blockChooser.addEventListener(
            'core-overlay-close-completed',
            function () {
              that.$.blockSearch.querySelector('input').value = '';

              var categories = that.querySelectorAll('[square-category]'), i, blocks, j;

              for (i = 0; i < categories.length; i += 1) {
                categories[i].mode = 'view';
                blocks = categories[i].querySelectorAll('[square-tile]');

                for (j = 0; j < blocks.length; j += 1) {
                  blocks[j].removeAttribute('search-result');
                }
              }
            }
          );

          this.$.blockSearch.querySelector('input').addEventListener(
            'input',
            function () {
              var categories = that.querySelectorAll('[square-category]'), i, blocks, j;

              if (this.value.length === 0) {
                for (i = 0; i < categories.length; i += 1) {
                  categories[i].mode = 'view';
                  blocks = categories[i].querySelectorAll('[square-tile]');

                  for (j = 0; j < blocks.length; j += 1) {
                    blocks[j].removeAttribute('search-result');
                  }
                }
              } else {
                for (i = 0; i < categories.length; i += 1) {
                  categories[i].mode = 'search';
                  blocks = categories[i].querySelectorAll('[square-tile]');

                  for (j = 0; j < blocks.length; j += 1) {
                    if (blocks[j].label.toLowerCase().indexOf(this.value.toLowerCase()) >= 0) {
                      blocks[j].setAttribute('search-result', '');
                    } else {
                      blocks[j].removeAttribute('search-result');
                    }
                  }
                }
              }
            }
          );

					this.addEventListener(
						'modeChanged',
						this.modeChanged
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

					this.addEventListener(
						'insertAbove',
						function (event) {
						  var contains = false, nodes = this.$.blocks.querySelector('content').getDistributedNodes();

              for (var i = 0; i < nodes.length; i += 1) {
                if (nodes[i].contains(event.path[0])) {
                  contains = true;
                  break;
                }
              }

							if (contains) {
							  insertionParent = event.path[0].parentNode;
								insertionPoint = event.path[0];
								this.$.blockChooser.opened = false;
								this.$.blockChooser.relatedTarget = event.path[0];
								this.$.blockChooser.opened = true;
							}
						}
					);

					this.addEventListener(
						'insertBelow',
						function (event) {
						  var contains = false, nodes = this.$.blocks.querySelector('content').getDistributedNodes();

              for (var i = 0; i < nodes.length; i += 1) {
                if (nodes[i].contains(event.path[0])) {
                  contains = true;
                  break;
                }
              }

							if (contains) {
							  insertionParent = event.path[0].parentNode;
								insertionPoint = event.path[0].nextSibling;
								this.$.blockChooser.opened = false;
								this.$.blockChooser.relatedTarget = event.path[0];
								this.$.blockChooser.opened = true;
							}
						}
					);

					this.$.blockChooser.addEventListener(
						'click',
						function (event) {
							if (event.target.hasAttribute('square-tile')) {
								that.$.blockChooser.opened = false;
                var block = document.createElement(event.target.block);
								block.mode = 'edit';
								insertionParent.insertBefore(block, insertionPoint);
								block.showOptions();
							}
						}
					);

					var shadow = document.createElement('paper-shadow');
					shadow.setAttribute('z', '5');

          this.$.blockChooser.addEventListener(
            'drag-start',
            function (event) {
							that.$.blockChooser.opened = false;
							event.detail.avatar.innerHTML = '';
							event.detail.avatar.classList.toggle('square-editor', true);
							shadow.innerHTML = '';
							shadow.appendChild(document.createElement(event.detail.event.target.tagName.toLowerCase()));
							event.detail.avatar.appendChild(shadow);
							that.$.blocks.style.pointerEvents = 'none';

							event.detail.drag = function (event) {
							};

							event.detail.drop = function (event) {
								event.avatar.classList.toggle('square-editor', false);
								event.avatar.innerHTML = '';
								that.$.blocks.style.pointerEvents = '';
							};
            }
          );

					this.$.blocks.addEventListener(
						'drag-start',
						function (event) {
						  if (that.mode === 'edit') {
                that.$.fabBackgroundAnimation.pause();
                that.$.fabBackgroundAnimation.direction = 'normal';
                that.$.fabBackgroundAnimation.cancel();
  							that.$.blockChooser.opened = false;
  							event.detail.event.target.style.display = 'none';
  							event.detail.avatar.innerHTML = '';
  							event.detail.avatar.classList.toggle('square-editor', true);
  							shadow.innerHTML = '';
  							shadow.appendChild(document.createElement(event.detail.event.target.tile));
  							event.detail.avatar.appendChild(shadow);
  							that.$.fabPositionAnimation.pause();
  							that.$.fabPositionAnimation.direction = 'normal';
  							that.$.fabPositionAnimation.play();
  							that.$.mounting.style.overflow = 'hidden';
  							that.$.blocks.style.pointerEvents = 'none';

                var old_target = that.$.mounting.querySelector('core-header-panel');

  							event.detail.drag = function (e) {
  							  e.avatar.style.pointerEvents = 'none';
  							  var target = that.shadowRoot.elementFromPoint(e.event.pageX, e.event.pageY);
  							  e.avatar.style.pointerEvents = 'all';

                  if (target !== old_target) {
                    old_target = target;
        						that.$.fabBackgroundAnimation.pause();

  								  if (target === that.$.fab) {
        							that.$.fabBackgroundAnimation.direction = 'normal';
  								  } else {
        							that.$.fabBackgroundAnimation.direction = 'reverse';
  								  }

        						that.$.fabBackgroundAnimation.play();
  							  }
  							};

                var disableContextMenu = function (e) {
                  e.stopPropagation();
                  e.preventDefault();
                  event.detail.drop(event.detail);
                  return false;
                };

                event.detail.avatar.addEventListener('contextmenu', disableContextMenu);

  							event.detail.drop = function (e) {
                  e.avatar.removeEventListener('contextmenu', disableContextMenu);

  								that.$.blocks.style.pointerEvents = '';
  								that.$.mounting.style.overflow = '';

  							  e.avatar.style.pointerEvents = 'none';
  							  var target = that.shadowRoot.elementFromPoint(e.event.pageX, e.event.pageY);
  							  e.avatar.style.pointerEvents = 'all';
  							  console.log(target);

  								if (target === that.$.fab) {
  									e.event.target.parentNode.removeChild(e.event.target);

  									if (that.$.blocks.querySelector('content').getDistributedNodes().length === 0) {
  										var defaultBlock = document.createElement(that.defaultBlock);

  										if (defaultBlock) {
  											defaultBlock.mode = that.mode;
  											that.appendChild(defaultBlock);
  										}
  									}

  									that.$.fabBackgroundAnimation.pause();
  									that.$.fabBackgroundAnimation.direction = 'reverse';
  									that.$.fabBackgroundAnimation.play();
  								} else {
  							    e.event.target.style.display = '';
  								}

  								e.avatar.classList.toggle('square-editor', false);
  								e.avatar.innerHTML = '';
  								that.$.fabPositionAnimation.pause();
  								that.$.fabPositionAnimation.direction = 'reverse';
  								that.$.fabPositionAnimation.play();
    							old_target = that.$.mounting.querySelector('core-header-panel');
  							};
						  }
						}
					);
				},
				save: function () {
				  var html = '', nodes = this.$.blocks.querySelector('content').getDistributedNodes();

          for (var i = 0; i < nodes.length; i += 1) {
            html += nodes[i].save();
          }

          return html;
				},
				toggleFullscreen: function () {
			    this.$.fullscreenAnimation.finish();

          var position = this.absolutePosition();

					this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="top"]').value = position.y + 'px';
					this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="right"]').value = (position.x + this.offsetWidth) + 'px';
					this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="bottom"]').value = (position.y + this.offsetHeight) + 'px';
					this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="left"]').value = position.x + 'px';
					this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="width"]').value = this.offsetWidth + 'px';
					this.$.fullscreenAnimation.querySelector('core-animation-keyframe core-animation-prop[name="height"]').value = this.offsetHeight + 'px';

					switch (this.$.fullscreenAnimation.direction) {
						case 'reverse':
						  document.body.style.overflow = 'hidden';
							this.$.fullscreenAnimation.direction = 'normal';
							this.$.fullscreenIcon.icon = 'fullscreen-exit';
							this.$.fullscreenIcon.setAttribute('title', 'Exit Fullscreen');
							break;
						case 'normal':
						  document.body.style.overflow = '';
							this.$.fullscreenAnimation.direction = 'reverse';
							this.$.fullscreenIcon.icon = 'fullscreen';
							this.$.fullscreenIcon.setAttribute('title', 'Enter Fullscreen');
							break;
					}

					this.$.fullscreenAnimation.play();
				},
				toggleMode: function () {
  		    switch (this.mode) {
  			    case 'edit':
  			      this.$.modeIcon.icon = 'create';
  						this.$.modeIcon.setAttribute('title', 'Edit');
  						this.mode = 'view';
  			      break;
  			    case 'view':
  			      this.$.modeIcon.icon = 'visibility';
  						this.$.modeIcon.setAttribute('title', 'Preview');
  						this.mode = 'edit';
  			      break;
  			  }
				}
			}
		);
	}
)();