import { ObjectDirective } from 'vue';

export const vLabel: ObjectDirective = {
  mounted(el: HTMLDivElement, binding) {
    /**
     * el：指令绑定到的元素
     * binding：一个对象 { value,oldValue,arg,modifiers,instance,dir }
     *
     * 自定义指令参数可参考：https://cn.vuejs.org/guide/reusability/custom-directives.html#hook-arguments
     */

    /* 标签元素 */
    const labelEl = el.querySelector('.ant-form-item-label') as Element;
    let realLabelWidth = '0px';
    if (labelEl) {
      /* 创建新元素用来获取标签宽度 */
      const tempEl = document.createElement('div');
      tempEl.appendChild(labelEl.cloneNode(true));
      document.body.appendChild(tempEl);
      /* 标签文字实际占用宽度 */
      realLabelWidth = window.getComputedStyle(tempEl.firstElementChild as HTMLDivElement).width;
      tempEl.remove();
    }
    binding.value.realLabelWidth = realLabelWidth;
  },
};
