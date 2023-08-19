import {
  Modal,
  Table,
  Menu,
  Input,
  Form,
  Card,
  Checkbox,
  Radio,
  Col,
  Row,
  Select,
  DatePicker,
  Steps,
  Switch,
  Button,
  List,
  Tree,
  Cascader,
  Space,
  Tooltip,
  InputNumber,
  Divider,
  Empty,
  Image,
  Popconfirm,
  Pagination,
  Spin,
  TreeSelect,
  PageHeader,
  Descriptions,
  Drawer,
  Tabs,
  Carousel,
  Collapse,
  Upload,
  Badge,
  Progress,
  Popover,
  Dropdown,
  Alert,
  Statistic,
  Timeline,
} from 'ant-design-vue';
import type { App } from 'vue';
import 'ant-design-vue/dist/antd.variable.min.css';
import 'dayjs/locale/zh-cn';

export function setupAntd(app: App<Element>) {
  // app.component('AButton', AButton);
  app.component('ADescriptionsItem', Descriptions.Item);

  app
    .use(Button)
    .use(Form)
    .use(Input)
    .use(Modal)
    .use(Table)
    .use(Menu)
    .use(Card)
    .use(Checkbox)
    .use(Radio)
    .use(Col)
    .use(Row)
    .use(Select)
    .use(DatePicker)
    .use(Steps)
    .use(Switch)
    .use(List)
    .use(Tree)
    .use(Cascader)
    .use(Space)
    .use(Tooltip)
    .use(Divider)
    .use(Empty)
    .use(Image)
    .use(Popconfirm)
    .use(Pagination)
    .use(Spin)
    .use(TreeSelect)
    .use(InputNumber)
    .use(PageHeader)
    .use(Drawer)
    .use(Collapse)
    .use(Tabs)
    .use(Carousel)
    .use(Upload)
    .use(Descriptions)
    .use(Badge)
    .use(Progress)
    .use(Dropdown)
    .use(Alert)
    .use(Statistic)
    .use(Timeline)
    .use(Popover);
}
