'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/angular-material-icons/angular-material-icons.css',
        'public/lib/angular-material/angular-material.css',
        'public/lib/angular-ui-select/dist/select.css',
        'public/lib/angular-material-data-table/dist/md-data-table.min.css',
        'public/lib/angular-block-ui/dist/angular-block-ui.min.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-translate/angular-translate.js',
        'public/lib/angular-translate-loader-partial/angular-translate-loader-partial.js',
        'public/lib/angular-ui-mask/dist/mask.js',
        'public/lib/angular-material-icons/angular-material-icons.min.js',
        'public/lib/angular-ui-select/dist/select.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-material-data-table/dist/md-data-table.min.js',
        'public/lib/angular-block-ui/dist/angular-block-ui.js',
        'public/lib/moment/moment.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
