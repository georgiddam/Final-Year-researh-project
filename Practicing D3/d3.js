$( document ).ready(function() {
    // PCA (global);
    var length = 0;
    var canvas = null;
    var created = false;
    var locationData = [];
    var allPasswords = passwordData.allPasswords
    var canvasSize = 800;
    var middleSection = canvasSize/2;
    var text = "";

    // var fastLevenshtein = require('fast-levenshtein');


    function comparator(a, b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    }

    function getTheta() {
        var longest = allPasswords[0].password.length;
        var minDistance = locationData[0][1];
        var maxDistance = locationData[0][1];
        finalData = [];
        for (var i = 1; i<locationData.length; i++) {
            var currentLength = allPasswords[i].password.length;
            if (longest < currentLength) {
                longest = currentLength
            }
            if(locationData[i][1] > maxDistance) {
                maxDistance = locationData[i][1];
            }
            if(locationData[i][1] < minDistance) {
                minDistance = locationData[i][1];
            }
        }
        var minRadius = 10;
        var maxRadius = 500;
        for(var i = 0; i<locationData.length; i++) {
            // console.log();
            var currentLength = allPasswords[i].password.length;
            var item = [];
            var radius = ((locationData[i][1] - minDistance) / (maxDistance-minDistance)) * (maxRadius - minRadius) + minDistance;
            var radian = ((Math.PI * 2) * (currentLength-1)) / longest;
            var getY = Math.sin(radian)*radius;
            var getX = Math.cos(radian)*radius;
            item.push(getY, getX, radius, allPasswords[i].password,locationData[i][1]);
            finalData.push(item);
        }
        updatePassCircles();
    }

    function createContainer() {
        canvas = d3.select(".container")
        .append("svg")
        .attr("width", canvasSize)
        .attr("height", canvasSize);


    }

    function updatePassCircles() {

        // Check to remove/add new dots and text
        if (created) {
            $(".passCircle").remove();
            $(".displayPass").remove();
        }
        var getY = [];
        if ($(".password").val().length != 0 ) {

            text = canvas.append("text")
                .attr("class", "displayPass")
                .attr("x", middleSection)
                .attr("y", middleSection)
                .text($(".password").val());
            // Center the text, text-anchor is the property
            text.style("text-anchor", "middle")

            // Put the password circles in the canvas

                var unhashedPasswordCircles = canvas.selectAll("circle")

                // [0] are names and [1] are distances
                .data(finalData)
                .enter()
                    .append("circle")
                    .on('click', function(d) {
                        console.log(d);
                    })
                    .attr("fill", function (d) {
                        var intColor = d[2];
                        hexString = intColor.toString(16);
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
                        return (d[1]+middleSection);
                    })
                    .attr("cy", function (d, i) {
                        return (d[0]+middleSection);
                    })
                    // Radius will be just 5 for now
                    .attr ("r", function (d) {
                        return 5;
                    })
                    created = true;
            // console.log("reaches");
            // unhashedPasswordCircles.
        }
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
            length = $(".password").val().length;
            locationData = [];
            var passLength = allPasswords.length
            for (var i = 0; i< passLength; i++) {
                var lDistance = levenshtein(passwordData.allPasswords[i].password, $(".password").val());
                locationData.push([allPasswords[i].password, lDistance]);
            }
            locationData.sort(comparator);
            getTheta();
        }, 1000));
    }


    // https://stackoverflow.com/questions/18516942/fastest-general-purpose-levenshtein-javascript-implementation
    // Took code from here
    function levenshtein(s, t) {
        //
        // var distance = fastLevenshtein.get(s, t)
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
