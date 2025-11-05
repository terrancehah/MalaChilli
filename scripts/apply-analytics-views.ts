/**
 * Script to apply analytics views to Supabase database
 * Run with: npx tsx scripts/apply-analytics-views.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://amyjfebmeskingoovyhb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('📊 Applying analytics views migration...\n');

  const migrationPath = path.join(__dirname, '../supabase/migrations/20251106000001_owner_analytics_views_fixed.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error applying migration:', error);
      process.exit(1);
    }

    console.log('✅ Analytics views migration applied successfully!');
    console.log('\nCreated views:');
    console.log('  - virality_metrics');
    console.log('  - customer_sharing_stats');
    console.log('  - saved_codes_pipeline');
    console.log('  - network_growth_daily');
    console.log('  - revenue_analytics');
    console.log('  - upline_rewards_stats');
    console.log('  - discount_breakdown');
    console.log('  - peak_hours_analysis');
    console.log('  - customer_segmentation');
    console.log('  - customer_acquisition_source');
    console.log('  - cohort_retention');
    console.log('  - customer_lifetime_value');
    console.log('\nCreated functions:');
    console.log('  - get_dashboard_summary()');
    console.log('  - get_top_sharers()');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

applyMigration();
