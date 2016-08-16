var c = document.getElementById("c");
var ctx = c.getContext("2d");
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;

function createHilbert(size){//size is a pow of 2
  var points = [
    [0,1],
    [0,0],
    [1,0],
    [1,1]
  ];
  //connections is not important because it is a non intersecting curve
  var newPoints;
  for(var i=1; i<Math.log(size)/Math.log(2); i++){
    newPoints = [];
    var add = Math.pow(2, i);
    //bottom left quadrant
    var subAdd = points[points.length - 1][0];
    for(var j=0; j<points.length; j++){
      newPoints.push([-points[j][1] + add - 1, -points[j][0] + 2*add - 1]);//flip over y=x, shift down
    }
    
    //top left quadrant stays same
    for(var j=0; j<points.length; j++){
      newPoints.push([points[j][0], points[j][1]]);//no translation
    }
    
    //top right
    for(var j=0; j<points.length; j++){
      newPoints.push([points[j][0] + add, points[j][1]]);//shift right
    }
    //bottom right
    for(var j=0; j<points.length; j++){
      newPoints.push([points[j][1] + add, points[j][0] + add]);//shift right
    }
    points = newPoints;
  }
  return points;
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {//source: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s; v = h.v; h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function animateCurve(curve, lineWidth, colorScalar, colorOffset, posScalar, posOffset, speed){
  if(colorScalar === undefined){
    colorScalar = 1;
  }
  
  if(colorOffset === undefined){
    colorOffset = 0;
  }

  if(posScalar === undefined){
    posScalar = 1;
  }

  if(posOffset === undefined){
    posOffset = 0;
  }
  
  if(lineWidth === undefined){
    ctx.lineWidth = 1;
  }else{
    ctx.lineWidth = lineWidth;
  }
  
  if(speed === undefined){
    speed = 1;
  }
  
  var k = 0;
  var inter = setInterval(
    function(){
      var color = HSVtoRGB(colorScalar*k/m.length + colorOffset, 1, 0.85);
      ctx.strokeStyle = "rgb("+color.r+","+color.g+","+color.b+")";
      ctx.beginPath();
      ctx.moveTo(curve[k][0]*posScalar + posOffset, curve[k][1]*posScalar + posOffset);
      ctx.lineTo(curve[k + 1][0]*posScalar + posOffset, curve[k + 1][1]*posScalar + posOffset);
      ctx.closePath();
      ctx.stroke();
      
      if(++k >= curve.length){
        window.clearInterval(inter);
      }
    },
  speed);
}

function drawCurve(curve, lineWidth, colorScalar, colorOffset, posScalar, posOffset){
  if(colorScalar === undefined){
    colorScalar = 1;
  }
  
  if(colorOffset === undefined){
    colorOffset = 0;
  }

  if(posScalar === undefined){
    posScalar = 1;
  }

  if(posOffset === undefined){
    posOffset = 0;
  }
  
  if(lineWidth === undefined){
    ctx.lineWidth = 1;
  }else{
    ctx.lineWidth = lineWidth;
  }
  
  for(var k=0; k<curve.length; k++){
    var color = HSVtoRGB(colorScalar*k/curve.length + colorOffset, 1, 0.85);
    ctx.strokeStyle = "rgb("+color.r+","+color.g+","+color.b+")";
    ctx.beginPath();
    ctx.moveTo(curve[k][0]*posScalar + posOffset, curve[k][1]*posScalar + posOffset);
    ctx.lineTo(curve[k + 1][0]*posScalar + posOffset, curve[k + 1][1]*posScalar + posOffset);
    ctx.closePath();
    ctx.stroke();
  }
}

var m = createHilbert(512);
drawCurve(m, 2, 1/3, 1/3);