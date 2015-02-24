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

          var blocks = this.querySelectorAll('[square-block]');

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
					var that = this, insertionPoint;

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

          var insertAboveOrBelow = function (block, side) {
            if (['top', 'bottom'].indexOf(side) === -1) return;
					  var blocks = that.$.blocks.querySelector('content').getDistributedNodes();

            for (var i = 0; i < blocks.length; i += 1) {
              if (blocks[i].contains(block)) {
  							insertionPoint = {block: block, side: side};
  							that.$.blockChooser.opened = false;
  							that.$.blockChooser.relatedTarget = blocks[i];
  							that.$.blockChooser.opened = true;
                break;
              }
            }
          };

					this.addEventListener(
						'insertAbove',
						function (event) {
						  insertAboveOrBelow(event.path[0], 'top');
						}
					);

					this.addEventListener(
						'insertBelow',
						function (event) {
						  insertAboveOrBelow(event.path[0], 'bottom');
						}
					);

					this.$.blockChooser.addEventListener(
						'click',
						function (event) {
							if (event.target.hasAttribute('square-tile')) {
								that.$.blockChooser.opened = false;
                var block = document.createElement(event.target.block);
								block.mode = 'edit';

                if (insertionPoint.block.parentNode.tagName.toLowerCase() === 'square-block-layout' && insertionPoint.block.parentNode.direction === 'horizontal') {
                  var layout = document.createElement('square-block-layout');
                  layout.direction = 'vertical';
                  layout.mode = that.mode;
                  var parent = insertionPoint.block.parentNode;
                  var insertAt = insertionPoint.block.nextElementSibling;
                  layout.appendChild(insertionPoint.block);
                  layout.insertBefore(block, insertionPoint.side === 'top' ? insertionPoint.block : insertionPoint.block.nextElementSibling);
                  parent.insertBefore(layout, insertAt);
                } else {
								  insertionPoint.block.parentNode.insertBefore(block, insertionPoint.side === 'top' ? insertionPoint.block : insertionPoint.block.nextElementSibling);
                }

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

          var getInsertionPoint = function (x, y, highlight) {
            var blocks = that.querySelectorAll('[square-block]');
            var insertionPoint = false;

            for (var i = 0; i < blocks.length; i += 1) {
              if (blocks[i].style.display === 'none') continue;

              if (insertionPoint) {
                continue;
                blocks[i].$.border1.style.borderLeftColor = '';
                blocks[i].$.border2.style.borderLeftColor = '';
                blocks[i].$.border3.style.borderLeftColor = '';
                blocks[i].$.border1.style.borderTopColor = '';
                blocks[i].$.border2.style.borderTopColor = '';
                blocks[i].$.border3.style.borderTopColor = '';
                blocks[i].$.border1.style.borderRightColor = '';
                blocks[i].$.border2.style.borderRightColor = '';
                blocks[i].$.border3.style.borderRightColor = '';
                blocks[i].$.border1.style.borderBottomColor = '';
                blocks[i].$.border2.style.borderBottomColor = '';
                blocks[i].$.border3.style.borderBottomColor = '';
              }

              var rect = blocks[i].$.border2.getBoundingClientRect();

              var distLeft = Math.abs(
                blocks[i].pointPolygonDistance(
                  [
                    [rect.left - 5, rect.top - 5],
                    [rect.left + 5, rect.top + 5],
                    [rect.left + 5, rect.bottom - 5],
                    [rect.left - 5, rect.bottom + 5]
                  ],
                  [x, y],
                  'CCW'
                )
              );

              if (distLeft <= 10) {
                if (highlight) {
                  blocks[i].$.border1.style.borderLeftColor = 'black';
                  blocks[i].$.border2.style.borderLeftColor = 'black';
                  blocks[i].$.border3.style.borderLeftColor = 'black';
                }

                insertionPoint = {block: blocks[i], side: 'left'};
              } else {
                blocks[i].$.border1.style.borderLeftColor = '';
                blocks[i].$.border2.style.borderLeftColor = '';
                blocks[i].$.border3.style.borderLeftColor = '';
              }

              var distTop = Math.abs(
                blocks[i].pointPolygonDistance(
                  [
                    [rect.left - 5, rect.top - 5],
                    [rect.right + 5, rect.top - 5],
                    [rect.right - 5, rect.top + 5],
                    [rect.left + 5, rect.top + 5]
                  ],
                  [x, y],
                  'CCW'
                )
              );

              if (distTop <= 10 && !insertionPoint) {
                if (highlight) {
                  blocks[i].$.border1.style.borderTopColor = 'black';
                  blocks[i].$.border2.style.borderTopColor = 'black';
                  blocks[i].$.border3.style.borderTopColor = 'black';
                }

                insertionPoint = {block: blocks[i], side: 'top'};
              } else {
                blocks[i].$.border1.style.borderTopColor = '';
                blocks[i].$.border2.style.borderTopColor = '';
                blocks[i].$.border3.style.borderTopColor = '';
              }

              var distRight = Math.abs(
                blocks[i].pointPolygonDistance(
                  [
                    [rect.right - 5, rect.top + 5],
                    [rect.right + 5, rect.top - 5],
                    [rect.right + 5, rect.bottom + 5],
                    [rect.right - 5, rect.bottom - 5]
                  ],
                  [x, y],
                  'CCW'
                )
              );

              if (distRight <= 10 && !insertionPoint) {
                if (highlight) {
                  blocks[i].$.border1.style.borderRightColor = 'black';
                  blocks[i].$.border2.style.borderRightColor = 'black';
                  blocks[i].$.border3.style.borderRightColor = 'black';
                }

                insertionPoint = {block: blocks[i], side: 'right'};
              } else {
                blocks[i].$.border1.style.borderRightColor = '';
                blocks[i].$.border2.style.borderRightColor = '';
                blocks[i].$.border3.style.borderRightColor = '';
              }

              var distBottom = Math.abs(
                blocks[i].pointPolygonDistance(
                  [
                    [rect.left + 5, rect.bottom - 5],
                    [rect.right - 5, rect.bottom - 5],
                    [rect.right + 5, rect.bottom + 5],
                    [rect.left - 5, rect.bottom + 5]
                  ],
                  [x, y],
                  'CCW'
                )
              );

              if (distBottom <= 10 && !insertionPoint) {
                if (highlight) {
                  blocks[i].$.border1.style.borderBottomColor = 'black';
                  blocks[i].$.border2.style.borderBottomColor = 'black';
                  blocks[i].$.border3.style.borderBottomColor = 'black';
                }

                insertionPoint = {block: blocks[i], side: 'bottom'};
              } else {
                blocks[i].$.border1.style.borderBottomColor = '';
                blocks[i].$.border2.style.borderBottomColor = '';
                blocks[i].$.border3.style.borderBottomColor = '';
              }
            }

            return insertionPoint;
          };

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
  							  getInsertionPoint(e.event.pageX, e.event.pageY, true);

  							  e.avatar.style.pointerEvents = 'none';
  							  var target = that.shadowRoot.elementFromPoint(e.event.pageX, e.event.pageY);
  							  e.avatar.style.pointerEvents = 'all';

                  if (target && target !== old_target) {
                    if ((target === that.$.fab || old_target === that.$.fab)) {
                      that.$.fabBackgroundAnimation.pause();

                      if (target === that.$.fab) {
                        that.$.fabBackgroundAnimation.direction = 'normal';
                      } else {
                        that.$.fabBackgroundAnimation.direction = 'reverse';
                      }

                      that.$.fabBackgroundAnimation.play();
                    }

                    old_target = target;
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
  							  var insertionPoint = getInsertionPoint(e.event.pageX, e.event.pageY);

                  if (insertionPoint) {
                    insertionPoint.block.$.border1.style.borderLeftColor = '';
                    insertionPoint.block.$.border2.style.borderLeftColor = '';
                    insertionPoint.block.$.border3.style.borderLeftColor = '';
                    insertionPoint.block.$.border1.style.borderTopColor = '';
                    insertionPoint.block.$.border2.style.borderTopColor = '';
                    insertionPoint.block.$.border3.style.borderTopColor = '';
                    insertionPoint.block.$.border1.style.borderRightColor = '';
                    insertionPoint.block.$.border2.style.borderRightColor = '';
                    insertionPoint.block.$.border3.style.borderRightColor = '';
                    insertionPoint.block.$.border1.style.borderBottomColor = '';
                    insertionPoint.block.$.border2.style.borderBottomColor = '';
                    insertionPoint.block.$.border3.style.borderBottomColor = '';

                    var insertionPointInLayout = insertionPoint.block.parentNode.tagName.toLowerCase() === 'square-block-layout';

                    switch (insertionPoint.side) {
                      case 'top':
                        if (insertionPointInLayout && insertionPoint.block.parentNode.direction === 'horizontal') {
                          var layout = document.createElement('square-block-layout');
                          layout.direction = 'vertical';
                          layout.mode = that.mode;
                          insertionPoint.block.parentNode.insertBefore(layout, insertionPoint.block);
                          layout.appendChild(e.event.target);
                          layout.appendChild(insertionPoint.block);
                        } else {
                          insertionPoint.block.parentNode.insertBefore(e.event.target, insertionPoint.block);
                        }

                        break;
                      case 'bottom':
                        if (insertionPointInLayout && insertionPoint.block.parentNode.direction === 'horizontal') {
                          var layout = document.createElement('square-block-layout');
                          layout.direction = 'vertical';
                          layout.mode = that.mode;
                          insertionPoint.block.parentNode.insertBefore(layout, insertionPoint.block);
                          layout.appendChild(insertionPoint.block);
                          layout.appendChild(e.event.target);
                        } else {
                          insertionPoint.block.parentNode.insertBefore(e.event.target, insertionPoint.block.nextElementSibling);
                        }

                        break;
                      case 'left':
                        if (insertionPointInLayout && insertionPoint.block.parentNode.direction === 'horizontal') {
                          insertionPoint.block.parentNode.insertBefore(e.event.target, insertionPoint.block);
                        } else {
                          var layout = document.createElement('square-block-layout');
                          layout.mode = that.mode;
                          insertionPoint.block.parentNode.insertBefore(layout, insertionPoint.block);
                          layout.appendChild(e.event.target);
                          layout.appendChild(insertionPoint.block);
                        }

                        break;
                      case 'right':
                        if (insertionPointInLayout && insertionPoint.block.parentNode.direction === 'horizontal') {
                          insertionPoint.block.parentNode.insertBefore(e.event.target, insertionPoint.block.nextElementSibling);
                        } else {
                          var layout = document.createElement('square-block-layout');
                          layout.mode = that.mode;
                          insertionPoint.block.parentNode.insertBefore(layout, insertionPoint.block);
                          layout.appendChild(insertionPoint.block);
                          layout.appendChild(e.event.target);
                        }

                        break;
                    }
                  }

                  e.avatar.removeEventListener('contextmenu', disableContextMenu);

  								that.$.blocks.style.pointerEvents = '';
  								that.$.mounting.style.overflow = '';

  							  e.avatar.style.pointerEvents = 'none';
  							  var target = that.shadowRoot.elementFromPoint(e.event.pageX, e.event.pageY);
  							  e.avatar.style.pointerEvents = 'all';

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