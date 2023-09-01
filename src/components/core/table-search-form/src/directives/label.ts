import type { ObjectDirective } from 'vue';

export const vLabel: ObjectDirective = {
  mounted(el: HTMLDivElement, binding) {
    /**
     * el：指令绑定到的元素
     * binding：一个对象 { value,oldValue,arg,modifiers,instance,dir }
     *
     * 自定义指令参数可参考：https://cn.vuejs.org/guide/reusability/custom-directives.html#hook-arguments
     */
    el.setAttribute('data-label', binding.value); // 设定自定义属性，用来显示设定的label属性值
  },
  // updated(el: HTMLDivElement, binding) {
  //   console.log(
  //     '🚀 ~ file: label.ts:14 ~ updated ~ el: HTMLDivElement, binding, vnode:',
  //     el,
  //     binding,
  //   );
  // },
};
