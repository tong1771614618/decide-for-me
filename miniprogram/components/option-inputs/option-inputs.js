const { MAX_OPTION_LENGTH } = require('../../utils/constants');

Component({
  properties: {
    options: { type: Array, value: ['', '', ''] },
    placeholders: { type: Array, value: ['选项 A', '选项 B', '选项 C'] },
    disabled: { type: Boolean, value: false }
  },

  data: {
    maxLength: MAX_OPTION_LENGTH
  },

  methods: {
    onInput(e) {
      const idx = e.currentTarget.dataset.index;
      const value = e.detail.value;
      const options = [...this.properties.options];
      options[idx] = value;
      this.triggerEvent('change', { options });
    },

    onBlur(e) {
      const idx = e.currentTarget.dataset.index;
      const value = (e.detail.value || '').trim();
      const options = [...this.properties.options];
      options[idx] = value;
      this.triggerEvent('change', { options });
    }
  }
});
