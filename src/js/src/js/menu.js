'use strict';

import $ from 'jquery';

export default class BasisMenu {
  constructor(container, params) {
    this.params = $.extend({
      container: '._c-menu'
    }, params);

    this.container = $(this.params.container);
    this.setListener();
  }

  setListener() {
    this.container.each((i, e) => {
      const container = $(e);

      const hasSubmenus = container.find('[aria-expanded]');
      hasSubmenus.each((i, e) => {
        const item = $(e);

        item.on('mouseover', (event) => {
          this.open(item);
        }, false);

        item.on('mouseleave', (event) => {
          this.close(item);
        }, false);
      });
    });
  }

  open(item) {
    item.attr('aria-expanded', 'true');
  }

  close(item) {
    item.attr('aria-expanded', 'false');
  }
}
