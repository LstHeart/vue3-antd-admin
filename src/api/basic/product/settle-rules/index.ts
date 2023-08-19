import { request } from '@/utils/request';

const settleApi = {
  //查询结算规则列表
  getSettleType() {
    return request({
      url: '/herpService/supplyProvHosGoods/getSettleType',
      method: 'get',
    });
  },

  //查询分页详情
  supplyProvHosGoods(data) {
    return request({
      url: '/herpService/supplyProvHosGoods/queryPage',
      method: 'post',
      data,
    });
  },

  //修改请领规则
  updateSettleType(data) {
    return request({
      url: '/herpService/supplyProvHosGoods/updateSettleType',
      method: 'post',
      data,
    });
  },
  //查看日志
  mcmsOpLog(data) {
    return request({
      url: 'herpService/mcmsOpLog/list',
      method: 'post',
      data,
    });
  },
};
export default settleApi;
