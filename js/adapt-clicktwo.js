/*
 * adapt-clicktwo
 * License - https://github.com/daya-cd
 * 
 */
 define([
    'coreViews/componentView',
    'coreJS/adapt',
     './adapt-clickHelpers'
    ], function(ComponentView, Adapt) {


        var clicktwo = ComponentView.extend({

            events: {
                'click .clicktwo-indicator': 'onClickDisplayItem',
                'click .clicktwo-popup-close': 'onClickCloseItem'
            },

            preRender: function() {
                this.listenTo(Adapt, 'device:resize', this.resizeControl, this);
            },


        // This function called on triggering of device resize event of Adapt.
        resizeControl: function() {
            this.setDeviceSize();
            var tabViewContainer = this.$('.clicktwo-tabViewContainer');
            if (!this.model.get('_isDesktop')) {
                tabViewContainer.fadeOut();
            } else if (this.getVisitedItems().length > 0) {
                tabViewContainer.show();
            }
        },


        // set component variable according to size of screen.
        setDeviceSize: function() {
            if (Adapt.device.screenSize === 'large') {
                this.$el.addClass('desktop').removeClass('mobile');
                this.model.set('_isDesktop', true);
            } else {
                this.$el.addClass('mobile').removeClass('desktop');
                this.model.set('_isDesktop', false);
            }
        },

        // this is use to set ready status for current component on postRender.
        postRender: function() {
            this.setDeviceSize();
            var flag = this.model.get('_flag');
            if (flag == "horizontal") {
                this.$('.clicktwo-container').addClass('clicktwo-horizontal');
            } else if (flag == "vertical") {
                this.$('.clicktwo-container').addClass('clicktwo-vertical');
            }
            this.$('.clicktwo-tabViewContainer').show();

            this.$('.clicktwo-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
            // $('.clicktwo-tabItem').addClass('animated bounceOutLeft');

        },

        // Used to check if the flipcard should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }

            _.each(this.model.get('_items'), function(item) {
                item._isVisited = false;
            });
        },

        // handler function for click event on indicator element.
        onClickDisplayItem: function(event) {

             $('img.on').hide();
                $('img.off').show();
            if (event && event.preventDefault) event.preventDefault();
            var $selectedElement = $(event.currentTarget);
            var indicatorIndex = this.$('.clicktwo-indicator').index($selectedElement);

            var dataIndex=$selectedElement.data("id");
            $(".defaultimage").hide();


        
            this.setDeviceSize();
            var $tabViewContainer = this.$('.clicktwo-tabViewContainer');
            if (!this.model.get('_isDesktop')) {
                $tabViewContainer.fadeOut();
            } else if (this.getVisitedItems().length > 0) {
                $tabViewContainer.show();
            }


            $selectedElement.children().eq(0).hide();
            $selectedElement.children().eq(1).show();
            
            

            this.$('.clicktwo-navContainer .clicktwo-indicator').removeClass('clicktwo-indicatorActive');
            if ($selectedElement.hasClass('clicktwo-indicator-img')) {
                $selectedElement.closest('.clicktwo-indicator').addClass('clicktwo-indicatorActive');
            } else {
                $selectedElement.addClass('clicktwo-indicatorActive');
            }
            this.$('.clicktwo-tabViewContainer .clicktwo-tabItem').hide().promise().done(function(){

               
                $(".clicktwo-tabViewContainer .show"+dataIndex+"").show();


            });
            



            if (!this.model.get('_isDesktop')) {
                var $popup = this.$('.clicktwo-popup');
                $popup.removeClass('display-none');

                $popup.find('.clicktwo-popup-toolbar-title').fadeOut();
                $popup.find('.clicktwo-popup-body').fadeOut();

                $popup.find('.clicktwo-popup-toolbar-title:eq(' + indicatorIndex + ')').show();
                $popup.find('.clicktwo-popup-body:eq(' + indicatorIndex + ')').show();
            }
            this.setVisited(indicatorIndex);
        },

        // Click or Touch event handler for pop-close.
        onClickCloseItem: function(event) {
            if (event && event.preventDefault) event.preventDefault();
            this.$('.clicktwo-popup-close').blur();
            this.$('.clicktwo-popup').addClass('display-none');
        },

        // This function will set the visited status for particular flipCard item.
        setVisited: function(index) {
            var item = this.model.get('_items')[index];
            item._isVisited = true;
            this.checkCompletionStatus();
        },

        // This function will be used to get visited states of all flipCard items.
        getVisitedItems: function() {
            return _.filter(this.model.get('_items'), function(item) {
                return item._isVisited;
            });
        },

        // This function will check or set the completion status of current component.
        checkCompletionStatus: function() {
            if (this.getVisitedItems().length === this.model.get('_items').length) {
                this.setCompletionStatus();
            }
        }

    });

Adapt.register('clicktwo', clicktwo);

return clicktwo;



});
