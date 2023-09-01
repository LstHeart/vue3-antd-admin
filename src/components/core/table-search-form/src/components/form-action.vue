<template>
  <Col v-if="showActionButtonGroup" v-bind="actionColOpt">
    <div style="width: 100%" :style="{ textAlign: actionColOpt.style.textAlign }">
      <Form.Item>
        <template v-if="isDrawerButton">
          <div :style="{ color: selColor }" class="advance-filter" @click="toggleDrawer">
            <i class="fa fa-filter fa-fw"></i>
            <span>高级筛选</span>
          </div>
        </template>

        <template v-else>
          <!-- <slot name="advanceBefore"></slot> -->
          <Button
            v-if="showAdvancedButton && !hideAdvanceBtn"
            type="link"
            size="small"
            @click="toggleAdvanced"
          >
            {{ isAdvanced ? '收起' : '展开' }}
            <template v-if="isAdvanced">
              <CaretUpOutlined />
            </template>
            <template v-else>
              <CaretDownOutlined />
            </template>
          </Button>
        </template>

        <!-- <slot name="advanceAfter"></slot> -->
        <!-- <slot name="submitBefore"></slot> -->
        <Button
          v-if="showSubmitButton"
          type="primary"
          class="mr-2"
          v-bind="getSubmitBtnOptions"
          @click="submit"
        >
          {{ getSubmitBtnOptions.text }}
        </Button>

        <!-- <slot name="resetBefore"></slot> -->
        <Button
          v-if="showResetButton"
          type="default"
          class="mr-2"
          v-bind="getResetBtnOptions"
          @click="resetFields"
        >
          {{ getResetBtnOptions.text }}
        </Button>
      </Form.Item>
    </div>
  </Col>
</template>
<script lang="ts" setup>
  import { computed, onMounted, type PropType } from 'vue';
  import { Form, Col } from 'ant-design-vue';
  import { useFormContext } from '../hooks/useFormContext';
  import { Button, ButtonProps } from '@/components/basic/button';
  import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue';
  import type { ColEx } from '../types/component';
  import { selColor } from '@/utils/getColor';

  type ButtonOptions = Partial<ButtonProps> & { text: string };

  defineOptions({
    name: 'FormAction',
    inheritAttrs: false,
  });

  const emit = defineEmits(['toggle-advanced']);

  const props = defineProps({
    showActionButtonGroup: {
      type: Boolean,
      default: true,
    },
    showResetButton: {
      type: Boolean,
      default: true,
    },
    showSubmitButton: {
      type: Boolean,
      default: true,
    },
    showAdvancedButton: {
      type: Boolean,
      default: true,
    },
    resetButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    submitButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    actionColOptions: {
      type: Object as PropType<Partial<ColEx>>,
      default: () => ({}),
    },
    actionSpan: {
      type: Number,
      default: 6,
    },
    isAdvanced: Boolean,
    hideAdvanceBtn: Boolean,
    isDrawerButton: Boolean,
  });

  onMounted(() => {
    debugger;
  });

  const { resetFields, submit, toggleDrawer } = useFormContext();
  const actionColOpt = computed(() => {
    const { showAdvancedButton, actionSpan: span, actionColOptions } = props;
    const actionSpan = 24 - span;
    const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {};
    const actionColOpt: Partial<ColEx> = {
      style: { textAlign: 'right' },
      span: showAdvancedButton ? 6 : 4,
      ...advancedSpanObj,
      ...actionColOptions,
    };
    debugger;
    return actionColOpt;
  });

  const getResetBtnOptions = computed((): ButtonOptions => {
    return Object.assign(
      {
        text: '重置',
      },
      props.resetButtonOptions,
    );
  });

  const getSubmitBtnOptions = computed(() => {
    return Object.assign(
      {
        text: '查询',
      },
      props.submitButtonOptions,
    );
  });

  // 点击【展开/收起】按钮触发
  function toggleAdvanced() {
    debugger;

    emit('toggle-advanced', props.isAdvanced);
  }
</script>
