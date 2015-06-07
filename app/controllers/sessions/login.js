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
        alert('Session post');

      }, function(error) {
        if (error.status === 401) {
          // if there is a authentication error the user is informed of it to try again
          alert("wrong user or password, please try again");
        }
      });
    }
  }
});
