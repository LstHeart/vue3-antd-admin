import { defineStore } from 'pinia';
import { store } from './../../store';
interface SpinState {
  /** 需要缓存的路由组件名称列表 */
  spinning: boolean;
  spinningBtn: boolean;
  isPageNpmCommon: boolean;
}
export const useSpinStore = defineStore({
  id: 'spin',
  state: (): SpinState => ({
    spinning: false,
    spinningBtn: false,
    isPageNpmCommon: false,
  }),

  actions: {
    changeSpinning(load) {
      this.spinning = load;
    },
    changeSpinningBtn(load) {
      this.spinningBtn = load;
    },
    changeIsPageNpmCommon(falg) {
      this.isPageNpmCommon = falg;
    },
  },
});

// 在组件setup函数外使用
export function useSpinStoreWithOut() {
  return useSpinStore(store);
}
