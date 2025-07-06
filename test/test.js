import { JSDOM } from 'jsdom';
import { assert } from 'chai';
import jQuery from 'jquery';
import NProgressModule from '../nprogress.js';

// Set up JSDOM with all necessary DOM APIs
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Set up global DOM environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Add missing DOM constructors that JSDOM might not provide
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;

// Make jQuery work with JSDOM
const $ = jQuery(window);

describe('NProgress', function() {
  var NProgress;

  beforeEach(function() {
    NProgress = NProgressModule();

    this.settings = $.extend({}, NProgress.settings);
  });

  afterEach(function() {
    $(".nprogress").remove();
    $('html').attr('class', '');
    NProgress.status = null;

    // Restore settings
    $.extend(NProgress.settings, this.settings);
  });

  describe('.set()', function() {
    it('.set(0) must render', function() {
      NProgress.set(0);
      assert.equal($(".nprogress").length, 1);
      assert.equal($(".nprogress .bar").length, 1);
      assert.equal($(".nprogress .peg").length, 1);
      assert.equal($(".nprogress .spinner").length, 1);
    });

    it('.set(1) should appear and disappear', function(done) {
      NProgress.configure({ speed: 10 });
      NProgress.set(0).set(1);
      assert.equal($(".nprogress").length, 1);

      setTimeout(function() {
        assert.equal($(".nprogress").length, 0);
        done();
      }, 70);
    });

    it('must respect minimum', function() {
      NProgress.set(0);
      assert.equal(NProgress.status, NProgress.settings.minimum);
    });

    it('must clamp to minimum', function() {
      NProgress.set(-100);
      assert.equal(NProgress.status, NProgress.settings.minimum);
    });

    it('must clamp to maximum', function() {
      NProgress.set(456);
      assert.equal(NProgress.status, null);
    });
  });

  // ----

  describe('.start()', function() {
    it('must render', function(done) {
      NProgress.start();
      assert.equal($(".nprogress").length, 1);
      done();
    });

    it('must respect minimum', function() {
      NProgress.start();
      assert.equal(NProgress.status, NProgress.settings.minimum);
    });

    it('must be attached to specified parent', function() {
      var test = $('<div>', {id: 'test'}).appendTo('body');
      NProgress.configure({parent: '#test'});

      NProgress.start();

      assert.isTrue($(".nprogress").parent().is(test));
      assert.isTrue($(NProgress.settings.parent).hasClass("nprogress-custom-parent"));

      test.remove();
    });
  });

  // ----

  describe('.done()', function() {
    it('must not render without start', function() {
      NProgress.done();
      assert.equal($(".nprogress").length, 0);
    });

    it('.done(true) must render', function() {
      NProgress.done(true);
      assert.equal($(".nprogress").length, 1);
    });
  });

  // ----

  describe('.remove()', function() {
    it('should be removed from the parent', function() {
      NProgress.set(1);
      NProgress.remove();

      var parent = $(NProgress.settings.parent);
      assert.isFalse(parent.hasClass('nprogress-custom-parent'));
      assert.equal(parent.find('.nprogress').length, 0);
    });


    it('should be removed from the parent even after trickleSpeed', function(done) {
      NProgress.start();

      NProgress.remove();

      var parent = $(NProgress.settings.parent);
      setTimeout(function() {
        assert.isFalse(parent.hasClass('nprogress-custom-parent'));
        assert.equal(parent.find('.nprogress').length, 0);
        done();
      }, NProgress.settings.trickleSpeed + 1);        
    });
  });

  // ----

  describe('.inc()', function() {
    it('should render', function() {
      NProgress.inc();
      assert.equal($(".nprogress").length, 1);
    });

    it('should start with minimum', function() {
      NProgress.inc();
      assert.equal(NProgress.status, NProgress.settings.minimum);
    });

    it('should increment', function() {
      NProgress.start();
      var start = NProgress.status;

      NProgress.inc();
      assert.operator(NProgress.status, '>', start);
    });

    it('should never reach 1.0', function() {
      for (var i=0; i<100; ++i) { NProgress.inc(); }
      assert.operator(NProgress.status, '<', 1.0);
    });
  });

  // -----

  describe('.configure()', function() {
    it('should work', function() {
      NProgress.configure({ minimum: 0.5 });
      assert.equal(NProgress.settings.minimum, 0.5);
    });
  });

  // ----

  describe('.configure(showSpinner)', function() {
    it('should render spinner by default', function() {
      NProgress.start();

      assert.equal($(".nprogress .spinner").length, 1);
    });

    it('should be true by default', function() {
      assert.equal(NProgress.settings.showSpinner, true);
    });

    it('should hide (on false)', function() {
      NProgress.configure({ showSpinner: false });
      NProgress.start();

      assert.equal($(".nprogress .spinner").length, 0);
    });
  });


  describe('Tests having multi instance with different parent', function() {
      var parent1;
      var parent2;

      beforeEach(function() {
          parent1 = $('<div>', {id: 'parent1'}).appendTo('body');
          parent2 = $('<div>', {id: 'parent2'}).appendTo('body');
      });


      afterEach(function() {
          parent1.remove();
          parent2.remove();
      });


      it('should render 2 progress bar', function() {
          var nprogress1 = NProgressModule();
          var nprogress2 = NProgressModule();
          nprogress1.configure({parent: '#parent1'});
          nprogress2.configure({parent: '#parent2'});

          nprogress1.set(0);
          nprogress2.set(0);

          assert.equal($("#parent1 .nprogress").length, 1);
          assert.equal($("#parent2 .nprogress").length, 1);
      });

      it('should render 2 progress bars when one parent is an HTMLElement', function() {
          var nprogress1 = NProgressModule();
          var nprogress2 = NProgressModule();
          nprogress1.configure({parent: document.querySelector('#parent1') });
          nprogress2.configure({parent: '#parent2'});

          nprogress1.set(0);
          nprogress2.set(0);

          assert.equal($("#parent1 .nprogress").length, 1);
          assert.equal($("#parent2 .nprogress").length, 1);
      });

      it('should render 2 progress bars when both parents are HTMLElements', function() {
          var nprogress1 = NProgressModule();
          var nprogress2 = NProgressModule();
          nprogress1.configure({parent: document.querySelector('#parent1') });
          nprogress2.configure({ parent: document.querySelector('#parent2') });

          nprogress1.set(0);
          nprogress2.set(0);

          assert.equal($("#parent1 .nprogress").length, 1);
          assert.equal($("#parent2 .nprogress").length, 1);
      });


      it('should not affect each other after multi set', function(done) {
          var nprogress1 = NProgressModule();
          var nprogress2 = NProgressModule();
          nprogress1.configure({parent: '#parent1'});
          nprogress2.configure({parent: '#parent2', speed: 10});

          nprogress1.set(0);
          nprogress2.set(0).set(1);

          assert.equal($("#parent1 .nprogress").length, 1);
          assert.equal($("#parent2 .nprogress").length, 1);

          setTimeout(function() {
            assert.equal($("#parent2 .nprogress").length, 0);
            done();
          }, 70);
      });


      it('should not affect each other when removing one', function() {
          var nprogress1 = NProgressModule();
          var nprogress2 = NProgressModule();
          nprogress1.configure({parent: '#parent1'});
          nprogress2.configure({parent: '#parent2', speed: 10});

          nprogress1.set(0);
          nprogress2.set(0);

          assert.equal($("#parent1 .nprogress").length, 1);
          assert.equal($("#parent2 .nprogress").length, 1);

          nprogress1.remove();
          assert.equal($("#parent1 .nprogress").length, 0);
      });
  })
    describe('Tests having instance under parent as another instance', function() {
        var nprogress;
        var nested;

        beforeEach(function() {
            nprogress = $('<div>', {id: 'nprogress'}).appendTo('body');
            nested = $('<div>', {id: 'nested'}).appendTo(nprogress);
        });


        afterEach(function() {
            nprogress.remove();
            nested.remove();
        });


        it('should render 2 progress bar', function() {
            var nprogress = NProgressModule();
            var nested = NProgressModule();
            nprogress.configure({parent: '#nprogress'});
            nested.configure({parent: '#nested'});

            nprogress.set(0);
            nested.set(0);

            assert.equal($("#nprogress > .nprogress").length, 1);
            assert.equal($("#nested > .nprogress").length, 1);
        });


        it('should not affect each other after multi set', function(done) {
          var nprogress = NProgressModule();
          var nested = NProgressModule();
          nprogress.configure({parent: '#nprogress'});
          nested.configure({parent: '#nested', speed: 10});

          nprogress.set(0);
          nested.set(0).set(1);

          assert.equal($("#nprogress > .nprogress").length, 1);
          assert.equal($("#nested > .nprogress").length, 1);

          setTimeout(function() {
            assert.equal($("#nested > .nprogress").length, 0);
            done();
          }, 70);
        });

        it('should not affect each other when removing one', function() {
            var nprogress = NProgressModule();
            var nested = NProgressModule();
            nprogress.configure({parent: '#nprogress'});
            nested.configure({parent: '#nested', speed: 10});

            nprogress.set(0);
            nested.set(0);

            assert.equal($("#nprogress > .nprogress").length, 1);
            assert.equal($("#nested > .nprogress").length, 1);

            nprogress.remove();              
            assert.equal($("#nprogress > .nprogress").length, 0);
        });

        it('should work with parents are HTMLElements', function() {
            var nprogress = NProgressModule();
            var nested = NProgressModule();
            nprogress.configure({parent: document.querySelector('body > #nprogress')});
            nested.configure({parent: document.querySelector('#nested'), speed: 10});

            nprogress.set(0);
            nested.set(0);

            assert.equal($("#nprogress > .nprogress").length, 1);
            assert.equal($("#nested > .nprogress").length, 1);

            nprogress.remove();              
            assert.equal($("#nprogress > .nprogress").length, 0);
        });
    })
});
