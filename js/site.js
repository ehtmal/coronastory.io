/**
 * Site related functions: i18n, menu, tooltips. datepicker, scrollbar, overlay story
 * Copyright 2020 Sinka Vietnam (https://sinka.vn)
 */

$(function () {
  // Console log
  console.log(
    "%c CoronaStory.io",
    "font-weight: bold; font-size: 50px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"
  );

  // Init i18n
  $.i18n().load({ en: en, vi: vi });

  // Update language from localStorage
  setTimeout(() => {
    if (localStorage.getItem("language") !== null) {
      updateLanguage(localStorage.getItem("language"));
      $(".selectpicker").val(localStorage.getItem("language"));
      $(".selectpicker").selectpicker("refresh");
    } else {
      updateLanguage("en");
      $(".selectpicker").val("en");
      $(".selectpicker").selectpicker("refresh");
    }
  }, 0);

  // On Update language from selectbox
  $(document).on("change", ".selectpicker", function (e) {
    localStorage.setItem("language", e.target.value);
    updateLanguage(e.target.value);
  });

  // Open & close menu click events
  $("#open-side-bar").on("click", function () {
    $(".screen-overlay").addClass("visible");
    $("#left-side-bar").addClass("visible");
  });
  $(".screen-overlay").on("click", function () {
    $(".screen-overlay").removeClass("visible");
    $("#left-side-bar").removeClass("visible");
    $(".embed-container").removeClass("visible");
  });

  $("#story").on("click", function (e) {
    e.preventDefault();
    window.location.href = "/";
  });
  $("#about-us").on("click", function (e) {
    e.preventDefault();
    window.location.href = "/about-us.html";
  });
  $("#donate-button").on("click", function (e) {
    e.preventDefault();
    window.open("https://www.buymeacoffee.com/sinka");
  });

  // Open embeded iframe and copy link
  $("#embed").on("click", function (e) {
    e.preventDefault();
    $(".screen-overlay").addClass("visible");
    $(".embed-container").addClass("visible");
    $("#left-side-bar").removeClass("visible");
  });
  $(".embed-link").on("click", function () {
    let width = $(".embed-input.width").val();
    let height = $(".embed-input.height").val();
    $(this).val(
      '<iframe src="https://coronastory.io/" width="' +
        width +
        '" height="' +
        height +
        '" frameborder="0" style="border:0;" tabindex="0"></iframe>'
    );
    $(this).select();
    document.execCommand("copy");
    $(".embed-copied").text("Copied!");
  });

  // Share events
  $("#share-button").click(function () {
    $("#share-modal").modal("show");
  });
  $("#copy-link").click(function (e) {
    e.preventDefault();
    var copyText = document.getElementById("copy-link-input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  });

  // Turn on bootstrap tooltip
  $('[data-toggle="tooltip"]').tooltip();

  initScrollBar();
  initDatePicker('[data-toggle="datepicker"]');
});

/** Init Datepicker */
function initDatePicker(selector) {
  $(selector).each(function (index, element) {
    let start = $(this).attr("min");
    let end = $(this).attr("max");

    $(this).datepicker({
      autoHide: true,
      zIndex: 2048,
      weekStart: 1,
      startDate: start ? start : null,
      endDate: end ? end : null,
      format: "yyyy-mm-dd",
      offset: 5,
    });
  });
}

/** Init custom scrollbar */
function initScrollBar() {
  $(".js-custom-scrollbar").each(function (index, item) {
    new SimpleBar(item);
  });
}

/** Update website language */
function updateLanguage(lang) {
  $.i18n().locale = lang;
  $("[data-i18n]").i18n();
}
