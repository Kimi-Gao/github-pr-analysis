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
  developerStarBlackList: ['Chris-Xie'],
  lastSprint: 'Damo-8',
  currentSprint: 'Damo-9',
  sprintConfig: [
    {
      "sprint": 'Damo-6',
      "fixedRate": 50.8,
      repos: [{
        "name": "apps",
        "owner": "TradeshiftCN",
        "repo": "Apps",
        "state": "closed",
        "milestone": 1,
        "per_page": 100
      }, {
        "name": "cnPayApps",
        "owner": "TradeshiftCN",
        "repo": "cn-pay-apps",
        "state": "closed",
        "milestone": 1,
        "per_page": 100
      }]
    }, {
      "sprint": 'Damo-7',
      "fixedRate": 54.7,
      repos: [{
        "name": "apps",
        "owner": "TradeshiftCN",
        "repo": "Apps",
        "state": "closed",
        "milestone": 2,
        "per_page": 100
      }, {
        "name": "cnPayApps",
        "owner": "TradeshiftCN",
        "repo": "cn-pay-apps",
        "state": "closed",
        "milestone": 2,
        "per_page": 100
      }]
    }, {
      "sprint": 'Damo-8',
      "fixedRate": 43.3,
      repos: [{
        "name": "apps",
        "owner": "TradeshiftCN",
        "repo": "Apps",
        "state": "closed",
        "milestone": 3,
        "per_page": 100
      }, {
        "name": "cnPayApps",
        "owner": "TradeshiftCN",
        "repo": "cn-pay-apps",
        "state": "closed",
        "milestone": 3,
        "per_page": 100
      }]
    }, {
      "sprint": 'Damo-9',
      "fixedRate": null,
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
      }, {
        "name": "cnResellerMarketplaceApps",
        "owner": "TradeshiftCN",
        "repo": "cn-reseller-marketplace-apps",
        "state": "closed",
        "milestone": 1,
        "per_page": 100
      }]
    }
  ]
};
