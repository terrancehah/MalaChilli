import { common, timeAgo } from './common';
import { auth } from './auth';
import * as customer from './customer';
import { staffDashboard } from './staff';
import { merchantDashboard } from './merchant';
import * as legal from './legal';
import { home } from './home';

export const ms = {
  common,
  timeAgo,
  auth,
  ...customer,
  staffDashboard,
  merchantDashboard,
  ...legal,
  home,
};
