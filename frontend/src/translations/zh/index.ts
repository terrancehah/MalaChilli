import { common, timeAgo } from './common';
import { auth } from './auth';
import * as customer from './customer';
import { staffDashboard } from './staff';
import { merchantDashboard } from './merchant';
import * as legal from './legal';

export const zh = {
  common,
  timeAgo,
  auth,
  ...customer,
  staffDashboard,
  merchantDashboard,
  ...legal,
};
