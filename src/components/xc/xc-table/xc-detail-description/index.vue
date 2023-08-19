<template>
  <a-descriptions
    v-bind="omit(props, ['headerTitle', 'descriptionsList', 'detailInfo', 'detailRightIcon'])"
    class="xc-header"
  >
    <template #title>
      <div class="xc-header-div" @click="state.headerShow = !state.headerShow">
        {{ props.headerTitle
        }}<span v-if="props.detailRightIcon"
          ><right-outlined
            class="xc-header-icon"
            v-show="state.headerShow"
            @click.stop="state.headerShow = false" /><up-outlined
            class="xc-header-icon"
            v-show="!state.headerShow"
            @click.stop="state.headerShow = true"
        /></span>
      </div>
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra"></slot>
    </template>
    <template v-if="state.headerShow">
      <a-descriptions-item
        v-for="item in props.descriptionsList"
        :key="item.title"
        :label="item.title"
        :span="item.spanNum || 1"
      >
        {{
          typeof item.customRender === 'function'
            ? item.customRender(props.detailInfo)
            : props.detailInfo[item.value] || '--'
        }}
      </a-descriptions-item>
    </template>
  </a-descriptions>
</template>
<script setup lang="ts">
  import { omit } from 'lodash-es';
  import { PropType, reactive } from 'vue';
  import { FormDetailList } from './type';
  import { descriptionsProps } from 'ant-design-vue/es/descriptions/index';
  import { RightOutlined, UpOutlined } from '@ant-design/icons-vue';
  const props = defineProps({
    ...descriptionsProps(),
    headerTitle: {
      type: String,
      required: false,
    },
    descriptionsList: {
      type: Array as PropType<FormDetailList>,
      required: true,
      default: () => [],
    },
    detailInfo: {
      type: Object as PropType<any>,
      required: true,
      default: () => {},
    },
    // 详情展开收起图标=操作展开收起
    detailRightIcon: {
      type: Boolean,
      required: false,
      default: true,
    },
  });
  const state = reactive({
    headerShow: true,
  });
</script>
<style lang="less" scoped>
  .xc-header {
    /deep/ .ant-descriptions-item-label {
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    /deep/ .ant-descriptions-item-content {
      color: #666;
    }
  }
</style>
