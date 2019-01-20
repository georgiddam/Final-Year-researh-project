(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$( document ).ready(function() {
    var passwordLD = [];
    var allPasswords = passwordData.allPasswords
    var canvasSizeWidth = 850;
    var canvasSizeHeight = 850;

    var middleSectionX = canvasSizeWidth/2;
    var middleSectionY = canvasSizeHeight/2;
    var canvas = d3.select(".container").append("svg")
    var text = "";


    var resizeContainerHeight = 0;
    var resizeContainerWidth = 0;

    const fastLevenshtein = require('js-levenshtein');

    function comparator(a, b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    }

    function formulateData() {
        resizeContainerHeight = 0;
        resizeContainerWidth = 0;
        var longest = allPasswords[0].password.length;
        var minDistance = passwordLD[0][1];
        var maxDistance = passwordLD[0][1];
        finalData = [];
        for (var i = 1; i<passwordLD.length; i++) {
            var currentLength = allPasswords[i].password.length;
            if (longest < currentLength) {
                longest = currentLength
            }
            if(passwordLD[i][1] > maxDistance) {
                maxDistance = passwordLD[i][1];
            }
            if(passwordLD[i][1] < minDistance) {
                minDistance = passwordLD[i][1];
            }
        }
        var minRadius = 10;
        var maxRadius = 500;
        for(var i = 0; i<passwordLD.length; i++) {
            // console.log();
            var currentLength = allPasswords[i].password.length;
            var item = [];
            var radius = ((passwordLD[i][1] - minDistance) / (maxDistance-minDistance)) * (maxRadius - minRadius) + minDistance;
            var radian = ((Math.PI * 2) * (currentLength-1)) / longest;
            var getY = Math.sin(radian)*radius;
            if (getY < 0) {
                var temp = canvasSizeHeight + -(getY);
                // console.log(temp, canvasSizeHeight, getY);

            } else if (getY > middleSectionY ) {
                var temp = canvasSizeHeight + (getY);
            }

            if (resizeContainerHeight < temp) {
                resizeContainerHeight = temp;
            }
            // console.log("Highest height = " + resizeContainerHeight);
            var getX = Math.cos(radian)*radius;

            if (getX < 0) {
                var temp = canvasSizeWidth + -(getX);
                // console.log(temp, canvasSizeWidth, getX);

            } else if (getX > middleSectionX ) {
                var temp = canvasSizeWidth + (getX);
            }

            if (resizeContainerWidth < temp) {
                resizeContainerWidth = temp;
            }
            item.push(getY, getX, radius, passwordLD[i][0],passwordLD[i][1]);
            finalData.push(item);
        }
        updatePassCircles();
    }

    function createContainer() {
        // console.log("Creating Container");
        canvas
            .attr("width", canvasSizeWidth)
            .attr("height", canvasSizeHeight);
    }

    function resizeContainer() {
        $(".container").width(resizeContainerWidth)
        $(".container").height(resizeContainerHeight)
    }

    function resetCircle () {
        if ($(".passCircle")[0]) {
            $(".passCircle").remove();
        }
    }

    function updatePassCircles() {
        resizeContainer();
        resetCircle();
        passValue = $(".password").val();

        if (passValue.length != 0 && passValue.trim() != 0 ) {
            // [0] are names and [1] are distances
        canvas.selectAll("circle")
            .data(finalData)
            .enter()
                .append("circle")
                .on('click', function(d) {
                    displayData(d);
                })

                .attr("fill", function (d) {
                    var intColor = d[2];
                    hexString = intColor.toString(16);
                    hexString = hexString.replace(".", "");
                    if (hexString.length % 2) {
                        hexString = '0' + hexString;
                    }

                    if (hexString.length == 2){
                        hexString = hexString + hexString + hexString;
                    } else if (hexString.length == 4) {
                        hexString = hexString + hexString.substring(0,2);
                    } else if (hexString.length > 6) {
                        hexString.substring(0,6);
                    }
                    hexString = "#" + hexString;
                    return hexString;
                })

                .attr("class", "passCircle")
                .attr("cx", function(d) {
                    return (d[1]+middleSectionX);
                })

                .attr("cy", function (d, i) {
                    return (d[0]+middleSectionY);
                })

                // Radius will be just 5 for now
                .attr ("r", function (d) {
                    return 5;
                })
        }
    }

    function displayData(circle) {
        // console.log(circle);
        if ($(".circleData")[0]){
            $(".circleData").remove();
        }
        console.log($(".vortexed"));
        $(".pass-data").append( '<div class="circleData"> Unhashed Password : ' + circle[3] + '</div>');
        $(".pass-data").append( '<div class="circleData"> Distance from Tested : ' + circle[4] + '</div>');
    }

    function delay(callback, ms) {
        var timer = 0;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }

    function getPassword() {
        $( ".password" ).keyup(delay(function(e) {
            // length = $(".password").val().length;
            passwordLD = [];
            var passLength = allPasswords.length
            for (var i = 0; i< passLength; i++) {
                var lDistance = levenshtein(passwordData.allPasswords[i].password, $(".password").val());
                passwordLD.push([allPasswords[i].password, lDistance]);
            }
            passwordLD.sort(comparator);
            formulateData();
        }, 1000));
    }


    // https://stackoverflow.com/questions/18516942/fastest-general-purpose-levenshtein-javascript-implementation
    // Took code from here
    function levenshtein(s, t) {

        // var distance = fastLevenshtein(s, t)
        // return distance;
        if (s === t) {
            return 0;
        }
        var n = s.length, m = t.length;
        if (n === 0 || m === 0) {
            return n + m;
        }
        var x = 0, y, a, b, c, d, g, h, k;
        var p = new Array(n);
        for (y = 0; y < n;) {
            p[y] = ++y;
        }

        for (; (x + 3) < m; x += 4) {
            var e1 = t.charCodeAt(x);
            var e2 = t.charCodeAt(x + 1);
            var e3 = t.charCodeAt(x + 2);
            var e4 = t.charCodeAt(x + 3);
            c = x;
            b = x + 1;
            d = x + 2;
            g = x + 3;
            h = x + 4;
            for (y = 0; y < n; y++) {
                k = s.charCodeAt(y);
                a = p[y];
                if (a < c || b < c) {
                    c = (a > b ? b + 1 : a + 1);
                }
                else {
                    if (e1 !== k) {
                        c++;
                    }
                }

                if (c < b || d < b) {
                    b = (c > d ? d + 1 : c + 1);
                }
                else {
                    if (e2 !== k) {
                        b++;
                    }
                }

                if (b < d || g < d) {
                    d = (b > g ? g + 1 : b + 1);
                }
                else {
                    if (e3 !== k) {
                        d++;
                    }
                }

                if (d < g || h < g) {
                    g = (d > h ? h + 1 : d + 1);
                }
                else {
                    if (e4 !== k) {
                        g++;
                    }
                }
                p[y] = h = g;
                g = d;
                d = b;
                b = c;
                c = a;
            }
        }

        for (; x < m;) {
            var e = t.charCodeAt(x);
            c = x;
            d = ++x;
            for (y = 0; y < n; y++) {
                a = p[y];
                if (a < c || d < c) {
                    d = (a > d ? d + 1 : a + 1);
                }
                else {
                    if (e !== s.charCodeAt(y)) {
                        d = c + 1;
                    }
                    else {
                        d = c;
                    }
                }
                p[y] = d;
                c = a;
            }
            h = d;
        }
        return h;


    }
    getPassword();
    createContainer();

});


        // https://www.mathopenref.com/coordbasiccircle.html
        // https://www.maplesoft.com/support/help/maple/view.aspx?path=MathApps%2FStandardEquationofaCircle

},{"js-levenshtein":2}],2:[function(require,module,exports){
'use strict';
module.exports = (function()
{
  function _min(d0, d1, d2, bx, ay)
  {
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
  }

  return function(a, b)
  {
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    var len = vector.length - 1;

    for (; x < lb - 3;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = (x += 4);
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
  };
})();


},{}]},{},[1]);
