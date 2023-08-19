export interface InitImportQueryCondition {
  stockId: string;
  tbStatus: string;
  orderNo: string;
  purMode: string;
}

export interface InitStock {
  branchId: string;
  branchName: string;
  contractCode: string;
  contractName: string;
  contractType: number;
  createTime: Date;
  hid: string;
  hosId: string;
  hosName: string;
  mid: string;
  orderNo: string;
  payAmount: number;
  provId: string;
  provName: string;
  rate: number;
  secondId: string;
  secondName: string;
  settleAmount: number;
  settleMonth: string;
}

export interface FormInfo {
  stockId: string;
  areaCode: string;
  purMode: string;
}

export interface BaseDetail {
  id: string;
  hosId: string;
  deptId: string;
  stockId: string;
  orderNo: string;
}

export interface DetailInfo {
  areaCode: string;
  branchId: string;
  characterQty: number;
  createTime: string;
  createUser: string;
  createUserName: string;
  deptId: string;
  generateTime: string;
  hosId: string;
  id: string;
  lastModified: string;
  lastModifiedUser: string;
  orderNo: string;
  purMode: number;
  shelfName: string;
  stockId: string;
  stockName: string;
  stockQty: number;
  tbStatus: number;
  version: number;
}

export type DetailData = {
  detailInfo: DetailInfo;
  purModeList: any[];
};

export type BatchParams = {
  branchId: string;
  hosGoodsId: string;
};

export interface InitStockParam {
  initStockDetailDTOList: InitStockDetailDTOList[];
  initStockId: string;
  orderNo: string;
}

export interface InitStockDetailDTOList {
  hosGoodsCode: string;
  hosGoodsId: string;
  initStockBatches: InitStockBatch[];
  inSettlement: number;
  provId: string;
  subProvId: string;
}

export interface InitStockBatch {
  batchCode: string;
  expdtDate: string;
  pkgDefId: string;
  productDate: string;
  stockQty: number;
}

export interface DetailGoods {
  batchCode: null;
  cnName: null;
  createTime: string;
  createUser: string;
  expdtDate: null;
  generateTime: null;
  generateTimeEnd: null;
  generateTimeStart: null;
  goodsMfrsName: string;
  goodsName: string;
  goodsSpec: string;
  hosGoodsCode: string;
  hosGoodsId: string;
  id: string;
  initStockBatchVOS: InitStockBatchVO[];
  inSettlement: number;
  lastModified: string;
  lastModifiedUser: string;
  orderNo: string;
  pid: string;
  pkgCodeSee: null;
  productDate: null;
  provId: string;
  provName: string;
  purMode: number;
  settleType: null;
  shelfCode: null;
  shelfName: null;
  stockId: null;
  stockName: null;
  stockQty: number;
  subProvId: string;
  subProvName: string;
  supplyId: string;
  unit: string;
  version: number;
}

export interface InitStockBatchVO {
  batchCode?: string;
  createTime?: string;
  createUser?: string;
  detailId?: string;
  expdtDate?: string;
  id?: string;
  lastModified?: string;
  lastModifiedUser?: string;
  pid?: string;
  pkgDefId?: string;
  pkgDefName?: string;
  pkgDefQty?: number;
  productDate?: string;
  purMode?: number;
  stockQty?: number;
  unit?: string;
  unitName?: string;
  version?: number;
}

export interface Goods {
  abroadFlag: null;
  barCodeMng: null;
  brand: string;
  chargeFlag: null;
  createTime: null;
  createUser: null;
  deptId: null;
  deptName: null;
  diPackage: null;
  erpCode: null;
  focusControl: null;
  focusControlType: null;
  fullPkgName: null;
  goodsAgentMfrsId: null;
  goodsDesc: null;
  goodsGeneralName: string;
  goodsMfrsId: string;
  goodsMfrsName: string;
  goodsName: string;
  goodsPackage: null;
  goodsRegCert: string;
  goodsSpec: string;
  grantRule: null;
  herpCode: null;
  hosGoodsCode: string;
  hosGoodsId: string;
  hosId: null;
  hosName: null;
  id: string;
  intoCostFlag: null;
  kindSixtyeightCode: null;
  lastModified: null;
  lastModifiedUser: null;
  levelName: null;
  made: null;
  mdmGoodsCode: null;
  mdmGoodsSpecCode: string;
  mgrLevel: string;
  officialStatus: null;
  pkgDefId: null;
  pkgDefName: null;
  pkgDefQty: null;
  price: number;
  property: null;
  provHosGoodsId: string;
  provId: string;
  purchaseFlag: null;
  purMode: number;
  qty: null;
  rfidFlag: null;
  shelfCode: null;
  shelfNo: null;
  shortPinyin: null;
  spdGoodsCode: null;
  srvId: null;
  stockLower: null;
  stockUpper: null;
  storageConditions: null;
  subProvId: string;
  subPurMode: null;
  tbStatus: number;
  tempFlag: null;
  uniqueCodeStrategy: null;
  unit: string;
  version: null;
}
// export type ExpenseGenerationParams = Omit<Statement, 'createTime' | 'branchName' | 'orderNo'>;
