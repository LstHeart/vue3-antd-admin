<template>
  <template v-if="state.page === 'index'">
    <div class="xc-page">
      <!-- 基础搜索 -->
      <div class="xc-header xc-header-table-search">
        <a-form :model="state.search" layout="inline" autocomplete="off">
          <a-col :span="6">
            <a-form-item label="库房" name="stockId">
              <a-select
                v-model:value="state.search.stockId"
                placeholder="请选择库房"
                :options="state.stockInfoList"
                :field-names="{ label: 'stockName', value: 'id' }"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="状态" name="tbStatus">
              <a-select
                v-model:value="state.search.tbStatus"
                placeholder="请选择状态"
                :options="INIT_STATUS_OPTIONS"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="期初单号" name="orderNo">
              <a-input
                v-model:value.lazy.trim="state.search.orderNo"
                placeholder="期初单号"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-form-item>
            <a-button type="primary" @click="searchList">查询</a-button>
            <a-button @click="searchReset">重置</a-button>
            <div
              class="advance-filter"
              :style="{ color: selColor }"
              @click="state.drawerVisible = true"
            >
              <i class="fa fa-filter fa-fw"></i>
              <span>高级筛选</span>
            </div>
          </a-form-item>
        </a-form>
      </div>

      <!-- 高级搜索 -->
      <a-drawer
        v-model:visible="state.drawerVisible"
        title="高级筛选"
        placement="right"
        :closable="false"
        :footer-style="{ textAlign: 'right' }"
        :width="500"
      >
        <a-form :model="state.search" autocomplete="off" :label-col="{ style: { width: '100px' } }">
          <a-form-item label="库房" name="stockId">
            <a-select
              v-model:value="state.search.stockId"
              placeholder="请选择库房"
              allow-clear
              show-search
              option-filter-prop="label"
            >
              <a-select-option
                v-for="item in state.stockInfoList"
                :key="item.id"
                :value="item.id"
                :label="item.stockName"
              >
                {{ item.stockName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态" name="tbStatus">
            <a-select
              v-model:value="state.search.tbStatus"
              placeholder="请选择状态"
              :options="INIT_STATUS_OPTIONS"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="期初单号" name="orderNo">
            <a-input
              v-model:value.lazy.trim="state.search.orderNo"
              placeholder="期初单号"
            ></a-input>
          </a-form-item>
          <a-form-item label="耗材类型" name="purMode">
            <a-select
              v-model:value="state.search.purMode"
              placeholder="请选择耗材类型"
              :options="state.purModeList"
              :field-names="{ label: 'cname', value: 'val' }"
              allow-clear
            />
          </a-form-item>
        </a-form>
        <template #footer>
          <a-button style="margin-right: 8px" @click="searchReset">重置</a-button>
          <a-button type="primary" @click="searchList">筛选</a-button>
        </template>
      </a-drawer>

      <!-- 数据展示 -->
      <DynamicTable
        table-name="HERP-INIT-IMPORT"
        :scroll="{ y: '100%' }"
        :columns="columns"
        :data-source="state.tableData"
        :pagination="state.pagination"
        :show-index="true"
        @change="handleTableChange"
        @resize-column="handleResizeColumn"
      >
        <template #tableTopAction>
          <div style="margin-top: 8px">
            <a-button type="primary" style="margin: 0 16px 0 0" @click="addInitStock()">
              新增
            </a-button>
          </div>
        </template>

        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'purMode'">
            {{ getPurMode(text)?.cname }}
          </template>
          <template v-if="column.dataIndex === 'tbStatus'">
            {{ INIT_STATUS_MAP.get(text) }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <template v-if="record.tbStatus === 1">
              <a-button type="link" @click="gotoInsertDetail(record.id, false)">查看详情</a-button>
            </template>
            <template v-else>
              <a-button type="link" @click="handleInsert(record)">录入</a-button>
              <a-popconfirm
                title="是否确认删除"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link">删除</a-button>
              </a-popconfirm>
            </template>
          </template>
        </template>
      </DynamicTable>

      <a-modal v-model:visible="state.modalData.visible" title="新增" centered @ok="handleOk">
        <a-form
          ref="formRef"
          :model="state.modalData.form"
          autocomplete="off"
          label-align="left"
          :label-col="{ span: 4 }"
          :rules="rules"
        >
          <a-form-item label="库房" name="stockId">
            <a-select
              v-model:value="state.modalData.form.stockId"
              placeholder="请选择库房"
              show-search
              option-filter-prop="label"
              @change="handleStockChange"
            >
              <a-select-option
                v-for="item in state.stockInfoList"
                :key="item.id"
                :value="item.id"
                :label="item.stockName"
              >
                {{ item.stockName }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="库区"
            name="areaCode"
            :rules="[{ required: true, message: '请选择库区' }]"
          >
            <a-select
              v-model:value="state.modalData.form.areaCode"
              placeholder="请选择库区"
              show-search
              option-filter-prop="label"
            >
              <a-select-option
                v-for="item in state.stockShelfList"
                :key="item.id"
                :value="item.shelfCode"
                :label="item.shelfName"
              >
                {{ item.shelfName }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="耗材类型" name="purMode">
            <a-select
              v-model:value="state.modalData.form.purMode"
              placeholder="请选择耗材类型"
              :options="state.purModeList"
              :field-names="{ label: 'cname', value: 'val' }"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </template>

  <template v-else-if="state.page === 'detail'">
    <template v-if="state.showLowDetail">
      <LowValue
        v-model:goodsData="state.goodsData"
        :detail-info="state.detailInfo"
        :can-edit="state.canEdit"
        :stock-info-list="state.stockInfoList"
        :pur-mode-list="state.purModeList"
        @back="back"
      ></LowValue>
    </template>
    <template v-else-if="state.showHighDetail"> </template>
  </template>
</template>

<script lang="ts">
  export default {
    // eslint-disable-next-line vue/component-definition-name-casing
    name: '/init/import',
  };
</script>
<script setup lang="ts">
  import { reactive, onMounted, ref } from 'vue';
  // import dayjs from 'dayjs';
  // import { Modal, message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { columns } from './columns';
  // import detail from './detail.vue';
  import { DetailInfo, FormInfo, InitImportQueryCondition } from './typing';
  import LowValue from './low/index.vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { selColor } from '@/utils/getColor';
  import { useTable } from '@/components/core/dynamic-table';
  import { INIT_STATUS_OPTIONS } from '@/enums/initEnum';
  import initImportApi from '@/api/init/import';
  // import { useUserStore } from '@/store/modules/user';
  import { PAGE_OBJ } from '@/enums/paginationEnums';

  const [DynamicTable] = useTable();
  // const userStore = useUserStore();

  // const userQueryParams = {
  //   hosId: userStore.userInfo.corpId,
  //   branchId: userStore.userInfo.branchId,
  // };
  // TODO delete
  const userQueryParams = {
    hosId: 'h0347',
    branchId: 'h0347-123',
  };

  // Data Definition
  const state = reactive({
    search: {} as InitImportQueryCondition,
    drawerVisible: false,
    stockInfoList: [] as any[],
    stockShelfList: [] as any[],
    purModeList: [] as any[],
    tableData: [] as any[],
    pagination: cloneDeep(PAGE_OBJ),
    page: 'index',
    orderId: '',
    modalData: {
      visible: false,
      form: {} as FormInfo,
    },
    detailInfo: {} as DetailInfo,
    showLowDetail: false,
    showHighDetail: false,
    baseDetailInfo: {
      id: '',
      hosId: '',
      deptId: '',
      stockId: '',
      orderNo: '',
    },
    goodsData: [],
    canEdit: true,
  });

  const formRef = ref();

  const INIT_STATUS_MAP = new Map(INIT_STATUS_OPTIONS.map((item) => [item.value, item.label]));

  const rules: Record<string, Rule[]> = {
    stockId: [{ required: true, message: '请选择库房', trigger: 'change' }],
    areaCode: [{ required: true, message: '请选择库区', trigger: 'change' }],
    purMode: [{ required: true, message: '请选择耗材类型', trigger: 'change' }],
  };

  // Common Functions(Table/Pagination/Styles...)
  // 拖拉表格列
  const handleResizeColumn = (w, col) => {
    col.width = w;
  };
  // 页码改变
  const handleTableChange = (pagination) => {
    state.pagination.current = pagination.current;
    state.pagination.pageSize = pagination.pageSize;
    if (state.pagination.pageSize != pagination.pageSize) {
      state.pagination.pageSize = pagination.pageSize;
      state.pagination.current = 1;
    } else {
      state.pagination.current = pagination.current;
    }
    queryList();
  };

  // Life Cycle Functions
  onMounted(() => {
    getStockInfoList();
    getPurModeList();
    searchList();
  });

  // Get Dicts Functions
  // 库房下拉列表
  const getStockInfoList = async () => {
    const queryData = {
      ...userQueryParams,
      stockLevelList: [],
    };
    try {
      const { code, data } = await initImportApi.getStockInfoList(queryData);
      if (code === 0) {
        state.stockInfoList = data || [];
      }
    } catch (err) {
      message.error('获取库房信息失败');
    }
  };
  // 耗材类型下拉列表
  const getPurModeList = async () => {
    try {
      const { code, data } = await initImportApi.getPurModeList({ dictId: 'PUR_MODE' });
      if (code === 0) {
        const list = data || [];
        state.purModeList = list;
      }
    } catch (err) {
      message.error('获取耗材类型信息失败');
    }
  };
  const getPurMode = (text: number) => {
    return state.purModeList.find((item) => Number(item.val) === text);
  };

  // 库区下拉列表
  const getStockShelfList = async () => {
    try {
      const { form } = state.modalData;
      const queryData = {
        stockAreaId: form.stockId,
        stockType: 0, // 0 查库区
      };
      const { code, data } = await initImportApi.getStockShelfList(queryData);
      if (code === 0) {
        state.stockShelfList = data || [];
      }
    } catch (err) {
      message.error('获取库区信息失败');
    }
  };

  // 库房-库区联动
  const handleStockChange = () => {
    state.modalData.form.areaCode = '';
    getStockShelfList();
  };

  // Business Functions
  // 期初库存分页查询列表
  const queryList = async () => {
    state.tableData = [];
    try {
      const param = reactive({
        pageNum: state.pagination.current,
        pageSize: state.pagination.pageSize,
        queryObject: {
          ...state.search,
          ...userQueryParams,
        },
      });
      const { code, data } = await initImportApi.getInitStockListPage(param);
      if (code === 0) {
        state.tableData = data.data;
        state.pagination.total = data.total;
        state.pagination.pageSize = data.pageSize;
        state.pagination.current = data.pageNum;
      }
    } catch (error) {}
  };

  // 查询
  const searchList = () => {
    state.drawerVisible = false;
    state.pagination.current = 1;
    queryList();
  };

  // 重置
  const searchReset = () => {
    state.search = {} as InitImportQueryCondition;
    searchList();
  };

  // 新增期初库存
  const addInitStock = () => {
    state.modalData.visible = true;
  };

  // 新增保存
  const handleOk = () => {
    formRef.value.validate().then(async () => {
      const { form } = state.modalData;
      const queryData = {
        ...form,
        ...userQueryParams,
      };

      try {
        const { code, data } = await initImportApi.addInitStock(queryData);
        if (code === 0) {
          state.orderId = data || '';
          resetModal();
          gotoInsertDetail(state.orderId);
        }
      } catch (err) {}
    });
  };

  // 重置新增弹窗
  const resetModal = () => {
    state.modalData.form = {} as FormInfo;
    state.modalData.visible = false;
  };

  // 点击录入
  const handleInsert = (record) => {
    gotoInsertDetail(record.id);
  };

  // 点击删除
  const handleDelete = async (record) => {
    try {
      const { code } = await initImportApi.deleteStockById(record.id);
      if (code === 0) {
        message.success('删除成功');
        searchList();
      }
    } catch (error) {}
  };

  // 跳转到录入详情页面
  const gotoInsertDetail = async (id: string, canEdit = true) => {
    try {
      const { code, data } = await initImportApi.getDetailHeader(id);
      if (code === 0) {
        state.detailInfo = data;
        state.canEdit = canEdit;
        state.showLowDetail = [10, 60].includes(data.purMode);
        state.showHighDetail = [20].includes(data.purMode);
        state.page = 'detail';
      }
    } catch (err) {}
  };

  const back = () => {
    state.page = 'index';
    searchList();
  };
</script>
<style lang="less" scoped></style>
