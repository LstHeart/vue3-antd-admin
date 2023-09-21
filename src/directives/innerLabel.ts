import { ObjectDirective } from 'vue';

export const vInnerLabel: ObjectDirective = {
  mounted(el: HTMLElement, _binding) {
    /* 添加自定义的class */
    el.classList.add('_inner-label-form');
    /* 删除内联模式样式 */
    el.classList.remove('ant-form-inline');

    const formItemColEls = el.firstElementChild?.children as HTMLCollection;
    for (let i = 0; i < formItemColEls.length; i++) {
      const colEl = formItemColEls.item(i);
      colEl?.classList.add('_form-col');
    }
    /* 所有表单项元素 */
    const formItemEls = el.querySelectorAll('.ant-form-item') as NodeListOf<Element>;
    formItemEls.forEach((formItemEl) => {
      /* 设定 formItem class */
      formItemEl.classList.add('_form-item');

      /* 标签元素 */
      const labelEl = formItemEl.querySelector('.ant-form-item-label') as Element;
      /* 内容元素 */
      const contentEl = formItemEl.querySelector('.ant-form-item-control') as Element;

      /* 组件元素 */
      const compEl = contentEl.querySelector('.ant-form-item-control-input-content')
        ?.firstElementChild as Element;

      let disablePointer = false;
      if (compEl) {
        if (!compEl.classList.contains('ant-btn')) {
          compEl.classList.add('_comp');
          // compEl.setAttribute('style', 'width:100%;');
          // compEl.setAttribute('style', 'width:100%;');
        }

        // 判断是否禁用鼠标事件
        const disableList = [
          'ant-picker', // date-picker
          'ant-select', // select
        ];
        for (let i = 0; i < disableList.length; i++) {
          if (compEl.classList.contains(disableList[i])) {
            disablePointer = true;
            break;
          }
        }
      }

      /* 下拉选择  */
      // const isInput = compEl?.classList.contains('ant-input-affix-wrapper');
      // const isInputNumber = compEl?.classList.contains('ant-input-number');
      // const isInputNumber = compEl?.classList.contains('ant-input-number-group-wrapper');
      // const isSelect = compEl?.classList.contains('ant-input-affix-wrapper');
      const selectEl = contentEl.querySelector('.ant-select .ant-select-selector') as Element;
      /* 可搜索下拉元素 */
      const selectSearchEl = selectEl?.querySelector('.ant-select-selection-search') as HTMLElement;
      /* 数字输入 */
      const inputNumberEl = contentEl.querySelector(
        '.ant-input-number .ant-input-number-input-wrap',
      ) as HTMLElement;
      /* 禁用 */
      const inputDisableEl = contentEl.querySelector('ant-input-disabled') as Element;

      /* 处理按钮组 */
      if (contentEl) {
        const btnEls = contentEl.querySelectorAll('.ant-btn') as NodeListOf<Element>;
        btnEls.forEach((_btn, index) => {
          if (index > 0) {
            /* 按钮class */
            _btn.classList.add('_btn');
          }
        });
      }

      /* 处理内部标签 */
      if (labelEl && compEl) {
        /* 内部标签class */
        labelEl.classList.add('_inner-label');

        /* 创建新元素用来获取标签宽度 */
        const tempEl = document.createElement('div');
        // const labelNode = labelEl.firstElementChild as Element;
        tempEl.appendChild(labelEl.cloneNode(true));
        document.body.appendChild(tempEl);
        /* 标签文字实际占用宽度 */
        const width = window.getComputedStyle(tempEl.firstElementChild as HTMLDivElement).width;
        tempEl.remove();

        /* 处理内容元素偏移 */
        const element = selectEl || compEl || inputDisableEl;
        if (element) {
          element.setAttribute(
            'style',
            `
            width:100%;
            padding-left: calc(${width} + 16px) !important;
          `,
          );
          if (disablePointer) {
            labelEl.setAttribute(
              'style',
              `
              pointer-events: none;
            `,
            );
          }
          /* 可搜索下拉 */
          if (element === selectEl && selectSearchEl) {
            selectSearchEl.setAttribute('style', ` padding-left: calc(${width} + 4px) !important;`);
          }
          /* 数字输入框 */
          console.log('element', element === compEl);
          console.log('element', element);
          console.log('compEl', compEl);
          console.log('inputNumberEl', inputNumberEl);
          if (element === compEl && inputNumberEl) {
            // inputNumberEl.setAttribute('style', ` padding-left: calc(${width} + 4px) !important;`);
            inputNumberEl.firstElementChild?.setAttribute('style', ` padding-left: 0 !important;`);
          }
        }
      }
    });
  },
  // updated(el: HTMLDivElement, _binding) {
  //   /**
  //    * el：指令绑定到的元素
  //    * binding：一个对象 { value,oldValue,arg,modifiers,instance,dir }
  //    *
  //    * 自定义指令参数可参考：https://cn.vuejs.org/guide/reusability/custom-directives.html#hook-arguments
  //    */
  // },
};
