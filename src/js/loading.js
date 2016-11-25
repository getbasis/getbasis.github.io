'use strict';

import $ from 'jquery';

export default class BasisLoading {
  constructor() {
    this.container     = $('[data-c="loading"]');
    this.pageOutObject = $('[data-page-effect-link="true"], a[href]:not([target="_blank"], [href^="#"], [href*="javascript"], [href*=".jpg"], [href*=".jpeg"], [href*=".gif"], [href*=".png"], [href*=".mov"], [href*=".swf"], [href*=".mp4"], [href*=".flv"], [href*=".avi"], [href*=".mp3"], [href*=".pdf"], [href*=".zip"], [href^="mailto:"], [data-page-effect-link="false"])');
    this.setListener();
  }

  setListener() {
    $(window).on('load', (event) => {
      this.hide();
    });

    this.pageOutObject.each((i, e) => {
      const link = $(e);
      link.on('click', (event) => {
        event.preventDefault();
        this.show();
        const url = link.attr('href');
        this.location(url);
      });
    });
  }

  location(url) {
    setTimeout(() => {
      location.href = url
    }, 200);
  }

  hide() {
    this.container.attr('aria-hidden', 'true');
  }

  show() {
    this.container.attr('aria-hidden', 'false');
  }
}
