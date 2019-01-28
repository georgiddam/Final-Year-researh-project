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

    // const fastLevenshtein = require('js-levenshtein');

    function comparator(a, b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    }

    function getSector(pswd) {
        ascii = pswd.charCodeAt(0);

        // '0','9' are passwords starting with 0 to 9
        if(ascii >= 48 && ascii <= 57 )
            return ascii - 48;
        // 'a', 'z' are passwords starting 'a' to 'z'
        if( ascii >= 97 && ascii <= 122)
            return ascii - 87;
        // else is any other symbol
        return 36;
    }

    function formulateData() {
        // console.log("Test 1");
        resizeContainerHeight = 0;
        resizeContainerWidth = 0;
        var longest = allPasswords[0].password.length;
        var maxSectors = 37;
        // var minDistance = passwordLD[0][1];
        // var maxDistance = passwordLD[0][1];
        finalData = [];

        var sectors = [];
        for(var i=0; i<37; i++) {
            sectors.push([]);
        }

        for(var i = 0; i<passwordLD.length; i++) {
            var sec = getSector(passwordLD[i][0]);
            sectors[sec].push(passwordLD[i]);
        }

        for(var i=0; i<36; i++) {
            sectors[i].sort(comparator);
        }

        // for (var i = 1; i<passwordLD.length; i++) {
            // var currentLength = allPasswords[i].password.length;

            // console.log("Test 2");
            // if (maxSectors < currentLength) {
            //     maxSectors = currentLength
            // }

            // if(passwordLD[i][1] > maxDistance) {
            //     maxDistance = passwordLD[i][1];
            // }
            // if(passwordLD[i][1] < minDistance) {
            //     minDistance = passwordLD[i][1];
            // }
        // }
        // var minRadius = 10;
        // var maxRadius = 500;
        for(var i = 0; i<sectors.length; i++) {
            for(var j = 0; j<sectors[i].length; j++) {

                var item = [];
                var radius = (sectors[i][j][1]);
                // var radius = ((passwordLD[i][1] - minDistance) / (maxDistance-minDistance)) * (maxRadius - minRadius) + minDistance;

                var radian = (Math.PI * 2) * (i/maxSectors);
                var getY = Math.sin(radian)*radius;
                var getX = Math.cos(radian)*radius;
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

                if (getX < 0) {
                    var temp = canvasSizeWidth + -(getX);
                    // console.log(temp, canvasSizeWidth, getX);

                } else if (getX > middleSectionX ) {
                    var temp = canvasSizeWidth + (getX);
                }

                if (resizeContainerWidth < temp) {
                    resizeContainerWidth = temp;
                }
                item.push(getY, getX, radius, sectors[i][j][0],sectors[i][j][1]);
                finalData.push(item);
            }
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
        var basicScale = 15;
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

                    return changeColor(d);
                })

                .attr("class", "passCircle")
                .attr("cx", function(d) {
                    return ((d[1] * basicScale)+middleSectionX);
                })

                .attr("cy", function (d, i) {
                    return ((d[0]* basicScale)+middleSectionY);
                })

                // Radius will be just 5 for now
                .attr ("r", function (d) {
                    return 5;
                })
        }
    }

    function changeColor(d) {
        var hexString;
        radius = d[4];
        stripSingleDigit = 0;

        if(radius > 10 ) {
            stripSingleDigit = radius.toString().substring(1,2);
        }

        if(stripSingleDigit == "0") {
            stripSingleDigit = "00";
        } else {
            stripSingleDigit = stripSingleDigit*10;
        }

        switch (true) {
            case (radius < 10) :
                hexString = "#00FF" + (radius*10);
                break;
            case (radius < 20):
                hexString = "#0080" + stripSingleDigit;
                break;
            case (radius < 30):
                hexString = "#0000" + stripSingleDigit;
                break;
            case (radius < 40):
                hexString = "#00FF" + stripSingleDigit;
                break;
            case (radius < 50):
                hexString = "#0080" + stripSingleDigit;
                break;
            case (radius < 60):
                hexString = "#8080" + stripSingleDigit;
                break;
            default:
                hexString = "#000000";
        }
        // console.log(hexString);

        // var intColor = d[2];
        // hexString = intColor.toString(16);
        // hexString = hexString.replace(".", "");
        // if (hexString.length % 2) {
        //     hexString = '0' + hexString;
        // }

        // if (hexString.length == 2){
        //     hexString = hexString + hexString + hexString;
        // } else if (hexString.length == 4) {
        //     hexString = hexString + hexString.substring(0,2);
        // } else if (hexString.length > 6) {
        //     hexString.substring(0,6);
        // }
        // hexString = "#" + hexString;
        return hexString;
    }

    function displayData(circle) {
    //     // console.log(circle);
    //     if ($(".circleData")[0]){
    //         $(".circleData").remove();
    //     }
    //     $(".pass-data").append( '<div class="circleData"> Unhashed Password : ' + circle[3] + '</div>');
    //     $(".pass-data").append( '<div class="circleData"> Distance from Tested : ' + circle[4] + '</div>');
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
                passwordLD.push([allPasswords[i].password.toLowerCase(), lDistance]);
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
