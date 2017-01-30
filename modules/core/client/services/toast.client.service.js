(function () {
  'use strict';

  angular.module('core')
    .factory('Toast', Toast);

  Toast.$inject = ['$mdToast', 'blockUI'];

  function Toast($mdToast, blockUI) {
    var self;

    self = {
      toast: toast,
      aviso: aviso,
      erro: erro,
      info: info,
      sucesso: sucesso,
      bloquearTela: bloquearTela,
      desbloquearTela: desbloquearTela
    };

    function toast(mensagem, tema, iconeTema) {
      $mdToast.show($mdToast.customToast()
        .textContent(mensagem)
        .position('top right')
        .hideDelay(6000)
        .theme(tema)
        .themeIcon(iconeTema));
    }

    function aviso(mensagem) {
      return toast(mensagem, 'warning-toast', 'warning');
    }

    function erro(mensagem) {
      return toast(mensagem, 'error-toast', 'error');
    }

    function info(mensagem) {
      return toast(mensagem, 'info-toast', 'info');
    }

    function sucesso(mensagem) {
      return toast(mensagem, 'success-toast', 'done');
    }

    function bloquearTela() {
      blockUI.start('Aguarde...');
    }

    function desbloquearTela() {
      blockUI.stop();
    }

    return self;
  }

}());
