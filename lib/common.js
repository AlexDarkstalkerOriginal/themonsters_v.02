var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n1e3z1jSPckHmnwwTtD3AMHKh6peU3KQeW6";

// онлоад
  window.onload = function(){         
    if(typeof(webExtensionWallet) === "undefined"){     
          $(".noExtension").show();   
          $(".content").hide();
      }else{          
      }
  };  
// онлоад

var hash_value = '';

var vm = new Vue({
  el: '.app',
  data: {      
    market: false,
    lab: true,        
    username: 'Your username',
    player_owner: '',
    battleground: false,
    rank: false,
    lab_monsters: true,
    lab_gift: false,    
    congrat: false, 
    versus: false,
    lab_nav: true,
    monster_page: false,
    no_monsters: false,  
    congrat_name: '',
    monsters: [],
    monsters_battle: [],
    my_monsters: [],
    monsters_gift: [],  
    monsters_market: [],  
    monster_page_arr: [],
    monsters_ranked: [],
    monsters_fight: [],    
    id_monster: 0,
    id_defender: 0,
    id_attacker: 0,
    id_for_history: 0,
    player_owner_for_trans: 0,
    fight_id: 0,
    account_page: false,
    history_arr_frontned: [],
    player_monsters: [],
    player_history_arr: [],
    my_addres: 0,
    can_change_name: true,
  },
   methods: {
    monsterPage: function(id) {
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.monster_page = true;
      vm.versus = false;
      vm.congrat = false;
      vm.account_page = false;

      vm.id_for_history = id;
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMonsterInfo';
      var id_this = id;      
      var args = [];
      args.push(id_this);
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMonsterPage              
      });        
      var callFunction2 = 'getMonsterHistory';                  
      nebPay.simulateCall(to, value, callFunction2, callArgs, { 
        listener: cbMonsterHistory 
      });        
    },    
    sell: function (id) {
      $('.sell_fake').trigger('click');
      vm.id_monster = id;
    },
    unsell: function (id) {      
      vm.id_monster = id;
      var to = dappAddress;
      var value = 0;
      var callFunction = 'offMarket';    
      var id_this = vm.id_monster;
      var args = [];
      args.push(id_this);    
      var callArgs = JSON.stringify(args);    
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbTransactionSell              
      });        
    }, 
    buy: function (id, prize) {
      vm.id_monster = id;
      var to = dappAddress;
      var prize_this = prize;
      var value = prize_this;
      var callFunction = 'buyMonster';    
      var id_this = vm.id_monster;
      var args = [];
      args.push(id_this);          
      var callArgs = JSON.stringify(args);    
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbTransactionBuy              
      });        
    },
    attack_monster: function (id) {
      $('.attack_fake').trigger('click');          
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMyMonsters';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonsters,        
      });
      vm.id_defender = id;        
    },
    attack_init: function(id) {
      var to = dappAddress;
      var value = 0;
      var callFunction = 'fight';
      var attacker = id;
      vm.id_attacker = id;
      var defender = vm.id_defender;
      var args = [];
      args.push(attacker);
      args.push(defender);
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonstersFight
      }); 
    },
    owner_click: function(owner) {      
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.monster_page = false;
      vm.versus = false;
      vm.no_monsters = false;
      vm.congrat = false;
      vm.account_page = true;      

      vm.player_owner_for_trans = owner;  

      var to = dappAddress;
      var value = 0;          
      var callFunction2 = 'geMyAddress';
      var callArgs2 = '[]';    
      nebPay.simulateCall(to, value, callFunction2, callArgs2, { 
        listener: cbWho
      });       
    },
  }
})  

// монстер маркет
    Vue.component('monster-market', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'owner', 'prize'],
    template: `<div class="monster">\
                <h3>{{name}}</h3>\
                <img v-bind:src="src" alt="">\
                <span class="prize">{{prize}}</span>\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="owner">owner <span v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                <span class="weight">{{weight}} lvl</span>\
                <button class="buy" v-on:click="vm.buy(id, prize)">Buy</button>\
              </div>`,
    })
// монстер маркет

// об игроке. Монстры
    Vue.component('player-monsters', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id'],
    template: `<div class="monster">\
                <h3>{{name}}</h3>\
                <img v-bind:src="src" alt="">\                
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\                
                <span class="weight">{{weight}} lvl</span>\                
              </div>`,
    })
// об игроке. Монстры

// страница боя
  Vue.component('monster-fight', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'owner', 'win', 'boolen'],
    template: `<div class="monster">\
                <h3>{{name}}</h3>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="owner">owner <span v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                <span class="weight">{{weight}} lvl</span>\
                <button v-bind:class="{ winner: boolen }" class="result loose">{{win}}<span class="kg">+ 1 kg</span></button>\
              </div>`,
  })
// страница боя

// мои монстры лаб
  Vue.component('my-monster-lab', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'sale'],           
    template: `<div class="monster">\
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="weight">{{weight}} lvl</span>\
                <button v-if="sale" class="unsell"><a v-on:click="vm.unsell(id)">Cancel sell</a></button><button v-else class="sell"><a v-on:click="vm.sell(id)" href="#sell" class="popup">Sell</a></button> \
              </div>`,              
  })
// мои монстры лаб

// страница монстра гет
  Vue.component('my-monster-page', {
      props: ['speed','name', 'flex', 'power', 'weight', 'src', 'owner'],           
      template: `<div class="monster">\
                  <h3>{{name}}</h3>\
                  <img v-bind:src="src" alt="">\
                  <div class="stats">\
                    <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                    <span class="agility">def: <span class="value">{{flex}}</span></span>\
                    <span class="power">attack: <span class="value">{{power}}</span></span>\
                  </div>\
                  <span class="owner">owner <span v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                  <span class="weight">{{weight}} lvl</span>\
                </div>`,              
    })    

  function cbMonsterPage(resp) {
     var page_monster = JSON.parse(resp.result);    
      vm.monster_page_arr = [];
      page_monster.flex = Math.round(page_monster.flex);
      page_monster.power = Math.round(page_monster.power);
      page_monster.weight = page_monster.weight.toFixed(1);
      var new_name = fix_name(page_monster.name);
      page_monster.name = new_name;      
      vm.monster_page_arr.push(page_monster);      
  }
// страница монстра гет

// монстр из коробки
  var gift_monster_component = Vue.component('monster-gift', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src'],           
    template: `<div class="monster">\
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{ speed }}</span></span>\
                  <span class="agility">def: <span class="value">{{ flex }}</span></span>\
                  <span class="power">attack: <span class="value">{{ power }}</span></span>\
                </div>\
                <span class="weight">{{weight}} lvl</span>\
                <a href="#sell" class="popup"><button class="sell">Sell</button></a>\
              </div>`,
  })
// монстр из коробки

// монстр батлграунд
  Vue.component('monster-bg', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'ownername', 'owner', 'view_name'],
    template: `<div class="monster">\
                <h3>{{name}}</h3>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="owner">owner <span v-if="view_name" v-on:click="vm.owner_click(owner)" class="true_name"> <p>{{ownername}}</p></span><span v-else v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                <span class="weight">{{weight}} lvl</span>\
                <a href="#my_monsters_popup"  v-on:click="vm.attack_monster(id)" class="popup"><button class="attack">Attack</button></a>\
              </div>`,              
  })
// монстр батлграунд

// монстр ранкед
 Vue.component('monster-ranked', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'owner'],           
    template: `<div class="monster">\
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\                
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="owner">owner <span v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                <span class="weight">{{weight}} lvl</span>\                
              </div>`,              
  })
// монстр ранкед

// мои монстры лаб попап
  Vue.component('my-monster-lab-popup', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'born_time'],
    template: `<div class="monster">\
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="weight">{{weight}} lvl</span>\
                <button v-if="born_time" class="freeze">Freeze</button><button v-else v-on:click="vm.attack_init(id)" class="pick">Pick</button>\
              </div>`,
  })
// мои монстры лаб попап

// переключение табов
  $('.nav button').click(function(){

    if ($(this).hasClass('market')) {
        vm.market = true;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
        vm.account_page = false;
    } else if ($(this).hasClass('lab')) {
        vm.market = false;      
        vm.lab = true;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = true;
        vm.lab_monsters = true;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
        vm.account_page = false;
    } else if ($(this).hasClass('battleground')) {
        vm.market = false;      
        vm.lab = false;
        vm.battleground = true;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
        vm.account_page = false;
    } else if ($(this).hasClass('rank')) {
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = true;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
        vm.account_page = false;
    }

    $('.lab_nav').hide();
    
    if ($(this).hasClass('lab')) {
      $('.lab_nav').show();
      vm.lab_monsters = false;
      vm.lab = true;
      $('.lab_monsters').trigger('click');
    };

    if ($(this).hasClass('active')) {
      return false;
    };    

    $('.nav button').removeClass('active');
    $(this).addClass('active');
  })


  $('.lab_nav button').click(function(){

    if ($(this).hasClass('lab_monsters')) {
        vm.market = false;      
        vm.lab = true;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = true;
        vm.lab_monsters = true;
        vm.lab_gift = false;
        vm.no_monsters = false;
        vm.congrat = false;
        vm.account_page = false;
    } else if ($(this).hasClass('lab_gift')) {
        vm.market = false;      
        vm.lab = true;
        vm.battleground = false;
        vm.rank = false;
        vm.account_page = false;
        vm.lab_nav = true;
        vm.lab_monsters = false;
        vm.lab_gift = true;
        vm.no_monsters = false;
        vm.congrat = false;
      };
    if ($(this).hasClass('active')) {
      return false;
    }
    $('.lab_nav button').removeClass('active');
    $(this).addClass('active');
  })
// переключение табов

// попапы
  $('.popup').magnificPopup({
    type:'inline',
    fixedContentPos: true, 
    mainClass: 'mfp-fade',      
    showCloseBtn: true,
    closeOnBgClick: false
  });   

  $('.transaction').magnificPopup({
    type:'inline',
    fixedContentPos: true, 
    mainClass: 'mfp-fade',      
    showCloseBtn: true,
    closeOnBgClick: false
  });   
// попапы

// нет монстра 
  $('.fake_gift').click(function(){
    $('.lab_gift').trigger('click');    
  })

  $('.fake_market').click(function(){
    $('.nav .market').trigger('click');    
  })
// нет монстра

// гет гифт монстра
  $('.get_free_monster').click(function(){
    var to = dappAddress;
    var value = 0;
    var callFunction = 'buyFreeBox';
    var callArgs = "[]";        
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbBuyFreeСheck            
    });
  })

  function cbBuyFreeСheck(resp) {        
    if (resp.result == 'true') {      
        $('.gift_box .error h1').html('');
        var to = dappAddress;
        var value = 0;
        var callFunction = 'buyFreeBox';
        var callArgs = "[]";        
        nebPay.call(to, value, callFunction, callArgs, { 
          listener: cbTransactionGetBox           
        });
    } else {
      $('.gift_box .error h1').html(resp.result);
    }
  }

  function cbCongrat(resp) {
    var gift_monster = JSON.parse(resp.result);    
    vm.monsters_gift = [];
    gift_monster[gift_monster.length - 1].flex = Math.round(gift_monster[gift_monster.length - 1].flex);
    gift_monster[gift_monster.length - 1].power = Math.round(gift_monster[gift_monster.length - 1].power);
    gift_monster[gift_monster.length - 1].weight = gift_monster[gift_monster.length - 1].weight.toFixed(1);
    var new_name = fix_name(gift_monster[gift_monster.length - 1].name);
    gift_monster[gift_monster.length - 1].name = new_name;
    vm.monsters_gift.push(gift_monster[gift_monster.length - 1]);
    vm.congrat_name = gift_monster[gift_monster.length - 1].name;
   } 
// гет гифт монстра

// гет платного монстра
  $('.pay_monster_get').click(function(){
    var to = dappAddress;
    var value = 0.01;
    var callFunction = 'buyPayBox';
    var callArgs = "[]";        
    nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTransactionGetBox            
    });
  })
// гет платного монстра

// гет ранкед
  // getMonsterListByTop
  $('.rank').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMonsterListByTop';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMonstersRanked
      });    
  })

  function cbMonstersRanked(resp) {
    var monsters_for_ranked = JSON.parse(resp.result);          
      vm.monsters_ranked = [];
      $.each(monsters_for_ranked,function(index,value){    
        monsters_for_ranked[index].flex = Math.round(monsters_for_ranked[index].flex);
        monsters_for_ranked[index].power = Math.round(monsters_for_ranked[index].power);
        monsters_for_ranked[index].weight = monsters_for_ranked[index].weight.toFixed(1);        
        var new_name = fix_name(monsters_for_ranked[index].name);
        var new_prize = monsters_for_ranked[index].price/1000000000000000000;
        monsters_for_ranked[index].price = new_prize;
        monsters_for_ranked[index].name = new_name;        
        vm.monsters_ranked.push(monsters_for_ranked[index]);
      });
  }
// гет ранкед

// гет магазин
  $('.market').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMonstersOnMarket';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMarketMonsters              
      });    
  })

  function cbMarketMonsters(resp) {
    var market_monsters = JSON.parse(resp.result);          
      vm.monsters_market = [];
      $.each(market_monsters,function(index,value){    
        market_monsters[index].flex = Math.round(market_monsters[index].flex);
        market_monsters[index].power = Math.round(market_monsters[index].power);
        market_monsters[index].weight = market_monsters[index].weight.toFixed(1);
        var new_sale = fix_sale(market_monsters[index].sale);
        market_monsters[index].sale = new_sale;
        var new_name = fix_name(market_monsters[index].name);
        var new_prize = market_monsters[index].price/1000000000000000000;
        market_monsters[index].price = new_prize;
        market_monsters[index].name = new_name;        
        vm.monsters_market.push(market_monsters[index]);
      });
  }
// гет магазин

// гет мои монстров + монстров под бой
  $(document).ready(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMyMonsters';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonsters              
      });    
  })

  $('.lab_monsters').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMyMonsters';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonsters              
      });    
  })

  function cbMyMonsters(resp) {        
    if (resp.result == '[]') {      
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = true;
      vm.account_page = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.no_monsters = true;
    } else {      
      var mymonsters_arr = JSON.parse(resp.result);      
      vm.my_monsters = [];

      var cooldowns = {
        0: 12 * 3600,
        1: 11 * 3600,
        2: 10 * 3600,
        3: 9 * 3600,
        4: 8 * 3600,
        5: 7 * 3600,
        6: 6 * 3600,
        7: 5 * 3600,
        8: 4 * 3600,
        9: 3 * 3600,
        10: 120 * 60,
        11: 90 * 60,
        12: 75 * 60,
        13: 60 * 60,
        14: 50 * 60,
        15: 40 * 60,
        16: 30 * 60,
        17: 20 * 60,
        18: 10 * 60,
        19: 5 * 60,
      }

      $.each(mymonsters_arr,function(index,value){    

        var time = new Date();
        time =  time.getTime() / 1000;
        var speed = parseInt(mymonsters_arr[index].speed / 5);
        if (speed + 1 > 20) {
          speed = 20 - 1;
        };
        var cd_time = cooldowns[speed];    
        if (cd_time + mymonsters_arr[index].attack_time > time) {
          mymonsters_arr[index].born_time = true;          
        } else {
          mymonsters_arr[index].born_time = false;          
        }

        mymonsters_arr[index].flex = Math.round(mymonsters_arr[index].flex);
        mymonsters_arr[index].power = Math.round(mymonsters_arr[index].power);        
        mymonsters_arr[index].weight = mymonsters_arr[index].weight.toFixed(1);
        var new_sale = fix_sale(mymonsters_arr[index].sale);
        mymonsters_arr[index].sale = new_sale;
        var new_name = fix_name(mymonsters_arr[index].name);
        mymonsters_arr[index].name = new_name;
        // mymonsters_arr.push(index);
        vm.my_monsters.push(mymonsters_arr[index]);
      });
    }
  }

  function cbMyMonstersFight(resp) {  
     if (resp.result == 'true') {
      var to = dappAddress;
      var value = 0;
      var callFunction = 'fight';
      var attacker = vm.id_attacker;
      var defender = vm.id_defender;
      var args = [];
      args.push(attacker);
      args.push(defender);
      var callArgs = JSON.stringify(args);    
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbTransactionFight
      }); 
    } else {
      $('#error_info .error').html(resp.result);
      $('.error_info_fake').trigger('click');
    }

    // if (resp.result == '[]') {      
    //   vm.market = false;      
    //   vm.lab = false;
    //   vm.battleground = false;
    //   vm.rank = false;
    //   vm.lab_nav = true;
    //   vm.lab_monsters = false;
    //   vm.lab_gift = false;
    //   vm.no_monsters = true;
    // } else {      
    //   var mymonsters_arr = JSON.parse(resp.result);      
    //   vm.my_monsters = [];
    //   var cooldowns = {
    //     0: 12 * 3600,
    //     1: 11 * 3600,
    //     2: 10 * 3600,
    //     3: 9 * 3600,
    //     4: 8 * 3600,
    //     5: 7 * 3600,
    //     6: 6 * 3600,
    //     7: 5 * 3600,
    //     8: 4 * 3600,
    //     9: 3 * 3600,
    //     10: 120 * 60,
    //     11: 90 * 60,
    //     12: 75 * 60,
    //     13: 60 * 60,
    //     14: 50 * 60,
    //     15: 40 * 60,
    //     16: 30 * 60,
    //     17: 20 * 60,
    //     18: 10 * 60,
    //     19: 5 * 60,
    // }
    //   $.each(mymonsters_arr,function(index,value){    

    //     var time = new Date();
    //     time =  time.getTime() / 1000;
    //     var speed = parseInt(mymonsters_arr[index].speed / 5);
    //     if (speed + 1 > 20) {
    //       speed = 20 - 1;
    //     };
    //     var cd_time = cooldowns[speed];    
    //     if (cd_time + mymonsters_arr[index].attack_time > time) {
    //       mymonsters_arr[index].born_time = true;          
    //     } else {
    //       mymonsters_arr[index].born_time = false;          
    //     }        
    //     mymonsters_arr[index].flex = Math.round(mymonsters_arr[index].flex);
    //     mymonsters_arr[index].power = Math.round(mymonsters_arr[index].power);        
    //     mymonsters_arr[index].weight = mymonsters_arr[index].weight.toFixed(1);
    //     var new_sale = fix_sale(mymonsters_arr[index].sale);
    //     mymonsters_arr[index].sale = new_sale;
    //     var new_name = fix_name(mymonsters_arr[index].name);
    //     mymonsters_arr[index].name = new_name;        
    //     vm.my_monsters.push(mymonsters_arr[index]);
    //   });
    // }   
  }
// гет мои монстров + монстров под бой

// обработчик транзакции гет бокс
  function cbTransactionGetBox(resp) {    
    hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.account_page = false;
        vm.versus = false;
        vm.congrat = true;
        var to = dappAddress;
        var value = 0;
        var callFunction = 'getMyMonsters';
        var callArgs = "[]";        
        nebPay.simulateCall(to, value, callFunction, callArgs, { 
          listener: cbCongrat            
        });

        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);  
  } 
// обработчик транзакции гет бокс

// нормальное имя
  function fix_name(name) {   
    var x = parseInt(name);    
    x = (x % 10);
    x = x + 1;    
    switch(x) {
      case 1:
        x = 'Korim';
        return x;
        break;

      case 2: 
        x = 'Galaxia';
        return x;
        break;

      case 3:        
        x = 'Mardil';
        return x;
        break;

      case 4: 
        x = 'Skylancer';        
        return x;
        break;

      case 5:       
        x = 'Ashakiel';
        return x; 
        break;

      case 6: 
        x = 'Nephilim';
        return x;
        break;

      case 7: 
        x = 'Guldan';
        return x;
        break;

      case 8: 
        x = 'Saurfang';
        return x;
        break;

      case 9: 
        x = 'Trall';
        return x;
        break;

      case 10: 
        x = 'Illidan';
        return x;
        break;

      default:
        break;
    }
  }
// нормальное имя

// сейл, ансейл фикс
   function fix_sale(sale) {   
    var x = sale;    
    switch(x) {
      case 1:
        x = true;
        return x;
        break;
      case 0:
        x = false;
        return x;
        break;
      default:
        break; 
      }
    }
// сейл, ансейл фикс

// продажа монстра
  $('#sell .sell').click(function(){
    var to = dappAddress;
    var value = 0;
    var callFunction = 'goMarket';
    var prize = $('#sell input').val();
    var id_this = vm.id_monster;
    var args = [];
    args.push(id_this);
    args.push(prize);    
    var callArgs = JSON.stringify(args);    
    nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTransactionSell              
    });        
  })

  function cbTransactionSell(resp) {   
   hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        $('.lab_monsters').trigger('click');
        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);  
  }    
// продажа монстра

// обработчик транзакции на покупку
  function cbTransactionBuy(resp) {   
   hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        $('.market').trigger('click');
        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);  
  }    
// обработчик транзакции на покупку

// гет поле боя
    $('.battleground').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMonsterList';          
      var min = 0;
      var max = 9999999;
      var args = [];
      args.push(min);    
      args.push(max);    
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbBattleList              
      });   
    })

    function cbBattleList(resp) {
      console.log('battle list ' + JSON.stringify(resp)); 
      // var resp_parse = JSON.parse(resp.result);
      var key_array = JSON.parse(resp.result);
      var key_array = key_array.data;
      var battleList = [];
      vm.monsters_battle = [];
      for (var j in key_array) {
        var time = new Date();
        time =  time.getTime() / 1000;
        cd_time = key_array[j].defence_time;
        if (cd_time + 3600 > time) {
          // battleList.splice(index, 1);
          // console.log('deleted ' + battleList[index]);
        } else {
          battleList.push(key_array[j]);
        }        
      }

      $.each(battleList,function(index,value){
    //     _checkCDByTime: function(monster, code_type) {        
        // var time = new Date();
        // time =  time.getTime() / 1000;
        // var cd_time = 0;
    //     if (code_type === "defence_time") {
            // cd_time = battleList[index].defence_time;
    //     } else {
    //         var speed = parseInt(monster["speed"] / 5);

    //         if (speed + 1 > this.cooldown_count) {
    //             speed = this.cooldown_count - 1;
    //         }
    //         var cd_time = this.cooldown_map.get(speed);
    //         if (!cd_time) throw new Error("No speed! " + speed + "," + monster["speed"]);          
    //     }        
      })

      $.each(battleList,function(index,value){
        battleList[index].flex = Math.round(battleList[index].flex);
        battleList[index].power = Math.round(battleList[index].power);
        var new_name = fix_name(battleList[index].name);       
        battleList[index].weight = battleList[index].weight.toFixed(1); 
        battleList[index].name = new_name;
        battleList[index].ownername = battleList[index].nameOwner;
        if(battleList[index].nameOwner == 'username is not set') {
          battleList[index].view_name = false
        } else {
          battleList[index].view_name = true;
        }
        vm.monsters_battle.push(battleList[index]);
      })      
    }
// гет поле боя

// обработчик транзакции на атаку
  function cbTransactionFight(resp) {
    hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.account_page = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = true;
        vm.congrat = false;

        var to = dappAddress;
        var value = 0;
        var callFunction = 'getLastHistory';
        var id = vm.id_attacker
        var callArgs = [];               
        callArgs.push(id);
        callArgs = JSON.stringify(callArgs);
        nebPay.simulateCall(to, value, callFunction, callArgs, { 
          listener: cbMonsterFightAfterFight            
        });
        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);   
  }
// обработчик транзакции на атаку

// кнопка окей, сори
  $('.ok_err').click(function(){
    $('#error_info .mfp-close').trigger('click');
  })
// кнопка окей, сори

// история и страница боев обработик 
  function cbMonsterHistory(resp) {    
    var history_arr = JSON.parse(resp.result);
    var our_monster;
    var opponent;    
    vm.history_arr_frontned = [];    
    $.each(history_arr,function(index,value){
      if (history_arr[index].attacker.id == vm.id_for_history) {
        our_monster = 'a'; 
        opponent = history_arr[index].defender;
      } else {
        our_monster = 'd'; 
        opponent = history_arr[index].attacker;
      };
      var el_for_push = {};      
      if (history_arr[index].win == our_monster) {
        el_for_push.result = 'Win';
      } else {
        el_for_push.result = 'Loose';
      };
      el_for_push.name = opponent.name;
      el_for_push.name = fix_name(el_for_push.name);
      el_for_push.id_fight = index;
      vm.history_arr_frontned.push(el_for_push);
    })    
    $('.history ul').html('<li><span class="opponent">Oppenent</span><span class="result">Result</span></li>');

    $.each(vm.history_arr_frontned,function(index,value){
      if (vm.history_arr_frontned[index].result == 'Win') {
        $('.history ul').append('<li fight-id=' + vm.history_arr_frontned[index].id_fight + '><img class="opp" src="img/'+ vm.history_arr_frontned[index].name + '.png">\
                              <span class="res winner">' + vm.history_arr_frontned[index].result + '</span>\
                              <a href="#" class="info"><img src="img/info.png"></a>\
                              </li>');
      } else {
        $('.history ul').append('<li fight-id=' + vm.history_arr_frontned[index].id_fight + '><img class="opp" src="img/'+ vm.history_arr_frontned[index].name + '.png">\
                              <span class="res loose">' + vm.history_arr_frontned[index].result + '</span>\
                              <a href="#" class="info"><img src="img/info.png"></a>\
                              </li>')
      }
    });
    if (vm.history_arr_frontned.length == 0) {
      $('.history ul').append('<h2>You never fought. Go to battleground</h2>');
    };
    $('.history .info').click(function(){
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.monster_page = false;
      vm.versus = true;
      vm.congrat = false;
      vm.account_page = false;
    });

    $('.history li .info').click(function(){
      var to = dappAddress;
      var value = 0;            
      var args = [];
      vm.fight_id = $(this).parent().attr('fight-id');      
      args.push(vm.id_for_history);              
      var callArgs = JSON.stringify(args);
      var callFunction = 'getMonsterHistory';                  
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMonsterFight 
      });    
    });
  }

  function cbMonsterFight(resp) {    
    var history_arr = JSON.parse(resp.result);
    console.log('resp cbfight ' + JSON.stringify(history_arr));
    vm.monsters_fight = [];
    // $.each(history_arr,function(index,value){
      history_arr[vm.fight_id].attacker.flex = Math.round(history_arr[vm.fight_id].attacker.flex);
      history_arr[vm.fight_id].attacker.power = Math.round(history_arr[vm.fight_id].attacker.power);
      history_arr[vm.fight_id].attacker.weight = history_arr[vm.fight_id].attacker.weight.toFixed(1);
      history_arr[vm.fight_id].defender.flex = Math.round(history_arr[vm.fight_id].defender.flex);
      history_arr[vm.fight_id].defender.power = Math.round(history_arr[vm.fight_id].defender.power);
      history_arr[vm.fight_id].defender.weight = history_arr[vm.fight_id].defender.weight.toFixed(1);

      var new_name = fix_name(history_arr[vm.fight_id].attacker.name);            
      history_arr[vm.fight_id].attacker.name = new_name;        
      var new_name = fix_name(history_arr[vm.fight_id].defender.name);                  
      history_arr[vm.fight_id].defender.name = new_name;        
      // vm.history_arr_frontned[vm.fight_id].result - результат для vm.id_for_history      
      
    if (history_arr[vm.fight_id].win == 'a') {     
      history_arr[vm.fight_id].attacker.win = 'Win';  
      history_arr[vm.fight_id].attacker.boolen = true;       
      history_arr[vm.fight_id].defender.win = 'Loose'; 
      history_arr[vm.fight_id].defender.boolen = false;
    } else {
      history_arr[vm.fight_id].attacker.win = 'Loose';  
      history_arr[vm.fight_id].attacker.boolen = false;       
      history_arr[vm.fight_id].defender.win = 'Win'; 
      history_arr[vm.fight_id].defender.boolen = true;
    }       

      vm.monsters_fight.push(history_arr[vm.fight_id].attacker);   
      vm.monsters_fight.push(history_arr[vm.fight_id].defender);   
    // });
  }
// история и страница боев обработик 

// страница игрока
  function cbWho(resp) {
    vm.my_addres = JSON.parse(resp.result);

    var to = dappAddress;
    var value = 0;
    var callFunction = 'getUserInfo';          
    var from = vm.player_owner_for_trans;    
    
    var args = [];
    args.push(from);
    var callArgs = JSON.stringify(args);    
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbUserPage
    }); 
  }  

  function cbUserPage(resp) {          
    var player_info = JSON.parse(resp.result);        
    var player_monsters = player_info.monsters;            
    var player_history = player_info.history;    
    vm.username = player_info.name;    
    vm.player_owner = player_monsters[0].owner;
    vm.player_history_arr = [];

    if (vm.my_addres == player_monsters[0].owner) {
      vm.can_change_name = true;
    } else {
      vm.can_change_name = false;
    }

    $('#monster-page-player').html('');
    $.each(player_monsters,function(index,value){    
      player_monsters[index].flex = Math.round(player_monsters[index].flex);
      player_monsters[index].power = Math.round(player_monsters[index].power);
      player_monsters[index].weight = player_monsters[index].weight.toFixed(1);        
      var new_name = fix_name(player_monsters[index].name);
      var new_prize = player_monsters[index].price/1000000000000000000;
      player_monsters[index].price = new_prize;
      player_monsters[index].name = new_name;        
      vm.player_monsters.push(player_monsters[index]);
    });    
    if(player_history.length == 0) {
      $('.data_history').html('Player has not played any games')
    } else {
      $('.data_history').html('');
      $.each(player_history, function(index,value) {       
        player_history[index].opponent = fix_name(player_history[index].opponent);                    
        if(player_history[index].attacker.owner == vm.player_owner_info) {          
          player_history[index].player = fix_name(player_history[index].attacker.name);
        } else {
          player_history[index].player = fix_name(player_history[index].defender.name);
        }
        vm.player_history_arr.push(player_history[index]);       
       });           
       $.each(vm.player_history_arr,function(index,value){      
        if (vm.player_history_arr[index].RESULT == 'Win') {                  
          $('.data_history').append('<li fight-id="' + index + '">\
                                      <span><img src="img/'+ vm.player_history_arr[index].player + '.png"></span>\
                                      <span><img src="img/'+ vm.player_history_arr[index].opponent + '.png"></span>\
                                      <span class="win">Win</span>\
                                      <a href="#" class="info"><img src="img/info.png"></a>\
                                    </li>');
        } else{
          $('.data_history').append('<li fight-id="' + index + '">\
                                      <span><img src="img/'+ vm.player_history_arr[index].player + '.png"></span>\
                                      <span><img src="img/'+ vm.player_history_arr[index].opponent + '.png"></span>\
                                      <span class="loose">Loose</span>\
                                      <a href="#" class="info"><img src="img/info.png"></a>\
                                    </li>');
        } 
      });
    }

    $('.history .info').click(function(){
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.monster_page = false;
      vm.versus = true;
      vm.congrat = false;
      vm.account_page = false;
    });

    $('.history li .info').click(function(){
      var to = dappAddress;
      var value = 0;            
      var args = [];
      vm.fight_id = $(this).parent().attr('fight-id');      
      args.push(vm.fight_id);              
      var callArgs = JSON.stringify(args);
      var callFunction = 'getMonsterHistory';                  
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMonsterFight 
      });    
    });
  }
// страница игрока

// изменить имя
  $('.set_name').click(function() {
    var to = dappAddress;
    var value = 0;
    var callFunction = 'setUserName';              
    var name = $('#editname input').val();
    var args = [];    
    args.push(name);
    var callArgs = JSON.stringify(args);    
    nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbChangeName
    }); 
  })

  function cbChangeName(resp) {
     hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.account_page = true;
        vm.versus = false;
        vm.congrat = false;
        console.log('resp name change ' + JSON.stringify(resp));
        clearInterval(reload_trans);              

        var to = dappAddress;
        var value = 0;
        var callFunction = 'getUserName';          
        var from = vm.player_owner_for_trans;             
        var args = [];
        args.push(from);
        var callArgs = JSON.stringify(args);    
        nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbNameUpdate
        }); 

      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);  
  }

  function cbNameUpdate(resp) {
    console.log('name update ' + JSON.stringify(resp));
    vm.username = JSON.parse(resp.result); 
  }
// изменить имя

// обработка файта после файта
  function cbMonsterFightAfterFight(resp) {
    
    console.log('fight after fight ' + JSON.stringify(resp));
    var monsters_for_fight = JSON.parse(resp.result);

    vm.monsters_fight = [];

    monsters_for_fight.attacker.flex = Math.round(monsters_for_fight.attacker.flex);
    monsters_for_fight.attacker.power = Math.round(monsters_for_fight.attacker.power);
    monsters_for_fight.attacker.weight = monsters_for_fight.attacker.weight.toFixed(1);
    monsters_for_fight.defender.flex = Math.round(monsters_for_fight.defender.flex);
    monsters_for_fight.defender.power = Math.round(monsters_for_fight.defender.power);
    monsters_for_fight.defender.weight = monsters_for_fight.defender.weight.toFixed(1);

    var new_name = fix_name(monsters_for_fight.attacker.name);
    monsters_for_fight.attacker.name = new_name;
    var new_name = fix_name(monsters_for_fight.defender.name);
    monsters_for_fight.defender.name = new_name;
    if (monsters_for_fight.win == 'a') {     
      monsters_for_fight.attacker.win = 'Win';  
      monsters_for_fight.attacker.boolen = true;       
      monsters_for_fight.defender.win = 'Loose'; 
      monsters_for_fight.defender.boolen = false;
    } else {
      monsters_for_fight.attacker.win = 'Loose';  
      monsters_for_fight.attacker.boolen = false;       
      monsters_for_fight.defender.win = 'Win'; 
      monsters_for_fight.defender.boolen = true;
    }       
    vm.monsters_fight.push(monsters_for_fight.attacker);   
    vm.monsters_fight.push(monsters_for_fight.defender);   
  }
// обработка файта после файта

