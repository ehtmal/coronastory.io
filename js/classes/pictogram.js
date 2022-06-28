/** Class Pictogram */
var Pictogram = (function () {
  var DEFAULT_OPTIONS = {
    activeCount: 0,
    recoveredCount: 0,
    deathsCount: 0,
  };

  $('#country-modal').css('display', 'block');
  const PICTOGRAM_WIDTH = document.querySelector(".js-human-chart").offsetWidth;
  $('#country-modal').css('display', 'none');
  const PICTOGRAM_HEIGHT = 400;

  /** Constructor */
  function Pictogram(selector, options = {}) {
    var self = this;
    self.$container = $(selector);
    self.$container.addClass("sk-pictogram").data("pictogram", this);
    self.$container.css("overflow", "hidden");
    self.activeCount = options.activeCount ? options.activeCount : DEFAULT_OPTIONS.activeCount;
    self.recoveredCount = options.recoveredCount ? options.recoveredCount : DEFAULT_OPTIONS.recoveredCount;
    self.deathsCount = options.deathsCount ? options.deathsCount : DEFAULT_OPTIONS.deathsCount;
    self.bindingEvents();

    self.app = new PIXI.Application({ backgroundAlpha: 0, width: PICTOGRAM_WIDTH, height: PICTOGRAM_HEIGHT });
    self.$container.append(self.app.view);

    // let parentWidth = document.querySelector(".js-human-chart").offsetWidth;
    // self.app.renderer.resize(parentWidth, PICTOGRAM_HEIGHT);

    self.scrollbox = new Scrollbox.Scrollbox({ boxWidth: PICTOGRAM_WIDTH, boxHeight: PICTOGRAM_HEIGHT, overflowX: 'hidden', overflowY: 'scroll', scrollbarBackgroundAlpha: 0.5, scrollbarForegroundAlpha: 0.5 })
    self.app.stage.addChild(self.scrollbox)

    // Make stage interactive so you can click on it too
    self.app.stage.interactive = true;
    // self.app.stage.interactiveMousewheel = true
    self.app.stage.hitArea = self.app.renderer.screen;

    // Listen for events
    // self.app.stage.on('click', (event) => {
    //   console.log('click')
    // })
    // self.app.stage.on('mousewheel', (delta, event) => {
    //   let pictogramContainer = self.app.stage.children.find(c => c.name === 'pictogram-container');
    //   let scrollBar = self.app.stage.children.find(c => c.name === 'scroll-bar');

      // let oldY = pictogramContainer.y;
      // let newY = oldY + delta * 100;
      // if (newY > 0) newY = 0;
      // if (newY < PICTOGRAM_HEIGHT - pictogramContainer.customHeight) newY = PICTOGRAM_HEIGHT - pictogramContainer.customHeight;
      // if (pictogramContainer.customHeight <= PICTOGRAM_HEIGHT) newY = 0;
      // pictogramContainer.y = newY;

      // let parentWidth = document.querySelector(".js-human-chart").offsetWidth;
      // let scrollWidth = 8;
      // let scrollHeight = scrollBar.customHeight <= PICTOGRAM_HEIGHT ? 0 : (PICTOGRAM_HEIGHT / scrollBar.customHeight * PICTOGRAM_HEIGHT);
      // scrollBar.clear();
      // scrollBar.beginFill(0x000000);
      // scrollBar.drawRect(parentWidth - scrollWidth, - PICTOGRAM_HEIGHT * newY / scrollBar.customHeight, scrollWidth, scrollHeight);
      // scrollBar.endFill();
    // })
  }

  /** Binding events for HTML */
  Pictogram.prototype.bindingEvents = function () {
    var self = this;
    $(window).resize(function () {
      self.render();
    });
  };

  /** Start render canvas of pictogram  */
  Pictogram.prototype.render = function () {
    let parentWidth = PICTOGRAM_WIDTH;
    let imagePerRow = Math.floor(parentWidth / 8);
    let totalActive = Math.ceil(this.activeCount);
    let totalRecovered = Math.ceil(this.recoveredCount);
    let totalDeaths = Math.ceil(this.deathsCount);
    let totalImage = totalActive + totalRecovered + totalDeaths;
    let totalRows = Math.ceil(totalImage / imagePerRow);

    // this.app.stage.removeChildren();
    this.scrollbox.content.removeChildren();

    let particle = new PIXI.ParticleContainer(300_000);
    particle.name = 'pictogram-container';
    // particle.customHeight = totalRows * 20;
    // particle.y = particle.customHeight <= PICTOGRAM_HEIGHT ? 0 : PICTOGRAM_HEIGHT - particle.customHeight;

    let texture = PIXI.Texture.from("images/icons/male.svg");
    let colors = { active: 0x286eff, recovered: 0x61ce81, deaths: 0x8643e6 };
    for (let i = 0; i < totalImage; i++) {
      let row = Math.floor(i / imagePerRow);
      let col = i % imagePerRow;
      let type = i < totalActive ? 'active' : i < (totalActive + totalRecovered) ? 'recovered' : 'deaths';
      let sprite = PIXI.Sprite.from(texture);
      sprite.x = col * 8 + 1;
      sprite.y = row * 20 + 2;
      sprite.width = 6;
      sprite.height = 16;
      sprite.tint = colors[type];
      particle.addChild(sprite);
    }
    // this.app.stage.addChild(particle);
    this.scrollbox.content.addChild(particle);

    let bound = new PIXI.Graphics()
    bound.beginFill(0xDE3249);
    bound.drawRect(0, 0, PICTOGRAM_WIDTH, totalRows * 20);
    bound.endFill();
    bound.alpha = 0;
    this.scrollbox.content.addChild(bound);

    this.scrollbox.update()

    // let graphics = new PIXI.Graphics();
    // graphics.name = "scroll-bar";
    // graphics.customHeight = totalRows * 20;
    // graphics.alpha = 0.6;
    // let scrollWidth = 8;
    // let scrollHeight = particle.customHeight <= PICTOGRAM_HEIGHT ? 0 : (PICTOGRAM_HEIGHT / particle.customHeight * PICTOGRAM_HEIGHT);
    // graphics.beginFill(0x000000);
    // graphics.drawRect(parentWidth - scrollWidth, PICTOGRAM_HEIGHT - scrollHeight, scrollWidth, scrollHeight);
    // graphics.endFill();
    // this.app.stage.addChild(graphics);
  };

  return Pictogram;
})();
