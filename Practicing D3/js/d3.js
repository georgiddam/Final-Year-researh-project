$( document ).ready(function() {
    var passwordLD = [];
    var allPasswords = passwordData.allPasswords;

    var canvasSizeWidth = 850;
    var canvasSizeHeight = 850;
    var middleSectionX = canvasSizeWidth/2;
    var middleSectionY = canvasSizeHeight/2;
    var canvas = d3.select(".container").append("svg")
    var text = "";

    var resizeContainerHeight = 0;
    var resizeContainerWidth = 0;

    function createContainer() {
        // console.log("Creating Container");
        canvas
            .attr("width", canvasSizeWidth)
            .attr("height", canvasSizeHeight)
            .attr("class", "svgElement");
    }


    function getSector(pswd) {
        ascii = pswd.charCodeAt(0);

        // '0','9' are passwords starting with 0 to 9
        if(ascii >= 48 && ascii <= 57 )
            return ascii - 48;
        // 'a', 'z' are passwords starting 'a' to 'z'
        // TODO currently all uppercase are made into lowercase. I need to keep them uppercase and do them in extra sectors
        if( ascii >= 97 && ascii <= 122)
            return ascii - 87;
        // else is any other symbol
        return 36;
    }

    function createDataSectors() {
        // Total sectors, 0-9 + a-z + symbols = 37
        var maxSectors = 37;
        finalData = [];

        // Create the amount of sectors we will have
        var sectors = [];
        for(var i=0; i<maxSectors; i++) {
            sectors.push([]);
        }

        // pushes the value in the appropriate sector
        for(var i = 0; i<passwordLD.length; i++) {
            var sec = getSector(passwordLD[i][0]);
            sectors[sec].push(passwordLD[i]);
        }

//      Now we sort each sector alphabetically
        for(var i=0; i<maxSectors; i++) {
            sectors[i].sort(sortBySecondVal);
        }

        getCoordinates(maxSectors, sectors);
        // checkInitialScale();
        setScaleSettings();
        updatePassCircles();
    }

    // Get coordinates and push inside sectors
    function getCoordinates(maxSectors, sectors) {
        var t0 = performance.now();
        // Go inside the sector
        console.log(sectors[0][0][1]);
        for(var i = 0; i<sectors.length; i++) {
            // Look at all the values for this sector
            for(var j = 0; j<sectors[i].length; j++) {

                var radius = (sectors[i][j][1])*15;
                // Now take the position of each sector
                var angle = (Math.PI * 2) * (i/maxSectors) + ((Math.PI * 2) / maxSectors / sectors[i].length * j);
                var getY = (Math.sin(angle)*radius);
                var getX = (Math.cos(angle)*radius);
                // X, Y, radius(I might manipulate), name, true radius
                finalData.push([getY, getX, radius, sectors[i][j][0],sectors[i][j][1]]);
            }
        }
        var t1 = performance.now();
        console.log("Call to getCoordinates took " + (t1 - t0) + " milliseconds.")
    }


    // function checkInitialScale() {
    //     finalData.sort(sortBySecondVal);
    //     var getNegativeX =  Math.abs(finalData[finalData.length-1][1]);
    //     var getPositiveX = Math.abs(finalData[0][1]);
    //     finalData.sort(sortByFirstVal);
    //     var getNegativeY =  Math.abs(finalData[finalData.length-1][0]);
    //     var getPositiveY =  Math.abs(finalData[0][0]);
    //
    //     // Scale negative X
    //     var counter1 = 0;
    //     while(getNegativeX < 50) {
    //         counter1++;
    //         getNegativeX = getNegativeX * 2
    //     }
    //     getNegativeX = getNegativeX/2
    //
    //     // Scale positive X
    //     var counter2 = 0;
    //     while(getPositiveX < 50) {
    //         counter2++;
    //
    //         getPositiveX = getPositiveX * 2
    //     }
    //     getPositiveX = getPositiveX/2
    //
    //     // Scale negative Y
    //     var counter3 = 0;
    //     while(getNegativeY < 50) {
    //
    //         counter3++;
    //         getNegativeY = getNegativeY * 2
    //     }
    //     getNegativeY = getNegativeY/2
    //
    //     // Scale Positive Y
    //     var counter4 = 0;
    //     while(getPositiveY < 50) {
    //
    //         counter4++;
    //         getPositiveY = getPositiveY * 2
    //     }
    //     getPositiveY = getPositiveY/2
    //     scaleUp = (counter1 + counter2 + counter3 + counter4);
    //     if (scaleUp > 1) {
    //         for (var i = 0; i < finalData.length; i++) {
    //             finalData[i][0] = finalData[i][0] * scaleUp;
    //             finalData[i][1] = finalData[i][1] * scaleUp;
    //             var getY = finalData[i][0];
    //             var getX = finalData[i][1];
    //
    //             // setScaleSettings(getY, getX);
    //         }
    //         setScaleSettings();
    //     }
    // }



    function setScaleSettings() {
        var t0 = performance.now();

        finalData.sort(sortBySecondVal);
        var getNegativeX = finalData[finalData.length-1][1];
        var getPositiveX = finalData[0][1];
        finalData.sort(sortByFirstVal);
        var getNegativeY = finalData[finalData.length-1][0];
        var getPositiveY = finalData[0][0];

        // We add +5 so it doesn't touch corners
        var left = Math.abs(getPositiveX) + 5 ;
        var right = Math.abs(getNegativeX) + 5;
        var bottom = Math.abs(getNegativeY) + 5;
        var top = Math.abs(getPositiveY) + 5;
        resizeContainer(top, bottom, left, right);

        var t1 = performance.now();
        console.log("Call to setScaleSettings took " + (t1 - t0) + " milliseconds.")
    }


    function resizeContainer(top, bottom, left, right) {
        $(".container").css("paddingTop" , top)
        $(".container").css("paddingBottom" , bottom)
        $(".container").css("paddingLeft" , left)
        $(".container").css("paddingRight" , right)
    }

    function resetCircle () {
        if ($(".passCircle")[0]) {
            $(".passCircle").remove();
        }
    }

    function updatePassCircles() {
        var t0 = performance.now();

        resetCircle();
        passValue = $(".password").val();

        if (passValue.length != 0 && passValue.trim() != 0 ) {
            // [0] are names and [1] are distances
        var scale = 1;
        canvas.selectAll("circle")
            .data(finalData)
            .enter()
                .append("circle")
                .on('click', function(d) {
                    // displayData(d);
                })

                .attr("fill", function (d) {
                    return changeColor(d);
                })

                .attr("class", "passCircle")
                .attr("cx", function(d) {
                    return ((d[1]*scale)+middleSectionX);
                })

                .attr("cy", function (d, i) {
                    return ((d[0]*scale)+middleSectionY);
                })

                // Radius will be just 5 for now
                .attr ("r", function (d) {
                    return 5;
                })
        }
        var t1 = performance.now();
        console.log("Call to updatePassCircles took " + (t1 - t0) + " milliseconds.")
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
            case (radius < 5) :
                hexString = "#8000" + (radius*5);
                break;
            case (radius < 10):
                hexString = "#ff00" + stripSingleDigit;
                break;
            case (radius < 15):
                hexString = "#0066" + stripSingleDigit;
                break;
            case (radius < 25):
                hexString = "#0099" + stripSingleDigit;
                break;
            case (radius < 35):
                hexString = "#33cc" + stripSingleDigit;
                break;
            case (radius < 50):
                hexString = "#00cc" + stripSingleDigit;
                break;
            default:
                hexString = "#00ff00";
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

    function disableInputEnter() {
        $("input").keydown(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                getPassword();
            }
        })
    }

    function getPassword() {
        var t0 = performance.now();

        passwordLD = [];
        var passLength = allPasswords.length
        for (var i = 0; i< passLength; i++) {
            var lDistance = levenshtein(passwordData.allPasswords[i].password, $(".password").val());
            passwordLD.push([allPasswords[i].password.toLowerCase(), lDistance]);
        }
        passwordLD.sort(sortBySecondVal);

        var t1 = performance.now();
        console.log("Call to getPassword took " + (t1 - t0) + " milliseconds.")

        createDataSectors();
    }

    // Sort by 2nd value
        function sortBySecondVal(a, b) {
          if (a[1] < b[1]) return -1;
          if (a[1] > b[1]) return 1;
          return 0;
        }
    // Sort by 1st value
        function sortByFirstVal(a, b) {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          return 0;
        }

    function getDownload() {
        var svgData = $(".svgElement")[0].outerHTML;
        var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
        var downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(svgBlob);
        downloadLink.download = "getGraph.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

// -------------------- BUTTON FUNCTIONALITIES

    function downloadSVG() {
        $(".download").click(function() {
            getDownload();
        })
    }


    function scaleSizeUp() {
        $(".buttonZoomIn").click(function() {
            for (var i = 0; i < finalData.length; i++) {
                finalData[i][0] = finalData[i][0] * 1.5;
                finalData[i][1] = finalData[i][1] * 1.5;
                var getY = finalData[i][0];
                var getX = finalData[i][1];
                // setScaleSettings(getY, getX);
            }
            setScaleSettings();
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

                // setScaleSettings(getY, getX);
            }
            setScaleSettings();
            updatePassCircles();
        })
    }

    function toggleInfo() {
        $(".toggle").click(function() {
            var $toggle = $(".pass-data");
            $toggle.toggle();
        })
    }

    function renderPass() {
        $(".renderPass").click(function() {
            getPassword();
        })
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
    createContainer();
    scaleSizeUp();
    scaleSizeDown();
    downloadSVG();
    toggleInfo();
    renderPass();
    disableInputEnter();


});
