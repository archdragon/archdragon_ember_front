import Ember from 'ember';

export default Ember.Controller.extend({
  tokenChanged: (function() {  
    if (Ember.isEmpty(this.get('token'))) {
      Ember.$.removeCookie('access_token');
      Ember.$.removeCookie('auth_user');
    } else {
      Ember.$.cookie('access_token', this.get('token'));
      Ember.$.cookie('auth_user', this.get('currentUser'));
    }
  }).observes('token'),

  init: function() {
    this._super();
    if (Ember.$.cookie('access_token')) {
      Ember.$.ajaxSetup({
        headers: {
          'Authorization': 'Bearer ' + Ember.$.cookie('access_token')
        }
      });
    }
  },

  // overwriting the default attemptedTransition attribute from the Ember.Controller object
  attemptedTransition: null,

  // create and set the token & current user objects based on the respective cookies
  token:               Ember.$.cookie('access_token'),
  currentUser:         Ember.$.cookie('auth_user')
});
