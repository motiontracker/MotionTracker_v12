module.exports = {
  apps: [
    {
      name: 'motiontracker-backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
      },
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/dev/stderr', // Direcionar logs de erro para o Docker
      out_file: '/dev/stdout',   // Direcionar logs de saída para o Docker
    },
  ],
};