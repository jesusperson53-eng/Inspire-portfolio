/**
 * Configuration for the institutional admin entry icon on public pages.
 * - 'signed-out': Icon renders only when no student session is active (default).
 * - 'always': Icon renders on public pages regardless of session state.
 * - 'off': Icon is completely disabled across the application.
 */
export type AdminEntryIconVisibility = 'signed-out' | 'always' | 'off';

export const ADMIN_ENTRY_ICON_VISIBILITY: AdminEntryIconVisibility = 'signed-out';
