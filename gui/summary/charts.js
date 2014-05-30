
var Charts = (function(){

  var self, playerList = [1,2,3], dots = 110, curMetric = 1, axisLeft = 46, 

      metrics = {
        'Units':      {data:{}}, 
        'Buildings':  {data:{}}, 
        'Area':       {data:{}}, 
        'Food':       {data:{}}, 
        'Wood':       {data:{}}, 
        'Stone':      {data:{}}, 
        'Metal':      {data:{}},
      },

      players = {
        '1': {color: 'Blue',   visible: false},
        '2': {color: 'Red',    visible: false},
        '3': {color: 'Yellow', visible: false},
        '4': {color: 'Green',  visible: false},
        '5': {color: 'Violet', visible: false},
        '6': {color: 'Orange', visible: false},
        '7': {color: 'Turcis', visible: false},
        '8': {color: 'LightB', visible: false},
      };

  function each (o,fn){Object.keys(o).forEach(a => fn(a, o[a]));}
  function fmt  (){var a=Array.prototype.slice.apply(arguments),s=a[0].split("%s"),p=a.slice(1).concat([""]),c=0;return s.map(function(t){return t + p[c++];}).join('');}
  function randomize(player, metric){

    var i, data, dir, next, last = 0;

    metrics[metric].data[player] = [];
    data = metrics[metric].data[player];
    
    for (i=0; i<dots;i++){
      dir = Math.random() * 2 -1;
      next = (dir > 0) ? last + 8 : last -6;
      data.push(next);
      last = next;
    }

  }      

  function init(){

    var btn;

    each(players, function(p, player){
      btn = Engine.GetGUIObjectByName("chartPlayer" + p);
      if (btn){
        btn.hidden = true;              
      }
    });
    
    playerList.forEach(function(p){

      // print(fmt("init: player: %s\n", p));

      players[p].visible = true;

      each(metrics, function(name, data){
        randomize(p, name);
      });

      btn = Engine.GetGUIObjectByName("chartPlayer" + p);
      if (btn){
        btn.hidden = false;              
      }

    });

  }

  function togglePlayer(player){

    // print(fmt("togglePlayer: %s\n", player));

    var sprite = "chartPlayerDot" + player;
    
    players[player].visible = !players[player].visible;
    sprite = Engine.GetGUIObjectByName(sprite);
    sprite.sprite = players[player].visible ? "chartDotP" + player : "chartDotP0";
    showMetric(curMetric);

  }

  function showMetric(metric){

    var m = Object.keys(metrics)[metric];

    // Mark heading as active, deactivate others (TODO Use childnodes access instead for a much more elegant solution):
    selectPanel(metric, Object.keys(metrics)
            , {/*'sprite_background': 'bkBorderBlack',*/ 'textcolor': '200 200 255' }/*if active*/
            , {/*'sprite': '',*/ 'textcolor': '255 255 255'/*TODO Better inherit => leave blank.*/ }/*if inactive*/
            , 'chartMenuLabel'/*if sth. to prepend to bgToBeChangedObject*/
            , ''/*if sth. to append to object where style to be changed*/
            , false /* Is adjusting tab spacer desired? (Attention: Conflicts with main summary panel. Don't readjust!) */
            );

    // print(fmt("showMetric: %s, %s\n", metric, m));

    curMetric = metric;

    each(players, function(p, player){

      var data = metrics[m].data[p];

      print(fmt("showMetric: %s, p: %s, vis: %s\n", m, p, player.visible));

        for (var i = 0; i < dots; i++){

          var dot = "chartDot" + p + "[" + i + "]";
          dot = Engine.GetGUIObjectByName(dot);

          if (player.visible){

            var newSize = new GUISize();
            newSize.left = i * 8 + axisLeft;
            newSize.top = 400 - data[i];
            newSize.right = newSize.left + 8;
            newSize.bottom = newSize.top - 8;
            dot.size = newSize;
            dot.hidden = false;

          } else {
            if (dot){dot.hidden = true;}
          }

        }

    });

  }  

  return {
    action: function(metric, player){

      print(fmt("Charts.action: %s, %s\n", metric, player));

      if (!metric && !player){init(); showMetric(0); return;}
      if ( metric && !player){showMetric(metric); return;}
      if (!metric &&  player){togglePlayer(player); return;}

    }

  };


}());



function onTick() {
//    print('empty onTick in summary/charts.js'); // <-- TODO Bug? Triggered endlessly, thus flodding console if message printed!
}
