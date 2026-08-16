import { useEffect, useCallback } from 'react'

export const useTelegram = () => {
  const tg = window.Telegram?.WebApp

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()
    }
  }, [tg])

  const setHeaderColor = useCallback((color) => {
    tg?.setHeaderColor(color)
  }, [tg])

  const setBackgroundColor = useCallback((color) => {
    tg?.setBackgroundColor(color)
  }, [tg])

  const showMainButton = useCallback((text, onClick) => {
    if (!tg?.MainButton) return
    tg.MainButton.setText(text)
    tg.MainButton.onClick(onClick)
    tg.MainButton.show()
  }, [tg])

  const hideMainButton = useCallback(() => {
    tg?.MainButton?.hide()
  }, [tg])

  const showBackButton = useCallback((onClick) => {
    if (!tg?.BackButton) return
    tg.BackButton.onClick(onClick)
    tg.BackButton.show()
  }, [tg])

  const hideBackButton = useCallback(() => {
    tg?.BackButton?.hide()
  }, [tg])

  const showAlert = useCallback((message) => {
    tg?.showAlert?.(message)
  }, [tg])

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      tg?.showConfirm?.(message, resolve)
    })
  }, [tg])

  const openLink = useCallback((url) => {
    tg?.openLink?.(url)
  }, [tg])

  const openTelegramLink = useCallback((url) => {
    tg?.openTelegramLink?.(url)
  }, [tg])

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    setHeaderColor,
    setBackgroundColor,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    openLink,
    openTelegramLink,
  }
}