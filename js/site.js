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
