<template>
  <div class="xc-page">
    <a-form :model="state.search" class="xc-header" autocomplete="off" v-innerLabel>
      <a-row>
        <a-col :span="6">
          <a-form-item label="文本输入框" name="Input">
            <a-input v-model:value="state.search.input" allow-clear placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="数字输入框" name="inputNumber">
            <a-input-number
              id="form_item_inputNumber"
              v-model:value="state.search.inputNumber"
              :min="1"
              :max="10"
              placeholder="请输入"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="数字输入框带后缀" name="inputNumber2">
            <a-input-number v-model:value="state.search.inputNumber2" id="form_item_inputNumber2">
              <template #addonAfter>
                <a-select v-model:value="state.search.inputNumberSelect" style="width: 60px">
                  <a-select-option value="USD">$</a-select-option>
                  <a-select-option value="EUR">€</a-select-option>
                  <a-select-option value="GBP">£</a-select-option>
                  <a-select-option value="CNY">¥</a-select-option>
                </a-select>
              </template>
            </a-input-number>
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="下拉单选选择框" name="select">
            <a-select
              v-model:value="state.search.select"
              :options="state.selectList"
              placeholder="请选择"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="下拉多选选择框" name="select">
            <a-select
              allow-clear
              v-model:value="state.search.select2"
              mode="multiple"
              style="width: 100%"
              placeholder="请选择"
              :options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="下拉可搜索框" name="selectSearch">
            <a-select
              v-model:value="state.search.selectSearch"
              :options="state.selectSearchList"
              placeholder="请选择"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="级联选择" name="cascader">
            <a-cascader
              v-model:value="state.search.cascader"
              :options="state.cascaderOptions"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="日期选择框" name="dateValue">
            <a-date-picker v-model:value="state.search.dateValue" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="时间范围选择框" name="dateRangeValue">
            <a-range-picker
              v-model:value="state.search.dateRangeValue"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              :format="['YYYY-MM-DD', 'YYYY-MM-DD']"
              :placeholder="['开始时间', '截止时间']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="树选择" name="tree">
            <a-tree-select
              v-model:value="state.search.tree"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              tree-default-expand-all
              :tree-data="state.treeData"
              tree-node-filter-prop="label"
            >
              <template #title="{ value: val, label }">
                <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
                <template v-else>{{ label }}</template>
              </template>
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="树选择多选" name="tree2">
            <a-tree-select
              v-model:value="state.search.tree2"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              multiple
              tree-default-expand-all
              :tree-data="state.treeData"
              tree-node-filter-prop="label"
            >
              <template #title="{ value: val, label }">
                <b v-if="val === 'parent 1-1'" style="color: #08c">{{ val }}</b>
                <template v-else>{{ label }}</template>
              </template>
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <a-button type="primary" @click="searchList">查询</a-button>
            <a-button style="margin-left: 16px" @click="restList">重置</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { vInnerLabel } from '@/directives/innerLabel';

  const state = reactive({
    list: [],
    // 搜索
    search: {
      input: '',
      inputNumber: 0,
      inputNumber2: 0,
      inputNumberSelect: '',
      select: '',
      select2: '',
      selectSearch: '',
      cascader: [] as any[],
      dateValue: '',
      dateRangeValue: [] as any[],
      tree: '',
      tree2: [] as any[],
    },
    selectList: [
      { value: '', label: '全部' },
      { value: '1', label: '医院' },
      { value: '2', label: '厂商' },
    ],
    selectSearchList: [
      { value: '', label: '全部' },
      { value: 10, label: '待审核' },
      { value: 20, label: '已通过' },
      { value: 30, label: '未通过' },
    ],
    cascaderOptions: [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ],
    treeData: [
      {
        label: 'parent 1',
        value: 'parent 1',
        children: [
          {
            label: 'parent 1-0',
            value: 'parent 1-0',
            children: [
              {
                label: 'my leaf',
                value: 'leaf1',
              },
              {
                label: 'your leaf',
                value: 'leaf2',
              },
            ],
          },
          {
            label: 'parent 1-1',
            value: 'parent 1-1',
          },
        ],
      },
    ],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      simple: false,
      hideOnSinglePage: false, // 只有一页时是否隐藏分页器
      showQuickJumper: true, //是否可以快速跳转至某页
      showSizeChanger: true, //是否可以快速跳转至某页
      showTotal: (total) => `共 ${total} 条`,
    },
  });

  // 查询条件
  const searchList = () => {
    state.pagination.current = 1;
    getList();
  };
  // 重置查询
  const restList = () => {};

  // 分页查询列表
  async function getList() {}
</script>
<style lang="less" scoped></style>
