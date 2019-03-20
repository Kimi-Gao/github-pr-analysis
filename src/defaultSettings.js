module.exports = {
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#1890FF', // primary color of ant design
  layout: 'topmenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: true, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: false, // sticky siderbar
  menu: {
    disableLocal: false,
  },
  title: 'GITHUBPR',
  pwa: true,
  // your iconfont Symbol Scrip Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont图标项目里要进行批量去色处理
  iconfontUrl: '',
  lastSprintPRFixedRate: 43.3,
  developerStarBlackList: ['Chris-Xie'],
  repos: [{
    "name": "apps",
    "owner": "TradeshiftCN",
    "repo": "Apps",
    "state": "closed",
    "milestone": 4,
    "per_page": 100
  }, {
    "name": "cnPayApps",
    "owner": "TradeshiftCN",
    "repo": "cn-pay-apps",
    "state": "closed",
    "milestone": 4,
    "per_page": 100
  }]
};
