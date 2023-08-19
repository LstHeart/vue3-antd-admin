import { request } from '@/utils/request';

const deptApi = {
  // 科室树
  deptTree(data) {
    return request({
      url: '/platformService/sys/org/v2/deptTree',
      method: 'post',
      data,
    });
  },
  // 科室人员树
  deptPersonTree(data) {
    return request({
      url: '/platformService/sys/org/v2/list/branchDept',
      method: 'post',
      data,
    });
  },
  // 分页查询科室商品信息
  mcmsDeptGoodsInfoList(data) {
    return request({
      url: '/herpService/basic/mcmsDeptGoodsInfo/page',
      method: 'post',
      data,
    });
  },
  //根据id查询科室商品信息
  getById(params) {
    return request({
      url: `/herpService/basic/mcmsDeptGoodsInfo/getById`,
      method: 'get',
      params,
    });
  },
  // 根据id查询医院产品表
  getByIdGoodsInfo(params) {
    return request({
      url: `/herpService/basic/mcmsGoodsInfo/getById`,
      method: 'get',
      params,
    });
  },

  //根据id更新科室商品信息
  updateById(data) {
    return request({
      url: `/herpService/basic/mcmsDeptGoodsInfo/updateById`,
      method: 'post',
      data,
    });
  },

  // 分页查询医院产品(还没有在科室里生成的产品)
  // 科室产品添加弹窗 分页查询医院产品信息
  mcmsGoodsInfoList(data) {
    return request({
      url: `/herpService/basic/mcmsGoodsInfo/list`,
      method: 'post',
      data,
    });
  },
  // 保存科室商品信息
  mcmsGoodsInfoInsert(data) {
    return request({
      url: `/herpService/basic/mcmsDeptGoodsInfo/insert`,
      method: 'post',
      data,
    });
  },
  // 获取医院下所有科室(对应请领目标下拉框)
  deptList(data) {
    return request({
      url: `/platformService/sys/org/v2/list/dept`,
      method: 'post',
      data,
    });
  },
  deptLists(data) {
    return request({
      url: `/platformService/sys/org/v2/deptBuyTarget`,
      method: 'post',
      data,
    });
  },
  branchDeptList(data) {
    return request({
      url: `/platformService/sys/org/v2/list/branchDept`,
      method: 'post',
      data,
    });
  },

  // 查询院区产品信息(对应单元含量下拉框)
  byGoodsId(data) {
    return request({
      url: `/herpService/branchGoodsPkgDef/byGoodsId`,
      method: 'post',
      data,
    });
  },
  // 查询科室所属货位(对应货位下拉框)
  deptShelf(data) {
    return request({
      url: `/herpService/basic/stockShelf/dept/shelf`,
      method: 'post',
      data,
    });
  },
  // 查询科室下默认值
  findDeptGoods(data) {
    return request({
      url: `/herpService/basic/mcmsDeptGoodsInfo/findDeptGoods`,
      method: 'post',
      data,
    });
  },
};
export default deptApi;
