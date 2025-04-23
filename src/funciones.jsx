import $ from 'jquery';

function Funciones() {
  $(".nav-item a").on("click", function () {
    $(this).parent().find(".collapse").hasClass("show")
      ? $(this).parent().removeClass("submenu")
      : $(this).parent().addClass("submenu");
  }),
    $(".messages-contact .user a").on("click", function () {
      $(".tab-chat").addClass("show-chat");
    }),
    $(".messages-wrapper .return").on("click", function () {
      $(".tab-chat").removeClass("show-chat");
    }),
    $('[data-select="checkbox"]').change(function () {
      var e = $(this).attr("data-target");
      $(e).prop("checked", $(this).prop("checked"));
    }),
    $(".form-group-default .form-control")
      .focus(function () {
        $(this).parent().addClass("active");
      })
      .blur(function () {
        $(this).parent().removeClass("active");
      });
}

export function Desplegar() {
  var c = !1,
    d = !1,
    g = !1,
    u = !1,
    p = !1,
    h = 0,
    m = 0,
    v = 0,
    f = 0,
    b = 0,
    C = 0;
  if (!c) {
    var k = $(".sidenav-toggler");
    k.on("click", function () {
      1 == h
        ? ($("html").removeClass("nav_open"), k.removeClass("toggled"), (h = 0))
        : ($("html").addClass("nav_open"), k.addClass("toggled"), (h = 1));
    }),
      (c = !0);
  }
  if (!m) {
    var k = $(".quick-sidebar-toggler");
    k.on("click", function () {
      1 == h
        ? ($("html").removeClass("quick_sidebar_open"),
          $(".quick-sidebar-overlay").remove(),
          k.removeClass("toggled"),
          (m = 0))
        : ($("html").addClass("quick_sidebar_open"),
          k.addClass("toggled"),
          $('<div class="quick-sidebar-overlay"></div>').insertAfter(
            ".quick-sidebar"
          ),
          (m = 1));
    }),
      $(".wrapper").mouseup(function (e) {
        var s = $(".quick-sidebar");
        e.target.className == s.attr("class") ||
          s.has(e.target).length ||
          ($("html").removeClass("quick_sidebar_open"),
          $(".quick-sidebar-toggler").removeClass("toggled"),
          $(".quick-sidebar-overlay").remove(),
          (m = 0));
      }),
      $(".close-quick-sidebar").on("click", function () {
        $("html").removeClass("quick_sidebar_open"),
          $(".quick-sidebar-toggler").removeClass("toggled"),
          $(".quick-sidebar-overlay").remove(),
          (m = 0);
      }),
      (m = !0);
  }
  if (!d) {
    var w = $(".topbar-toggler");
    w.on("click", function () {
      1 == v
        ? ($("html").removeClass("topbar_open"),
          w.removeClass("toggled"),
          (v = 0))
        : ($("html").addClass("topbar_open"), w.addClass("toggled"), (v = 1));
    }),
      (d = !0);
  }
  if (!g) {
    var _ = $(".toggle-sidebar");
    $(".wrapper").hasClass("sidebar_minimize") &&
      (_.addClass("toggled"),
      _.html('<i class="gg-more-vertical-alt"></i>'),
      (f = 1)),
      _.on("click", function () {
        1 == f
          ? ($(".wrapper").removeClass("sidebar_minimize"),
            _.removeClass("toggled"),
            _.html('<i class="gg-menu-right"></i>'),
            (f = 0))
          : ($(".wrapper").addClass("sidebar_minimize"),
            _.addClass("toggled"),
            _.html('<i class="gg-more-vertical-alt"></i>'),
            (f = 1)),
          $(window).resize();
      }),
      (g = !0),
      (u = !0);
  }
  if (!p) {
    var q = $(".page-sidebar-toggler");
    q.on("click", function () {
      1 == b
        ? ($("html").removeClass("pagesidebar_open"),
          q.removeClass("toggled"),
          (b = 0))
        : ($("html").addClass("pagesidebar_open"),
          q.addClass("toggled"),
          (b = 1));
    }),
      $(".page-sidebar .back").on("click", function () {
        $("html").removeClass("pagesidebar_open"),
          q.removeClass("toggled"),
          (b = 0);
      }),
      (p = !0);
  }
  var y = $(".sidenav-overlay-toggler");
  $(".wrapper").hasClass("is-show") &&
    ((C = 1),
    y.addClass("toggled"),
    y.html('<i class="icon-options-vertical"></i>')),
    y.on("click", function () {
      1 == C
        ? ($(".wrapper").removeClass("is-show"),
          y.removeClass("toggled"),
          y.html('<i class="icon-menu"></i>'),
          (C = 0))
        : ($(".wrapper").addClass("is-show"),
          y.addClass("toggled"),
          y.html('<i class="icon-options-vertical"></i>'),
          (C = 1)),
        $(window).resize();
    }),
    (g = !0),
    $(".sidebar")
      .mouseenter(function () {
        1 != f || u
          ? $(".wrapper").removeClass("sidebar_minimize_hover")
          : ($(".wrapper").addClass("sidebar_minimize_hover"), (u = !0));
      })
      .mouseleave(function () {
        1 == f &&
          u &&
          ($(".wrapper").removeClass("sidebar_minimize_hover"), (u = !1));
      });
}

export default Funciones;
