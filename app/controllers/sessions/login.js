import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    authenticate: function() {
      alert('Authenticating');

      var _this = this;

      // get the properties sent from the form and if there is any attemptedTransition set
      var attemptedTrans = this.get('attemptedTransition');  
      var data =           this.getProperties('username_or_email', 'password');

      // clear the form fields
      this.setProperties({  
        username_or_email: null,
        password:          null
      });

      // send a POST request to the /sessions api with the form data
      Ember.$.post('/session', data).then(function(response) {  
        // set the ajax header with the returned access_token object
        Ember.$.ajaxSetup({
          headers: { 'Authorization': 'Bearer ' + response.api_key.access_token }
        });
        console.log('Session post');
        console.log(response.api_key.access_token);

        // create a apiKey record on the local storage based on the returned object
        var key = _this.get('store').createRecord('apiKey', {  
          accessToken: response.api_key.access_token
        });

        // find a user based on the user_id returned from the request to the /sessions api
        alert('User id: ' + response.api_key.user_id);
        alert('Created key:');
        alert(key);
        _this.store.find('user', response.api_key.user_id).then(function(user) {

          // set this controller token & current user properties
          // based on the data from the user and access_token
          alert('Returning user');
          alert(user);
          _this.setProperties({
            token:       response.api_key.access_token,
            currentUser: user.getProperties('username', 'name', 'email')
          });

          // set the relationship between the User and the ApiKey models & save the apiKey object
          key.set('user', user);
          key.save();

          alert('User apiKeys:');
          alert(user.get('apiKeys'));
          //alert('User apiKeys content:');
          //alert(user.get('apiKeys').content);

          user.get('apiKeys').pushObject(key);

          // check if there is any attemptedTransition to retry it or go to the secret route
          if (attemptedTrans) {
            attemptedTrans.retry();
            _this.set('attemptedTransition', null);
          } else {
            _this.transitionToRoute('secret');
          }

        });

      }, function(error) {
        if (error.status === 401) {
          // if there is a authentication error the user is informed of it to try again
          alert("wrong user or password, please try again");
        }
        alert(error.status);
      });
    }
  }
});
