export type Item = {
  title: string;
  value: string;
  spanNum?: Number; // 包含列的数量
  customRender?: Function; // customRender方法
};
export type FormDetailList = Item[];
