(function(){
  function getOrigin(){
    var scripts=Array.prototype.slice.call(document.getElementsByTagName('script'));
    var script=document.currentScript&&document.currentScript.src?document.currentScript:null;
    if(!script){
      for(var i=scripts.length-1;i>=0;i--){
        if(scripts[i].src&&/\/readmore\/readmore\.js(?:\?|#|$)/.test(scripts[i].src)){
          script=scripts[i];
          break;
        }
      }
    }
    if(!script||!script.src)return '';
    var a=document.createElement('a');
    a.href=script.src;
    return a.protocol+'//'+a.host;
  }
  function visitorId(){
    var key='readmore_visitor_id';
    var existing=localStorage.getItem(key);
    if(existing)return existing;
    var value='v_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
    localStorage.setItem(key,value);
    return value;
  }
  function getTitle(){return document.title||''}
  function tokenKey(blogId){return 'readmore_unlock_'+blogId}
  function isUnlocked(blogId){
    try{
      var raw=localStorage.getItem(tokenKey(blogId));
      if(!raw)return false;
      var data=JSON.parse(raw);
      return data&&data.expireAt&&new Date(data.expireAt).getTime()>Date.now();
    }catch(e){return false}
  }
  function saveUnlock(blogId,data){localStorage.setItem(tokenKey(blogId),JSON.stringify(data))}
  function post(url,payload){
    return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'请求失败');return j})})
  }
  function get(url){
    return fetch(url).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'请求失败');return j})})
  }
  function buildQuery(params){
    var parts=[];
    for(var key in params){
      if(Object.prototype.hasOwnProperty.call(params,key)&&params[key]!==undefined&&params[key]!==null){
        parts.push(encodeURIComponent(key)+'='+encodeURIComponent(params[key]));
      }
    }
    return parts.join('&');
  }
  function isArticlePage(options){
    if(options.articleOnly===false||options.articleOnly==='false')return true;
    if(options.articlePathPattern){
      try{
        return new RegExp(options.articlePathPattern).test(location.pathname);
      }catch(e){}
    }
    if(options.type==='hexo'&&/^\/\d{4}\/\d{2}\/\d{2}\//.test(location.pathname))return true;
    var ogType=document.querySelector('meta[property="og:type"],meta[name="og:type"]');
    if(ogType&&String(ogType.getAttribute('content')||'').toLowerCase()==='article')return true;
    if(document.querySelector('meta[property="article:published_time"],meta[name="article:published_time"],[itemtype*="BlogPosting"],[itemtype*="Article"]'))return true;
    return false;
  }
  function getArticleElement(options){
    if(options.selector){
      var selected=document.querySelector(options.selector);
      if(selected)return selected;
    }
    if(options.id){
      var byId=document.getElementById(options.id);
      if(byId)return byId;
    }
    var selectors=['article','.post-content','.article-content','.entry-content','.content'];
    for(var i=0;i<selectors.length;i++){
      var element=document.querySelector(selectors[i]);
      if(element)return element;
    }
    return null;
  }
  function createDialog(options,origin,onUnlock){
    var existing=document.querySelector('.readmore-mask');
    if(existing)existing.remove();
    var mask=document.createElement('div');
    mask.className='readmore-mask';
    mask.innerHTML='<div class="readmore-dialog"><button class="readmore-close" type="button">×</button><div class="readmore-title">扫码关注公众号：<b></b></div><div class="readmore-subtitle">发送：<span class="readmore-keyword"></span></div><div class="readmore-subtitle">即可立即永久解锁本站全部文章</div><img class="readmore-qrcode" alt="公众号二维码"><form class="readmore-form"><input class="readmore-input" placeholder="请输入验证码"><button class="readmore-submit" type="submit">提交</button></form><div class="readmore-error"></div></div>';
    mask.querySelector('.readmore-title b').textContent=options.name||'';
    mask.querySelector('.readmore-keyword').textContent=options.keyword||'验证码';
    mask.querySelector('.readmore-qrcode').src=options.qrcode||'';
    mask.querySelector('.readmore-close').onclick=function(){mask.remove()};
    mask.querySelector('form').onsubmit=function(e){
      e.preventDefault();
      var input=mask.querySelector('.readmore-input');
      var error=mask.querySelector('.readmore-error');
      var button=mask.querySelector('.readmore-submit');
      error.textContent='';
      button.disabled=true;
      post(origin+'/api/readmore/captcha/verify',{blogId:options.blogId,code:input.value,visitorId:visitorId(),articleUrl:location.href,articleTitle:getTitle()}).then(function(res){
        saveUnlock(options.blogId,{visitorId:res.visitorId,token:res.token,expireAt:res.expireAt});
        mask.remove();
        if(typeof onUnlock==='function')onUnlock();
      }).catch(function(err){error.textContent=err.message}).finally(function(){button.disabled=false});
    };
    document.body.appendChild(mask);
  }
  function applyGate(article,options,origin){
    var previewHeight=parseInt(options.height||options.previewHeight||480,10);
    if(!previewHeight||previewHeight<120)previewHeight=480;
    if(previewHeight>3000)previewHeight=3000;

    var previous={
      maxHeight:article.style.maxHeight,
      overflow:article.style.overflow,
      position:article.style.position
    };
    article.__readmorePreviousStyle=previous;
    article.classList.add('readmore-gated');
    article.style.maxHeight=previewHeight+'px';
    article.style.overflow='hidden';
    if(getComputedStyle(article).position==='static')article.style.position='relative';

    var gate=document.createElement('div');
    gate.className='readmore-gate';
    gate.innerHTML='<div class="readmore-gate-fade"></div><div class="readmore-gate-box"><button class="readmore-readfull" type="button">阅读全文</button></div>';
    article.insertAdjacentElement('afterend',gate);

    function unlockArticle(){
      var oldStyle=article.__readmorePreviousStyle||{};
      article.classList.remove('readmore-gated');
      article.classList.add('readmore-unlocked');
      article.style.maxHeight=oldStyle.maxHeight||'';
      article.style.overflow=oldStyle.overflow||'';
      article.style.position=oldStyle.position||'';
      gate.remove();
    }

    gate.querySelector('.readmore-readfull').onclick=function(){createDialog(options,origin,unlockArticle)};
    post(origin+'/api/readmore/records',{blogId:options.blogId,visitorId:visitorId(),articleUrl:location.href,articleTitle:getTitle()}).catch(function(){});
  }
  function ReadmorePlugin(){this.origin=getOrigin()}
  ReadmorePlugin.prototype.init=function(options){
    if(!options||!options.blogId)return;
    var origin=this.origin;
    if(!origin)return;
    var run=function(){
      if(!isArticlePage(options))return;
      var article=getArticleElement(options);
      if(!article)return;
      if(isUnlocked(options.blogId)){
        article.classList.add('readmore-unlocked');
        return;
      }
      get(origin+'/api/readmore/config?'+buildQuery({blogId:options.blogId,articleUrl:location.href})).then(function(config){
        if(!config.protected)return;
        var merged={
          blogId:options.blogId,
          name:config.officialAccountName||options.name,
          keyword:config.replyKeyword||options.keyword,
          qrcode:config.qrcodeUrl||options.qrcode,
          height:config.previewHeight||options.height,
          previewHeight:config.previewHeight||options.previewHeight
        };
        applyGate(article,merged,origin);
      }).catch(function(err){console.warn('readmore config error: '+err.message)});
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  };
  window.ReadmorePlugin=ReadmorePlugin;
})();
