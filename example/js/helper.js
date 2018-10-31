/*
 List of extensions:
  - DScript 1.0
  - DDevice 1.0
  - DMath 1.0
  - DArray 1.1
  - DObject 1.0
  - DLayoutCSS 1.0
  - DUpload 1.1
  - DLoader 1.0
  - DBrowser 1.0
*/

/* DBrowser - version 1.0
// detect: WebGL, Browser name,...
Author: Goon Nguyen
================================================== */

var DLoader = {
    arr: [],
    onComplete: null,
    onProgress: null,
    progress: 0,
    loadCount: 0,
    add: function(url){
        this.arr.push(url);
    },
    load: function(url){
        if(typeof url == "undefined"){
            // load list
            var curURL = DLoader.arr[DLoader.loadCount];
            var img = new Image();
            img.onload = function(){
                if(DLoader.loadCount >= DLoader.arr.length){
                    if(DLoader.onComplete != null) DLoader.onComplete();
                    // clear all events
                    DLoader.onProgress = DLoader.onComplete = null;
                } else {
                    DLoader.loadCount++;
                    curURL = DLoader.arr[DLoader.loadCount];
                    DLoader.load(curURL);
                }
                DLoader.progress = DLoader.loadCount / DLoader.arr.length;
                if(DLoader.onProgress != null) DLoader.onProgress(DLoader.progress);
            }
            img.src = url;
        } else {
            DLoader.progress = 0;
            // load single
            var img = new Image();
            img.onload = function(){
                DLoader.progress = 1;
                if(DLoader.onProgress != null) DLoader.onProgress(DLoader.progress);
                if(DLoader.onComplete != null) DLoader.onComplete();
                // clear all events
                DLoader.onProgress = DLoader.onComplete = null;
            }
            img.src = url;
        }
    },
    on: function(event, callback){
        if(event == "complete"){
            DLoader.onComplete = callback;
        }
        if(event == "progress"){
            DLoader.onProgress = callback;
        }
    }
}

/* DBrowser - version 1.0
// detect: WebGL, Browser name,...
Author: Goon Nguyen
================================================== */

var DBrowser = {
    get isSupportWebGL() {
        /*try {
            var canvas = document.createElement("canvas");
            if( !!window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) ){
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }*/
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                 names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
               context = false;

            for(var i=0;i<4;i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // else, return just true
                        return true;
                    }
                } catch(e) {
                    console.log("!")
                }
            }

            // WebGL is supported, but disabled
            return false;
        }

        // WebGL not supported
        return false;
    }
}

/* DScript - version 1.0
Author: Goon Nguyen
================================================== */

if (DScript == null && typeof DScript == "undefined") {
    var DScript = {
        version: 1,

        load: function(url, callback) {
            var done = false;
            var result = {
                status: false,
                message: ""
            };
            var script = document.createElement('script');
            script.setAttribute('src', url);

            script.onload = handleLoad;
            script.onreadystatechange = handleReadyStateChange;
            script.onerror = handleError;

            document.head.appendChild(script);

            function handleLoad() {
                if (!done) {
                    done = true;

                    result.status = true;
                    result.message = "Script was loaded successfully";

                    if (callback) callback(result);
                }
            }

            function handleReadyStateChange() {
                var state;

                if (!done) {
                    state = script.readyState;
                    if (state === "complete") {
                        handleLoad();
                    }
                }
            }

            function handleError() {
                if (!done) {
                    done = true;
                    result.status = false;
                    result.message = "Failed to load script."
                    if (callback) callback(result);
                }
            }
        },

        unload: function(url, callback) {
            var scripts = document.getElementsByTagName("script");
            var result = {
                status: false,
                message: ""
            };

            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                if (script.src) {
                    var src = script.src;
                    if (String(src).toLowerCase().indexOf(url.toLowerCase()) >= 0) {
                        script.parentElement.removeChild(script);
                        result.status = true;
                        result.message = "Unload script successfully.";
                    }
                }
            }

            if (!result.status) {
                result.message = "Script not found.";
            }

            if (callback) callback(result);

            return result;
        },

        isExisted: function(filename) {
            var scripts = document.getElementsByTagName("script");
            var existed = false;
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src) {
                    var src = scripts[i].src;
                    if (String(src).toLowerCase().indexOf(filename.toLowerCase()) >= 0) {
                        existed = true;
                    }
                    console.log(i, scripts[i].src)
                } else {
                    console.log(i, scripts[i].innerHTML)
                }
            }
            return existed;
        },

        loadList: function(array, callback) {
            var result = {
                status: false,
                message: ""
            };
            var count = 0;
            var total = array.length;
            //console.log("loadList")
            this.load(array[count], onComplete);

            function onComplete(result) {
                count++;
                //console.log(count, total)
                if (count == total) {
                    result.status = true;
                    result.message = "All scripts were loaded.";
                    if (callback) callback(result);
                } else {
                    DScript.load(array[count], onComplete);
                }
            }
        }
    }
}

/* DMath - version 1.0
Author: Goon Nguyen
================================================== */

var DMath = {
    random: function(number) {
        return number * Math.random();
    },
    randomInt: function(number) {
        return Math.floor(DMath.random(number));
    },
    randomPlusMinus: function(number) {
        return number * (Math.random() - Math.random());
    },
    randomIntPlusMinus: function(number) {
        return Math.round(DMath.randomPlusMinus(number));
    },
    randomFromTo: function(from, to) {
        return from + (to - from) * Math.random();
    },
    randomIntFromTo: function(from, to) {
        return Math.floor(DMath.randomFromTo(from, to));
    },

    angleRadBetween2Points: function(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    },

    angleDegBetween2Points: function(p1, p2) {
        return DMath.radToDeg(DMath.angleRadBetween2Points(p1, p2));
    },

    degToRad: function(deg) {
        return deg * Math.PI / 180;
    },

    radToDeg: function(rad) {
        return rad * 180 / Math.PI;
    },

    angleRadBetween3Points: function(A, B, C) {
        var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
        var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
        var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
        return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
    },

    getPointWithAngleAndRadius: function(angle, radius) {
        var p = {
            x: 0,
            y: 0
        };
        p.x = radius * Math.cos(angle);
        p.y = radius * Math.sin(angle);
        return p;
    },

    distanceBetweenPoints: function(p1, p2) {
        var x1 = p1.x;
        var y1 = p1.y;

        var x2 = p2.x;
        var y2 = p2.y;

        var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

        return d;
    }
}

/* DArray - version 1.1
Author: Goon Nguyen
================================================== */

var DArray = {
    remove: function(item, array) {
        var arr = array.slice(); // clone
        var index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    },

    clone: function(array){
        var arr = array.slice();
        return arr;
    },

    shuffle: function(array){
        var arr = array.slice();
        var currentIndex = arr.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }

        return arr;
    },

    getRandom: function(array){
        var randId = Math.floor( array.length * Math.random() );
        return array[randId];
    }
}

/* DObject - version 1.0
Author: Goon Nguyen
================================================== */

var DObject = {
    clone: function(object){
        return JSON.parse(JSON.stringify(object));
    },

    merge: function(object, toObject){
        var obj = DObject.clone(toObject);
        for(var key in object){
            var val = object[key];
            obj[key] = val;
        }
        return obj;
    }
}
