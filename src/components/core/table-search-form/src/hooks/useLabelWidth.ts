import { computed, unref } from 'vue';
import type { Ref } from 'vue';
import type { FormSchema } from '../types/form';
import type { SchemaFormProps } from '../schema-form';
import { isNumber } from '@/utils/is';

export function useItemLabelWidth(schemaRef: Ref<FormSchema>, formPropsRef: Ref<SchemaFormProps>) {
  return computed(() => {
    const schemaItem = unref(schemaRef);
    console.log('🚀 ~ file: useLabelWidth.ts:10 ~ returncomputed ~ schemaItem:', schemaItem);
    const { labelCol = {}, wrapperCol = {} } = schemaItem.formItemProps || {};
    const { labelWidth = 64, disabledLabelWidth } = schemaItem;

    debugger;
    // 内部标签宽度
    const innerLabelWidth = isNumber(labelWidth) ? `${labelWidth}px` : labelWidth;
    // 内部标签是否显示
    const showInnerLabel =
      (isNumber(innerLabelWidth) && innerLabelWidth) || (labelWidth && labelWidth[0] !== '0');

    const {
      labelWidth: globalLabelWidth,
      labelCol: globalLabelCol,
      wrapperCol: globWrapperCol,
    } = unref(formPropsRef);
    console.log('🚀 ~ file: useLabelWidth.ts:26 ~ returncomputed ~ formPropsRef:', formPropsRef);
    // console.log('🚀 ~ file: useLabelWidth.ts:26 ~ returncomputed ~ labelWidth:', labelWidth);

    // 如果labelWidth是全局设置的，则会设置所有项
    if ((!globalLabelWidth && !labelWidth && !globalLabelCol) || disabledLabelWidth) {
      labelCol.style = {
        textAlign: 'left',
      };
      return { innerLabelWidth, showInnerLabel, labelCol, wrapperCol };
    }
    let width = labelWidth || globalLabelWidth;

    const col = { ...globalLabelCol, ...labelCol };
    const wrapCol = { ...globWrapperCol, ...wrapperCol };

    if (width) {
      width = isNumber(width) ? `${width}px` : width;
    }

    return {
      innerLabelWidth,
      showInnerLabel,
      labelCol: { style: { width }, ...col },
      wrapperCol: { style: { width: `calc(100% - ${width})` }, ...wrapCol },
    };
  });
}
