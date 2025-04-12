import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import Router from './router'
import AuthRouter from './router/helper/authRouter'
import { ConfigProvider, ThemeConfig } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './main.css'
import '@icon-park/react/styles/index.css'
import { App } from 'antd'
dayjs.locale('zh-cn')
const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0251bf'
  },
  components: {
    Layout: {
      lightSiderBg: '#f5f5f5'
    },
    Menu: {
      itemBg: '#f3f4f4',
      subMenuItemBg: '#f5f5f5',
      itemColor: '#575757',
      itemHoverBg: '#eaeaea',
      popupBg: '#eaeaea',
      itemSelectedBg: '#eaeaea',
      itemSelectedColor: '#0c0c0c',
      itemMarginInline: 10,
      // itemHeight: 38,
      itemBorderRadius: 6
      // collapsedIconSize: 28
    }
  }
}

createRoot(document.getElementById('root')!).render(
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <HashRouter>
        <AuthRouter>
          <App>
            <Router />
          </App>
        </AuthRouter>
      </HashRouter>
    </ConfigProvider>
)
