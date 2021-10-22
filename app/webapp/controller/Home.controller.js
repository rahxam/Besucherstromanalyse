/* globals history, location */
sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    'use strict'

    return BaseController.extend(
      'odc.hackaton.besucherstrom-ui.controller.Home',
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
          // keeps the search state
          this._aTableSearchState = []

          // Model used to manipulate control states
          const oViewModel = new JSONModel({
            worklistTableTitle:
              this.getResourceBundle().getText('worklistTableTitle'),
            shareOnJamTitle: this.getResourceBundle().getText('worklistTitle'),
            shareSendEmailSubject: this.getResourceBundle().getText(
              'shareSendEmailWorklistSubject'
            ),
            shareSendEmailMessage: this.getResourceBundle().getText(
              'shareSendEmailWorklistMessage',
              [location.href]
            ),
            tableNoDataText: this.getResourceBundle().getText('tableNoDataText')
          })
          this.setModel(oViewModel, 'worklistView')
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished: function (oEvent) {
          // update the worklist's object counter after the table update
          let sTitle
          const oTable = oEvent.getSource()
          const iTotalItems = oEvent.getParameter('total')
          // only update the counter if the length is final and
          // the table is not empty
          if (iTotalItems && oTable.getBinding('items').isLengthFinal()) {
            sTitle = this.getResourceBundle().getText(
              'worklistTableTitleCount',
              [iTotalItems]
            )
          } else {
            sTitle = this.getResourceBundle().getText('worklistTableTitle')
          }
          this.getModel('worklistView').setProperty(
            '/worklistTableTitle',
            sTitle
          )
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress: function (oEvent) {
          // The source is the list item that got pressed
          this._showObject(oEvent.getSource())
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack: function () {
          history.go(-1)
        },

        onSearch: function (oEvent) {
          if (oEvent.getParameters().refreshButtonPressed) {
            // Search field's 'refresh' button has been pressed.
            // This is visible if you select any master list item.
            // In this case no new search is triggered, we only
            // refresh the list binding.
            this.onRefresh()
          } else {
            let aTableSearchState = []
            const sQuery = oEvent.getParameter('query')

            if (sQuery && sQuery.length > 0) {
              aTableSearchState = [
                new Filter('name', FilterOperator.Contains, sQuery)
              ]
            }
            this._applySearch(aTableSearchState)
          }
        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh: function () {
          const oTable = this.byId('table')
          oTable.getBinding('items').refresh()
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * On phones a additional history entry is created
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject: function (oItem) {
          const that = this

          oItem
            .getBindingContext()
            .requestCanonicalPath()
            .then(function (sObjectPath) {
              that.getRouter().navTo('object', {
                // eslint-disable-next-line camelcase
                objectId_Old: oItem.getBindingContext().getProperty('ID'),
                objectId: sObjectPath.slice('/Tickets'.length) // /Products(3)->(3)
              })
            })
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function (aTableSearchState) {
          const oTable = this.byId('table')
          const oViewModel = this.getModel('worklistView')
          oTable.getBinding('items').filter(aTableSearchState, 'Application')
          // changes the noDataText of the list in case there are no filter results
          if (aTableSearchState.length !== 0) {
            oViewModel.setProperty(
              '/tableNoDataText',
              this.getResourceBundle().getText('worklistNoDataWithSearchText')
            )
          }
        }
      }
    )
  }
)
