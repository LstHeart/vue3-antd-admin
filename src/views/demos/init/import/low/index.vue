<template>
  <div class="xc-layout-tb put-page" v-if="!state.excelData.excelShow">
    <!-- 顶部基本信息 -->
    <XcDetailDescription
      :descriptionsList="items"
      :headerTitle="'期初录入'"
      :detailInfo="detailInfo"
    >
    </XcDetailDescription>

    <div class="xc-content xc-page">
      <div class="xc-content-box" style="padding-top: 8px">
        <a-form
          ref="tableFormRef"
          class="xc-content return-table"
          :model="state.form"
          autocomplete="off"
        >
          <a-row>
            <a-col span="16">
              <DynamicTable
                :columns="lowDetailColumns"
                :row-key="(record) => record.hosGoodsCode"
                :data-source="state.form.displayList"
                :scroll="{ y: '100%' }"
                :table-name="'HERP_INIT_IMPORT_DETAIL_LOW_TABLE'"
                :pagination="false"
                @resizeColumn="handleResizeColumn"
                :row-selection="rowSelectionEntity"
                :row-class-name="handleRowClass"
              >
                <template #tableTopAction>
                  <a-form layout="inline" autocomplete="off">
                    <a-col>
                      <a-form-item label="产品名称" name="goodsName">
                        <a-input
                          allowClear
                          v-model:value.lazy.trim="state.filterGoodsName"
                          placeholder="产品名称"
                        ></a-input>
                      </a-form-item>
                    </a-col>
                    <a-form-item>
                      <a-button type="primary" ghost @click="filterTable">查询</a-button>
                    </a-form-item>
                  </a-form>

                  <a-row class="table-top-action-btn">
                    <div>
                      <a-button type="primary" @click="addGoodsModal" style="margin-right: 16px">
                        新增
                      </a-button>
                      <a-button
                        type="primary"
                        :disabled="!rowSelectionEntity.selectedRowKeys.length"
                        @click="del"
                        style="margin-right: 8px"
                        >移除（{{ rowSelectionEntity.selectedRowKeys.length }}）</a-button
                      >
                      <a-button
                        type="primary"
                        style="margin-right: 8px"
                        :disabled="!rowSelectionEntity.selectedRowKeys.length"
                        @click="showBatchModal"
                        >批量修改（{{ rowSelectionEntity.selectedRowKeys.length }}）</a-button
                      >
                      <a-button type="primary" ghost @click="handleExcelImport">Excel导入</a-button>
                    </div>
                  </a-row>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template
                    v-if="
                      [
                        'hosGoodsCode',
                        'goodsName',
                        'goodsSpec',
                        'goodsMfrsName',
                        'unit',
                        'stockQty',
                      ].includes(column.dataIndex)
                    "
                    >{{ record[column.dataIndex] }}</template
                  >
                  <XcSubProvSelect
                    :column="column"
                    :record="record"
                    :provDataIndex="'provName'"
                    :provDataName="['displayList', index, 'provName']"
                    :provDataRules="{
                      required: true,
                      message: '请选择一级供应商!',
                    }"
                    :subProvDataIndex="'subProvName'"
                    :subProvDataName="['displayList', index, 'subProvName']"
                    :subProvDataRules="{
                      required: true,
                      message: '请选择二级供应商!',
                    }"
                    @rowChange="rowChange($event, index)"
                  ></XcSubProvSelect>
                  <template v-if="column.dataIndex === 'inSettlement'">
                    <a-form-item
                      :name="['displayList', index, 'inSettlement']"
                      :rules="{
                        required: true,
                        message: '请选择结算方式!',
                      }"
                    >
                      <a-select
                        v-model:value="record.inSettlement"
                        style="width: 100%"
                        :options="state.settleTypeList"
                        :show-arrow="true"
                        :filter-option="false"
                        show-search
                        :field-names="{ label: 'value', value: 'key' }"
                      />
                    </a-form-item>
                  </template>
                  <template v-if="column.dataIndex === 'action'">
                    <a-button type="link" @click="editBatch(record)" v-if="!record.editing"
                      >编辑批次</a-button
                    >
                  </template>
                </template>
              </DynamicTable>
            </a-col>
            <a-col span="8">
              <DynamicTable
                :columns="batchColumns"
                :data-source="state.form.batchData"
                :scroll="{ y: '100%' }"
                :table-name="'HERP_INIT_IMPORT_DETAIL_LOW_BATCH_TABLE'"
                :pagination="false"
                :show-index="false"
                @resizeColumn="handleResizeColumn"
              >
                <template #tableTopAction v-if="canEdit">
                  <a-button type="primary" @click="addBatch">添加</a-button>
                </template>

                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'batchCode'">
                    <a-form-item
                      :name="['batchData', index, 'batchCode']"
                      :rules="{
                        required: true,
                        message: '请输入批号!',
                      }"
                    >
                      <a-input
                        :placeholder="'请输入批号'"
                        v-model:value="record.batchCode"
                      ></a-input>
                    </a-form-item>
                  </template>
                  <template v-if="column.dataIndex === 'productDate'">
                    <a-form-item
                      :name="['batchData', index, 'productDate']"
                      :rules="{
                        required: true,
                        message: '请选择生产日期!',
                      }"
                    >
                      <a-date-picker v-model:value="record.productDate" format="YYYY-MM-DD" />
                    </a-form-item>
                  </template>
                  <template v-if="column.dataIndex === 'expdtDate'">
                    <a-form-item
                      :name="['batchData', index, 'expdtDate']"
                      :rules="{
                        required: true,
                        message: '请选择有效期至!',
                      }"
                    >
                      <a-date-picker v-model:value="record.expdtDate" format="YYYY-MM-DD" />
                    </a-form-item>
                  </template>
                  <template v-if="column.dataIndex === 'stockQty'">
                    <a-form-item
                      :name="['batchData', index, 'stockQty']"
                      :rules="{
                        required: true,
                        message: '请输入库存数量!',
                      }"
                    >
                      <a-input-number
                        v-model:value="record.stockQty"
                        style="margin: -5px 0"
                        :min="1"
                        :precision="0"
                        @change="handleQtyChange"
                      />
                    </a-form-item>
                  </template>
                  <template v-if="column.dataIndex === 'pkgDefId'">
                    <a-form-item
                      :name="['batchData', index, 'pkgDefId']"
                      :rules="{
                        required: true,
                        message: '请选择单元含量!',
                      }"
                    >
                      <a-select
                        :disabled="state.stockLevel !== 1"
                        v-model:value="record.pkgDefId"
                        :options="state.pkgDefList"
                        :field-names="{ label: 'pkgDefName', value: 'id' }"
                        style="width: 100%"
                        allowClear
                      ></a-select>
                    </a-form-item>
                  </template>
                  <template v-if="column.dataIndex === 'action'">
                    <a-button type="link" @click="removeBatchRow(index)">移除</a-button>
                  </template>
                </template>
              </DynamicTable>
            </a-col>
          </a-row>
        </a-form>

        <template v-if="state.addVisible">
          <AddGoods
            v-model:visible="state.addVisible"
            :baseDetail="state.baseDetail"
            v-model:addedList="state.tableData"
            @save="handleGoodsSave"
          ></AddGoods>
        </template>

        <DraggableModal
          v-model:visible="state.progress.visible"
          :wrap-style="{ overflow: 'hidden' }"
          width="400px"
          title="生成期初单"
          :footer="null"
          :closable="state.closable"
        >
          <div>
            <div style="display: flex"
              ><a-progress
                style="margin-right: 8px"
                :percent="state.progress.percent"
                :strokeColor="selColor"
                :show-info="false"
              />{{ state.progress.percent }}%
            </div>
            <div style="text-align: center; margin-top: 24px; font-weight: 500">
              <span v-if="!state.closable">执行中</span>
              <span v-else>执行完毕</span>
              ，成功<span style="color: #52c41a">{{ state.progress.successNum }}</span
              >条，失败<span style="color: #ff4d4f">{{ state.progress.failNum }}</span
              >条
            </div>
          </div>
        </DraggableModal>
      </div>
    </div>

    <div class="bottom-btn-div">
      <a-button @click="back">返回</a-button>
      <template v-if="canEdit">
        <a-button type="primary" @click="saveTemp" ghost :loading="state.saveTempLoading"
          >暂存</a-button
        >
        <a-button type="primary" @click="generate" :loading="state.generateLoading">生成</a-button>
      </template>
    </div>
  </div>

  <div v-else class="xc-layout-tb put-page">
    <ExcelImport :uploadParams="state.excelData.uploadParams" @back="backDetail"></ExcelImport>
  </div>
</template>

<script setup lang="tsx">
  import { onMounted, reactive, defineProps, ref } from 'vue';
  import {
    // pick,
    remove,
    // findIndex,
  } from 'lodash-es';
  import { message, Modal } from 'ant-design-vue';
  import { useTable } from '@/components/core/dynamic-table';
  // import { cloneDeep } from 'lodash-es';
  import { AButton } from '@/components/basic/button';
  import XcDetailDescription from '@/components/xc/xc-table/xc-detail-description/index.vue';
  import XcSubProvSelect from '@/components/xc/xc-select/xc-sub-prov-select/index.vue';
  import { items } from './descriptionItems';
  import { DataModalSchemas } from './form-schema';
  import { useFormModal } from '@/hooks/useModal/index';
  import { BaseDetail, DetailInfo, DetailGoods, InitStockParam } from '../typing';
  import initImportApi from '@/api/init/import';
  import { lowDetailColumns, batchColumns } from './columns';
  import AddGoods from './addGoods.vue';
  import ExcelImport from './excelImport.vue';
  import deptApi from '@/api/basic/dept/product';
  import { selColor } from '@/utils/getColor';
  import { DraggableModal } from '@/components/core/draggable-modal';
  import dayjs from 'dayjs';
  import weekday from 'dayjs/plugin/weekday';
  import localeData from 'dayjs/plugin/localeData';

  dayjs.extend(weekday);
  dayjs.extend(localeData);

  const [DynamicTable] = useTable();
  const props = defineProps({
    detailInfo: {
      type: Object as PropType<DetailInfo>,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
    stockInfoList: {
      type: Array as PropType<Array<any>>,
      required: true,
      default: () => [],
    },
    purModeList: {
      type: Array as PropType<Array<any>>,
      required: true,
      default: () => [],
    },
  });
  const emit = defineEmits<{
    (e: 'back'): void;
  }>();

  // Data Definition
  const state = reactive({
    tableData: [] as DetailGoods[], // 低值表格所有数据
    form: {
      // 低值数据表单
      displayList: [] as any[], // 低值表格展示的数据
      batchData: [] as any[], // 批次数据
    },
    baseDetail: {} as BaseDetail,
    filterGoodsName: '', // 产品名称筛选
    addVisible: false, // 添加产品弹窗显示与否
    selectedRowKeys: [] as string[],
    selectedRows: [] as any[],
    excelData: {
      // ExcelImport 组件参数
      excelShow: false,
      uploadParams: {},
    },
    provList: [], // 一级供应商下拉取值
    subProvList: [] as any[], // 二级供应商下拉取值
    settleTypeList: [] as any[], // 结算方式下拉取值
    showBatch: false, // 显示批次维护表格
    batchRecord: {} as any, // 批次关联的产品
    stockLevel: props.stockInfoList.find(
      (item) => item.stockId === props.detailInfo.stockId,
    ) as number,
    pkgDefList: [] as any[], // 单元含量下拉取值
    maxPkgDef: {} as any, // 最大的单元含量
    saveTempLoading: false,
    tempDone: false,
    generateLoading: false,
    // 生成按钮的进度条
    progress: {
      visible: false,
      percent: 0,
      status: 'active',
      successNum: 0,
      failNum: 0,
      totalNum: 0,
    },
    intervalId: 0 as any,
    closable: false,
  });

  const rowSelectionEntity = ref({
    selectedRowKeys: [] as any[],
    selectedList: [] as any[],
    onChange: (selectedRowKeys, selectedRows) => {
      rowSelectionEntity.value.selectedList = selectedRows;
      rowSelectionEntity.value.selectedRowKeys = selectedRowKeys;
    },
  });
  const tableFormRef = ref();

  // Common Functions(Table/Pagination/Styles...)
  const handleResizeColumn = (w, col) => {
    col.width = w;
  };

  const handleRowClass = (record) => {
    return state.batchRecord === record ? 'ant-table-row-selected' : '';
  };

  // 供应商选单变更回调
  const rowChange = (row, index) => {
    state.form.displayList[index].provId = row.provId;
    state.form.displayList[index].provName = row.provName;
    state.form.displayList[index].subProvId = row.subProvId;
    state.form.displayList[index].subProvName = row.subProvName;
    const { id: supplyId = '' } = state.subProvList.find(
      (item: any) => item.provId === row.subProvId,
    );
    state.form.displayList[index].supplyId = supplyId;
  };

  // Life Cycle Functions
  // 初始化加载
  onMounted(() => {
    getLowList();
    getSettleList();
  });

  // Get Dicts Functions
  // 获取结算方式下拉
  const getSettleList = async () => {
    const params = {
      name: 'SettlementEnum',
      keys: [3, 4, 6],
    };
    const data = await initImportApi.getSettleTypeList(params);
    if (data.code === 0) {
      state.settleTypeList = data.data;
    } else {
      state.settleTypeList = [];
    }
  };
  // 获取单元含量列表
  const getPkgDefList = async (record: any) => {
    state.pkgDefList = [];
    let params = {
      branchId: props.detailInfo.branchId,
      hosGoodsId: record.hosGoodsId,
    } as any;

    if (state.stockLevel != 1) {
      params = { pkgDefId: record.pkgDefId };
    }

    try {
      const { code, data } = await deptApi.byGoodsId(params);
      if (code === 0) {
        state.pkgDefList = data || [];
        state.maxPkgDef = state.pkgDefList.reduce((pre, current) => {
          if (pre.qty >= current.qty) {
            return pre;
          }
          return current;
        }, state.pkgDefList[0]);
      }
    } catch (error) {}
  };

  // Business Functions
  // 获取期初低值Table数据
  const getLowList = async (goodsName?: string) => {
    // 清空选中
    rowSelectionEntity.value.selectedList = [];
    rowSelectionEntity.value.selectedRowKeys = [];
    state.form.displayList = [];

    const queryData = {
      pid: props.detailInfo.id,
      goodsName,
    };

    try {
      const { code, data } = await initImportApi.getInitStockDetail(queryData);
      if (code === 0) {
        const goodsList = data || [];
        state.tableData = goodsList;
        state.form.displayList = goodsList;
        if (state.form.displayList.length) {
          // 默认编辑第一笔
          editBatch(state.form.displayList[0]);
          state.showBatch = true;
        }
      }
    } catch (err) {}
  };

  // 通过产品名称过滤表格数据
  const filterTable = () => {
    state.form.displayList = state.tableData.filter((item) =>
      item.goodsName.includes(state.filterGoodsName),
    );
  };

  // 添加产品
  const addGoodsModal = async () => {
    state.baseDetail = {
      id: props.detailInfo.id,
      hosId: props.detailInfo.hosId,
      deptId: props.detailInfo.deptId,
      stockId: props.detailInfo.stockId,
      orderNo: props.detailInfo.orderNo,
    };
    state.addVisible = true;
  };
  const resetGoodsFilter = () => {
    state.filterGoodsName = '';
    state.form.displayList = [...state.tableData];
  };
  const handleGoodsSave = (data) => {
    console.log('goods saved', data);

    resetGoodsFilter();
    editBatch(state.form.displayList[0]);
  };

  // 移除产品
  const del = () => {
    Modal.confirm({
      title: '提示',
      content: '是否确认移除？',
      onOk: async () => {
        remove(state.form.displayList, (item) => {
          return rowSelectionEntity.value.selectedRowKeys.includes(item.hosGoodsCode);
        });
        rowSelectionEntity.value.selectedList = [];
        rowSelectionEntity.value.selectedRowKeys = [];
      },
      onCancel() {},
    });
  };

  // 批量编辑
  const [showModal, modalRenderInstance] = useFormModal();
  const showBatchModal = async () => {
    const [formRef] = await showModal<any>({
      modalProps: {
        title: `批量修改`,
        width: 700,
        footer: (
          <div>
            <AButton
              onClick={() => {
                modalRenderInstance.hide();
              }}
            >
              取消
            </AButton>
            <AButton type="primary" onClick={() => handleModalMsg(formRef)}>
              确定
            </AButton>
          </div>
        ),
        // onFinish: async (values) => {
        //   values.id = record.id;
        // },
      },
      formProps: {
        labelWidth: 100,
        schemas: DataModalSchemas,
        baseCol: {
          span: 24,
        },
      },
    });
    // formRef?.setFieldsValue(state.formState);
  };
  const handleModalMsg = async (formRef) => {
    const values = formRef.getFieldsValue();
    state.form.displayList.map((item) => {
      item.inSettlement = values.inSettlement;
    });
    modalRenderInstance.hide();
  };

  // Excel导入
  const handleExcelImport = () => {
    const { detailInfo } = props;
    state.excelData.uploadParams = {
      hosId: detailInfo.hosId,
      stockId: detailInfo.stockId,
      orderNo: detailInfo.orderNo,
      initStockId: detailInfo.id,
      branchId: detailInfo.branchId,
    };
    state.excelData.excelShow = true;
  };
  // 返回低值详情页面
  const backDetail = () => {
    state.excelData.excelShow = false;
    state.addVisible = false;
    getLowList();
  };

  //  编辑批次
  const editBatch = (record) => {
    //  TODO 编辑前是否保存之前的数据
    state.batchRecord = record;
    state.form.batchData = record.initStockBatchVOS.map((batch) => {
      return {
        ...batch,
        productDate: dayjs(batch.productDate, 'YYYY-MM-DD'),
        expdtDate: dayjs(batch.expdtDate, 'YYYY-MM-DD'),
      };
    });
    record.initStockBatchVOS = state.form.batchData;
    getPkgDefList(record);
  };

  // 添加批次
  const addBatch = () => {
    const defaultBatch = {
      batchCode: '',
      productDate: '',
      expdtDate: '',
      stockQty: 0,
      pkgDefId: state.maxPkgDef?.id || '',
    };
    state.form.batchData.push(defaultBatch);
  };
  // 批次行移除
  const removeBatchRow = (index: number): void => {
    Modal.confirm({
      title: '提示',
      content: '是否确认移除？',
      onOk: async () => {
        state.form.batchData.splice(index, 1);
      },
      onCancel() {},
    });
  };

  const handleQtyChange = () => {
    const { batchData } = tableFormRef.value.getFieldsValue();
    const totalQty = batchData.reduce((pre, current) => {
      return pre + current.stockQty;
    }, 0);
    state.batchRecord.stockQty = totalQty;
  };

  // 返回期初管理初始页面
  const back = () => {
    emit('back');
  };

  // 点击暂存按钮
  const saveTemp = async () => {
    state.saveTempLoading = true;
    state.tempDone = false;

    try {
      await tableFormRef?.value?.validate().then(async () => {
        const initStockDetailDTOList = state.tableData.map((item) => {
          return {
            hosGoodsId: item.hosGoodsId,
            hosGoodsCode: item.hosGoodsCode,
            provId: item.provId,
            subProvId: item.subProvId,
            inSettlement: item.inSettlement,
            initStockBatchVOS: item.initStockBatchVOS,
          };
        });
        const params = {
          initStockId: props.detailInfo.id,
          orderNo: props.detailInfo.orderNo,
          initStockDetailDTOList,
        };
        const res = await initImportApi.importInitStockTemp(params);
        if (res.code === 0) {
          message.success('暂存成功');
          state.tempDone = true;
        } else {
          message.error(res.msg);
        }
      });
    } finally {
      state.saveTempLoading = false;
    }
  };

  // 点击生成按钮
  const generate = async () => {
    state.generateLoading = true;
    const initStockDetailDTOList = state.tableData.map((item) => {
      return {
        hosGoodsCode: item.hosGoodsCode,
        hosGoodsId: item.hosGoodsId,
        inSettlement: item.inSettlement,
        provId: item.provId,
        subProvId: item.subProvId,
        initStockBatches: item.initStockBatchVOS,
      };
    });
    const params = {
      initStockId: props.detailInfo.id,
      orderNo: props.detailInfo.orderNo,
      initStockDetailDTOList,
    } as InitStockParam;
    try {
      const { code, data } = await initImportApi.generateInitStock(params);
      if (code === 0) {
        updateProgress(data.progressKey);
      }
    } finally {
      state.generateLoading = false;
    }
  };

  const updateProgress = async (progressKey) => {
    clearInterval(state.intervalId);
    state.intervalId = setInterval(async function () {
      const data = await initImportApi.getProgressInfo(progressKey);
      if (data.data == null) {
        clearInterval(state.intervalId);
        state.closable = true;
      } else {
        const { totalNum, successNum, failNum } = data.data;
        state.progress.totalNum = totalNum;
        state.progress.successNum = successNum;
        state.progress.failNum = failNum;
        state.progress.percent = Math.floor(((failNum + successNum) * 100) / totalNum);
        state.progress.visible = true;
        if (failNum + successNum >= totalNum) {
          clearInterval(state.intervalId);
          state.closable = true;
          emit('back');
        }
      }
    }, 1000);
  };
</script>

<style lang="less" scoped>
  .approve-page {
    height: 100%;
    position: relative;
    .workflow-chart {
      position: absolute;
      right: 0px;
      top: 57px;
    }
  }
  .warning {
    background: rgba(250, 173, 20, 1);
    color: #fff;
  }

  .put-page {
    background: #f0f2f5 !important;
    padding: 0 !important;
  }
  .statusAll {
    padding: 4px 6px;
    border-radius: 4px;
  }
  .status-0 {
    background: rgba(16, 163, 151, 0.102);
    color: #10a397;
  }
  .status-1 {
    background: rgba(250, 173, 20, 0.1);
    color: #faad14;
  }
  .status-2 {
    background: rgba(255, 77, 79, 0.1);
    color: #ff4d4f;
  }
  :deep(.ant-progress-bg) {
    height: 12px !important;
  }
</style>
