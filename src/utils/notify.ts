import { useQuasar } from 'quasar'

export const useNotify = () => {
  const $q = useQuasar()

  return {
    success: (message: string) => {
      $q.notify({
        type: 'positive',
        message,
        icon: 'check_circle',
        position: 'top-right',
        progress: true,
        timeout: 3000,
        actions: [{ icon: 'close', color: 'white' }]
      })
    },

    error: (message: string) => {
      $q.notify({
        type: 'negative',
        message,
        icon: 'error',
        position: 'top-right',
        progress: true,
        timeout: 5000,
        actions: [{ icon: 'close', color: 'white' }]
      })
    },

    loading: (message: string) => {
      return $q.notify({
        type: 'ongoing',
        message,
        position: 'top',
        timeout: 0,
        spinner: true
      })
    }
  }
}
