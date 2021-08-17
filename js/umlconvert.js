(function () {
'use strict';

/**
 * Targets special code or div blocks and converts them to UML.
 * @param {object} converter is the object that transforms the text to UML.
 * @param {string} className is the name of the class to target.
 * @param {object} settings is the settings for converter.
 * @return {void}
 */
var uml = (function (converter, className, settings) {

  var getFromCode = function getFromCode(parent) {
    // Handles <pre><code>
    var text = "";
    for (var j = 0; j < parent.childNodes.length; j++) {
      var subEl = parent.childNodes[j];
      if (subEl.tagName.toLowerCase() === "code") {
        for (var k = 0; k < subEl.childNodes.length; k++) {
          var child = subEl.childNodes[k];
          var whitespace = /^\s*$/;
          if (child.nodeName === "#text" && !whitespace.test(child.nodeValue)) {
            text = child.nodeValue;
            break;
          }
        }
      }
    }
    return text;
  };

  var getFromDiv = function getFromDiv(parent) {
    // Handles <div>
    return parent.textContent || parent.innerText;
  };

  // Change article to whatever element your main Markdown content lives.
  var article = document.querySelectorAll("article");
  var blocks = document.querySelectorAll("pre." + className + ",div." + className

  // Is there a settings object?
  );var config = settings === void 0 ? {} : settings;

  // Find the UML source element and get the text
  for (var i = 0; i < blocks.length; i++) {
    var parentEl = blocks[i];
    var el = document.createElement("div");
    el.className = className;
    el.style.visibility = "hidden";
    el.style.position = "absolute";

    var text = parentEl.tagName.toLowerCase() === "pre" ? getFromCode(parentEl) : getFromDiv(parentEl)

    // Insert our new div at the end of our content to get general
    // typset and page sizes as our parent might be `display:none`
    // keeping us from getting the right sizes for our SVG.
    // Our new div will be hidden via "visibility" and take no space
    // via `poistion: absolute`. When we are all done, use the
    // original node as a reference to insert our SVG back
    // into the proper place, and then make our SVG visilbe again.
    // Lastly, clean up the old node.
    ;
    article[0].appendChild(el);
    var diagram = converter.parse(text);
    diagram.drawSVG(el, config);
    el.style.visibility = "visible";
    el.style.position = "static";
    parentEl.parentNode.insertBefore(el, parentEl);
    parentEl.parentNode.removeChild(parentEl);
  }
});

(function () {
  var onReady = function onReady(fn) {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "interactive") {
          fn();
        }
      });
    }
  };

  onReady(function () {
    if (typeof flowchart !== "undefined") {
      uml(flowchart, "uml-flowchart");
    }

    if (typeof Diagram !== "undefined") {
      uml(Diagram, "uml-sequence-diagram", { theme: "simple" });
    }
  });
})();

}());
(function (document) {
  function convertUML(className, converter, settings) {
      var charts = document.querySelectorAll("pre." + className + ',div.' + className),
          arr = [],
          i, j, maxItem, diagaram, text, curNode,
          isPre;

      // Is there a settings object?
      if (settings === void 0) {
          settings = {};
      }

      // Make sure we are dealing with an array
      for(i = 0, maxItem = charts.length; i < maxItem; i++) arr.push(charts[i]);

      // Find the UML source element and get the text
      for (i = 0, maxItem = arr.length; i < maxItem; i++) {
          isPre = arr[i].tagName.toLowerCase() == 'pre';
          if (isPre) {
              // Handles <pre><code>
              childEl = arr[i].firstChild;
              parentEl = childEl.parentNode;
              text = "";
              for (j = 0; j < childEl.childNodes.length; j++) {
                  curNode = childEl.childNodes[j];
                  whitespace = /^\s*$/;
                  if (curNode.nodeName === "#text" && !(whitespace.test(curNode.nodeValue))) {
                      text = curNode.nodeValue;
                      break;
                  }
              }
              // Do UML conversion and replace source
              el = document.createElement('div');
              el.className = className;
              parentEl.parentNode.insertBefore(el, parentEl);
              parentEl.parentNode.removeChild(parentEl);
          } else {
              // Handles <div>
              el = arr[i];
              text = el.textContent || el.innerText;
              if (el.innerText){
                  el.innerText = '';
              } else {
                  el.textContent = '';
              }
          }

          if (className != "mermaid")
          {
              //flowchart.js sequence-diagram.js
              diagram = converter.parse(text);
              diagram.drawSVG(el, settings);
          }
          else
          {
              //mermaid
              //2017.12.5 add by Daphne
              //https://github.com/knsv/mermaid/issues/291
              var config = {
                  startOnLoad: false
              };
              //end add

              mermaid.mermaidAPI.initialize(config);
              //mermaid.mermaidAPI.initialize(settings); //remark by Daphne
              //console.log(mermaid.mermaidAPI.getConfig());
              var insertSvg = function(svgCode) {
                  el.innerHTML = svgCode;
              };

              mermaid.mermaidAPI.render(className + '-' + i.toString(), text, insertSvg);
          }
      }
  };

  function onReady(fn) {
      if (document.addEventListener) {
          document.addEventListener('DOMContentLoaded', fn);
      } else {
          document.attachEvent('onreadystatechange', function() {
              if (document.readyState === 'interactive')
                  fn();
          });
      }
  }

  onReady(function(){
      convertUML('uml-flowchart', flowchart);
      convertUML('uml-sequence-diagram', Diagram, {theme: 'simple'});
      convertUML('mermaid')
  });
})(document);