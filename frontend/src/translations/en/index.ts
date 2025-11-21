import { common, timeAgo } from './common';
import { auth } from './auth';
import * as customer from './customer';
import { staffDashboard } from './staff';
import { ownerDashboard } from './owner';
import * as legal from './legal';

export const en = {
  common,
  timeAgo,
  auth,
  ...customer,
  staffDashboard,
  ownerDashboard,
  ...legal,
};
