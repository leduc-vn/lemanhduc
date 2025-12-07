jQuery(document).ready(function () {
  initMusic();
  giftOpen();
  // Make the invisible SVG hover area clickable and forward to the gift click
  try {
    var $hover = jQuery("#hover");
    if ($hover && $hover.length) {
      // Ensure it receives pointer events and indicates clickable
      $hover.css({ cursor: "pointer" });
      // For SVG elements, set the attribute for pointer events
      $hover.attr("pointer-events", "visible");
      $hover.on("click", function () {
        console.log("SVG #hover clicked — forwarding to section.gift click");
        jQuery("section.gift").trigger("click");
        // Fallback: directly force the card elements visible in case CSS/animation blocks normal show
        try {
          var $merry = jQuery("#merry");
          var $box = jQuery("#box");
          if ($merry && $merry.length) {
            $merry.removeAttr("hidden").css({
              display: "block",
              visibility: "visible",
              opacity: 1,
              "z-index": 9999,
            });
            console.log("SVG click: forced #merry visible");
          }
          if ($box && $box.length) {
            $box
              .removeAttr("hidden")
              .fadeIn(600)
              .css({ visibility: "visible", opacity: 1, "z-index": 9999 });
            console.log("SVG click: forced #box visible");
          }
          // Ensure modal fallback shows the card as well
          try {
            showCardModal();
          } catch (e) {
            console.warn("showCardModal() failed", e);
          }
          try {
            showCardModal();
          } catch (e) {
            console.warn("showCardModal() failed", e);
          }
        } catch (e) {
          console.warn("SVG click: fallback show failed", e);
        }
      });
    }
  } catch (e) {
    console.warn("Could not attach #hover click handler", e);
  }
});

// Background music initialization (local file)
var bgAudio = null;
function initMusic() {
  // Place a file named `music.mp3` next to this HTML file (same folder)
  // e.g. d:\noel\html\music.mp3
  try {
    bgAudio = new Audio("music.mp3");
    bgAudio.loop = true;
    bgAudio.volume = 0.3; // 30% volume by default
    bgAudio.preload = "auto";
    // Attach events for debugging
    bgAudio.addEventListener("canplay", function () {
      console.log("bgAudio: canplay");
    });
    bgAudio.addEventListener("playing", function () {
      console.log("bgAudio: playing");
    });
    bgAudio.addEventListener("play", function () {
      console.log("bgAudio: play event");
    });
    bgAudio.addEventListener("error", function (e) {
      console.warn("bgAudio: error", e);
    });
  } catch (e) {
    console.warn("Could not initialize background audio", e);
    bgAudio = null;
  }
}

// Show a fallback modal with the card content (ensures user always sees the card)
function showCardModal() {
  try {
    // If modal already exists, show it
    if (jQuery("#card-modal").length) {
      jQuery("#card-modal").fadeIn(200);
      return;
    }

    var $modal = jQuery('<div id="card-modal"/>');
    $modal.css({
      position: "fixed",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      "background-color": "rgba(0,0,0,0.6)",
      "z-index": 2147483000,
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    });

    var $container = jQuery('<div class="card-container"/>');
    $container.css({
      padding: "20px",
      "border-radius": "8px",
      "max-width": "90%",
      "max-height": "90%",
      overflow: "auto",
      position: "relative",
    });

    // Force red theme: use the red background + white text
    $container.addClass("card-theme-red");

    // Card title
    var $title = jQuery('<div class="card-title">Merry Christmas</div>');
    $title.css({
      "text-align": "center",
      "font-size": "28px",
      "font-family": "'Great Vibes', cursive",
      padding: "12px 0",
    });
    $container.append($title);

    // Create a simple Christmas card content (no snowman image)
    var $cardFace = jQuery('<div class="card-face"/>');
    $cardFace.css({
      background: "transparent",
      color: "#fff",
      padding: "12px 6px",
      "text-align": "center",
    });

    var $greeting = jQuery('<h2 class="card-greeting"/>').text("").css({
      margin: "6px 0",
      "font-size": "42px",
      "font-family": "'Great Vibes', cursive",
    });
    var messageText =
      "Chúc em bé của anh một mùa Giáng Sinh an lành và hạnh phúc.\n" +
      "Mong rằng những điều tốt đẹp nhất sẽ đến với em trong năm mới sắp tới.\n" +
      "Anh luôn ở đây bên em, chia sẻ mọi khoảnh khắc đáng nhớ.\n" +
      "Giáng Sinh vui vẻ nhé, Thu Hà của anh <3";
    var $message = jQuery('<p class="card-message"/>').text("").css({
      margin: "6px 0 12px",
      "font-size": "20px",
      "line-height": "1.4",
    });
    var $from = jQuery('<div class="card-from"/>').text("— Lê Mạnh Đức ").css({
      "margin-top": "10px",
      "font-size": "16px",
      opacity: 0.95,
    });

    $cardFace.append($greeting, $message, $from);
    $container.append($cardFace);

    var $close = jQuery(
      '<button class="card-close" aria-label="Close card"><span aria-hidden="true">✕</span></button>'
    );
    $close.on("click", function () {
      $modal.fadeOut(200);
    });

    // append close inside container so it's positioned relative to the card
    $container.append($close);
    $modal.append($container);
    jQuery("body").append($modal);
    $modal.hide().fadeIn(200, function () {
      // after modal visible, animate greeting then message
      try {
        animateText($greeting, $greeting.text(), 60);
        // start message after greeting approximately finishes
        setTimeout(function () {
          animateText($message, messageText, 40);
        }, $greeting.text().length * 60 + 150);
      } catch (e) {
        console.warn("animateText failed", e);
      }
    });
  } catch (e) {
    console.warn("showCardModal error", e);
  }
}

// Animate text by revealing characters one by one. Supports '\n' as newline.
function animateText($el, text, interval) {
  $el.empty();
  var i = 0;
  function step() {
    if (i >= text.length) return;
    var ch = text.charAt(i);
    if (ch === "\n") {
      $el.append("<br/>");
      i++;
      // small pause after newline
      setTimeout(step, interval);
      return;
    }
    var $span = jQuery("<span/>")
      .text(ch)
      .css({ opacity: 0, "white-space": "pre" });
    $el.append($span);
    $span.animate({ opacity: 1 }, 120);
    i++;
    setTimeout(step, interval);
  }
  step();
}

//Gift Open

function giftOpen() {
  // Use .one so the music starts only the first time user opens the gift
  jQuery("section.gift").one("click", function () {
    jQuery(".error").hide();
    jQuery(".lbWrapper,.lbWrapper .signupWrapper").hide();
    jQuery(".gift-top").removeClass("hovered");
    jQuery(".gift-text").hide();

    jQuery(".gift-final-text").show();
    // Play background music (local file) when gift is opened
    console.log("giftOpen: gift clicked");
    if (typeof bgAudio !== "undefined" && bgAudio) {
      console.log(
        "giftOpen: attempting to play bgAudio, readyState=",
        bgAudio.readyState
      );
      try {
        bgAudio.currentTime = 0;
        var playPromise = bgAudio.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(function () {
              console.log("bgAudio.play() resolved (playing)");
            })
            .catch(function (err) {
              console.warn("bgAudio.play() rejected:", err);
            });
        }
      } catch (e) {
        console.warn("Error playing audio", e);
      }
    } else {
      console.warn("giftOpen: bgAudio is not initialized");
    }
    jQuery(".gift-bottom").addClass("fadeout");
    jQuery(".gift-top").addClass("fadeout");
    //jQuery(".santa-wrapper").fadeIn(5000);
    setTimeout(function () {
      jQuery(".santa-wrapper").fadeIn(5000);
    }, 500);
    setTimeout(function () {
      jQuery("#merry").show(1000);
      jQuery("#houu").fadeIn(1000);
      jQuery("#box").fadeIn(1000);
    }, 1000);
    //jQuery(".gift-card-text").fadeIn(5000);
  });
}

//Snow Fall

function createSnow() {
  var particles = [];
  var particleSize = 3;
  var maxParticles = 1000;
  var particleOpacity = 0.9;

  // Initialize canvas
  var canvas = document.getElementById("snow");
  var ctx = canvas.getContext("2d");

  // Get window width & height
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  // Apply canvas size based on window width & height.
  // This can be changed to bound within an element instead.
  canvas.width = windowWidth;
  canvas.height = windowHeight;

  // Push particle iteration
  for (var i = 0; i < maxParticles; i++) {
    particles.push({
      // Particle x position
      x: Math.random() * windowWidth,

      // Particle y position
      y: Math.random() * windowHeight,

      // Particle radius
      r: Math.random(Math.min(particleSize)) * particleSize,

      // Particle density
      d: Math.random() * maxParticles,
    });
  }

  // Render particles
  function render() {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.fillStyle = "rgba(255, 255, 255, " + particleOpacity + ")";
    ctx.beginPath();

    for (var i = 0; i < maxParticles; i++) {
      // Iterate the particles.
      var p = particles[i];

      // Move particles along x, y.
      ctx.moveTo(p.x, p.y);

      // Draw particle.
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }

    ctx.fill();
    update();
  }

  // To create a more dynamic and organic flow, we need to apply an
  // incremental 'angle' that will iterate through each particle flow.
  var angle = 0.005;

  // Update particles
  function update() {
    // Incremental angle.
    angle += 0.005;

    for (var i = 0; i < maxParticles; i++) {
      var p = particles[i];

      // Offset the particles flow based on the angle.
      p.y += Math.cos(p.d) + p.r;
      p.x += (Math.sin(angle) * Math.PI) / 10;

      // Re-iterate the particles to the top once the particle has
      // reached the bottom of the window.
      if (p.y > windowHeight) {
        particles[i] = {
          x: Math.random() * windowWidth,
          y: 0,
          r: p.r,
          d: p.d,
        };
      }
    }
  }

  // Call function.
}
