const CONSTANTS = {
  ACCESS_TOKEN: 'acc_tk',
  REFRESH_TOKEN: 'ref_tk',
  LOCATION: 'flex_route_history',
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

export const STATUS_COLOR = new Map([
  ['published', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['awaiting', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300']
]);

export const APPROVAL_COLOR = new Map([
  ['CASH', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['CREDIT', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10']
]);

export const CATEGORY_COLOR = [
  'bg-blue-100/30 text-blue-800 border-blue-200',
  'bg-slate-100/30 text-slate-800 border-slate-200',
  'bg-purple-100/30 text-purple-800 border-purple-200',
  'bg-emerald-100/30 text-emerald-800 border-emerald-200',
  'bg-yellow-100/30 text-yellow-800 border-yellow-200',
  'bg-teal-100/30 text-teal-800 border-teal-200'
];

export const HOSTAWAY_CHANNEL_MAP = ['airbnb', 'booking', 'vrbo', 'direct'];

export default CONSTANTS;
