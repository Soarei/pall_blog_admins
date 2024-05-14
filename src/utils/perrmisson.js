import { getUserMenus } from '@/utils/auth'

export function formatTreeList(list) {
  var treeData = [];
  var map = {};
  list.forEach(function (item) {
    item['title'] = item.name;
    item['key'] = item.id
    map[item.id] = item;
  })
  list.forEach(function (item) {
    var parent = map[item.parentId];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      treeData.push(item);
    }
  })
  return treeData;
}

// 处理成路由需要的格式
// const DashBoard = import('@/views/dashboard/index')
import Layout from '@/layout'
export function domenuList() {
  const list = []
  const data = getUserMenus()
  data.forEach(item => {
    const obj = {
      path: item.routeUrl,
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      meta: {
        title: item.name,
        icon: item.icon
      }
    }
    if (item.parentId === 0) {
      obj.component = Layout
      obj.redirect = item.url
      if (item.routeUrl === '/') {
        obj.children = [{
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index'),
          meta: { title: '主页', icon: 'dashboard' }
        }]
      }
    } else {
      obj = {
        "component": () => import('@/views' + item.url)
      }
    }

    list.push(obj)
  })
  console.log(
    list
  );
  return list
}
