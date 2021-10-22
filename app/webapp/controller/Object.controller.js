/* globals history, location */
sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/routing/History',
    '../model/formatter'
  ],
  function (BaseController, JSONModel, History, formatter) {
    'use strict'

    return BaseController.extend(
      'odc.hackaton.besucherstrom-ui.controller.Object',
      {
        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
          // Model used to manipulate control states. The chosen values make sure,
          // detail page shows busy indication immediately so there is no break in
          // between the busy indication for loading the view's meta data
          const oViewModel = new JSONModel({
            busy: true,
            delay: 0
          })
          this.getRouter()
            .getRoute('object')
            .attachPatternMatched(this._onObjectMatched, this)
          this.setModel(oViewModel, 'objectView')
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack: function () {
          const sPreviousHash = History.getInstance().getPreviousHash()
          if (sPreviousHash !== undefined) {
            history.go(-1)
          } else {
            this.getRouter().navTo('worklist', {}, true)
          }
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched: function (oEvent) {
          const sObjectId = oEvent.getParameter('arguments').objectId
          this._bindView('/Tickets' + sObjectId)
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView: function (sObjectPath) {
          const oViewModel = this.getModel('objectView')

          this.getView().bindElement({
            path: sObjectPath,
            events: {
              change: this._onBindingChange.bind(this),
              dataRequested: function () {
                oViewModel.setProperty('/busy', true)
              },
              dataReceived: function () {
                oViewModel.setProperty('/busy', false)
              }
            }
          })
        },

        _onBindingChange: function () {
          const oView = this.getView()
          const oViewModel = this.getModel('objectView')
          const oElementBinding = oView.getElementBinding()

          // No data for the binding
          if (!oElementBinding.getBoundContext()) {
            this.getRouter().getTargets().display('objectNotFound')
            return
          }

          const oResourceBundle = this.getResourceBundle()

          oView
            .getBindingContext()
            .requestObject()
            .then(function (oObject) {
              const sObjectId = oObject.ID
              const sObjectName = oObject.name

              oViewModel.setProperty('/busy', false)
              oViewModel.setProperty(
                '/shareSendEmailSubject',
                oResourceBundle.getText('shareSendEmailObjectSubject', [
                  sObjectId
                ])
              )
              oViewModel.setProperty(
                '/shareSendEmailMessage',
                oResourceBundle.getText('shareSendEmailObjectMessage', [
                  sObjectName,
                  sObjectId,
                  location.href
                ])
              )
            })
        }
      }
    )
  }
)
