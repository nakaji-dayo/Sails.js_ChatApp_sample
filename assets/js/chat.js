 var SailsCollection = Backbone.Collection.extend({
   sailsCollection: '',
   socket: null,
   sync: function(method, model, options) {
     var where = {};
     if (options.where) {
       where = {
	 where: options.where
       }
     }
     if (typeof this.sailsCollection === "string" && this.sailsCollection !== '') {
       this.socket = io.connect();
       this.socket.on('connect', _.bind(function() {
	 this.socket.request('/' + this.sailsCollection, where, _.bind(function(users) {
	   this.set(users);
	 }, this));
	 this.socket.on('message', _.bind(function(msg) {
	   var m = msg.verb;
	   if (m === 'create') {
	     this.add(msg.data);
	   } else if (m === 'update') {
	     this.get(msg.data.id).set(msg.data);
	   } else if (m === 'destroy') {
	     this.remove(this.get(msg.data.id));
	   }
	 }, this));
       }, this));
     } else {
       console.log("Error: Cannot retrieve models because property 'sailsCollection' not set on the collection");
     }
   }
 });

 var MessageModel = Backbone.Model.extend({
   urlRoot: '/messages'
 });

 var MessageCollection = SailsCollection.extend({
   sailsCollection: 'messages',
   model: MessageModel
 });

 var messages = new MessageCollection();
 messages.fetch();

 $('#postMessageButton').click(function() {
   console.log('post message');
   var messageText = $('#message').val();
   messages.create({message: messageText}, {wait: true});
   $('#message').val('');
 });

 _.templateSettings = {
   interpolate : /\{\{(.+?)\}\}/g
 };

 var MessagesView = Backbone.View.extend({
   el: '#messagesContainer',
   initialize: function() {
     this.collection.on('add', this.render, this);
     this.render();
   },
   template: _.template('<div><p>{{ username }}: {{ message }}<p></div>'),
   render: function() {
     this.$el.html('');
     this.collection.each(function(msg) {
       this.$el.append(this.template(msg.toJSON()));
     }, this);
   }
 });

 var view = new MessagesView({collection: messages});
