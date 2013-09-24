var should = require('should');
var sinon = require('sinon');
var nodemock = require('nodemock');
var controller = require('../../../api/controllers/MainController');

describe('MainControllerのテスト', function() {
  it('ログインせずにchatにアクセスするとリダイレクトされること', function(done) {
    var req = {};
    //ログイン情報無し
    req.session = {user: null};
    controller.chat(req, {redirect: function(path){
      //redirectが実行され、'/'がわたされていること
      path.should.equal('/');
      done();
    }});
  });

  it('ログイン済みであれば、usernameを渡しviewを描画すること', function(done) {
    var req = {};
    //ログイン済み
    req.session = {user: {username:'ほげ'}};
    controller.chat(req, {view: function(options){
      //viewが実行され、ユーザー名を渡していること
      options.username.should.equal('ほげ');
      done();
    }});
  });

  it('ログインに失敗した際に、エラーのコードとメッセージをレスポンスしていること', function() {
    //requestのモック作成
    //username:hoge, password:piyo
    var req = nodemock.mock('param').takes('username').returns('hoge')
        .mock('param').takes('password').returns('piyo');
    //Usersモデルのモック作成
    //リクエストに渡されたユーザー名・パスワードでログインを実行していること
    //エラーをコールバックする
    Users = nodemock.mock('login').takes('hoge', 'piyo', function() {})
        .calls(2,[{code:500, message:'エラーだよ'}, null]);
    //レスポンスのモック作成
    //モデルが返したエラーをレスポンスしていること
    var res = nodemock.mock('set').takes('error','エラーだよ').
        mock('send').takes(500);
    //実行
    controller.login(req, res);
  });

  it('ログインに成功すると、セッションにユーザー情報を保存し、ユーザー情報をレスポンスすること', function() {
    //requestのモック作成
    //username:hoge, password:piyo
    var req = nodemock.mock('param').takes('username').returns('hoge')
        .mock('param').takes('password').returns('piyo');
    req.session = {};
    //Usersモデルのモック作成
    //リクエストに渡されたユーザー名・パスワードでログインを実行していること
    //ログイン成功のコールバックをする
    Users = nodemock.mock('login').takes('hoge', 'piyo', function() {})
        .calls(2,[null, {username:'hoge'}]);
    //レスポンスのモック作成
    //モデルが返したエラーをレスポンスしていること
    var res = nodemock.mock('send').takes({username: 'hoge'});
    //実行
    controller.login(req, res);
    //セッションにユーザー名が保存されていること
    req.session.user.username.should.equal('hoge');
  });

});