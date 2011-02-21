/**
 * 起動例
 
Ext.setup({
  fullscreen: true,
  onReady: function(){
    new Tori.simple.Carousel({ fullscreen: true });
  }
});

*/

Ext.ns('Tori','Tori.simple');

/**
 * @class Tori.simple.Carousel
 * @extends Ext.Panel
 *
 * <p>bodyタグ内に所定の形式で記述されたHTMLをSencha TouchのCarousel形式のスライドに変換する
 * クラス。HTMLの書式は以下の通り：</p>
 * <ul>
 * <li>スライド本体 - slideSelector（デフォルト値は".slide"）に指定されたタグ</li>
 * <li>スライドタイトル - スライド本体内部のslideTitleSelector（デフォルト値は"h1"）に指定されたタグ</li>
 * <li>スライドコンテンツ - スライド本体内部のslideContentSelector（デフォルト値は".content"）に指定されたタグ</li>
 * </ul>
 */

Tori.simple.Carousel = Ext.extend(Ext.Carousel,{
  /**
   * @cfg {String} slideSelector
   * スライド本体を示すCSSセレクター。デフォルト値は".slide"
   */
  slideSelector: '.slide',

  /**
   * @cfg {String} slideContentSelector
   * スライドコンテンツを示すCSSセレクター。デフォルト値は".content"。スライド本体内部に存在する必要がある。
   */
  slideContentSelector: '.content',

  /**
   * @cfg {String} slideTitleSelector
   * スライドのタイトルを示すCSSセレクター。デフォルト値は"h1"。スライド本体内部に存在する必要がある。
   */
  slideTitleSelector: 'h1',

  /**
   * @cfg {String} backText
   */
  backText: '戻る',

  /**
   * @cfg {String} forwardText
   */
  forwardText: '次へ',

  initComponent: function(){
    var slides = Ext.select(this.slideSelector), items = [];

    if(slides.getCount()>0){
      // 各スライド内部のコンテンツとタイトルを取り込み、Carouselのitemsに格納
      slides.each(function(itm){
        items.push({
          scroll: 'vertical',
          html: itm.down(this.slideContentSelector).getHTML(),
          slideTitle: itm.down(this.slideTitleSelector).getHTML()
        });  
      },this);

      this.items = items;
      this.dockedItems = this.generateDockedItems(items[0].slideTitle);
    }

    Tori.simple.Carousel.superclass.initComponent.apply(this,arguments);

    this.tbar = this.getDockedItems()[0];
    this.back = this.tbar.down('#back');
    this.forward = this.tbar.down('#forward');

    this.on('cardswitch', this.onSlideChange, this);
  },

  // DockedItemsのコンフィグを生成
  generateDockedItems: function(title){
    return [{
      dock: 'top',  
      xtype: 'toolbar',
      title: title || '',
      items: [{
        xtype: 'button',
        ui: 'back',
        text: this.backText,
        itemId: 'back',
        handler: this.onBack,
        disabled: true,
        scope: this
      },{
        xtype: 'spacer'
      },{
        xtype: 'button',
        ui: 'forward',
        text: this.forwardText,
        itemId: 'forward',
        handler: this.onForward,
        scope: this
      }]
    }];
  },

  // スライドが切り替わった際のボタンのオン・オフおよびタイトルの変更を管理
  onSlideChange: function(t,new_card,old_card,idx){
    this.tbar.setTitle(new_card.slideTitle);

    if(idx === 0){
      this.back.disable();
    }else if(idx === this.items.getCount() - 1){
      this.forward.disable();
    }else{
      if(this.back.isDisabled()){
        this.back.enable();
      }
      if(this.forward.isDisabled()){
        this.forward.enable();
      }
    }
  },

  onBack: function(){
    this.prev();
  },

  onForward: function(){
    this.next();  
  }
});


