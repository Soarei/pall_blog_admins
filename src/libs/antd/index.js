
import 'ant-design-vue/dist/antd.css'
import Vue from 'vue'
import { Drawer, Collapse, Menu, Dropdown, Modal, Button, message, PageHeader, Card, Table, Empty, Input, Select, FormModel, Upload, Icon, Switch, Tooltip, Checkbox, Layout, Pagination, Alert, Form, Popover, InputNumber, Divider, Row, Col, Tag, Tree, DatePicker, Cascader, Radio, ConfigProvider, Space, Rate, List, Avatar } from 'ant-design-vue'
const components = [Drawer, Collapse, Menu, Dropdown, Modal, Button, message, PageHeader, Card, Table, Empty, Input, Select, FormModel, Upload, Icon, Switch, Tooltip, Checkbox, Layout, Pagination, Alert, Form, Popover, InputNumber, Divider, Row, Col, Tag, Tree, DatePicker, Cascader, Radio, ConfigProvider, Space, Rate, List, Avatar];
export const componentsPlugin = app => components.forEach(app.use, app);
const { confirm } = Modal
Vue.prototype.$antconfirm = confirm
Vue.prototype.$antmessage = message