import { ref, onMounted, onUnmounted } from 'vue';

export default function useScrollDirection() {
  const isScrollingDown = ref(false);
  let lastScrollY = window.scrollY;

  const updateScroll = () => {
    const currentY = window.scrollY;
    isScrollingDown.value = currentY > lastScrollY;
    lastScrollY = currentY;
  };

  onMounted(() => {
    window.addEventListener('scroll', updateScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll);
  });

  return {
    isScrollingDown,
  };
}
