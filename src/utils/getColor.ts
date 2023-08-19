// import { computed, type CSSProperties } from 'vue';
import { computed } from 'vue';
import { useThemeStore } from './../store/modules/projectConfig';

export const selBg = computed(() => {
  const themeStore = useThemeStore();
  const { primaryColor } = themeStore;
  const index = primaryColor.indexOf(')');
  const sel = `${primaryColor.substring(0, 3)}a${primaryColor.substring(
    3,
    index,
  )}, 0.1 ${primaryColor.substring(index)}`;
  return sel;
});
export const selPrimary = computed(() => {
  const themeStore = useThemeStore();
  const { primaryColor } = themeStore;
  return primaryColor;
});
export const selColor = computed(() => {
  const themeStore = useThemeStore();
  const { primaryColor } = themeStore;
  return primaryColor;
});
