<?php 
  define('DB_NAME', $_SERVER['RDS_DB_NAME']);
  define('DB_USER', $_SERVER['RDS_USERNAME']);
  define('DB_PASSWORD', $_SERVER['RDS_PASSWORD']);
  define('DB_HOST', $_SERVER['RDS_HOSTNAME']);
  // define('DB_TABLE', 'urler');
  define('DB_TABLE', 't_books');
  define('DB_TABLE_PUNCH', 't_punch_records');
  define('DB_TABLE_ACTIVITY', 't_activities');
  define('DB_TABLE_ACTIVITY_FIGURE', 't_activities_figure');
  define('DB_TABLE_AREAS_TARGET', 't_areas_target');
  define('DB_TABLE_MAJOR_AREAS', 't_major_areas');
  define('DB_TABLE_SUB_AREAS', 't_sub_areas');
?>