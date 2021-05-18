import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决重复路由报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const routes = [
  {
    path: '/Login', //登录
    name: 'Login',
    meta: { title: '登录', isLogin: false },
    component: () => import('../views/Login')
  },
  {
    path: '/', //前台首页
    name: 'Index',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
    component: () => import('../views/Index')
  },
  {
    path: '/Front_Course', //前台课程
    name: 'Front_Course',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
    component: () => import('../views/Front_Course')
  },
  {
    path: '/Front_About', //前台关于
    name: 'Front_About',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
    component: () => import('../views/Front_About')
  },
  {
    path: '/Front_News', //前台新闻页
    name: 'Front_News',
    redirect: '/News_Main',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
    component: () => import('../views/News/Front_News'),
    children: [
      {
        path: '/News_Main', //前台新闻主页
        name: 'News_Main',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
        component: () => import('../views/News/News_Main')
      },
      {
        path: '/News_Detail', //前台新闻详情页
        name: 'News_Detail',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
        component: () => import('../views/News/News_Detail')
      },
      {
        path: '/News_All', //前台新闻全部页
        name: 'News_All',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
        component: () => import('../views/News/News_All')
      }
    ]
  },
  {
    path: '/Manage',  //后台管理
    redirect: '/Manage/Home',
    component: () => import('../views/Manage/Main'),
    meta: { title: 'KIDS PT后台管理系统', isLogin: true },
    children: [
      {
        path: 'Home',
        name: 'Home',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Main_Home')
      },
      {
        path: 'User_List',
        name: 'User_List',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/User_List')
      },
      {
        path: 'User_Recycle',
        name: 'User_Recycle',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/User_Recycle')
      },
      {
        path: 'Knowledge',
        name: 'Knowledge',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Knowledge')
      },
      {
        path: 'Message_List',
        name: 'Message_List',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Message_List')
      },
      {
        path: 'Course_List',
        name: 'Course_List',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Course_List')
      },
      {
        path: 'Course_List/Course_List_Child',
        name: 'Course_List_Child',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Course_List_Child')
      },
      {
        path: 'Commend_List',
        name: 'Commend_List',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Commend_List')
      },
      {
        path: 'Commend_Child',
        name: 'Commend_Child',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Commend_Child')
      },
      {
        path: 'Order',
        name: 'Order',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Order')
      },
      {
        path: 'Class_List',
        name: 'Class_List',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Class_List')
      },
      {
        path: 'Class_Student',
        name: 'Class_Student',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Class_Student')
      },
      {
        path: 'Review_List',
        name: 'Review_List',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Review_List')
      },
      {
        path: 'Topic_List',
        name: 'Topic_List',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Topic_List')
      },
      {
        path: 'Manage_Info',
        name: 'Manage_Info',
        meta: { title: 'KIDS PT后台管理系统', isLogin: true },
        component: () => import('../views/Manage/Manage_Info')
      }
    ]
  },
  {
    path: '/Front_Buy_Course', //前台用户购买课程订单页
    name: 'Front_Buy_Course',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
    component: () => import('../views/Order/Front_Buy_Course')
  },
  {
    path: '/Order_Payment', //前台用户购买课程支付页
    name: 'Order_Payment',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
    component: () => import('../views/Order/Order_Payment')
  },
  {
    path: '/Pay_Success', //前台用户购买课程成功页
    name: 'Pay_Success',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
    component: () => import('../views/Order/Pay_Success')
  },
  {
    path: '/Mine', //前台用户我的训练
    name: 'Mine',
    redirect: '/Mine_Home_Re',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
    component: () => import('../views/Mine/Mine'),
    children: [
      {
        path: '/Mine_Course_Home', //前台我的训练课程首页
        name: 'Mine_Course_Home',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Course_Home')
      },
      {
        path: '/Mine_Home_Re', //前台我的训练首页 动态
        name: 'Mine_Home_Re',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Home_Re')
      },
      {
        path: '/Mine_Course', //前台我的训练课程页
        name: 'Mine_Course',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Course')
      },
      {
        path: '/Mine_Plan', //前台我的训练计划页
        name: 'Mine_Plan',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Plan')
      },
      {
        path: '/Mine_Statistic', //前台我的训练统计
        name: 'Mine_Statistic',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Statistic')
      },
      {
        path: '/Mine_Class', //前台我的训练班级
        name: 'Mine_Class',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Class')
      },
      {
        path: '/Mine_Class_Detail', //前台我的训练班级详情
        name: 'Mine_Class_Detail',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Class_Detail')
      },
      {
        path: '/Mine_User', //前台用户个人中心
        name: 'Mine_User',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_User')
      },
      {
        path: '/Mine_Head_Img', //前台修改头像
        name: 'Mine_Head_Img',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Head_Img')
      },
      {
        path: '/Mine_Order', //前台用户订单
        name: 'Mine_Order',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Order')
      },
      {
        path: '/Mine_Collect', //前台用户收藏夹
        name: 'Mine_Collect',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Collect')
      },
      {
        path: '/Mine_Message', //前台通知中心
        name: 'Mine_Message',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Message')
      },
    ]
  },
  {
    path: '/Coach', //前台教练
    name: 'Coach',
    redirect: 'Mine_Home_Re',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
    component: () => import('../views/Coach/Coach'),
    children: [
      {
        path: 'Mine_Home_Re', //前台教练首页
        name: 'Mine_Home_Re',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Home_Re')
      },
      {
        path: '/Coach_Class', //前台教练班级
        name: 'Coach_Class',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Coach/Coach_Class')
      },
      {
        path: '/Coach_Class_Detail', //前台教练班级
        name: 'Coach_Class_Detail',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Coach/Coach_Class_Detail')
      },
      {
        path: '/Coach_Statistic', //前台教练统计
        name: 'Coach_Statistic',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Coach/Coach_Statistic')
      },
      {
        path: '/Coach_Course', //前台教练课程
        name: 'Coach_Course',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Coach/Coach_Course')
      },
      {
        path: 'Mine_Message', //前台通知中心
        name: 'Mine_Message',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Message')
      },
      {
        path: 'Mine_User', //前台教练个人中心
        name: 'Mine_User',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_User')
      },
      {
        path: 'Mine_Head_Img', //前台修改头像
        name: 'Mine_Head_Img',
        meta: { title: 'KIDS PT少儿体能训练', isLogin: true },
        component: () => import('../views/Mine/Mine_Head_Img')
      },
    ]
  },
  {
    path: '/Course_Detail', //前台课程详情
    name: 'Course_Detail',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
    component: () => import('../views/Course/Course_Detail')
  },
  {
    path: '/Course_Offline_Detail', //前台实体课页面
    name: 'Course_Offline_Detail',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
    component: () => import('../views/Course/Course_Offline_Detail')
  },
  {
    path: '/Course_Video', //前台课程播放视频
    name: 'Course_Video',
    meta: { title: 'KIDS PT少儿体能训练', isLogin: false },
    component: () => import('../views/Course/Course_Video')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
