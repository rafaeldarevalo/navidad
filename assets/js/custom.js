
var baseURL = "assets/img/";

var w = window.innerWidth;
var h = window.innerHeight;

var rad = Math.PI / 180;

var size = { x: 1920, y: 980 };

var total = 400;
var snowflakes = [];

var linear = Linear.easeNone;
var sine = Sine.easeInOut;

var resize = debounce(resizeScene, 100);

var sprites = new PIXI.ParticleContainer(total, {
  scale: true,
  position: true,
  rotation: false,
  uvs: false,
  alpha: false
});

var app = new PIXI.Application(w, h, {
  view: document.querySelector("canvas"),
  backgroundColor: 0x111111,
  transparent: true,
  autoStart: false
});

var loader = new PIXI.loaders.Loader(baseURL)
  .add("snowflake", "snow.svg")  
  .load(init);

var stage = app.stage;

stage.alpha = 0;
stage.addChild(sprites);

//
// INIT
// ===========================================================================
function init(loader, assets) {
  
  for (var i = 0; i < total; i++) {

    var snowflake = new PIXI.Sprite(assets.snowflake.texture);

    snowflake.anchor.set(0.5);
    snowflake.scale.set(random(0.12, 0.02));
        
    snowflakes.push(snowflake);
    sprites.addChild(snowflake);
  }

  window.addEventListener("resize", resize);
  resize();
  
  app.start();
  
  TweenLite.to(stage, 1, { alpha: 1, delay: 0.25 });
}

//
// ANIMATE SNOWFLAKE
// ===========================================================================
function animateSnowflake(snowflake) {
  
  TweenMax.to(snowflake, random(1, 10), { x: "-=200", repeat: -1, yoyo: true, ease: sine });
  TweenMax.to(snowflake, random(1, 16), { y: h + 100, ease: linear, repeat: -1, delay: -15 });
}

//
// RESIZE SCENE
// ===========================================================================
function resizeScene() {

  w = window.innerWidth;
  h = window.innerHeight;

  var ratio = Math.max(w / size.x, h / size.y);

  app.renderer.resize(w, h);

  for (var i = 0; i < total; i++) {

    var snowflake = snowflakes[i];

    TweenLite.killTweensOf(snowflake);

    var x = random(-200, w + 200);
    var y = random(-200, -150);

    snowflake.position.set(x, y);
    
    animateSnowflake(snowflake);
  } 
}

//
// DEBOUNCE
// ===========================================================================
function debounce(callback, time) {
  var timeout;
  return function() {
    clearTimeout(timeout); 
    timeout = setTimeout(callback, time);
  };
}

//
// RANDOM
// ===========================================================================
function random(min, max) {
  if (max == null) { max = min; min = 0; }
  if (min > max) { var tmp = min; min = max; max = tmp; }
  return min + (max - min) * Math.random();
}

