(function(){
  function getOrigin(){
    var script=document.currentScript||Array.prototype.slice.call(document.getElementsByTagName('script')).pop();
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
  function shouldShow(random){return Math.floor(Math.random()*100)+1<=Number(random||100)}
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
  function createDialog(options,origin){
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
      }).catch(function(err){error.textContent=err.message}).finally(function(){button.disabled=false});
    };
    document.body.appendChild(mask);
  }
  function ReadmorePlugin(){this.origin=getOrigin()}
  ReadmorePlugin.prototype.init=function(options){
    if(!options||!options.blogId)return;
    if(isUnlocked(options.blogId))return;
    if(!shouldShow(options.random))return;
    var origin=this.origin;
    post(origin+'/api/readmore/records',{blogId:options.blogId,visitorId:visitorId(),articleUrl:location.href,articleTitle:getTitle()}).catch(function(){});
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){createDialog(options,origin)});else createDialog(options,origin);
  };
  window.ReadmorePlugin=ReadmorePlugin;
})();
