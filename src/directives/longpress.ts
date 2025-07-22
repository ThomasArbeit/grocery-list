export default {
  mounted(el: HTMLElement, binding: any) {
    let pressTimer: number | null = null;

    const handler = () => {
      if (typeof binding.value === 'function') {
        binding.value();
      }
    };

    const start = () => {
      if (pressTimer === null) {
        pressTimer = window.setTimeout(handler, 500); // durée du press long (500ms)
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start);
    el.addEventListener('click', cancel);
    el.addEventListener('mouseout', cancel);
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('mousedown', () => {});
    el.removeEventListener('touchstart', () => {});
    el.removeEventListener('click', () => {});
    el.removeEventListener('mouseout', () => {});
    el.removeEventListener('touchend', () => {});
    el.removeEventListener('touchcancel', () => {});
  }
}
