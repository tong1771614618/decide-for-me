Component({
  properties: {
    enabled: { type: Boolean, value: false },
    showHint: { type: Boolean, value: false }
  },

  methods: {
    onTap() {
      if (!this.properties.enabled) {
        this.triggerEvent('invalid');
        return;
      }
      this.triggerEvent('decide');
    }
  }
});
