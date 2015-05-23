import Ember from 'ember';

export default Ember.Component.extend({
  scrollPosition: 0,
  scrollMin: 0,
  scrollMax: 2,
  startCarousel: function() {
  }.on('didInsertElement'),
  scrollChanged: function() {
    var scrollPosition = this.get('scrollPosition');
    var leftOffset = scrollPosition * 100;
    Ember.$('.scrollable-container').css('left', leftOffset + '%');
  }.observes('scrollPosition'),
  actions: {
    scroll: function(direction) {
      direction = parseInt(direction);
      var scrollPosition = this.get('scrollPosition') + direction;
      if(scrollPosition > this.get('scrollMax')) {
        scrollPosition = this.get('scrollMin');
      } else if (scrollPosition < this.get('scrollMin')) {
        scrollPosition = this.get('scrollMax');
      }

      this.set('scrollPosition', scrollPosition);
    }
  }
});
