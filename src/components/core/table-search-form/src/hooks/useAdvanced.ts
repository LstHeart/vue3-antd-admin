import { computed, unref, watch } from 'vue';
import type { SchemaFormEmitFn } from '../schema-form';
// import type { ColEx } from '../types/component';
import type { SchemaFormType } from './';
import { isBoolean, isFunction, isNumber, isObject } from '@/utils/is';
import { useBreakpoint } from '@/hooks/event/useBreakpoint';

// const BASIC_COL_LEN = 24;
const BASIC_COL_LEN = 100; // 一行为100,100%

type UseAdvancedContext = {
  instance: SchemaFormType;
  emit: SchemaFormEmitFn;
};

export const useAdvanced = ({ instance, emit }: UseAdvancedContext) => {
  const { realWidthRef, screenRef } = useBreakpoint();
  const { advanceState, getFormProps, formSchemasRef, formModel, defaultFormValues } = instance;
  const getEmptySpan = computed((): number => {
    if (!advanceState.isAdvanced) {
      return 0;
    }
    // For some special cases, you need to manually specify additional blank lines
    const emptySpan = unref(getFormProps).emptySpan || 0;

    if (isNumber(emptySpan)) {
      return emptySpan;
    }
    if (isObject(emptySpan)) {
      const { span = 0 } = emptySpan;
      const screen = unref(screenRef) as string;

      const screenSpan = (emptySpan as any)[screen.toLowerCase()];
      return screenSpan || span || 0;
    }
    return 0;
  });

  watch(
    [formSchemasRef, () => unref(realWidthRef)],
    () => {
      const { showAdvancedButton } = unref(getFormProps);
      if (showAdvancedButton) {
        updateAdvanced();
      }
    },
    { immediate: true },
  );
  watch(
    () => advanceState.isAdvanced,
    () => {
      const { showAdvancedButton } = unref(getFormProps);
      if (showAdvancedButton) {
        updateAdvanced();
      }
    },
    { immediate: true },
  );

  // 计算span
  function getAdvanced(itemColSum = 0, isLastAction = false) {
    const width = unref(realWidthRef);
    // debugger;

    const baseSpan = width >= 1440 ? 20 : 25;
    itemColSum += baseSpan;
    if (isLastAction) {
      // 当前为action btn区域，
      advanceState.hideAdvanceBtn = false;
      if (itemColSum <= BASIC_COL_LEN + baseSpan) {
        // 少于1行，则不显示折叠按钮
        advanceState.hideAdvanceBtn = true;
        advanceState.isAdvanced = true;
      } else if (itemColSum <= BASIC_COL_LEN * (unref(getFormProps).autoAdvancedLine || 2)) {
        advanceState.hideAdvanceBtn = false;
        // 超过2行自动折叠
      } else if (!advanceState.isLoad) {
        advanceState.isLoad = true;
        advanceState.isAdvanced = !advanceState.isAdvanced;
      }
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    }

    if (itemColSum > BASIC_COL_LEN * (unref(getFormProps).alwaysShowLines || 1)) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    } else {
      // The first line is always displayed
      return { isAdvanced: true, itemColSum };
    }
  }

  /**
   * 更新advance状态
   */
  function updateAdvanced() {
    let itemColSum = 0;
    let realItemColSum = 0;
    // const { baseColProps = {} } = unref(getFormProps);

    for (const schema of unref(formSchemasRef)) {
      const { vShow } = schema;
      let isShow = true;

      if (isBoolean(vShow)) {
        isShow = vShow;
      }

      if (isFunction(vShow)) {
        isShow = vShow({
          schema,
          formModel,
          field: schema.field,
          formInstance: instance,
          values: {
            ...unref(defaultFormValues),
            ...formModel,
          },
        });
      }

      if (isShow) {
        const { itemColSum: sum, isAdvanced } = getAdvanced(itemColSum);

        itemColSum = sum || 0;
        if (isAdvanced) {
          realItemColSum = itemColSum;
        }

        schema.isAdvanced = isAdvanced;
      }
      // debugger;
    }
    advanceState.actionSpan = (realItemColSum % BASIC_COL_LEN) + unref(getEmptySpan);

    // getAdvanced(unref(getFormProps).actionColOptions || { span: BASIC_COL_LEN }, itemColSum, true);
    getAdvanced(itemColSum, true);
    // debugger;

    emit('advanced-change');
  }

  function handleToggleAdvanced() {
    // debugger;
    advanceState.isAdvanced = !advanceState.isAdvanced;
  }

  return { handleToggleAdvanced };
};
