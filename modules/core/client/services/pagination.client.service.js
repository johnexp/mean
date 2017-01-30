(function () {
  'use strict';

  angular
    .module('core')
    .factory('PaginationService', PaginationService);

  function PaginationService() {
    return {
      getPagination: function () {
        return {
          limit: 10,
          limitOptions: [5, 10, 15],
          page: 1,
          label: {
            page: 'Página:',
            rowsPerPage: 'Linhas por página:',
            of: 'de'
          }
        };
      }
    };
  }

}());
