/**
 * Workspace Local Notifications Helper
 * Does NOT prompt for permission on page load (silent check).
 * Permission can be requested upon user action.
 */
export async function setupNotifications() {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }
    // Never show a permission prompt on page load
    if (Notification.permission === 'default') {
      return;
    }
  } catch (e) {
    // silently catch in web/iframe sandbox
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  } catch (e) {
    console.warn('Notification permission request error:', e);
  }
  return false;
}
