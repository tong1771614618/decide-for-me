const { ONBOARDING_STEPS } = require('../../utils/constants');
const storage = require('../../utils/storage');

Component({
  data: {
    visible: false,
    currentStep: 0,
    steps: ONBOARDING_STEPS
  },

  lifetimes: {
    attached() {
      if (!storage.hasOnboarded()) {
        this.setData({ visible: true });
      }
    }
  },

  methods: {
    onNext() {
      const { currentStep, steps } = this.data;
      if (currentStep < steps.length - 1) {
        this.setData({ currentStep: currentStep + 1 });
      } else {
        this._complete();
      }
    },

    onPrev() {
      const { currentStep } = this.data;
      if (currentStep > 0) {
        this.setData({ currentStep: currentStep - 1 });
      }
    },

    onSkip() {
      this._complete();
    },

    _complete() {
      storage.setOnboarded();
      this.setData({ visible: false });
      this.triggerEvent('complete');
    }
  }
});
