$( document ).ready(function() {
var length = 0;
var canvas = null;
var created = false;
var allPasswords = passwordData.allPasswords
    function svgExample() {
        canvas = d3.select(".container")
            .append("svg")
            .attr("width", 200)
            .attr("height", 200);

        var circle = canvas.append("circle")
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("r", 100)
            .attr("fill", "orange");

            update(canvas);

        var line = canvas.append("line")
            .attr("x1", 100)
            .attr("x2", 100)
            .attr("y1", 100)
            .attr("y2", 200)
            .attr("stroke", "grey")
            .attr("stroke-width", 2)

    }

    function update() {
        var locationData = [length, length]
        // console.log(locationData);
        if (created) {
            $(".passCircle").remove();
        }
        var passwords = canvas.selectAll("circle")
            .data(locationData)
            .enter()

                .append("circle")
                .attr("fill", "blue")
                .attr("class", "passCircle")
                .attr("cx", function(d, z) {
                    // console.log("test", d, i);
                    return 50 + d*2;
                })
                .attr("cy", function (d, i) {
                    // console.log(d, i);
                    return Math.random()*150;
                })
                .attr ("r", 5)


                created = true;
    }

    function getPassword() {



        $( ".password" ).keyup(function() {
          length = $(".password").val().length;
          for (var i = 0; i<allPasswords.length; i++){
              var lDistance = levenshteinDistance(passwordData.allPasswords[i].password, $(".password").val());
          }
          console.log(lDistance);
          update();
        });
    }

    function levenshteinDistance (s, t) {
        if (!s.length) return t.length;
        if (!t.length) return s.length;

        return Math.min(
            levenshteinDistance(s.substr(1), t) + 1,
            levenshteinDistance(t.substr(1), s) + 1,
            levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
        ) + 1;
    }

    console.log(passwordData);
    getPassword();
    svgExample();

});
