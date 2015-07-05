// ==UserScript==
// @name 	      CoachLaBrute
// @description Ajoute des métriques pour suivre la progression de ses brutes
// @id        	fr.tzi.CoachLaBrute
// @namespace 	http://tzi.fr
// @include 	  http://*.labrute.fr/cellule
// @include 	  http://*.labrute.fr/arene
// @grant 	    none
// @coypright   2015, Thomas ZILLIOX (http://tzi.fr)
// @license     MIT
// @oujs:author tzi
// @version 	  2015.07.05
// ==/UserScript==
(function () {
  var settings = {
  };
  var execute = function (settings) {
    var pointsByLevelMap = {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 21,
      6: 26,
      7: 32,
      8: 37,
      9: 43,
      10: 49,
      11: 55,
      12: 61,
      13: 68,
      14: 75,
      15: 81,
      16: 88,
      17: 95,
      18: 102,
      19: 109,
      20: 117,
      21: 124,
      22: 132,
      23: 139,
      24: 147,
      25: 155,
      26: 163,
      27: 171,
      28: 179,
      29: 187,
      30: 196,
      31: 204,
      32: 212,
      33: 221,
      34: 230,
      35: 238,
      36: 247,
      37: 256,
      38: 265,
      39: 273,
      40: 283,
      41: 292,
      42: 292
    };
    var page = document.location.href.replace(/.*\//, '');
    if (page == 'cellule') {
      customCellulePage();
    } 
    else if (page == 'arene') {
      customArenePage();
    }
    
    // Cellule page
    function customCellulePage() {
      // Check current level is accessible
      var levelLabelElement = document.querySelector('.level > span');
      if (!levelLabelElement) {
        return false;
      }
      var LevelRegexp = /Niveau ([0-9]*)/i;
      if (!LevelRegexp.test(levelLabelElement.innerHTML)) {
        return false;
      }
      
      // Query the main elements
      var rankingLabelElement = document.querySelector('.lvlTxt');
      var rankingContainerElement = document.querySelector('.levelName');
      var levelBarElement = document.querySelector('.levelBar');
      var levelBarContainer = document.querySelector('.levelBarContainer');
      // Minimize the ranking
      var isPadawan = !rankingLabelElement;
      appendStyle(rankingContainerElement, {
        'width': 'auto'
      });
      if (!isPadawan) {
        rankingLabelElement.innerHTML = '';
        appendStyle(levelLabelElement, {
          'line-height': '40px'
        });
      }
      
      // Enlarge the level bar
      appendStyle(levelBarContainer, {
        'width': 'auto',
        'height': '15px',
        'clear': 'both',
        'position': 'relative'
      });
      appendStyle(levelBarElement, {
        'height': '100%',
        'background-color': '#ff9900'
      });
      
      // Calculate the level metrics
      var currentLevel = LevelRegexp.exec(levelLabelElement.innerHTML) [1];
      if (!pointsByLevelMap[currentLevel]) {
        alert('Desole, mais nous ne connaissons pas encore la taille de votre niveau (' + currentLevel + ').');
        return false;
      }
      var currentLevelSize = pointsByLevelMap[currentLevel];
      var currentlevelProgress = Math.round(parseFloat(levelBarElement.style.width) / 100 * currentLevelSize);
      
      // Display the level metrics
      levelLabelElement.innerHTML += ' - ' + (getTotalPointByLevel(currentLevel) + currentlevelProgress) + 'pts';
      var levelMetricsElement = document.createElement('div');
      appendStyle(levelMetricsElement, {
        'position': 'absolute',
        'top': 0,
        'bottom': 0,
        'left': 0,
        'right': 0,
        'text-align': 'center',
        'color': 'white',
        'font-weight': 'bold',
        'font-size': '15px',
        'line-height': '15px'
      });
      levelMetricsElement.innerHTML = currentlevelProgress + ' / ' + currentLevelSize;
      levelBarContainer.appendChild(levelMetricsElement);
      
      // Add page on classement link
      var classement = document.querySelector('.headStats + .headStats .value a');
      var page = Math.ceil(classement.innerHTML / 15);
      var href = classement.getAttribute('href')+';page='+page;
      var classementLinks = document.querySelectorAll('.headStats + .headStats a');
      for (var i=0; i<classementLinks.length; i++) {
        classementLinks[i].setAttribute('href', href);
      }
      
      // Append Style 
      function appendStyle(element, styleMap) {
        var style = '';
        var oldStyle = element.getAttribute('style');
        if (oldStyle) {
          style = oldStyle.trim() + ' ';
        }
        for (var property in styleMap) {
          if (styleMap.hasOwnProperty(property)) {
            style += property + ': ' + styleMap[property] + '; ';
          }
        }
        element.setAttribute('style', style);
      }
      
      // Total Points of a Level
      function getTotalPointByLevel(level) {
        var totalPointByLevel = 0;
        for (var i = 1; i < level; i++) {
          totalPointByLevel += pointsByLevelMap[i];
        }
        return totalPointByLevel;
      }
    }
    
    // Arene page
    function customArenePage() {
      var vs;
      var subdivs;
      var divs = document.getElementsByTagName('div');
      for (var i = 0; i < divs.length; i++) {
        if (divs[i].className == 'miniCaracs') {
          vs = divs[i].getAttribute('onclick').replace(/.*\//, '');
          divs[i].removeAttribute('onclick');
          divs[i].removeAttribute('onmouseover');
          divs[i].removeAttribute('onmouseout');
          vs = vs.substr(0, vs.length - 2);
          subdivs = divs[i].getElementsByTagName('div');
          for (var j = 0; j < subdivs.length; j++) {
            if (subdivs[j].className == 'miniLvlTxt') {
              subdivs[j].innerHTML = '';
              subdivs[j].innerHTML = '<a href=\'/vs/' + vs + '\'>Combat</a> | <a href=\'http://' + vs + '.labrute.fr/cellule\'>Cellule</a>';
            }
          }
        }
      }
    }
  };
  var script = document.createElement('script');
  script.innerHTML = '(' + execute.toString() + ')( ' + JSON.stringify(settings) + ');';
  document.head.appendChild(script);
}) ();
