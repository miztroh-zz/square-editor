Polymer(
	{
	  pointPolygonDistance: function (polygon, point, orientation) {
    	function robustScale (e, scale) {
    	  var n = e.length;

    	  if (n === 1) {
    	    var ts = twoProduct(e[0], scale);

    	    if (ts[0]) return ts;
    	    return [ts[1]];
    	  }

    	  var g = new Array(2 * n);
    	  var q = [0.1, 0.1];
    	  var t = [0.1, 0.1];
    	  var count = 0;
    	  twoProduct(e[0], scale, q);

    	  if (q[0]) g[count++] = q[0];

    	  for (var i = 1; i < n; ++i) {
    	    twoProduct(e[i], scale, t);
    	    var pq = q[1];
    	    twoSum(pq, t[0], q);

    	    if (q[0]) g[count++] = q[0];

    	    var a = t[1];
    	    var b = q[1];
    	    var x = a + b;
    	    var bv = x - a;
    	    var y = b - bv;
    	    q[1] = x;

    	    if(y) g[count++] = y;
    	  }

    	  if(q[1]) g[count++] = q[1];

    	  if(count === 0) g[count++] = 0.0;

    	  g.length = count;
    	  return g;
    	}

    	var SPLITTER = +(Math.pow(2, 27) + 1.0);

    	function twoProduct (a, b, result) {
    	  var x = a * b;

    	  var c = SPLITTER * a;
    	  var abig = c - a;
    	  var ahi = c - abig;
    	  var alo = a - ahi;

    	  var d = SPLITTER * b;
    	  var bbig = d - b;
    	  var bhi = d - bbig;
    	  var blo = b - bhi;

    	  var err1 = x - (ahi * bhi);
    	  var err2 = err1 - (alo * bhi);
    	  var err3 = err2 - (ahi * blo);

    	  var y = alo * blo - err3;

    	  if(result) {
    	    result[0] = y;
    	    result[1] = x;
    	    return result;
    	  }

    	  return [y, x];
    	}

    	function twoSum (a, b, result) {
    		var x = a + b;
    		var bv = x - a;
    		var av = x - bv;
    		var br = b - bv;
    		var ar = a - av;

    		if (result) {
    			result[0] = ar + br;
    			result[1] = x;
    			return result;
    		}

    		return [ar + br, x];
    	}

    	function scalarScalar (a, b) {
    	  var x = a + b;
    	  var bv = x - a;
    	  var av = x - bv;
    	  var br = b - bv;
    	  var ar = a - av;
    	  var y = ar + br;

    	  if (y) return [y, x];
    	  return [x];
    	}

    	function robustSum (e, f) {
    	  var ne = e.length | 0;
    	  var nf = f.length | 0;

    	  if (ne === 1 && nf === 1) return scalarScalar(e[0], f[0]);

    	  var n = ne + nf;
    	  var g = new Array(n);
    	  var count = 0;
    	  var eptr = 0;
    	  var fptr = 0;
    	  var abs = Math.abs;
    	  var ei = e[eptr];
    	  var ea = abs(ei);
    	  var fi = f[fptr];
    	  var fa = abs(fi);
    	  var a, b;

    	  if (ea < fa) {
    	    b = ei;
    	    eptr += 1;

    	    if (eptr < ne) {
    	      ei = e[eptr];
    	      ea = abs(ei);
    	    }
    	  } else {
    	    b = fi;
    	    fptr += 1;

    	    if (fptr < nf) {
    	      fi = f[fptr];
    	      fa = abs(fi);
    	    }
    	  }

    	  if ((eptr < ne && ea < fa) || (fptr >= nf)) {
    	    a = ei;
    	    eptr += 1;

    	    if (eptr < ne) {
    	      ei = e[eptr];
    	      ea = abs(ei);
    	    }
    	  } else {
    	    a = fi;
    	    fptr += 1;

    	    if (fptr < nf) {
    	      fi = f[fptr];
    	      fa = abs(fi);
    	    }
    	  }

    	  var x = a + b;
    	  var bv = x - a;
    	  var y = b - bv;
    	  var q0 = y;
    	  var q1 = x;
    	  var _x, _bv, _av, _br, _ar;

    	  while (eptr < ne && fptr < nf) {
    	    if (ea < fa) {
    	      a = ei;
    	      eptr += 1;

    	      if (eptr < ne) {
    	        ei = e[eptr];
    	        ea = abs(ei);
    	      }
    	    } else {
    	      a = fi;
    	      fptr += 1;

    	      if (fptr < nf) {
    	        fi = f[fptr];
    	        fa = abs(fi);
    	      }
    	    }

    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;

    	    if(y) g[count++] = y;

    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	  }

    	  while (eptr < ne) {
    	    a = ei;
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;

    	    if (y) g[count++] = y;

    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	    eptr += 1;

    	    if (eptr < ne) ei = e[eptr];
    	  }

    	  while (fptr < nf) {
    	    a = fi;
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;

    	    if (y) g[count++] = y;

    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	    fptr += 1;

    	    if (fptr < nf) {
    	      fi = f[fptr];
    	    }
    	  }

    	  if(q0) g[count++] = q0;

    	  if(q1) g[count++] = q1;

    	  if(!count) g[count++] = 0.0;

    	  g.length = count;
    	  return g;
    	}

    	function robustDeterminant2 (m) {
    		var p = twoProduct(m[0][0], m[1][1]);
    		var q = twoProduct(-m[1][0], m[0][1]);
    	  return robustSum(p, q);
    	}

    	function robustDeterminant3 (m) {
    	  var A = robustScale(robustDeterminant2([[m[1][1], m[1][2]], [m[2][1], m[2][2]]]), m[0][0]);
    	  var B = robustScale(robustDeterminant2([[m[1][0], m[1][2]], [m[2][0], m[2][2]]]), -m[0][1]);
    	  var C = robustScale(robustDeterminant2([[m[1][0], m[1][1]], [m[2][0], m[2][1]]]), m[0][2]);
    	  return robustSum(robustSum(A, B), C);
    	}

    	return (
    		function (polygon, point, orientation) {
    			var i;
    			var m = [[0,0,1],[0,0,1],[point[0], point[1],1]];
    			var min_pos = Number.MAX_VALUE;
    			var max_neg = -Number.MAX_VALUE;
    			var dist;
    			var u;

    			for (i = 0; i < polygon.length; i++) {
    				var idx1 = i;
    				var idx2 = (i + 1) % polygon.length;
    				m[0][0] = polygon[idx1][0];
    				m[0][1] = polygon[idx1][1];
    				m[1][0] = polygon[idx2][0];
    				m[1][1] = polygon[idx2][1];
    				var det = robustDeterminant3(m);
    				u = [polygon[idx2][0] - polygon[idx1][0], polygon[idx2][1] - polygon[idx1][1]];
    				var v = [point[0] - polygon[idx1][0], point[1] - polygon[idx1][1]];
    				var dot_u = (u[0] * u[0] + u[1] * u[1]);
    				var test = (u[0] * v[0] + u[1] * v[1]) / dot_u;

    				if(test <= 1 && test >= 0) {
    					dist = det / Math.sqrt(dot_u);

    					if(dist <= 0 && dist > max_neg) {
    						max_neg = dist;
    					} else if(dist < min_pos){
    						min_pos = dist;
    					}
    				}
    			}

    			if (min_pos == Number.MAX_VALUE && max_neg == -Number.MAX_VALUE) {
    				var tmp;
    				dist = Number.MAX_VALUE;

    				for (i = 0; i < polygon.length; i++) {
    					u = [point[0] - polygon[i][0], point[1] - polygon[i][1]];
    					tmp = Math.sqrt(u[0] * u[0] + u[1] * u[1]);

    					if (tmp < dist) {
    						dist = tmp;
    					}
    				}

    				if(orientation == "CCW") dist = -dist;
    			} else if(min_pos < -max_neg){
    				dist = min_pos;
    			} else{
    				dist = max_neg;
    			}

    			if (orientation == "CCW") {
    				dist = -dist;
    			}

    		  return dist;
    		}
    	)(polygon, point, orientation);
    },
		modeChanged: function () {
			if (['edit', 'view'].indexOf(this.mode) === -1) {
				this.mode = 'view';
				return;
			}

			this.fire('modeChanged');
		},
		publish: {
		  label: {
		    value: 'Block',
		    reflect: true
		  },
		  tile: {
		    value: 'square-tile',
		    reflect: true
		  },
			mode: {
				value: 'edit',
				reflect: true
			}
		},
		distanceToToolbar: function (x, y) {
		  var rect = this.$.toolbar.parentNode.getBoundingClientRect();

			var distance = this.pointPolygonDistance(
			  [
			    [rect.left, rect.top],
			    [rect.right, rect.top],
			    [rect.right, rect.bottom],
			    [rect.left, rect.bottom]
			  ],
			  [x, y],
			  'CCW'
			);

      return distance;
		},
		ready: function () {
			var that = this;

			this.addEventListener(
				'trackstart',
				function (event) {
					if (this.mode === 'edit' && Array.prototype.indexOf.call(event.path, this.$.toolbarLabel) === -1) {
						event.stopPropagation();
					}
				}
			);

			var topDropletDistance = 61;
			var bottomDropletDistance = 61;
			var toolbarDistance = 61;

			document.addEventListener(
				'mousemove',
				function (event) {
					if (that.mode === 'edit') {
					  //Toolbar animation

            var new_toolbarDistance = that.distanceToToolbar(event.pageX, event.pageY);

						if (new_toolbarDistance <= 60 && toolbarDistance > 60) {
							that.$.toolbarAnimation.pause();
							that.$.toolbarAnimation.direction = 'normal';
							that.$.toolbarAnimation.play();
						} else if (new_toolbarDistance > 60 && toolbarDistance <= 60) {
						  if (that.$.formatsDropdown.opened) that.$.formatsDropdown.toggle();
							that.$.toolbarAnimation.pause();
							that.$.toolbarAnimation.direction = 'reverse';
							that.$.toolbarAnimation.play();
						}

						toolbarDistance = new_toolbarDistance;

            //Droplet animations
						var border3Rect = that.$.border3.getBoundingClientRect();

						var new_topDropletDistance = parseInt(Math.abs(Math.sqrt(Math.pow(event.pageX - border3Rect.left, 2) + Math.pow(event.pageY - border3Rect.top, 2))));

						if (new_topDropletDistance <= 60 && topDropletDistance > 60) {
							that.$.topDropletAnimation.pause();
							that.$.topDropletAnimation.direction = 'normal';
							that.$.topDropletAnimation.play();
						} else if (new_topDropletDistance > 60 && topDropletDistance <= 60) {
							that.$.topDropletAnimation.pause();
							that.$.topDropletAnimation.direction = 'reverse';
							that.$.topDropletAnimation.play();
						}

						topDropletDistance = new_topDropletDistance;

						var new_bottomDropletDistance = parseInt(Math.abs(Math.sqrt(Math.pow(event.pageX - border3Rect.left, 2) + Math.pow(event.pageY - border3Rect.bottom, 2))));

						if (new_bottomDropletDistance <= 60 && bottomDropletDistance > 60) {
							that.$.bottomDropletAnimation.pause();
							that.$.bottomDropletAnimation.direction = 'normal';
							that.$.bottomDropletAnimation.play();
						} else if (new_bottomDropletDistance > 60 && bottomDropletDistance <= 60) {
							that.$.bottomDropletAnimation.pause();
							that.$.bottomDropletAnimation.direction = 'reverse';
							that.$.bottomDropletAnimation.play();
						}

						bottomDropletDistance = new_bottomDropletDistance;
					}
				}
			);

			this.$.matting.addEventListener(
				'click',
				function (event) {
					if (that.mode === 'edit') {
						if (event.target === that.$.topDroplet) that.fire('insertAbove');
						if (event.target === that.$.bottomDroplet) that.fire('insertBelow');
					}
				}
			);

			this.$.matting.addEventListener(
				'mouseover',
				function (event) {
					if (that.mode === 'edit') {
						if (event.target === that.$.topDroplet) this.setAttribute('topDroplet', '');
						if (event.target === that.$.bottomDroplet) this.setAttribute('bottomDroplet', '');
					}
				}
			);

			this.$.matting.addEventListener(
				'mouseout',
				function (event) {
					if (that.mode === 'edit') {
						if (event.target === that.$.topDroplet) this.removeAttribute('topDroplet');
						if (event.target === that.$.bottomDroplet) this.removeAttribute('bottomDroplet');
					}
				}
			);

      this.addEventListener(
        'dblclick',
        function (event) {
          if (this.mode === 'edit' && Array.prototype.indexOf.call(event.path, this.$.border3) >= 0) {
            this.showOptions();
          }
        }
      );

			this.modeChanged();
		},
		save: function () {
		  var clone = this.cloneNode();
		  clone.mode = 'view';
		  clone.innerHTML = this.innerHTML;
		  return clone.outerHTML;
		},
		showOptions: function() {
		}
	}
);