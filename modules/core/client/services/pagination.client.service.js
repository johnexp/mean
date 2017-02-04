(function () {
  'use strict';

  angular
    .module('core')
    .factory('PaginationService', PaginationService);

  function PaginationService() {

    var pagination = {
      limit: 10,
      queryLimit: 10,
      limitOptions: [2, 10, 15],
      page: 1,
      sort: '',
      label: '{ page: "Page:", rowsPerPage: "Rows per page:", of: "of" }'
    };

    return {
      getPagination: getPagination,
      setOffset: setOffset
    };

    function getPagination() {
      return pagination;
    }

    function setOffset(pagination) {
      pagination.offset = (pagination.page - 1) * pagination.limit;
    }
  }

}());
