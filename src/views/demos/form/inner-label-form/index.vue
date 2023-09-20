<template>
  <div class="xc-page">
    <a-form :model="state.search" class="xc-header" autocomplete="off" v-innerLabel>
      <a-row>
        <a-col :span="6">
          <a-form-item label="客户名称" name="provName">
            <a-input v-model:value="state.search.provName" allow-clear placeholder="客户名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="客户类型" name="clientType">
            <a-select
              v-model:value="state.search.clientType"
              class="form-selsect"
              :options="state.clientTypeList"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="状态" name="tbStatus">
            <a-select
              v-model:value="state.search.tbStatus"
              class="form-selsect"
              :options="state.statusList"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="采购日期" name="dateValue">
            <a-range-picker
              v-model:value="state.search.dateValue"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              :format="['YYYY-MM-DD', 'YYYY-MM-DD']"
              :placeholder="['开始时间', '截止时间']"
            />
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
  import { reactive, watch } from 'vue';
  import { vInnerLabel } from '@/directives/innerLabel';

  const state = reactive({
    list: [],
    // 搜索
    search: {
      provName: '',
      clientType: '',
      tbStatus: '',
      dateValue: [] as any[],
    },
    // 状态
    statusList: [
      { value: '', label: '全部' },
      { value: 10, label: '待审核' },
      { value: 20, label: '已通过' },
      { value: 30, label: '未通过' },
    ],
    // 客户类型
    clientTypeList: [
      { value: '', label: '全部' },
      { value: '1', label: '医院' },
      { value: '2', label: '厂商' },
    ],
    supplyRelEditFlag: false,
    timeout: {} as any, //客户名称远程搜索定时器
    // 医院名称
    hosNameList: [] as any[],
    // 医院查询分页器
    hosQuery: {
      initHosList: [] as any[],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      inputHosName: '',
    },
    //客户名称
    provNameList: [],

    formCustomer: {
      // 新增编辑数据
      id: '',
      provName: '',
      hosName: '',
      invitationCode: '',
      hosId: '',
      clientType: '1',
      provId: '',
      contactUser: '',
      contactWay: '',
      version: '',
    },
    provNameShow: false, //是否显示客户名称
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
  const restList = () => {
    state.pagination.current = 1;
    state.search.provName = '';
    state.search.clientType = '';
    state.search.tbStatus = '';
    getList();
  };

  // 分页查询系统列表
  async function getList() {}

  watch(
    () => state.formCustomer.clientType,
    (value) => {
      if (value == '1') {
        //客户类型医院时不显示客户名称
        state.provNameShow = false;
      } else {
        state.provNameShow = true;
      }
    },
  );
</script>
<style lang="less" scoped></style>
