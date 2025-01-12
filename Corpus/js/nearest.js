(function(a){var b=a([1]);a.fn.each2=function(d){var c=-1;while((b.context=b[0]=this[++c])&&d.call(b[0],c,b)!==false){}return this}})(jQuery);(function(b,c){function a(g,s,f){g||(g="div");var i=b(g),n=[],p=!!s.furthest,l=!!s.checkHoriz,j=!!s.checkVert,d=p?0:Infinity,r=parseInt(s.x,10)||0,q=parseInt(s.y,10)||0,m=parseInt(r+s.w,10)||r,k=parseInt(q+s.h,10)||q,e=!!b.fn.each2,h=Math.min,o=Math.max;if(!s.includeSelf&&f){i=i.not(f)}i[e?"each2":"each"](function(I,L){var u=e?L:b(this),N=u.offset(),A=N.left,z=N.top,B=u.outerWidth(),J=u.outerHeight(),K=A+B,t=z+J,P=o(A,r),G=h(K,m),v=o(z,q),O=h(t,k),F=G>=P,E=O>=v,D=F?0:P-G,C=E?0:v-O,H=F||E?o(D,C):Math.sqrt(D*D+C*C),M=p?H>d:H<d;if((l&&j)||(!l&&!j&&F&&E)||(l&&E)||(j&&F)){if(M){n=[];d=H}if(H==d){n.push(this)}}});return n}b.each(["nearest","furthest","touching"],function(e,d){var f={x:0,y:0,w:0,h:0,furthest:d=="furthest",includeSelf:false,checkHoriz:d!="touching",checkVert:d!="touching"};b[d]=function(h,g,i){if(!h||h.x===c||h.y===c){return b([])}var j=b.extend({},f,h,i||{});return b(a(g,j))};b.fn[d]=function(g,h){var j;if(g&&b.isPlainObject(g)){j=b.extend({},f,g,h||{});return this.pushStack(a(this,j))}var k=this.offset(),i={x:k.left,y:k.top,w:this.outerWidth(),h:this.outerHeight()};j=b.extend({},f,i,h||{});return this.pushStack(a(g,j,this))}})})(jQuery);

(function ($) {
    var isClicked = false;
    $.fn.vortex = function (radius) {
        if (radius === undefined) {
            radius = 9;
        }

        var radiusSquared = Math.pow(radius, 2),
            diameter = radius * 2,
            $previouslyChanged = $();

        // $(this).html($(this).text().replace(/(\S+)/g, '<span class="vortext">$1</span>'));

        $(document).click(function (event) {
        isClicked = false;
        $(".passCircle").click(function() {
            isClicked = true;
            console.log(isClicked);
            $(".circleData").remove();

        })

            var willChange = [];

            $('.passCircle').nearest({
                x: event.pageX - radius,
                y: event.pageY - radius,
                w: diameter,
                h: diameter
            }).filter(function () {
                var $element = $(this),
                    coordinates = $element.offset(),
                    height = $element.height(),
                    width = $element.width(),
                    left = coordinates.left - event.pageX,
                    top = coordinates.top - event.pageY;

                // broken up for readability (sorry for the duplicate code?)
                if (Math.pow(left, 2) + Math.pow(top, 2) <= radiusSquared) {
                    willChange.push(this);
                    return true;
                }
                if (Math.pow(left + width, 2) + Math.pow(top, 2) <= radiusSquared) {
                    willChange.push(this);
                    return true;
                }
                if (Math.pow(left + width, 2) + Math.pow(top + height, 2) <= radiusSquared) {
                    willChange.push(this);
                    return true;
                }
                if (Math.pow(left, 2) + Math.pow(top + height, 2) <= radiusSquared) {
                    willChange.push(this);
                    return true;
                }
                return false;
            });
            $previouslyChanged.removeClass('vortexed');
            $previouslyChanged = $(willChange).addClass('vortexed');
            $changed = $(".vortexed")
            // console.log($changed);
            displayData($changed);
        });
    };

    function displayData(data) {


        // console.log(data);
        for (var i = 0; i < data.length; i++) {
            // console.log(data[i]);
            newData = data[i].__data__
            $(".pass-data").append( '<div class="circleData"> Unhashed Password : ' + newData[3] + '</div>');
            $(".pass-data").append( '<div class="circleData"> Distance from Tested : ' + newData[4] + '</div>');
        }
    }

    $(document).ready(function () {
        $('body').vortex();
    });
}(jQuery));


// http://jsfiddle.net/fuYHv/14/
