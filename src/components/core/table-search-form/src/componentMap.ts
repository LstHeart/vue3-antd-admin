/**
 * Component list, register here to setting it in the form
 */
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Tree,
  Slider,
  Rate,
  // Divider,
  Upload,
} from 'ant-design-vue';

const componentMap = {
  Input,
  InputGroup: Input.Group,
  InputPassword: Input.Password,
  InputSearch: Input.Search,
  InputTextArea: Input.TextArea,
  InputNumber,
  AutoComplete,
  Select,
  TreeSelect,
  Tree,
  Switch,
  RadioGroup: Radio.Group,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Cascader,
  Slider,
  Rate,
  DatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  TimePicker,
  Upload,

  // Divider,
};
const innerLabelMap = {
  Input,
  // InputGroup: Input.Group,
  // InputPassword: Input.Password,
  // InputSearch: Input.Search,
  InputTextArea: Input.TextArea,
  InputNumber,
  // AutoComplete,
  Select,
  TreeSelect,
  Tree,
  // Switch,
  // RadioGroup: Radio.Group,
  // Checkbox,
  // CheckboxGroup: Checkbox.Group,
  Cascader,
  // Slider,
  // Rate,
  DatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  TimePicker,
  // Upload,

  // Divider,
};

/* 需要为标签禁用point-events的组件 */
const disablePointMap = {
  Select,
  TreeSelect,
  Tree,
  Cascader,
  DatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  TimePicker,
};

export type ComponentMapType = keyof typeof componentMap;

export { componentMap, innerLabelMap, disablePointMap };
