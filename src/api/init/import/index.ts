import { request } from '@/utils/request';
const initImportApi = {
  // 库房下拉列表查询接口
  getStockInfoList(data) {
    return request(
      {
        url: `/herpService/basic/stockInfo/listVo`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  // 库区下拉列表查询接口
  getStockShelfList(data) {
    return request(
      {
        url: `/herpService/basic/stockShelf/list`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  // 耗材类型下拉列表接口
  getPurModeList(data) {
    return request(
      {
        url: `/platformService/dict/value/list`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  // 一级供应商下拉列表接口
  getProvList(data) {
    return request(
      {
        url: `/herpService/basic/mcmsGoodsInfo/provList`,
        method: 'get',
        params: data,
      },
      {
        isGetDataDirectly: false,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  // 二级供应商下拉列表接口
  getSubProvList(data) {
    return request(
      {
        url: `/herpService/basic/mcmsGoodsInfo/subProvList`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  // 结算方式下拉列表接口
  getSettleTypeList(data) {
    return request(
      {
        url: `/herpService/enum/listExclude`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  // 分页查询期初单信息
  getInitStockListPage(data) {
    return request(
      {
        url: `/herpService/mcmsInitStock/listVoPage`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
    );
  },

  // 新增期初单信息接口
  addInitStock(data) {
    return request(
      {
        url: `/herpService/mcmsInitStock/insertInitStock`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
    );
  },
  // 根据id删除期初单
  deleteStockById(id: string) {
    return request(
      {
        url: `/herpService/mcmsInitStock/deleteById/${id}`,
        method: 'delete',
      },
      {
        isGetDataDirectly: false,
      },
    );
  },
  // 根据id查询期初单头信息
  getDetailHeader(id: string) {
    return request(
      {
        url: `/herpService/mcmsInitStock/getById/${id}`,
        method: 'get',
      },
      {
        isGetDataDirectly: false,
      },
    );
  },

  // 期初录入-查询详情接口
  getInitStockDetail(data) {
    return request(
      {
        url: `/herpService/mcmsInitStock/getInitStockDetails`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
    );
  },

  // 期初录入-下载导入模板接口
  downloadInitImportTemplate() {
    return request({
      url: `/herpService/mcmsInitStock/download/template`,
      method: 'get',
    });
  },
  // 期初录入-解析导入文件接口
  uploadInitImportTemplate(data) {
    return request({
      url: `/herpService/mcmsInitStock/upload/file`,
      method: 'post',
      data,
    });
  },
  // 期初录入-新增产品分页查询接口
  getInitStockGoodsList(data) {
    return request(
      {
        url: `/herpService/mcmsInitStock/getMcmsGoodsInfoVOS`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
    );
  },
  // 期初录入-高值扫码识别接口
  // importInitStockByScanCode(data) {
  //   return request({
  //     url: `/herpService/mcmsInitStock/decode`,
  //     method: 'post',
  //     data,
  //   });
  // },

  // 期初明细-查询详情接口
  // getInitStockDetailListPage(data) {
  //   return request({
  //     url: `/herpService/mcmsInitStock/listInitStockDetailCondition`,
  //     method: 'post',
  //     data,
  //   });
  // },

  // 期初录入-暂存接口
  importInitStockTemp(data) {
    return request(
      {
        url: `/herpService/mcmsInitStock/insertTemp`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
    );
  },
  // 期初录入--生成期初库存数据
  generateInitStock(data) {
    return request(
      {
        url: `/herpService/mcmsInitStock/generate`,
        method: 'post',
        data,
      },
      {
        isGetDataDirectly: false,
      },
    );
  },

  //生成期初单进度
  getProgressInfo: (progressKey) => {
    return request(
      {
        url: `/platformService/basic/progress/${progressKey}`,
        method: 'get',
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
};
export default initImportApi;
