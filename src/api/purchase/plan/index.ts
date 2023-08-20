import { request } from '@/utils/request';

const planApi = {
  // 分页查询采购计划单Page
  planListVoPage(data) {
    return request({
      url: '/herpService/purPlan/listVoPage',
      method: 'post',
      data,
    });
  },
  // 根据id查询采购计划单
  getById(data) {
    return request({
      url: `/herpService/purPlan/getById/${data.id}`,
      method: 'post',
      data,
    });
  },
  // 分页查询采购计划单Page
  purPlanList(data) {
    return request({
      url: '/herpService/purPlan/listVo',
      method: 'post',
      data,
    });
  },
  // 查询列表医院商品单元包装定义表
  branchGoodsPkgDef(data) {
    return request({
      url: '/herpService/branchGoodsPkgDef/list',
      method: 'post',
      data,
    });
  },
  branchGoodsPkgDefByBuyPurMode(data) {
    return request({
      url: '/herpService/branchGoodsPkgDef/listBuyPurMode',
      method: 'post',
      data,
    });
  },
  // 保存
  purPlanInsert(data) {
    return request({
      url: '/herpService/purPlan/insert',
      method: 'post',
      data,
    });
  },
  // 自动保存
  purPlanAutoSubmit(data) {
    return request({
      url: '/herpService/purPlan/submit',
      method: 'post',
      data,
    });
  },
  // 一键生成
  purPlanSubmit(data) {
    return request({
      url: '/herpService/purPlan/oneSubmit',
      method: 'post',
      data,
    });
  },
  //根据医院&供应商id查询详情
  companyDetail(params) {
    return request({
      url: `/platformService/basic/company/detail/${params.id}`,
      method: 'get',
      params,
    });
  },
  //查询自动建议列表
  purPlanAuto(data) {
    return request({
      url: '/herpService/purPlan/listAuto',
      method: 'post',
      data,
    });
  },
  //采购计划批量调整
  purPlanEdit(data) {
    return request({
      url: '/herpService/purPlan/edit',
      method: 'post',
      data,
    });
  },
  //提交采购计划单
  submitPurPlan(data) {
    return request({
      url: '/herpService/purPlan/submitPurPlan',
      method: 'post',
      data,
    });
  },
  //采购计划单审核
  auditPurPlan(data) {
    return request({
      url: '/herpService/purPlan/auditPurPlan',
      method: 'post',
      data,
    });
  },
  //获取枚举字典
  getRecTypeList(data) {
    return request({
      url: `/herpService/enum/list/${data.name}`,
      method: 'get',
      params: data,
    });
  },
  //查询采购计划单详情列表Page
  detailVoPage(data) {
    return request({
      url: `/herpService/purPlan/detailVoPage`,
      method: 'post',
      data,
    });
  },
  // 根据产品id查询供应关系
  mcmsGoodsInfoSupply(data) {
    return request(
      {
        url: `/herpService/basic/mcmsGoodsInfo/provList`,
        method: 'get',
        params: data,
      },
      {
        isMock: true,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  // 根据产品id查询供应关系
  mcmsGoodsSubProvList(data) {
    return request(
      {
        url: `/herpService/basic/mcmsGoodsInfo/subProvList`,
        method: 'post',
        data,
      },
      //  {
      //   isLoading: false,
      //  },
    );
  },
  //查询结算规则列表
  getSettleType(id) {
    return request({
      url: `/herpService/purPlan/getSettlementList/${id}`,
      method: 'get',
    });
  },
};

export default planApi;
