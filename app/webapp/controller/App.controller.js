sap.ui.define([
  './BaseController'
], function (BaseController) {
  'use strict'

  return BaseController.extend('odc.hackaton.besucherstrom-ui.controller.App', {

    onInit: function () {
      // apply content density mode to root view
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())
      this.setImageModel()
    },

    setImageModel: function () {
      const images = {
        logo: sap.ui.require.toUrl(
          'odc/hackaton/besucherstrom-ui/images/rhs_logo_200_110.png'
        )
      }

      this.getOwnerComponent().getModel('img').setData(images)
    }

  })
})
