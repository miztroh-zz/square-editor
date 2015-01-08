Polymer(
	{
	  contenteditableChanged: function () {
	    switch (this.mode) {
	      case 'edit':
	        this.contenteditable = true;
	        break;
	      default:
	        this.contenteditable = false;
	        break;
	    }
	  },
		distanceToToolbar: function (x, y) {
		  var new_toolbarDistance = this.super(arguments);

      if (this.$.formatsDropdown.opened) {
			  var formatsDropdownRect = this.$.formatsDropdown.getBoundingClientRect();

				var formatsDropdownDistance = this.pointPolygonDistance(
				  [
				    [formatsDropdownRect.left, formatsDropdownRect.top],
				    [formatsDropdownRect.right, formatsDropdownRect.top],
				    [formatsDropdownRect.right, formatsDropdownRect.bottom],
				    [formatsDropdownRect.left, formatsDropdownRect.bottom]
				  ],
				  [x, y],
				  'CCW'
				);

        if (formatsDropdownDistance < new_toolbarDistance) new_toolbarDistance = formatsDropdownDistance;

        if (new_toolbarDistance > 60) {
          this.$.formatsDropdown.opened = false;
        }
      }

      return new_toolbarDistance;
		},
		labelChanged: function () {
			this.label = 'Text';
		},
	  modeChanged: function () {
	    this.super();

      if (this.mode === 'edit') {
        this.setAttribute('contenteditable', '');
      } else {
        this.removeAttribute('contenteditable');
        this.$.toolbar.style.display = '';
      }
	  },
	  publish: {
	    contenteditable: {
	      value: false,
	      reflect: true
	    }
	  },
		ready: function () {
		  var that = this;

			this.super();

      var tools = Array.prototype.slice.call(this.$.tools.children, 0);

      for (var i = 0; i < tools.length; i += 1) {
        this.$.toolbar.appendChild(tools[i]);
      }

      require(
        {
          paths: {
            'scribe': '/bower_components/scribe/scribe',
            'scribe-plugin-curly-quotes': '/bower_components/scribe-plugin-curly-quotes/scribe-plugin-curly-quotes',
            'scribe-plugin-formatter-plain-text-convert-new-lines-to-html': '/bower_components/scribe-plugin-formatter-plain-text-convert-new-lines-to-html/scribe-plugin-formatter-plain-text-convert-new-lines-to-html',
            'scribe-plugin-heading-command': '/bower_components/scribe-plugin-heading-command/scribe-plugin-heading-command',
            'scribe-plugin-intelligent-unlink-command': '/bower_components/scribe-plugin-intelligent-unlink-command/scribe-plugin-intelligent-unlink-command',
            'scribe-plugin-keyboard-shortcuts': '/bower_components/scribe-plugin-keyboard-shortcuts/scribe-plugin-keyboard-shortcuts',
            'scribe-plugin-link-prompt-command': '/bower_components/scribe-plugin-link-prompt-command/scribe-plugin-link-prompt-command',
            'scribe-plugin-sanitizer': '/bower_components/scribe-plugin-sanitizer/scribe-plugin-sanitizer',
            'scribe-plugin-toolbar': '/bower_components/scribe-plugin-toolbar/scribe-plugin-toolbar'
          }
        },
        [
          'scribe',
          'scribe-plugin-curly-quotes',
          'scribe-plugin-formatter-plain-text-convert-new-lines-to-html',
          'scribe-plugin-heading-command',
          'scribe-plugin-intelligent-unlink-command',
          'scribe-plugin-keyboard-shortcuts',
          'scribe-plugin-link-prompt-command',
          'scribe-plugin-sanitizer',
          'scribe-plugin-toolbar'
        ],
        function (
          Scribe,
          scribePluginCurlyQuotes,
          scribePluginFormatterPlainTextConvertNewLinesToHtml,
          scribePluginHeadingCommand,
          scribePluginIntelligentUnlinkCommand,
          scribePluginKeyboardShortcuts,
          scribePluginLinkPromptCommand,
          scribePluginSanitizer,
          scribePluginToolbar
        ) {
          'use strict';

          var existingHTML = that.innerHTML;
          var scribe = new Scribe(that);

          scribe.on(
            'content-changed',
            function () {
              if (scribe.getHTML().length === 0) {
                if (scribe.allowsBlockElements()) {
                  scribe.setContent('<p>Write here...</p>');
                } else {
                  scribe.setContent('Write here...');
                }
              }
            }
          );

          var ctrlKey = function (event) { return event.metaKey || event.ctrlKey; };

          var commandsToKeyboardShortcutsMap = Object.freeze({
            bold: function (event) { return event.metaKey && event.keyCode === 66; }, // b
            italic: function (event) { return event.metaKey && event.keyCode === 73; }, // i
            undo: function (event) { return event.metaKey && event.keyCode === 90; }, // z
            redo: function (event) { return event.metaKey && event.keyCode === 89; }, // y
          });

          scribe.use(scribePluginHeadingCommand(1));
          scribe.use(scribePluginHeadingCommand(2));
          scribe.use(scribePluginHeadingCommand(3));
          scribe.use(scribePluginIntelligentUnlinkCommand());
          scribe.use(scribePluginLinkPromptCommand());
          scribe.use(scribePluginToolbar(that.$.toolbar));
          scribe.use(scribePluginCurlyQuotes());
          scribe.use(scribePluginKeyboardShortcuts(commandsToKeyboardShortcutsMap));

          scribe.use(scribePluginSanitizer({
            tags: {
              p: { style: true },
              br: {},
              b: {},
              strong: {},
              em: {},
              i: {},
              strike: {},
              blockquote: {},
              code: {},
              ol: {},
              ul: {},
              li: {},
              a: { href: true },
              h1: {},
              h2: {},
              h3: {}
            }
          }));

          scribe.use(scribePluginFormatterPlainTextConvertNewLinesToHtml());

          scribe.use(
            function (scribe) {
              var tag = '<p>';
              var nodeName = 'P';
              var commandName = 'p';

              /**
               * Chrome: the `heading` command doesn't work. Supported by Firefox only.
               */

              var headingCommand = new scribe.api.Command('formatBlock');

              headingCommand.execute = function () {
                if (this.queryState()) {
                  scribe.api.Command.prototype.execute.call(this, '<p>');
                } else {
                  scribe.api.Command.prototype.execute.call(this, tag);
                }
              };

              headingCommand.queryState = function () {
                var selection = new scribe.api.Selection();
                return !! selection.getContaining(function (node) {
                  return node.nodeName === nodeName;
                });
              };

              /**
               * All: Executing a heading command inside a list element corrupts the markup.
               * Disabling for now.
               */
              headingCommand.queryEnabled = function () {
                var selection = new scribe.api.Selection();
                var listNode = selection.getContaining(function (node) {
                  return node.nodeName === 'OL' || node.nodeName === 'UL';
                });

                return scribe.api.Command.prototype.queryEnabled.apply(this, arguments)
                  && scribe.allowsBlockElements() && ! listNode;
              };

              scribe.commands[commandName] = headingCommand;
            }
          );

          if (existingHTML.length === 0) {
            if (scribe.allowsBlockElements()) {
              scribe.setContent('<p>Write here...</p>');
            } else {
              scribe.setContent('Write here...');
            }
          } else {
            scribe.setContent(existingHTML);
          }
        }
      );

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
		  clone.contenteditable = false;
		  clone.innerHTML = this.innerHTML;
		  return clone.outerHTML;
		},
	  toggleFormats: function () {
	    this.$.formatsDropdown.toggle();
	  },
	  togglePasteAsPlainText: function () {
	    this.$.pasteAsPlainText.toggle();
	  }
	}
);