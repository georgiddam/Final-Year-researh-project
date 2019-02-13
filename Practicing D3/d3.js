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
        resizeContainerHeight = 0;
        resizeContainerWidth = 0;
        var longest = allPasswords[0].password.length;
        var maxSectors = 37;

        finalData = [];

        var sectors = [];
        for(var i=0; i<maxSectors; i++) {
            sectors.push([]);
        }

        for(var i = 0; i<passwordLD.length; i++) {
            var sec = getSector(passwordLD[i][0]);
            sectors[sec].push(passwordLD[i]);
        }

        for(var i=0; i<maxSectors; i++) {
            sectors[i].sort(comparator);
        }


        // Go inside the sector
        for(var i = 0; i<sectors.length; i++) {
            // Look at all the values for this sector
            for(var j = 0; j<sectors[i].length; j++) {

                var item = [];
                var radius = (sectors[i][j][1]);
                // Now take the position of each sector
                var angle = (Math.PI * 2) * (i/maxSectors) + ((Math.PI * 2) / maxSectors / sectors[i].length * j);
                var getY = Math.sin(angle)*radius;
                var getX = Math.cos(angle)*radius;
                setScaleSettings(getY, getX);
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

    function scaleSizeUp() {
        $(".buttonZoomIn").click(function() {
            for (var i = 0; i < finalData.length; i++) {
                finalData[i][0] = finalData[i][0] * 1.5;
                finalData[i][1] = finalData[i][1] * 1.5;
                var getY = finalData[i][0];
                var getX = finalData[i][1];
                setScaleSettings(getY, getX);
            }
            updatePassCircles();
        })
    }

    function scaleSizeDown() {
        $(".buttonZoomOut").click(function() {
            for (var i = 0; i < finalData.length; i++) {
                finalData[i][0] = finalData[i][0] / 1.5;
                finalData[i][1] = finalData[i][1] / 1.5;
                var getY = finalData[i][0];
                var getX = finalData[i][1];
                
                resizeContainerHeight = 0;
                resizeContainerWidth = 0;
                setScaleSettings(getY, getX);
            }
            updatePassCircles();
        })
    }

    function setScaleSettings(getY, getX) {

        if (getY < 0) {
            var temp = canvasSizeHeight + -(getY);

        } else if (getY > middleSectionY ) {
            var temp = canvasSizeHeight + (getY);
        }

        if (resizeContainerHeight < temp) {
            resizeContainerHeight = temp;
        }

        if (getX < 0) {
            var temp = canvasSizeWidth + -(getX);

        } else if (getX > middleSectionX ) {
            var temp = canvasSizeWidth + (getX);
        }

        if (resizeContainerWidth < temp) {
            resizeContainerWidth = temp;
        }
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

                    return changeColor(d);
                })

                .attr("class", "passCircle")
                .attr("cx", function(d) {
                    return ((d[1])+middleSectionX);
                })

                .attr("cy", function (d, i) {
                    return ((d[0])+middleSectionY);
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
        return hexString;
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
    scaleSizeUp();
    scaleSizeDown();

});


        // https://www.mathopenref.com/coordbasiccircle.html
        // https://www.maplesoft.com/support/help/maple/view.aspx?path=MathApps%2FStandardEquationofaCircle
