Component({
  properties: {
    current: { type: Number, value: 3 },
    disabled: { type: Boolean, value: false }
  },

  data: {
    tiers: [2, 3, 4, 5, 6]
  },

  methods: {
    onTap(e) {
      if (this.properties.disabled) return;
      const tier = e.currentTarget.dataset.tier;
      if (tier === this.properties.current) return;
      this.triggerEvent('change', { tier });
    }
  }
});
