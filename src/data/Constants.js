const CONSTANTS = {
  ACCESS_TOKEN: 'acc_tk',
  REFRESH_TOKEN: 'ref_tk',
  LOCATION: 'route_history',
  SIDEBAR_STATE: 'sidebar_state',
  SIDEBAR_STATE_AGE: 60 * 60 * 24 * 7,
  SIDEBAR_WIDTH: '16rem',
  SIDEBAR_WIDTH_MOBILE: '18rem',
  SIDEBAR_WIDTH_ICON: '3rem',
  SIDEBAR_KEYBOARD_SHORTCUT: 'b'
};

export const USER_STATUS = {
  active: 'ACTIVE',
  blocked: 'BLOCKED',
  pending: 'PENDING'
};

export const PAYMENT_OPTIONS = {
  cash: 'CASH',
  credit: 'CREDIT'
};

export const NO_PRINT_COLUMN = ['actions', 'invoice', 'iqamaDocument'];

export const USER_STATUS_COLOR = new Map([
  ['ACTIVE', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['PENDING', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300'],
  ['BLOCKED', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10']
]);

export const PAYMENT_METHOD_COLOR = new Map([
  ['CASH', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['CREDIT', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10']
]);

export const MANAGER_PROHIBBETED_ROUTES = ['/users', 'users'];

export default CONSTANTS;
