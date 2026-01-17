import { useEffect } from 'react'

const SITE_NAME = '技术笔记'

/**
 * 动态设置页面标题的 Hook
 * @param title - 页面标题，不包含站点名称
 * @param options - 配置选项
 */
export function useTitle(title: string | undefined, options?: { template?: boolean }) {
  useEffect(() => {
    if (title) {
      document.title = options?.template !== false ? `${title} | ${SITE_NAME}` : title
    } else {
      document.title = SITE_NAME
    }

    // 组件卸载时重置标题
    return () => {
      document.title = SITE_NAME
    }
  }, [title, options])
}
