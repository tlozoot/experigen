
(function($){$.toJSON=function(o)
{if(typeof(JSON)=='object'&&JSON.stringify)
return JSON.stringify(o);var type=typeof(o);if(o===null)
return"null";if(type=="undefined")
return undefined;if(type=="number"||type=="boolean")
return o+"";if(type=="string")
return $.quoteString(o);if(type=='object')
{if(typeof o.toJSON=="function")
return $.toJSON(o.toJSON());if(o.constructor===Date)
{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array)
{var ret=[];for(var i=0;i<o.length;i++)
ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;if(typeof o[k]=="function")
continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
{if(string.match(_escapeable))
{return'"'+string.replace(_escapeable,function(a)
{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};})(jQuery);


(function(){var rsplit=function(string,regex){var result=regex.exec(string),retArr=new Array(),first_idx,last_idx,first_bit;while(result!=null){first_idx=result.index;last_idx=regex.lastIndex;if((first_idx)!=0){first_bit=string.substring(0,first_idx);retArr.push(string.substring(0,first_idx));string=string.slice(first_idx)}retArr.push(result[0]);string=string.slice(result[0].length);result=regex.exec(string)}if(!string==""){retArr.push(string)}return retArr},chop=function(string){return string.substr(0,string.length-1)},extend=function(d,s){for(var n in s){if(s.hasOwnProperty(n)){d[n]=s[n]}}};EJS=function(options){options=typeof options=="string"?{view:options}:options;this.set_options(options);if(options.precompiled){this.template={};this.template.process=options.precompiled;EJS.update(this.name,this);return }if(options.element){if(typeof options.element=="string"){var name=options.element;options.element=document.getElementById(options.element);if(options.element==null){throw name+"does not exist!"}}if(options.element.value){this.text=options.element.value}else{this.text=options.element.innerHTML}this.name=options.element.id;this.type="["}else{if(options.url){options.url=EJS.endExt(options.url,this.extMatch);this.name=this.name?this.name:options.url;var url=options.url;var template=EJS.get(this.name,this.cache);if(template){return template}if(template==EJS.INVALID_PATH){return null}try{this.text=EJS.request(url+(this.cache?"":"?"+Math.random()))}catch(e){}if(this.text==null){throw ({type:"EJS",message:"There is no template at "+url})}}}var template=new EJS.Compiler(this.text,this.type);template.compile(options,this.name);EJS.update(this.name,this);this.template=template};EJS.prototype={render:function(object,extra_helpers){object=object||{};this._extra_helpers=extra_helpers;var v=new EJS.Helpers(object,extra_helpers||{});return this.template.process.call(object,object,v)},update:function(element,options){if(typeof element=="string"){element=document.getElementById(element)}if(options==null){_template=this;return function(object){EJS.prototype.update.call(_template,element,object)}}if(typeof options=="string"){params={};params.url=options;_template=this;params.onComplete=function(request){var object=eval(request.responseText);EJS.prototype.update.call(_template,element,object)};EJS.ajax_request(params)}else{element.innerHTML=this.render(options)}},out:function(){return this.template.out},set_options:function(options){this.type=options.type||EJS.type;this.cache=options.cache!=null?options.cache:EJS.cache;this.text=options.text||null;this.name=options.name||null;this.ext=options.ext||EJS.ext;this.extMatch=new RegExp(this.ext.replace(/\./,"."))}};EJS.endExt=function(path,match){if(!path){return null}match.lastIndex=0;return path+(match.test(path)?"":this.ext)};EJS.Scanner=function(source,left,right){extend(this,{left_delimiter:left+"%",right_delimiter:"%"+right,double_left:left+"%%",double_right:"%%"+right,left_equal:left+"%=",left_comment:left+"%#"});this.SplitRegexp=left=="["?/(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/:new RegExp("("+this.double_left+")|(%%"+this.double_right+")|("+this.left_equal+")|("+this.left_comment+")|("+this.left_delimiter+")|("+this.right_delimiter+"\n)|("+this.right_delimiter+")|(\n)");this.source=source;this.stag=null;this.lines=0};EJS.Scanner.to_text=function(input){if(input==null||input===undefined){return""}if(input instanceof Date){return input.toDateString()}if(input.toString){return input.toString()}return""};EJS.Scanner.prototype={scan:function(block){scanline=this.scanline;regex=this.SplitRegexp;if(!this.source==""){var source_split=rsplit(this.source,/\n/);for(var i=0;i<source_split.length;i++){var item=source_split[i];this.scanline(item,regex,block)}}},scanline:function(line,regex,block){this.lines++;var line_split=rsplit(line,regex);for(var i=0;i<line_split.length;i++){var token=line_split[i];if(token!=null){try{block(token,this)}catch(e){throw {type:"EJS.Scanner",line:this.lines}}}}}};EJS.Buffer=function(pre_cmd,post_cmd){this.line=new Array();this.script="";this.pre_cmd=pre_cmd;this.post_cmd=post_cmd;for(var i=0;i<this.pre_cmd.length;i++){this.push(pre_cmd[i])}};EJS.Buffer.prototype={push:function(cmd){this.line.push(cmd)},cr:function(){this.script=this.script+this.line.join("; ");this.line=new Array();this.script=this.script+"\n"},close:function(){if(this.line.length>0){for(var i=0;i<this.post_cmd.length;i++){this.push(pre_cmd[i])}this.script=this.script+this.line.join("; ");line=null}}};EJS.Compiler=function(source,left){this.pre_cmd=["var ___ViewO = [];"];this.post_cmd=new Array();this.source=" ";if(source!=null){if(typeof source=="string"){source=source.replace(/\r\n/g,"\n");source=source.replace(/\r/g,"\n");this.source=source}else{if(source.innerHTML){this.source=source.innerHTML}}if(typeof this.source!="string"){this.source=""}}left=left||"<";var right=">";switch(left){case"[":right="]";break;case"<":break;default:throw left+" is not a supported deliminator";break}this.scanner=new EJS.Scanner(this.source,left,right);this.out=""};EJS.Compiler.prototype={compile:function(options,name){options=options||{};this.out="";var put_cmd="___ViewO.push(";var insert_cmd=put_cmd;var buff=new EJS.Buffer(this.pre_cmd,this.post_cmd);var content="";var clean=function(content){content=content.replace(/\\/g,"\\\\");content=content.replace(/\n/g,"\\n");content=content.replace(/"/g,'\\"');return content};this.scanner.scan(function(token,scanner){if(scanner.stag==null){switch(token){case"\n":content=content+"\n";buff.push(put_cmd+'"'+clean(content)+'");');buff.cr();content="";break;case scanner.left_delimiter:case scanner.left_equal:case scanner.left_comment:scanner.stag=token;if(content.length>0){buff.push(put_cmd+'"'+clean(content)+'")')}content="";break;case scanner.double_left:content=content+scanner.left_delimiter;break;default:content=content+token;break}}else{switch(token){case scanner.right_delimiter:switch(scanner.stag){case scanner.left_delimiter:if(content[content.length-1]=="\n"){content=chop(content);buff.push(content);buff.cr()}else{buff.push(content)}break;case scanner.left_equal:buff.push(insert_cmd+"(EJS.Scanner.to_text("+content+")))");break}scanner.stag=null;content="";break;case scanner.double_right:content=content+scanner.right_delimiter;break;default:content=content+token;break}}});if(content.length>0){buff.push(put_cmd+'"'+clean(content)+'")')}buff.close();this.out=buff.script+";";var to_be_evaled="/*"+name+"*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {"+this.out+" return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";try{eval(to_be_evaled)}catch(e){if(typeof JSLINT!="undefined"){JSLINT(this.out);for(var i=0;i<JSLINT.errors.length;i++){var error=JSLINT.errors[i];if(error.reason!="Unnecessary semicolon."){error.line++;var e=new Error();e.lineNumber=error.line;e.message=error.reason;if(options.view){e.fileName=options.view}throw e}}}else{throw e}}}};EJS.config=function(options){EJS.cache=options.cache!=null?options.cache:EJS.cache;EJS.type=options.type!=null?options.type:EJS.type;EJS.ext=options.ext!=null?options.ext:EJS.ext;var templates_directory=EJS.templates_directory||{};EJS.templates_directory=templates_directory;EJS.get=function(path,cache){if(cache==false){return null}if(templates_directory[path]){return templates_directory[path]}return null};EJS.update=function(path,template){if(path==null){return }templates_directory[path]=template};EJS.INVALID_PATH=-1};EJS.config({cache:true,type:"<",ext:".ejs"});EJS.Helpers=function(data,extras){this._data=data;this._extras=extras;extend(this,extras)};EJS.Helpers.prototype={view:function(options,data,helpers){if(!helpers){helpers=this._extras}if(!data){data=this._data}return new EJS(options).render(data,helpers)},to_text:function(input,null_text){if(input==null||input===undefined){return null_text||""}if(input instanceof Date){return input.toDateString()}if(input.toString){return input.toString().replace(/\n/g,"<br />").replace(/''/g,"'")}return""}};EJS.newRequest=function(){var factories=[function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new XMLHttpRequest()},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var i=0;i<factories.length;i++){try{var request=factories[i]();if(request!=null){return request}}catch(e){continue}}};EJS.request=function(path){var request=new EJS.newRequest();request.open("GET",path,false);try{request.send(null)}catch(e){return null}if(request.status==404||request.status==2||(request.status==0&&request.responseText=="")){return null}return request.responseText};EJS.ajax_request=function(params){params.method=(params.method?params.method:"GET");var request=new EJS.newRequest();request.onreadystatechange=function(){if(request.readyState==4){if(request.status==200){params.onComplete(request)}else{params.onComplete(request)}}};request.open(params.method,params.url);request.send(null)}})();EJS.Helpers.prototype.date_tag=function(C,O,A){if(!(O instanceof Date)){O=new Date()}var B=["January","February","March","April","May","June","July","August","September","October","November","December"];var G=[],D=[],P=[];var J=O.getFullYear();var H=O.getMonth();var N=O.getDate();for(var M=J-15;M<J+15;M++){G.push({value:M,text:M})}for(var E=0;E<12;E++){D.push({value:(E),text:B[E]})}for(var I=0;I<31;I++){P.push({value:(I+1),text:(I+1)})}var L=this.select_tag(C+"[year]",J,G,{id:C+"[year]"});var F=this.select_tag(C+"[month]",H,D,{id:C+"[month]"});var K=this.select_tag(C+"[day]",N,P,{id:C+"[day]"});return L+F+K};EJS.Helpers.prototype.form_tag=function(B,A){A=A||{};A.action=B;if(A.multipart==true){A.method="post";A.enctype="multipart/form-data"}return this.start_tag_for("form",A)};EJS.Helpers.prototype.form_tag_end=function(){return this.tag_end("form")};EJS.Helpers.prototype.hidden_field_tag=function(A,C,B){return this.input_field_tag(A,C,"hidden",B)};EJS.Helpers.prototype.input_field_tag=function(A,D,C,B){B=B||{};B.id=B.id||A;B.value=D||"";B.type=C||"text";B.name=A;return this.single_tag_for("input",B)};EJS.Helpers.prototype.is_current_page=function(A){return(window.location.href==A||window.location.pathname==A?true:false)};EJS.Helpers.prototype.link_to=function(B,A,C){if(!B){var B="null"}if(!C){var C={}}if(C.confirm){C.onclick=' var ret_confirm = confirm("'+C.confirm+'"); if(!ret_confirm){ return false;} ';C.confirm=null}C.href=A;return this.start_tag_for("a",C)+B+this.tag_end("a")};EJS.Helpers.prototype.submit_link_to=function(B,A,C){if(!B){var B="null"}if(!C){var C={}}C.onclick=C.onclick||"";if(C.confirm){C.onclick=' var ret_confirm = confirm("'+C.confirm+'"); if(!ret_confirm){ return false;} ';C.confirm=null}C.value=B;C.type="submit";C.onclick=C.onclick+(A?this.url_for(A):"")+"return false;";return this.start_tag_for("input",C)};EJS.Helpers.prototype.link_to_if=function(F,B,A,D,C,E){return this.link_to_unless((F==false),B,A,D,C,E)};EJS.Helpers.prototype.link_to_unless=function(E,B,A,C,D){C=C||{};if(E){if(D&&typeof D=="function"){return D(B,A,C,D)}else{return B}}else{return this.link_to(B,A,C)}};EJS.Helpers.prototype.link_to_unless_current=function(B,A,C,D){C=C||{};return this.link_to_unless(this.is_current_page(A),B,A,C,D)};EJS.Helpers.prototype.password_field_tag=function(A,C,B){return this.input_field_tag(A,C,"password",B)};EJS.Helpers.prototype.select_tag=function(D,G,H,F){F=F||{};F.id=F.id||D;F.value=G;F.name=D;var B="";B+=this.start_tag_for("select",F);for(var E=0;E<H.length;E++){var C=H[E];var A={value:C.value};if(C.value==G){A.selected="selected"}B+=this.start_tag_for("option",A)+C.text+this.tag_end("option")}B+=this.tag_end("select");return B};EJS.Helpers.prototype.single_tag_for=function(A,B){return this.tag(A,B,"/>")};EJS.Helpers.prototype.start_tag_for=function(A,B){return this.tag(A,B)};EJS.Helpers.prototype.submit_tag=function(A,B){B=B||{};B.type=B.type||"submit";B.value=A||"Submit";return this.single_tag_for("input",B)};EJS.Helpers.prototype.tag=function(C,E,D){if(!D){var D=">"}var B=" ";for(var A in E){if(E[A]!=null){var F=E[A].toString()}else{var F=""}if(A=="Class"){A="class"}if(F.indexOf("'")!=-1){B+=A+'="'+F+'" '}else{B+=A+"='"+F+"' "}}return"<"+C+B+D};EJS.Helpers.prototype.tag_end=function(A){return"</"+A+">"};EJS.Helpers.prototype.text_area_tag=function(A,C,B){B=B||{};B.id=B.id||A;B.name=B.name||A;C=C||"";if(B.size){B.cols=B.size.split("x")[0];B.rows=B.size.split("x")[1];delete B.size}B.cols=B.cols||50;B.rows=B.rows||4;return this.start_tag_for("textarea",B)+C+this.tag_end("textarea")};EJS.Helpers.prototype.text_tag=EJS.Helpers.prototype.text_area_tag;EJS.Helpers.prototype.text_field_tag=function(A,C,B){return this.input_field_tag(A,C,"text",B)};EJS.Helpers.prototype.url_for=function(A){return'window.location="'+A+'";'};EJS.Helpers.prototype.img_tag=function(B,C,A){A=A||{};A.src=B;A.alt=C;return this.single_tag_for("img",A)};

/*

 SoundManager 2: Javascript Sound for the Web
 --------------------------------------------
 http://schillmania.com/projects/soundmanager2/

 Copyright (c) 2007, Scott Schiller. All rights reserved.
 Code provided under the BSD License:
 http://schillmania.com/projects/soundmanager2/license.txt

 V2.96a.20100606
*/
(function(j){function oa(Q,Z){function $(){if(b.debugURLParam.test(I))b.debugMode=true;var c,a,f,h;if(b.debugMode){c=document.createElement("div");c.id=b.debugID+"-toggle";a={position:"fixed",bottom:"0px",right:"0px",width:"1.2em",height:"1.2em",lineHeight:"1.2em",margin:"2px",textAlign:"center",border:"1px solid #999",cursor:"pointer",background:"#fff",color:"#333",zIndex:10001};c.appendChild(document.createTextNode("-"));c.onclick=pa;c.title="Toggle SM2 debug console";if(A.match(/msie 6/i)){c.style.position=
"absolute";c.style.cursor="hand"}for(h in a)if(a.hasOwnProperty(h))c.style[h]=a[h]}if(b.debugMode&&!t(b.debugID)&&(!aa||!b.useConsole||b.useConsole&&aa&&!b.consoleOnly)){a=document.createElement("div");a.id=b.debugID;a.style.display=b.debugMode?"block":"none";if(b.debugMode&&!t(c.id)){try{f=ba();f.appendChild(c)}catch(e){throw new Error(p("appXHTML"));}f.appendChild(a)}}f=null;$=function(){}}this.flashVersion=8;this.debugMode=true;this.debugFlash=false;this.useConsole=true;this.waitForWindowLoad=
this.consoleOnly=false;this.nullURL="about:blank";this.allowPolling=true;this.useFastPolling=false;this.useMovieStar=true;this.bgColor="#ffffff";this.useHighPerformance=false;this.flashLoadTimeout=1E3;this.wmode=null;this.allowFullScreen=true;this.allowScriptAccess="always";this.useHTML5Audio=this.useFlashBlock=false;this.html5Test=/^probably$/i;this.audioFormats={mp3:{type:['audio/mpeg; codecs="mp3"',"audio/mpeg","audio/mp3","audio/MPA","audio/mpa-robust"],required:true},mp4:{related:["aac","m4a"],
type:['audio/mp4; codecs="mp4a.40.2"',"audio/aac","audio/x-m4a","audio/MP4A-LATM","audio/mpeg4-generic"],required:true},ogg:{type:["audio/ogg; codecs=vorbis"],required:false},wav:{type:['audio/wav; codecs="1"',"audio/wav","audio/wave","audio/x-wav"],required:false}};this.defaultOptions={autoLoad:false,stream:true,autoPlay:false,loops:1,onid3:null,onload:null,whileloading:null,onplay:null,onpause:null,onresume:null,whileplaying:null,onstop:null,onfinish:null,onbeforefinish:null,onbeforefinishtime:5E3,
onbeforefinishcomplete:null,onjustbeforefinish:null,onjustbeforefinishtime:200,multiShot:true,multiShotEvents:false,position:null,pan:0,type:null,volume:100};this.flash9Options={isMovieStar:null,usePeakData:false,useWaveformData:false,useEQData:false,onbufferchange:null,ondataerror:null};this.movieStarOptions={onmetadata:null,useVideo:false,bufferTime:3,serverURL:null,onconnect:null};this.version=null;this.versionNumber="V2.96a.20100606";this.movieURL=null;this.url=Q||null;this.altURL=null;this.enabled=
this.swfLoaded=false;this.o=null;this.movieID="sm2-container";this.id=Z||"sm2movie";this.swfCSS={swfDefault:"movieContainer",swfError:"swf_error",swfTimedout:"swf_timedout",swfUnblocked:"swf_unblocked",sm2Debug:"sm2_debug",highPerf:"high_performance",flashDebug:"flash_debug"};this.oMC=null;this.sounds={};this.soundIDs=[];this.isFullScreen=this.muted=false;this.isIE=navigator.userAgent.match(/MSIE/i);this.isSafari=navigator.userAgent.match(/safari/i);this.debugID="soundmanager-debug";this.debugURLParam=
/([#?&])debug=1/i;this.didFlashBlock=this.specialWmodeCase=false;this.filePattern=null;this.filePatterns={flash8:/\.mp3(\?.*)?$/i,flash9:/\.mp3(\?.*)?$/i};this.baseMimeTypes=/^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;this.netStreamMimeTypes=/^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;this.netStreamTypes=["aac","flv","mov","mp4","m4v","f4v","m4a","mp4v","3gp","3g2"];this.netStreamPattern=new RegExp("\\.("+this.netStreamTypes.join("|")+")(\\?.*)?$","i");this.mimePattern=this.baseMimeTypes;this.features=
{buffering:false,peakData:false,waveformData:false,eqData:false,movieStar:false};this.sandbox={type:null,types:{remote:"remote (domain-based) rules",localWithFile:"local with file access (no internet access)",localWithNetwork:"local with network (internet access only, no local access)",localTrusted:"local, trusted (local+internet access)"},description:null,noRemote:null,noLocal:null};this.hasHTML5=null;this.html5={usingFlash:null};this.ignoreFlash=false;var ca,b=this,t,A=navigator.userAgent,I=j.location.href.toString(),
n=this.flashVersion,qa,R,C=[],da=true,v,D=false,J=false,r=false,x=false,ea=false,k,ra,K,u,sa,E,F,ta,fa,ga,B,ua,S,T,L,ha,ba,U,va,Da=["log","info","warn","error"],wa,M,xa,N=null,ia=null,p,ja,O,pa,V,ka,q,W=false,la=false,ya,za,G=null,Aa,X,y=false,P,z,ma,Ba;Q=A.match(/pre\//i);Z=A.match(/(ipad|iphone)/i);A.match(/mobile/i);var aa=typeof console!=="undefined"&&typeof console.log!=="undefined",na=typeof document.hasFocus!=="undefined"?document.hasFocus():null,H=typeof document.hasFocus==="undefined"&&this.isSafari,
Ca=!H;this._use_maybe=I.match(/sm2\-useHTML5Maybe\=1/i);this._overHTTP=document.location?document.location.protocol.match(/http/i):null;this.useAltURL=!this._overHTTP;if(Z||Q){b.useHTML5Audio=true;b.ignoreFlash=true}if(Q||this._use_maybe)b.html5Test=/^(probably|maybe)$/i;(function(){var c=I,a=null;if(c.indexOf("#sm2-usehtml5audio=")!==-1){a=c.substr(c.indexOf("#sm2-usehtml5audio=")+19)==="1";if(typeof console!=="undefined"&&typeof console.log!=="undefined")console.log((a?"Enabling ":"Disabling ")+
"useHTML5Audio via URL parameter");b.useHTML5Audio=a}})();this.supported=function(){return G?r&&!x:b.useHTML5Audio&&b.hasHTML5};this.getMovie=function(c){return b.isIE?j[c]:b.isSafari?t(c)||document[c]:t(c)};this.loadFromXML=function(c){try{b.o._loadFromXML(c)}catch(a){M();return true}};this.createSound=function(c){function a(){f=V(f);b.sounds[e.id]=new ca(e);b.soundIDs.push(e.id);return b.sounds[e.id]}var f=null,h=null,e=null;if(!r)throw ka("soundManager.createSound(): "+p("notReady"),arguments.callee.caller);
if(arguments.length===2)c={id:arguments[0],url:arguments[1]};e=f=u(c);e.id.toString().charAt(0).match(/^[0-9]$/)&&b._wD("soundManager.createSound(): "+p("badID",e.id),2);b._wD("soundManager.createSound(): "+e.id+" ("+e.url+")",1);if(q(e.id,true)){b._wD("soundManager.createSound(): "+e.id+" exists",1);return b.sounds[e.id]}if(X(e)){h=a();b._wD("Loading sound "+e.id+" from HTML5");h._setup_html5(e)}else{if(n>8&&b.useMovieStar){if(e.isMovieStar===null)e.isMovieStar=e.serverURL||(e.type?e.type.match(b.netStreamPattern):
false)||e.url.match(b.netStreamPattern)?true:false;e.isMovieStar&&b._wD("soundManager.createSound(): using MovieStar handling");if(e.isMovieStar){if(e.usePeakData){k("noPeak");e.usePeakData=false}e.loops>1&&k("noNSLoop")}}h=a();if(n===8)b.o._createSound(e.id,e.onjustbeforefinishtime,e.loops||1);else{b.o._createSound(e.id,e.url,e.onjustbeforefinishtime,e.usePeakData,e.useWaveformData,e.useEQData,e.isMovieStar,e.isMovieStar?e.useVideo:false,e.isMovieStar?e.bufferTime:false,e.loops||1,e.serverURL,e.duration||
null,e.totalBytes||null,e.autoPlay,true);if(!e.serverURL){h.connected=true;e.onconnect&&e.onconnect.apply(h)}}}if(e.autoLoad||e.autoPlay)if(h)if(b.isHTML5){h.autobuffer="auto";h.preload="auto"}else h.load(e);e.autoPlay&&h.play();return h};this.createVideo=function(c){if(arguments.length===2)c={id:arguments[0],url:arguments[1]};if(n>=9){c.isMovieStar=true;c.useVideo=true}else{b._wD("soundManager.createVideo(): "+p("f9Vid"),2);return false}b.useMovieStar||b._wD("soundManager.createVideo(): "+p("noMS"),
2);return b.createSound(c)};this.destroyVideo=this.destroySound=function(c,a){if(!q(c))return false;for(var f=0;f<b.soundIDs.length;f++)b.soundIDs[f]===c&&b.soundIDs.splice(f,1);b.sounds[c].unload();a||b.sounds[c].destruct();delete b.sounds[c]};this.load=function(c,a){if(!q(c))return false;return b.sounds[c].load(a)};this.unload=function(c){if(!q(c))return false;return b.sounds[c].unload()};this.start=this.play=function(c,a){if(!r)throw ka("soundManager.play(): "+p("notReady"),arguments.callee.caller);
if(!q(c)){a instanceof Object||(a={url:a});if(a&&a.url){b._wD('soundManager.play(): attempting to create "'+c+'"',1);a.id=c;return b.createSound(a).play()}else return false}return b.sounds[c].play(a)};this.setPosition=function(c,a){if(!q(c))return false;return b.sounds[c].setPosition(a)};this.stop=function(c){if(!q(c))return false;b._wD("soundManager.stop("+c+")",1);return b.sounds[c].stop()};this.stopAll=function(){b._wD("soundManager.stopAll()",1);for(var c in b.sounds)b.sounds[c]instanceof ca&&
b.sounds[c].stop()};this.pause=function(c){if(!q(c))return false;return b.sounds[c].pause()};this.pauseAll=function(){for(var c=b.soundIDs.length;c--;)b.sounds[b.soundIDs[c]].pause()};this.resume=function(c){if(!q(c))return false;return b.sounds[c].resume()};this.resumeAll=function(){for(var c=b.soundIDs.length;c--;)b.sounds[b.soundIDs[c]].resume()};this.togglePause=function(c){if(!q(c))return false;return b.sounds[c].togglePause()};this.setPan=function(c,a){if(!q(c))return false;return b.sounds[c].setPan(a)};
this.setVolume=function(c,a){if(!q(c))return false;return b.sounds[c].setVolume(a)};this.mute=function(c){var a=0;if(typeof c!=="string")c=null;if(c){if(!q(c))return false;b._wD('soundManager.mute(): Muting "'+c+'"');return b.sounds[c].mute()}else{b._wD("soundManager.mute(): Muting all sounds");for(a=b.soundIDs.length;a--;)b.sounds[b.soundIDs[a]].mute();b.muted=true}};this.muteAll=function(){b.mute()};this.unmute=function(c){if(typeof c!=="string")c=null;if(c){if(!q(c))return false;b._wD('soundManager.unmute(): Unmuting "'+
c+'"');return b.sounds[c].unmute()}else{b._wD("soundManager.unmute(): Unmuting all sounds");for(c=b.soundIDs.length;c--;)b.sounds[b.soundIDs[c]].unmute();b.muted=false}};this.unmuteAll=function(){b.unmute()};this.toggleMute=function(c){if(!q(c))return false;return b.sounds[c].toggleMute()};this.getMemoryUse=function(){if(n===8)return 0;if(b.o)return parseInt(b.o._getMemoryUse(),10)};this.disable=function(c){if(typeof c==="undefined")c=false;if(x)return false;x=true;k("shutdown",1);for(var a=b.soundIDs.length;a--;)wa(b.sounds[b.soundIDs[a]]);
K(c);j.removeEventListener&&j.removeEventListener("load",F,false)};this.canPlayMIME=function(c){var a;if(b.hasHTML5)a=P({type:c});return!G||a?a:c?c.match(b.mimePattern)?true:false:null};this.canPlayURL=function(c){var a;if(b.hasHTML5)a=P(c);return!G||a?a:c?c.match(b.filePattern)?true:false:null};this.canPlayLink=function(c){if(typeof c.type!=="undefined"&&c.type)if(b.canPlayMIME(c.type))return true;return b.canPlayURL(c.href)};this.getSoundById=function(c,a){if(!c)throw new Error("SoundManager.getSoundById(): sID is null/undefined");
var f=b.sounds[c];!f&&!a&&b._wD('"'+c+'" is an invalid sound ID.',2);return f};this.onready=function(c,a){if(c&&c instanceof Function){r&&k("queue");a||(a=j);sa(c,a);E();return true}else throw p("needFunction");};this.oninitmovie=function(){};this.onload=function(){b._wD("soundManager.onload()",1)};this.onerror=function(){};this.getMoviePercent=function(){return b.o&&typeof b.o.PercentLoaded!=="undefined"?b.o.PercentLoaded():null};this._wD=this._writeDebug=function(c,a,f){var h,e;if(!b.debugMode)return false;
if(typeof f!=="undefined"&&f)c=c+" | "+(new Date).getTime();if(aa&&b.useConsole){f=Da[a];typeof console[f]!=="undefined"?console[f](c):console.log(c);if(b.useConsoleOnly)return true}try{h=t("soundmanager-debug");if(!h)return false;e=document.createElement("div");if(++ra%2===0)e.className="sm2-alt";a=typeof a==="undefined"?0:parseInt(a,10);e.appendChild(document.createTextNode(c));if(a){if(a>=2)e.style.fontWeight="bold";if(a===3)e.style.color="#ff3333"}h.insertBefore(e,h.firstChild)}catch(m){}};this._debug=
function(){k("currentObj",1);for(var c=0,a=b.soundIDs.length;c<a;c++)b.sounds[b.soundIDs[c]]._debug()};this.reboot=function(){b._wD("soundManager.reboot()");b.soundIDs.length&&b._wD("Destroying "+b.soundIDs.length+" SMSound objects...");for(var c=b.soundIDs.length;c--;)b.sounds[b.soundIDs[c]].destruct();try{if(b.isIE)ia=b.o.innerHTML;N=b.o.parentNode.removeChild(b.o);b._wD("Flash movie removed.")}catch(a){k("badRemove",2)}N=ia=null;x=J=D=la=W=r=b.enabled=false;b.swfLoaded=false;b.soundIDs={};b.sounds=
[];b.o=null;for(c=C.length;c--;)C[c].fired=false;b._wD("soundManager: Rebooting...");j.setTimeout(function(){b.beginDelayedInit()},20)};this.destruct=function(){b._wD("soundManager.destruct()");b.disable(true)};this.beginDelayedInit=function(){ea=true;L();setTimeout(fa,500);setTimeout(ua,20)};X=function(c){return(c.type?P({type:c.type}):false)||P(c.url)};P=function(c){if(!b.useHTML5Audio||!b.hasHTML5)return false;var a,f=b.audioFormats;if(!z){z=[];for(a in f)if(f.hasOwnProperty(a)){z.push(a);if(f[a].related)z=
z.concat(f[a].related)}z=new RegExp("\\.("+z.join("|")+")","i")}a=typeof c.type!=="undefined"?c.type:null;c=typeof c==="string"?c.match(z):null;if(!c||!c.length){if(!a)return false}else c=c[0].substr(1);if(c&&typeof b.html5[c]!=="undefined")return b.html5[c];else{if(!a)if(c&&b.html5[c])return b.html5[c];else a="audio/"+c;a=b.html5.canPlayType(a);return b.html5[c]=a}};Ba=function(){function c(l){var i,d,g=false;if(!a||typeof a.canPlayType!=="function")return false;if(l instanceof Array){i=0;for(d=
l.length;i<d&&!g;i++)if(b.html5[l[i]]||a.canPlayType(l[i]).match(b.html5Test)){g=true;b.html5[l[i]]=true}return g}else return(l=a&&typeof a.canPlayType==="function"?a.canPlayType(l):false)&&(l.match(b.html5Test)?true:false)}if(!b.useHTML5Audio||typeof Audio==="undefined")return false;var a=typeof Audio!=="undefined"?new Audio:null,f,h={},e,m;e=b.audioFormats;for(f in e)if(e.hasOwnProperty(f)){h[f]=c(e[f].type);if(e[f]&&e[f].related)for(m=0;m<e[f].related.length;m++)b.html5[e[f].related[m]]=h[f]}h.canPlayType=
a?c:null;b.html5=u(b.html5,h)};S={notReady:"Not loaded yet - wait for soundManager.onload() before calling sound-related methods",appXHTML:"soundManager::createMovie(): appendChild/innerHTML set failed. May be app/xhtml+xml DOM-related.",spcWmode:"soundManager::createMovie(): Removing wmode, preventing win32 below-the-fold SWF loading issue",swf404:"soundManager: Verify that %s is a valid path.",tryDebug:"Try soundManager.debugFlash = true for more security details (output goes to SWF.)",checkSWF:"See SWF output for more debug info.",
localFail:"soundManager: Non-HTTP page ("+document.location.protocol+" URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/",waitFocus:"soundManager: Special case: Waiting for focus-related event..",waitImpatient:"soundManager: Getting impatient, still waiting for Flash%s...",waitForever:"soundManager: Waiting indefinitely for Flash (will recover if unblocked)...",
needFunction:"soundManager.onready(): Function object expected",badID:'Warning: Sound ID "%s" should be a string, starting with a non-numeric character',fl9Vid:"flash 9 required for video. Exiting.",noMS:"MovieStar mode not enabled. Exiting.",currentObj:"--- soundManager._debug(): Current sound objects ---",waitEI:"soundManager::initMovie(): Waiting for ExternalInterface call from Flash..",waitOnload:"soundManager: Waiting for window.onload()",docLoaded:"soundManager: Document already loaded",onload:"soundManager::initComplete(): calling soundManager.onload()",
onloadOK:"soundManager.onload() complete",init:"-- soundManager::init() --",didInit:"soundManager::init(): Already called?",flashJS:"soundManager: Attempting to call Flash from JS..",noPolling:"soundManager: Polling (whileloading()/whileplaying() support) is disabled.",secNote:"Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html",
badRemove:"Warning: Failed to remove flash movie.",noPeak:"Warning: peakData features unsupported for movieStar formats",shutdown:"soundManager.disable(): Shutting down",queue:"soundManager.onready(): Queueing handler",smFail:"soundManager: Failed to initialise.",smError:"SMSound.load(): Exception: JS-Flash communication failed, or JS error.",fbTimeout:"No flash response, applying ."+b.swfCSS.swfTimedout+" CSS..",fbLoaded:"Flash loaded",manURL:"SMSound.load(): Using manually-assigned URL",onURL:"soundManager.load(): current URL already assigned.",
badFV:'soundManager.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',as2loop:"Note: Setting stream:false so looping can work (flash 8 limitation)",noNSLoop:"Note: Looping not implemented for MovieStar formats",needfl9:"Note: Switching to flash 9, required for MP4 formats."};t=function(c){return document.getElementById(c)};ra=0;p=function(){var c=Array.prototype.slice.call(arguments),a=c.shift();a=S&&S[a]?S[a]:"";var f,h;if(a&&c&&c.length){f=0;for(h=c.length;f<h;f++)a=a.replace("%s",
c[f])}return a};V=function(c){if(n===8&&c.loops>1&&c.stream){k("as2loop");c.stream=false}return c};ka=function(c,a){if(!a)return new Error("Error: "+c);typeof console!=="undefined"&&typeof console.trace!=="undefined"&&console.trace();c="Error: "+c+". \nCaller: "+a.toString();return new Error(c)};qa=function(){return false};wa=function(c){for(var a in c)if(c.hasOwnProperty(a)&&typeof c[a]==="function")c[a]=qa};M=function(c){if(typeof c==="undefined")c=false;if(x||c){k("smFail",2);b.disable(c)}};xa=
function(c){var a=null;if(c)if(c.match(/\.swf(\?\.*)?$/i)){if(a=c.substr(c.toLowerCase().lastIndexOf(".swf?")+4))return c}else if(c.lastIndexOf("/")!==c.length-1)c+="/";return(c&&c.lastIndexOf("/")!==-1?c.substr(0,c.lastIndexOf("/")+1):"./")+b.movieURL};ga=function(){if(n!==8&&n!==9){b._wD(p("badFV",n,8));b.flashVersion=8}var c=b.debugMode||b.debugFlash?"_debug.swf":".swf";if(b.flashVersion<9&&b.useHTML5Audio&&b.audioFormats.mp4.required){b._wD(p("needfl9"));b.flashVersion=9}n=b.flashVersion;b.version=
b.versionNumber+(y?" (HTML5-only mode)":n===9?" (AS3/Flash 9)":" (AS2/Flash 8)");if(n>8){b.defaultOptions=u(b.defaultOptions,b.flash9Options);b.features.buffering=true}if(n>8&&b.useMovieStar){b.defaultOptions=u(b.defaultOptions,b.movieStarOptions);b.filePatterns.flash9=new RegExp("\\.(mp3|"+b.netStreamTypes.join("|")+")(\\?.*)?$","i");b.mimePattern=b.netStreamMimeTypes;b.features.movieStar=true}else b.features.movieStar=false;b.filePattern=b.filePatterns[n!==8?"flash9":"flash8"];b.movieURL=(n===8?
"soundmanager2.swf":"soundmanager2_flash9.swf").replace(".swf",c);b.features.peakData=b.features.waveformData=b.features.eqData=n>8};ba=function(){return document.body?document.body:document.documentElement?document.documentElement:document.getElementsByTagName("div")[0]};va=function(c,a){if(!b.o||!b.allowPolling)return false;b.o._setPolling(c,a)};U=function(c,a){function f(){b._wD("-- SoundManager 2 "+b.version+(!y&&b.useHTML5Audio?b.hasHTML5?" + HTML5 audio":", no HTML5 audio support":"")+(b.useMovieStar?
", MovieStar mode":"")+(b.useHighPerformance?", high performance mode, ":", ")+((b.useFastPolling?"fast":"normal")+" polling")+(b.wmode?", wmode: "+b.wmode:"")+(b.debugFlash?", flash debug mode":"")+(b.useFlashBlock?", flashBlock mode":"")+" --",1)}var h=null;a=a?a:b.url;var e=b.altURL?b.altURL:a,m,l,i,d;c=typeof c==="undefined"?b.id:c;if(D&&J)return false;if(y){ga();f();b.oMC=t(b.movieID);R();J=D=true;return false}D=true;ga();b.url=xa(this._overHTTP?a:e);a=b.url;if(b.useHighPerformance&&b.useMovieStar&&
b.defaultOptions.useVideo===true){h="soundManager note: disabling highPerformance, not applicable with movieStar mode+useVideo";b.useHighPerformance=false}b.wmode=!b.wmode&&b.useHighPerformance&&!b.useMovieStar?"transparent":b.wmode;if(b.wmode!==null&&!b.isIE&&!b.useHighPerformance&&navigator.platform.match(/win32/i)){b.specialWmodeCase=true;k("spcWmode");b.wmode=null}if(n===8)b.allowFullScreen=false;m={name:c,id:c,src:a,width:"100%",height:"100%",quality:"high",allowScriptAccess:b.allowScriptAccess,
bgcolor:b.bgColor,pluginspage:"http://www.macromedia.com/go/getflashplayer",type:"application/x-shockwave-flash",wmode:b.wmode,allowfullscreen:b.allowFullScreen?"true":"false"};if(b.debugFlash)m.FlashVars="debug=1";b.wmode||delete m.wmode;if(b.isIE){e=document.createElement("div");i='<object id="'+c+'" data="'+a+'" type="'+m.type+'" width="'+m.width+'" height="'+m.height+'"><param name="movie" value="'+a+'" /><param name="AllowScriptAccess" value="'+b.allowScriptAccess+'" /><param name="quality" value="'+
m.quality+'" />'+(b.wmode?'<param name="wmode" value="'+b.wmode+'" /> ':"")+'<param name="bgcolor" value="'+b.bgColor+'" /><param name="allowFullScreen" value="'+m.allowFullScreen+'" />'+(b.debugFlash?'<param name="FlashVars" value="'+m.FlashVars+'" />':"")+"<!-- --\></object>"}else{e=document.createElement("embed");for(l in m)m.hasOwnProperty(l)&&e.setAttribute(l,m[l])}$();l=O();if(c=ba()){b.oMC=t(b.movieID)?t(b.movieID):document.createElement("div");if(b.oMC.id){c=b.oMC.className;b.oMC.className=
(c?c+" ":b.swfCSS.swfDefault)+(l?" "+l:"");b.oMC.appendChild(e);if(b.isIE){l=b.oMC.appendChild(document.createElement("div"));l.className="sm2-object-box";l.innerHTML=i}J=true}else{b.oMC.id=b.movieID;b.oMC.className=b.swfCSS.swfDefault+" "+l;l=m=null;b.useFlashBlock||(m=b.useHighPerformance?{position:"fixed",width:"8px",height:"8px",bottom:"0px",left:"0px",overflow:"hidden"}:{position:"absolute",width:"6px",height:"6px",top:"-9999px",left:"-9999px"});d=null;if(!b.debugFlash)for(d in m)if(m.hasOwnProperty(d))b.oMC.style[d]=
m[d];try{b.isIE||b.oMC.appendChild(e);c.appendChild(b.oMC);if(b.isIE){l=b.oMC.appendChild(document.createElement("div"));l.className="sm2-object-box";l.innerHTML=i}J=true}catch(g){throw new Error(p("appXHTML"));}}}h&&b._wD(h);f();b._wD("soundManager::createMovie(): Trying to load "+a+(!this._overHTTP&&b.altURL?" (alternate URL)":""),1)};q=this.getSoundById;k=function(c,a){return c?b._wD(p(c),a):""};if(I.indexOf("debug=alert")+1&&b.debugMode)b._wD=function(c){alert(c)};pa=function(){var c=t(b.debugID),
a=t(b.debugID+"-toggle");if(!c)return false;if(da){a.innerHTML="+";c.style.display="none"}else{a.innerHTML="-";c.style.display="block"}da=!da};v=function(c,a,f){if(typeof sm2Debugger!=="undefined")try{sm2Debugger.handleEvent(c,a,f)}catch(h){}};u=function(c,a){var f={},h,e;for(h in c)if(c.hasOwnProperty(h))f[h]=c[h];c=typeof a==="undefined"?b.defaultOptions:a;for(e in c)if(c.hasOwnProperty(e)&&typeof f[e]==="undefined")f[e]=c[e];return f};T=function(){if(y){U();return false}if(b.o)return false;b.o=
b.getMovie(b.id);if(!b.o){if(N){if(b.isIE)b.oMC.innerHTML=ia;else b.oMC.appendChild(N);N=null;D=true}else U(b.id,b.url);b.o=b.getMovie(b.id)}if(b.o){b._wD("soundManager::initMovie(): Got "+b.o.nodeName+" element ("+(D?"created via JS":"static HTML")+")");k("waitEI")}typeof b.oninitmovie==="function"&&setTimeout(b.oninitmovie,1)};ta=function(c){if(c)b.url=c;T()};fa=function(){if(W)return false;W=true;if(H&&!na){k("waitFocus");return false}var c;if(!r){c=b.getMoviePercent();b._wD(p("waitImpatient",
c===100?" (SWF loaded)":c>0?" (SWF "+c+"% loaded)":""))}setTimeout(function(){c=b.getMoviePercent();if(!r){b._wD("soundManager: No Flash response within expected time.\nLikely causes: "+(c===0?"Loading "+b.movieURL+" may have failed (and/or Flash "+n+"+ not present?), ":"")+"Flash blocked or JS-Flash security error."+(b.debugFlash?" "+p("checkSWF"):""),2);if(!this._overHTTP&&c){k("localFail",2);b.debugFlash||k("tryDebug",2)}c===0&&b._wD(p("swf404",b.url));v("flashtojs",false,": Timed out"+this._overHTTP?
" (Check flash security or flash blockers)":" (No plugin/missing SWF?)")}if(!r&&Ca)if(c===null)if(b.useFlashBlock||b.flashLoadTimeout===0){b.useFlashBlock&&ja();k("waitForever")}else M(true);else b.flashLoadTimeout===0?k("waitForever"):M(true)},b.flashLoadTimeout)};O=function(){var c=[];b.debugMode&&c.push(b.swfCSS.sm2Debug);b.debugFlash&&c.push(b.swfCSS.flashDebug);b.useHighPerformance&&c.push(b.swfCSS.highPerf);return c.join(" ")};ja=function(){var c=b.getMoviePercent();if(b.supported()){b.didFlashBlock&&
b._wD("soundManager::flashBlockHandler(): Unblocked");if(b.oMC)b.oMC.className=O()+" "+b.swfCSS.swfDefault+(" "+b.swfCSS.swfUnblocked)}else{if(G){b.oMC.className=O()+" "+b.swfCSS.swfDefault+" "+(c===null?b.swfCSS.swfTimedout:b.swfCSS.swfError);b._wD("soundManager::flashBlockHandler(): "+p("fbTimeout")+(c?" ("+p("fbLoaded")+")":""))}b.didFlashBlock=true;E(true);b.onerror instanceof Function&&b.onerror.apply(j)}};B=function(){if(na||!H)return true;na=Ca=true;b._wD("soundManager::handleFocus()");H&&
j.removeEventListener("mousemove",B,false);W=false;setTimeout(fa,500);if(j.removeEventListener)j.removeEventListener("focus",B,false);else j.detachEvent&&j.detachEvent("onfocus",B)};K=function(c){if(r)return false;if(y){b._wD("-- SoundManager 2: loaded --");r=true;E();F();return true}b.useFlashBlock&&b.flashLoadTimeout&&!b.getMoviePercent()||(r=true);b._wD("-- SoundManager 2 "+(x?"failed to load":"loaded")+" ("+(x?"security/load error":"OK")+") --",1);if(x||c){if(b.useFlashBlock)b.oMC.className=O()+
" "+(b.getMoviePercent()===null?b.swfCSS.swfTimedout:b.swfCSS.swfError);E();v("onload",false);b.onerror instanceof Function&&b.onerror.apply(j);return false}else v("onload",true);if(b.waitForWindowLoad&&!ea){k("waitOnload");if(j.addEventListener)j.addEventListener("load",F,false);else j.attachEvent&&j.attachEvent("onload",F);return false}else{b.waitForWindowLoad&&ea&&k("docLoaded");F()}};sa=function(c,a){C.push({method:c,scope:a||null,fired:false})};E=function(c){if(!r&&!c)return false;c={success:c?
b.supported():!x};var a=[],f,h,e=!b.useFlashBlock||b.useFlashBlock&&!b.supported();f=0;for(h=C.length;f<h;f++)C[f].fired!==true&&a.push(C[f]);if(a.length){b._wD("soundManager: Firing "+a.length+" onready() item"+(a.length>1?"s":""));f=0;for(h=a.length;f<h;f++){a[f].scope?a[f].method.apply(a[f].scope,[c]):a[f].method(c);if(!e)a[f].fired=true}}};F=function(){j.setTimeout(function(){b.useFlashBlock&&ja();E();k("onload",1);b.onload.apply(j);k("onloadOK",1)},1)};Aa=function(){var c,a,f=!I.match(/usehtml5audio/i)&&
b.isSafari&&A.match(/OS X 10_6_3/i)&&A.match(/531\.22\.7/i);if(A.match(/iphone os (1|2|3_0|3_1)/i)?true:false){b.hasHTML5=false;y=true;if(b.oMC)b.oMC.style.display="none";return false}if(b.useHTML5Audio){if(!b.html5||!b.html5.canPlayType){b._wD("SoundManager: No HTML5 Audio() support detected.");b.hasHTML5=false;return true}else b.hasHTML5=true;if(f){b._wD("Note: Buggy HTML5 in this version of Safari, see https://bugs.webkit.org/show_bug.cgi?id=32159 - disabling HTML5",1);b.useHTML5Audio=false;b.hasHTML5=
false;return true}}else return true;for(a in b.audioFormats)if(b.audioFormats.hasOwnProperty(a))if(b.audioFormats[a].required&&!b.html5.canPlayType(b.audioFormats[a].type))c=true;if(b.ignoreFlash)c=false;y=b.useHTML5Audio&&b.hasHTML5&&!c;return c};R=function(){function c(){if(j.removeEventListener)j.removeEventListener("load",b.beginDelayedInit,false);else j.detachEvent&&j.detachEvent("onload",b.beginDelayedInit)}var a,f=[];k("init");if(r){k("didInit");return false}if(b.hasHTML5){for(a in b.audioFormats)b.audioFormats.hasOwnProperty(a)&&
f.push(a+": "+b.html5[a]);b._wD("-- SoundManager 2: HTML5 support tests ("+b.html5Test+"): "+f.join(", ")+" --",1)}if(y){if(!r){c();b.enabled=true;K()}return true}T();try{k("flashJS");b.o._externalInterfaceTest(false);b.allowPolling?va(true,b.useFastPolling?true:false):k("noPolling",1);b.debugMode||b.o._disableDebug();b.enabled=true;v("jstoflash",true)}catch(h){b._wD("js/flash exception: "+h.toString());v("jstoflash",false);M(true);K();return false}K();c()};ua=function(){if(la)return false;U();T();
return la=true};L=function(){if(ha)return false;ha=true;$();Ba();b.html5.usingFlash=Aa();G=b.html5.usingFlash;ha=true;ta()};ya=function(c){if(!c._hasTimer)c._hasTimer=true};za=function(c){if(c._hasTimer)c._hasTimer=false};this._setSandboxType=function(c){var a=b.sandbox;a.type=c;a.description=a.types[typeof a.types[c]!=="undefined"?c:"unknown"];b._wD("Flash security sandbox type: "+a.type);if(a.type==="localWithFile"){a.noRemote=true;a.noLocal=false;k("secNote",2)}else if(a.type==="localWithNetwork"){a.noRemote=
false;a.noLocal=true}else if(a.type==="localTrusted"){a.noRemote=false;a.noLocal=false}};this._externalInterfaceOK=function(c){if(b.swfLoaded)return false;var a=(new Date).getTime();b._wD("soundManager::externalInterfaceOK()"+(c?" (~"+(a-c)+" ms)":""));v("swf",true);v("flashtojs",true);b.swfLoaded=true;H=false;b.isIE?setTimeout(R,100):R()};this._onfullscreenchange=function(c){b._wD("onfullscreenchange(): "+c);b.isFullScreen=c===1?true:false;if(!b.isFullScreen)try{j.focus();b._wD("window.focus()")}catch(a){}};
ca=function(c){var a=this,f,h,e,m,l,i;this.sID=c.id;this.url=c.url;this._iO=this.instanceOptions=this.options=u(c);this.pan=this.options.pan;this.volume=this.options.volume;this._lastURL=null;this.isHTML5=false;this.id3={};this._debug=function(){if(b.debugMode){var d=null,g=[],o,s;for(d in a.options)if(a.options[d]!==null)if(a.options[d]instanceof Function){o=a.options[d].toString();o=o.replace(/\s\s+/g," ");s=o.indexOf("{");g.push(" "+d+": {"+o.substr(s+1,Math.min(Math.max(o.indexOf("\n")-1,64),
64)).replace(/\n/g,"")+"... }")}else g.push(" "+d+": "+a.options[d]);b._wD("SMSound() merged options: {\n"+g.join(", \n")+"\n}")}};this._debug();this.load=function(d){if(typeof d!=="undefined"){a._iO=u(d);a.instanceOptions=a._iO}else{d=a.options;a._iO=d;a.instanceOptions=a._iO;if(a._lastURL&&a._lastURL!==a.url){k("manURL");a._iO.url=a.url;a.url=null}}if(typeof a._iO.url==="undefined")a._iO.url=a.url;b._wD("soundManager.load(): "+a._iO.url,1);if(a._iO.url===a.url&&a.readyState!==0&&a.readyState!==
2){k("onURL",1);return a}a.url=a._iO.url;a._lastURL=a._iO.url;a.loaded=false;a.readyState=1;a.playState=0;if(X(a._iO)){b._wD("HTML 5 load: "+a._iO.url);a._setup_html5(a._iO);a._iO.autoPlay&&a.play()}else try{a.isHTML5=false;a._iO=V(a._iO);if(n===8)b.o._load(a.sID,a._iO.url,a._iO.stream,a._iO.autoPlay,a._iO.whileloading?1:0,a._iO.loops||1);else{b.o._load(a.sID,a._iO.url,a._iO.stream?true:false,a._iO.autoPlay?true:false,a._iO.loops||1);a._iO.isMovieStar&&a._iO.autoLoad&&!a._iO.autoPlay&&a.pause()}}catch(g){k("smError",
2);v("onload",false);b.onerror();b.disable()}return a};this.unload=function(){if(a.readyState!==0){b._wD('SMSound.unload(): "'+a.sID+'"');a.readyState!==2&&a.setPosition(0,true);if(a.isHTML5){e();if(i){i.pause();i.src=b.nullURL;i.load();i=a._audio=null}}else if(n===8)b.o._unload(a.sID,b.nullURL);else{a.setAutoPlay(false);b.o._unload(a.sID)}f()}return a};this.destruct=function(){b._wD('SMSound.destruct(): "'+a.sID+'"');if(a.isHTML5){e();if(i){i.pause();i.src="about:blank";i.load();i=a._audio=null}}else{a._iO.onfailure=
null;b.o._destroySound(a.sID)}b.destroySound(a.sID,true)};this.start=this.play=function(d){d||(d={});a._iO=u(d,a._iO);a._iO=u(a._iO,a.options);a.instanceOptions=a._iO;if(a._iO.serverURL)if(!a.connected){b._wD("SMSound.play():  Netstream not connected yet - setting autoPlay");a.setAutoPlay(true);return a}if(X(a._iO)){a._setup_html5(a._iO);m()}if(a.playState===1)if(d=a._iO.multiShot){b._wD('SMSound.play(): "'+a.sID+'" already playing (multi-shot)',1);a.isHTML5&&a.setPosition(a._iO.position)}else{b._wD('SMSound.play(): "'+
a.sID+'" already playing (one-shot)',1);return a}if(a.loaded)b._wD('SMSound.play(): "'+a.sID+'"');else if(a.readyState===0){b._wD('SMSound.play(): Attempting to load "'+a.sID+'"',1);if(a.isHTML5)a.readyState=1;else if(!a._iO.serverURL){a._iO.autoPlay=true;a.load(a._iO)}}else if(a.readyState===2){b._wD('SMSound.play(): Could not load "'+a.sID+'" - exiting',2);return a}else b._wD('SMSound.play(): "'+a.sID+'" is loading - attempting to play..',1);if(a.paused){b._wD('SMSound.play(): "'+a.sID+'" is resuming from paused state',
1);a.resume()}else{b._wD('SMSound.play(): "'+a.sID+'" is starting to play');a.playState=1;if(!a.instanceCount||n>8&&!a.isHTML5)a.instanceCount++;a.position=typeof a._iO.position!=="undefined"&&!isNaN(a._iO.position)?a._iO.position:0;a._iO=V(a._iO);a._iO.onplay&&a._iO.onplay.apply(a);a.setVolume(a._iO.volume,true);a.setPan(a._iO.pan,true);if(a.isHTML5){m();a._setup_html5().play()}else{n===9&&a._iO.serverURL&&a.setAutoPlay(true);b.o._start(a.sID,a._iO.loops||1,n===9?a.position:a.position/1E3)}}return a};
this.stop=function(d){if(a.playState===1){a._onbufferchange(0);a.resetOnPosition(0);if(!a.isHTML5)a.playState=0;a.paused=false;a._iO.onstop&&a._iO.onstop.apply(a);if(a.isHTML5){if(i){a.setPosition(0);i.pause();a.playState=0;a._onTimer();e();a.unload()}}else{b.o._stop(a.sID,d);a._iO.serverURL&&a.unload()}a.instanceCount=0;a._iO={}}return a};this.setAutoPlay=function(d){b._wD("setAutoPlay("+d+")");a._iO.autoPlay=d;b.o._setAutoPlay(a.sID,d);if(d)a.instanceCount||a.instanceCount++};this.setPosition=function(d){if(typeof d===
"undefined")d=0;d=a.isHTML5?Math.max(d,0):Math.min(a.duration,Math.max(d,0));a._iO.position=d;a.resetOnPosition(a._iO.position);if(a.isHTML5){if(i){b._wD("setPosition(): setting position to "+a._iO.position/1E3);if(a.playState)try{i.currentTime=a._iO.position/1E3}catch(g){b._wD("setPosition("+a._iO.position+"): WARN: Caught exception: "+g.message,2)}else b._wD("HTML 5 warning: cannot set position while playState == 0 (not playing)",2);if(a.paused){a._onTimer(true);a._iO.useMovieStar&&a.resume()}}}else b.o._setPosition(a.sID,
n===9?a._iO.position:a._iO.position/1E3,a.paused||!a.playState);return a};this.pause=function(d){if(a.paused||a.playState===0&&a.readyState!==1)return a;b._wD("SMSound.pause()");a.paused=true;if(a.isHTML5){a._setup_html5().pause();e()}else if(d||d===undefined)b.o._pause(a.sID);a._iO.onpause&&a._iO.onpause.apply(a);return a};this.resume=function(){if(!a.paused||a.playState===0)return a;b._wD("SMSound.resume()");a.paused=false;a.playState=1;if(a.isHTML5){a._setup_html5().play();m()}else b.o._pause(a.sID);
a._iO.onresume&&a._iO.onresume.apply(a);return a};this.togglePause=function(){b._wD("SMSound.togglePause()");if(a.playState===0){a.play({position:n===9&&!a.isHTML5?a.position:a.position/1E3});return a}a.paused?a.resume():a.pause();return a};this.setPan=function(d,g){if(typeof d==="undefined")d=0;if(typeof g==="undefined")g=false;a.isHTML5||b.o._setPan(a.sID,d);a._iO.pan=d;if(!g)a.pan=d;return a};this.setVolume=function(d,g){if(typeof d==="undefined")d=100;if(typeof g==="undefined")g=false;if(a.isHTML5){if(i)i.volume=
d/100}else b.o._setVolume(a.sID,b.muted&&!a.muted||a.muted?0:d);a._iO.volume=d;if(!g)a.volume=d;return a};this.mute=function(){a.muted=true;if(a.isHTML5){if(i)i.muted=true}else b.o._setVolume(a.sID,0);return a};this.unmute=function(){a.muted=false;var d=typeof a._iO.volume!=="undefined";if(a.isHTML5){if(i)i.muted=false}else b.o._setVolume(a.sID,d?a._iO.volume:a.options.volume);return a};this.toggleMute=function(){return a.muted?a.unmute():a.mute()};this.onposition=function(d,g,o){a._onPositionItems.push({position:d,
method:g,scope:typeof o!=="undefined"?o:a,fired:false});return a};this.processOnPosition=function(){var d,g;d=a._onPositionItems.length;if(!d||!a.playState||a._onPositionFired>=d)return false;for(d=d;d--;){g=a._onPositionItems[d];if(!g.fired&&a.position>=g.position){g.method.apply(g.scope,[g.position]);g.fired=true;b._onPositionFired++}}};this.resetOnPosition=function(d){var g,o;g=a._onPositionItems.length;if(!g)return false;for(g=g;g--;){o=a._onPositionItems[g];if(o.fired&&d<=o.position){o.fired=
false;b._onPositionFired--}}};this._onTimer=function(d){if(a._hasTimer||d)if(i&&(d||(a.playState>0||a.readyState===1)&&!a.paused)){a.duration=l();a.durationEstimate=a.duration;d=i.currentTime?i.currentTime*1E3:0;a._whileplaying(d,{},{},{},{});return true}else{b._wD('_onTimer: Warn for "'+a.sID+'": '+(!i?"Could not find element. ":"")+(a.playState===0?"playState bad, 0?":"playState = "+a.playState+", OK"));return false}};l=function(){var d=i?i.duration*1E3:undefined;if(d)return!isNaN(d)?d:null};m=
function(){a.isHTML5&&ya(a)};e=function(){a.isHTML5&&za(a)};f=function(){a._onPositionItems=[];a._onPositionFired=0;a._hasTimer=null;a._added_events=null;i=a._audio=null;a.bytesLoaded=null;a.bytesTotal=null;a.position=null;a.duration=null;a.durationEstimate=null;a.failures=0;a.loaded=false;a.playState=0;a.paused=false;a.readyState=0;a.muted=false;a.didBeforeFinish=false;a.didJustBeforeFinish=false;a.isBuffering=false;a.instanceOptions={};a.instanceCount=0;a.peakData={left:0,right:0};a.waveformData=
{left:[],right:[]};a.eqData=[];a.eqData.left=[];a.eqData.right=[]};f();this._setup_html5=function(d){d=u(a._iO,d);if(i){if(a.url!==d.url){b._wD("setting new URL on existing object: "+d.url);i.src=d.url}}else{b._wD("creating HTML 5 audio element with URL: "+d.url);a._audio=new Audio(d.url);i=a._audio;a.isHTML5=true;h()}i.loop=d.loops>1?"loop":"";return a._audio};h=function(){function d(g,o,s){return i?i.addEventListener(g,o,s||false):null}if(a._added_events)return false;a._added_events=true;d("load",
function(){b._wD("HTML5::load: "+a.sID);if(i){a._onbufferchange(0);a._whileloading(a.bytesTotal,a.bytesTotal,l());a._onload(1)}},false);d("canplay",function(){b._wD("HTML5::canplay: "+a.sID);a._onbufferchange(0)},false);d("waiting",function(){b._wD("HTML5::waiting: "+a.sID);a._onbufferchange(1)},false);d("progress",function(g){b._wD("HTML5::progress: "+a.sID+": loaded/total: "+(g.loaded||0)+","+(g.total||1));if(!a.loaded&&i){a._onbufferchange(0);a._whileloading(g.loaded||0,g.total||1,l())}},false);
d("end",function(){b._wD("HTML5::end: "+a.sID);a._onfinish()},false);d("error",function(){if(i){b._wD("HTML5::error: "+i.error.code);a._onload(0)}},false);d("loadstart",function(){b._wD("HTML5::loadstart: "+a.sID);a._onbufferchange(1)},false);d("play",function(){b._wD("HTML5::play: "+a.sID);a._onbufferchange(0)},false);d("playing",function(){b._wD("HTML5::playing: "+a.sID);a._onbufferchange(0)},false);d("timeupdate",function(){a._onTimer()},false);setTimeout(function(){a&&i&&d("ended",function(){b._wD("HTML5::ended: "+
a.sID);a._onfinish()},false)},250)};this._whileloading=function(d,g,o,s){a.bytesLoaded=d;a.bytesTotal=g;a.duration=Math.floor(o);if(a._iO.isMovieStar){a.durationEstimate=a.duration;a.readyState!==3&&a._iO.whileloading&&a._iO.whileloading.apply(a)}else{a.durationEstimate=parseInt(a.bytesTotal/a.bytesLoaded*a.duration,10);if(a.durationEstimate===undefined)a.durationEstimate=a.duration;a.bufferLength=s;if((a._iO.isMovieStar||a.readyState!==3)&&a._iO.whileloading)a._iO.whileloading.apply(a)}};this._onid3=
function(d,g){b._wD('SMSound._onid3(): "'+this.sID+'" ID3 data received.');var o=[],s,w;s=0;for(w=d.length;s<w;s++)o[d[s]]=g[s];a.id3=u(a.id3,o);a._iO.onid3&&a._iO.onid3.apply(a)};this._whileplaying=function(d,g,o,s,w){if(isNaN(d)||d===null)return false;if(a.playState===0&&d>0)d=0;a.position=d;a.processOnPosition();if(n>8&&!a.isHTML5){if(a._iO.usePeakData&&typeof g!=="undefined"&&g)a.peakData={left:g.leftPeak,right:g.rightPeak};if(a._iO.useWaveformData&&typeof o!=="undefined"&&o)a.waveformData={left:o.split(","),
right:s.split(",")};if(a._iO.useEQData)if(typeof w!=="undefined"&&w&&w.leftEQ){d=w.leftEQ.split(",");a.eqData=d;a.eqData.left=d;if(typeof w.rightEQ!=="undefined"&&w.rightEQ)a.eqData.right=w.rightEQ.split(",")}}if(a.playState===1){!a.isHTML5&&a.isBuffering&&a._onbufferchange(0);a._iO.whileplaying&&a._iO.whileplaying.apply(a);if((a.loaded||!a.loaded&&a._iO.isMovieStar)&&a._iO.onbeforefinish&&a._iO.onbeforefinishtime&&!a.didBeforeFinish&&a.duration-a.position<=a._iO.onbeforefinishtime){b._wD("duration-position &lt;= onbeforefinishtime: "+
a.duration+" - "+a.position+" &lt= "+a._iO.onbeforefinishtime+" ("+(a.duration-a.position)+")");a._onbeforefinish()}}};this._onconnect=function(d){d=d===1;b._wD('SMSound._onconnect(): "'+a.sID+'"'+(d?" connected.":" failed to connect? - "+a.url),d?1:2);if(a.connected=d){a.failures=0;if(a._iO.autoLoad||a._iO.autoPlay)a.load(a._iO);a._iO.autoPlay&&a.play();a._iO.onconnect&&a._iO.onconnect.apply(a,[d])}};this._onload=function(d){d=d===1?true:false;b._wD('SMSound._onload(): "'+a.sID+'"'+(d?" loaded.":
" failed to load? - "+a.url),d?1:2);if(!d&&!a.isHTML5){b.sandbox.noRemote===true&&b._wD("SMSound._onload(): "+p("noNet"),1);b.sandbox.noLocal===true&&b._wD("SMSound._onload(): "+p("noLocal"),1)}a.loaded=d;a.readyState=d?3:2;a._iO.onload&&a._iO.onload.apply(a)};this._onfailure=function(d){a.failures++;b._wD('SMSound._onfailure(): "'+a.sID+'" count '+a.failures);a._iO.onfailure&&a.failures===1?a._iO.onfailure(a,d):b._wD("SMSound._onfailure(): ignoring")};this._onbeforefinish=function(){if(!a.didBeforeFinish){a.didBeforeFinish=
true;if(a._iO.onbeforefinish){b._wD('SMSound._onbeforefinish(): "'+a.sID+'"');a._iO.onbeforefinish.apply(a)}}};this._onjustbeforefinish=function(){if(!a.didJustBeforeFinish){a.didJustBeforeFinish=true;if(a._iO.onjustbeforefinish){b._wD('SMSound._onjustbeforefinish(): "'+a.sID+'"');a._iO.onjustbeforefinish.apply(a)}}};this._onfinish=function(){a._onbufferchange(0);a.resetOnPosition(0);a._iO.onbeforefinishcomplete&&a._iO.onbeforefinishcomplete.apply(a);a.didBeforeFinish=false;a.didJustBeforeFinish=
false;if(a.instanceCount){a.instanceCount--;if(!a.instanceCount){a.playState=0;a.paused=false;a.instanceCount=0;a.instanceOptions={};e()}if(!a.instanceCount||a._iO.multiShotEvents)if(a._iO.onfinish){b._wD('SMSound._onfinish(): "'+a.sID+'"');a._iO.onfinish.apply(a)}a.isHTML5&&a.unload()}};this._onmetadata=function(d){b._wD("SMSound.onmetadata()");if(!d.width&&!d.height){k("noWH");d.width=320;d.height=240}a.metadata=d;a.width=d.width;a.height=d.height;if(a._iO.onmetadata){b._wD('SMSound.onmetadata(): "'+
a.sID+'"');a._iO.onmetadata.apply(a)}b._wD("SMSound.onmetadata() complete")};this._onbufferchange=function(d){if(a.playState===0)return false;if(d&&a.isBuffering||!d&&!a.isBuffering)return false;a.isBuffering=d===1?true:false;if(a._iO.onbufferchange){b._wD("SMSound._onbufferchange(): "+d);a._iO.onbufferchange.apply(a)}};this._ondataerror=function(d){if(a.playState>0){b._wD("SMSound._ondataerror(): "+d);a._iO.ondataerror&&a._iO.ondataerror.apply(a)}}};if(!b.hasHTML5||G)if(j.addEventListener){j.addEventListener("focus",
B,false);j.addEventListener("load",b.beginDelayedInit,false);j.addEventListener("unload",b.destruct,false);H&&j.addEventListener("mousemove",B,false)}else if(j.attachEvent){j.attachEvent("onfocus",B);j.attachEvent("onload",b.beginDelayedInit);j.attachEvent("unload",b.destruct)}else{v("onload",false);Y.onerror();Y.disable()}ma=function(){if(document.readyState==="complete"){L();document.detachEvent("onreadystatechange",ma)}};if(document.addEventListener)document.addEventListener("DOMContentLoaded",
L,false);else document.attachEvent&&document.attachEvent("onreadystatechange",ma);document.readyState==="complete"&&setTimeout(L,100)}var Y=null;if(typeof SM2_DEFER==="undefined"||!SM2_DEFER)Y=new oa;j.SoundManager=oa;j.soundManager=Y})(window);


soundManager.url = 'lib/soundman/swf/';
soundManager.debugMode = false;


Array.prototype.subset = function (field, criterion) {
	arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] === criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.exclude = function (field, criterion) {
	arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] !== criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.excludeBlock = function (excludeArray) {
	newArray = [];
	for (var i=0; i<this.length; i++) {
		var found = false;
		for (var j=0; j<excludeArray.length; j++) {
			if (this[i]===excludeArray[j]) {
				found = true;
			} else {
				if(this[i][exp.resources.items.key]===excludeArray[j][exp.resources.items.key]) {
					found = true;
				}
			}
		}
		if (!found) {
			newArray.push(this[i]);
		}
	}
	return newArray;
}



Array.prototype.chooseFirst = function (i) {
		if (!i) {
			return this.slice(0,1);
		} else {
			return this.slice(0,i);
		}
}

Array.prototype.excludeFirst = function (i) {
		if (!i) {
			return this.slice(1,this.length);
		} else {
			return this.slice(i,this.length);
		}
}


Array.prototype.chooseRandom = function (i) {
	var arr = this;
	return arr.shuffle().chooseFirst(i);
}


Array.prototype.pairWith = function (field, arr) {

	if (!arr) { console.error("Can't pair with empty list!"); return false; }
	if (typeof arr === "string") { arr = [arr];}

	/// clone this
	var newArray = [];
	for (var i=0; i<this.length; i+=1) {
		newArray.push(jQuery.extend(true, {}, this[i]));
	}

	var arrPosition = 0;
	for (var i=0 ; i<newArray.length ; i++) {
		newArray[i][field] = arr[arrPosition];
		arrPosition++;
		if(arrPosition>=arr.length) arrPosition=0;
	}
	exp.fieldsToSave[field] = true;
	return newArray;
}



Array.prototype.shuffle = function () {
	var arr  = new Array();
	for (var i=0 ; i<this.length ; i++) {
		arr.push(this[i]);
	}
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
}


Array.prototype.uniqueNonEmpty = function () {
	
	var noempties = true;
	var hash = {};
	for (var i=0 ; i<this.length ; i++) {
		if (!this[i] || this[i]=="") {
			noempties = false;
		} else {
			hash[this[i]] = "1";
		}
	}
	var hashlength=0;
	for (i in hash) {hashlength++};
	return (this.length===hashlength && noempties);
}

var CONFIG = {};
CONFIG.proxyURL = "";

function Experiment() {

	this._screens = [];

	this.STATIC = "instructions";
	this.TRIAL = "trial";
	this.VERSION = "0.1";
	this.audio = false;

	this.userFileName = "";
	this.userCode = "";

	this.fieldsToSave = {};

	this.resources = [];
	
	this.position = -1;
	
	if (!this.settings) {
		this.settings = {};
		if (!this.settings.strings) {
			this.settings.strings = {};
			//console.error("Looks like setup.js wasn't properly formatted.");
		}
		if (!this.settings.progressbar) {
			this.settings.progressbar = {};
			//console.error("Looks like setup.js wasn't properly formatted.");
		}
	}

	this.launch = function () {
		$(document).ready(function(){
			$('body').append('<div id="main"></div><div id="footer"></div>');
			exp.loadUserID();		
		
		});
	}



	this.load = function () {

		var that = this;
		$("#main").html(this.settings.strings.loading);

		this.resources["items"] = this.loadResource("data/items.txt");
		this.fieldsToSave[this.resources.items.key] = true;
		this.fieldsToSave["trialnumber"] = true;

		this.resources["frames"] = this.loadResource("data/frames.txt"); 
		this.resources["pictures"] = this.loadResource("data/pictures.txt"); 

		this.loadText({destination: "#footer", url: CONFIG.proxyURL + "app/templates/footer.html", wait: true});

		this.progressbarContainer.initialize();

		if (this.settings.audio) {
			soundManager.onload = function() { 
				that.initialize(); 
				that.advance();
			};
		} else {
			this.initialize();
			this.advance();
		}
	}


	this.advance = function(callerButton) {

		var that = this;
		
		var prefix = "<form id='currentform'>" 
				   + "<input type='hidden' name='userCode' value='" + this.getUserCode() + "'>"
				   + "<input type='hidden' name='userFileName' value='" + this.getUserFileName() + "'>"
				   + "<input type='hidden' name='experimentName' value='" + this.settings.experimentName + "'>";

		var suffix = "</form>";

		if (callerButton) callerButton.disabled = true;
		this.position++;
		this.progressbarContainer.advance(); 
		
		var screen = this.getCurrentScreen();
		switch (screen.screentype) {
			case this.STATIC:
				
				var fileType = screen.url.match(/\.[a-zA-Z]+$/);
				if (fileType) { fileType = fileType[0]; };
				switch (fileType) {
				
					case ".html":
						$.get(CONFIG.proxyURL + screen.url, function(data) {
							$("#main").html(prefix + data + suffix);
						});
						break;
					
					case ".ejs":
						html = new EJS({url: CONFIG.proxyURL + screen.url}).render({});
						$("#main").html(prefix + html + suffix);
						break;

					default:
						$("#main").html(this.settings.strings.errorMessage);
				
				}
				break;
				
			case this.TRIAL:
				//console.log(screen);
				this.make_into_trial(screen);
				if (screen.view) {
					html = new EJS({url: CONFIG.proxyURL + 'app/templates/' + screen.view}).render({});
					$("#main").html(prefix + html + suffix);
					screen.advance();
				} else {
					html = new EJS({url: CONFIG.proxyURL + 'app/templates/missingview.ejs'}).render({});
					$("#main").html(prefix + html + suffix);
				}
				break;
			default:
				$("#main").html(this.settings.strings.errorMessage);
		}

	}


	this.addBlock = function (arr) {
		for (var i=0 ; i<arr.length ; i++) {
			arr[i].trialnumber = this._screens.length+1;
			arr[i].screentype = this.TRIAL;
			this._screens.push(arr[i]);	
		}
		return this;
	}

	this.getFrameSentences = function () {
		return this.resources.frames.table;
	}
	this.getPictures = function () {
		return this.resources.pictures.table;
	}

	this.addStaticScreen = function (obj) {
	
		if (typeof obj=="string") {
			obj = {url: "app/templates/" + obj};	
		}
		obj.screentype = this.STATIC;
		obj.trialnumber = this._screens.length+1;
		this._screens.push(obj);	

		return this;
	}
	this.getCurrentScreen = function () {
		return this._screens[this.position];
	}
	this.screen = function () {
		return this._screens[this.position];
	}
	this.printScreensToConsole = function () {
		for (var i=0; i<this._screens.length; i++) {
			console.log(this._screens[i]);
		}
	}
	this.setUser = function (data) {
		this.userFileName = data[0];
		this.userCode = data[1];
	}
	this.getUserCode = function() {
		return this.userCode;
	}
	this.getUserFileName = function() {
		return this.userFileName;
	}

	this.getItems = function() {
		return this.resources.items.table;
	}

	this.recordResponse = function (callerbutton) {
		this.sendForm($("#currentform"));
		this.advance(callerbutton);
	}


	this.progressbarContainer = {
		adjust: this.settings.progressbar.adjustWidth || 4,
		visible: this.settings.progressbar.visible,
		percentage: this.settings.progressbar.percentage,
		initialize: function() {
			if (exp.progressbarContainer.visible) {
				$("#progressbar").html('<DIV ID="progress_bar_empty"></DIV><DIV ID="progress_bar_full"></DIV><DIV ID="progress_text"></DIV>');
				exp.progressbarContainer.advance();
			}
		},
		advance: function () {
			if (exp.progressbarContainer.visible) {
				$("#progress_bar_empty").width((exp._screens.length-(exp.position+1))*exp.progressbarContainer.adjust +  "px");
				$("#progress_bar_full").width((exp.position+1)*exp.progressbarContainer.adjust + "px");
				if (exp.progressbarContainer.percentage) {
					$("#progress_text").html( Math.floor(100*(exp.position+1)/exp._screens.length) + "%");
				} else {
					$("#progress_text").html((exp.position+1) + "/" + exp._screens.length);
				}
			}
		}
	}

	this.makeContinueButton = function () {
		return '<input type="button" value="' + this.settings.strings.continueButton + '" onClick="exp.advance(this);">'
	}
	


}



Experiment.prototype.make_into_trial = function (that) {

	that.userCode = exp.userCode;
	that.userFileName = exp.userFileName;

	that.HORIZONTAL = "H";
	that.VERTICAL = "V";

	that.parts = [];
	that.currentPart = 0;
	that.callingPart = 0;
	that.soundbuttons = [];
	that.responses = 0;
	

	that.advance = function() {
		if (exp.getCurrentScreen().callingPart===0) { // initial call
			exp.getCurrentScreen().parts = $(".trialpartWrapper");
			var haveIDs = true; // check that all wrappers have ID's
			// to do: check that they are "part" + number w/o skipping
			for (var i=0; i<exp.getCurrentScreen().parts.length; i++) {
				if(!exp.getCurrentScreen().parts[i].id) haveIDs = false;
			}
			if (!haveIDs) { // assign IDs by order
				console.log("This template doesn't full specify part numbers, parts will appear in order");
				for (var i=0; i<exp.getCurrentScreen().parts.length; i++) {
					exp.getCurrentScreen().parts[i].id = "part" + (i+1);
				}
			}
		}
		if (exp.getCurrentScreen().callingPart===exp.getCurrentScreen().currentPart) {
			exp.getCurrentScreen().currentPart += 1;
			$("#" + "part" + exp.getCurrentScreen().currentPart).show();
		}
	}

	
	that.makeScale = function(obj) {
		exp.getCurrentScreen().responses++;
		var direction = obj.direction || that.VERTICAL;
		var buttons = obj.buttons || ["1","2","3","4","5","6","7"];
		var edgelabels = obj.edgelabels || [''];
		var sidelabels = obj.sidelabels || [''];
		var edgelabel_position = 0;
		var sidelabel_position = 0;

		var serverValues = obj.serverValues || buttons;
		/// validate serverValues here to be non-empty and distinct

		var str = "";
		str += '<div class="scaleWrapper' + direction + '">';
		str += '<div class="scaleEdgeLabel' + direction + '">' + edgelabels[edgelabel_position] + '</div>';
		edgelabel_position += 1; 
		if(edgelabel_position>=edgelabels.length)  edgelabel_position=0;

		for (var i=0; i<buttons.length; i+=1) {

			if (direction===that.VERTICAL) {
				str += '<div class="scalebuttonWrapper' + direction + '">';
			} else {
				str += '<div class="scalebuttonWrapper' + direction + '">';
			}
			
			str += '<input type="button" value=" '+ buttons[i] +' " id="' + exp.getCurrentScreen().responses + 'button' + i + '" class="scaleButton' + direction + '" onClick="exp.getCurrentScreen().recordResponse(' + exp.getCurrentScreen().responses + "," + "'" + buttons[i] + "'" + ');exp.advance();">';
			str += '<div class="scalebuttonsidelabel' + direction + '">' + sidelabels[sidelabel_position] + '</div>';

			str += '</div>';

			sidelabel_position+= 1;  
			if(sidelabel_position >=sidelabels.length)  sidelabel_position=0;
		}

		str += '<div class="scaleEdgeLabel' + direction + '">' + edgelabels[edgelabel_position] + '</div>';
		str += '</div>';
		str += "<input type='hidden' name='response" + exp.getCurrentScreen().responses + "' value=''>\n";
		return str;
	}

	that.recordResponse = function (scaleNo, buttonNo) {
		/// make all the necessary fields in document.forms["currentform"],
		/// and fill them with data
		document.forms["currentform"]["response"+scaleNo].value = buttonNo;
		for (i in exp.fieldsToSave) {
			var str = "";
			//console.log(i + ": " + typeof exp.getCurrentScreen()[i]);
			if (typeof exp.getCurrentScreen()[i] === "object") {
				str = "<input type='hidden' name='" + i + "' value='" + exp.getCurrentScreen()[i][exp.resources[i+"s"].key] + "'>"; 
			} else {
				str = "<input type='hidden' name='" + i + "' value='" + exp.getCurrentScreen()[i] + "'>"; 
			}
			$("#currentform").append(str);
		}
		for (var i=0; i<exp.getCurrentScreen().soundbuttons.length; i+=1) {
			var str= "<input type='hidden' name='sound" + (i+1) + "' value='" + exp.getCurrentScreen().soundbuttons[i].presses + "'>\n";
			$("#currentform").append(str);
		}
		exp.sendForm($("#currentform"));
	}


	that.playSound = function (soundID, caller) {
		var comingFrom = $(caller).parent(".trialpartWrapper").attr("id").match(/part(\d+)$/)[1];
		exp.getCurrentScreen().callingPart = parseInt(comingFrom,10);
		soundManager.play(soundID);
		for (i=0; i<exp.getCurrentScreen().soundbuttons.length; i+=1) {
			if (exp.getCurrentScreen().soundbuttons[i].id === soundID) {
				exp.getCurrentScreen().soundbuttons[i].presses += 1;
			}
		}
	}
	
	that.makeSoundButton = function (obj) {

		if (typeof obj==="string") {
			obj = {soundFile: "data/sounds/" + obj}
		}
		var label = obj.label || exp.settings.strings.soundButton;
		var soundID  = obj.soundID || exp.screen()[exp.resources.items.key] + exp.screen().trialnumber + exp.screen().soundbuttons.length;
		var soundFile = CONFIG.proxyURL + obj.soundFile;
		exp.getCurrentScreen().soundbuttons.push({id: soundID, presses: 0, file: soundFile});
		
		soundManager.createSound({
			id: soundID,
			url: soundFile,
			autoPlay: false, 
			autoLoad: true,
			onload:function() {
			},
			onfinish:function() {
				exp.getCurrentScreen().advance();
			}
		});

		var str = "";
		str += '<input type="button" ';
		str += ' id="' + soundID +'"';
		str += ' value="' + label + '"';
		str += ' onClick="exp.getCurrentScreen().playSound(\'' + soundID + '\',this);"'
		str += ' style="margin-left: 10px;"'
		str += '>';
		return str;
	}

	return that;
}



// connection to local text files and to the database

Experiment.prototype.loadUserID = function () {
	var that = this;
	var jsonp_url = this.settings.databaseServer + "getuserid.cgi?experimentName=" + this.settings.experimentName ;
	$.ajax({
		dataType: 'jsonp',
		url: jsonp_url,  //CONFIG.proxyURL +
		success: function (data) {
			that.userFileName = data;
			var code =  String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26));
			that.userCode = code + that.userFileName;	
			
			exp.load();
			//console.debug(data);
		}
	});
}

Experiment.prototype.sendForm = function (formObj) {
	//console.debug(formObj.serialize());
	var jsonp_url = this.settings.databaseServer + "dbwrite.cgi?" + formObj.serialize();
	$.ajax({
		dataType: 'jsonp',
		url: jsonp_url,  //CONFIG.proxyURL +
		success: function (data) {
			console.debug(data);
			return true;
		}
	});
}

Experiment.prototype.loadText = function (spec) {
	var url = spec.url;
	var wait = spec.wait;
	var destination = spec.destination;
	
	$.ajax({
		url: url,
		success: function (data) {
			$("#footer").html(data);
		},
		async: !wait,
		error: function() {
			console.error("Error! Footer not found.");
		}
	});
}


Experiment.prototype.loadResource = function (name) {

	var key = "";
	var items = [];
	
	$.ajax({
		url: CONFIG.proxyURL +  name,
		success: function(data) {
			var lines = data.split("\n");
			var fields = lines[0].replace(/(\n|\r)+$/, '').split("\t");
			key = fields[0]; // for now, the "key" for a tab-delimited file is always the first before the file's first tab
			if (!fields.uniqueNonEmpty()) {
				console.error("Field names in " + name + " must be unique and non-empty!");
				return false;
			}
			var keys = []; // these are saved to be evaluated by uniqueNonEmpty()
			LINE: for (var i=1; i<lines.length; i++) {
				if (lines[i].match(/^\s*$/)) {
					continue LINE;
				}
				var line = lines[i].replace(/(\n|\r)+$/, '').split("\t");
				keys.push(line[0]);
				var frame = {};
				for (var j=0; j<line.length; j++) {
					frame[ fields[j] ] = line[j];
				}
				//console.log(frame);
				items.push(frame);
			}
			if(!keys.uniqueNonEmpty()) {
				console.error("In " + name + ", the values of the first column must be unique and non-empty!");
				return false;
			}
			return true;
		},
		async: false,
		error: function() {
			console.error("The file " + name + " wasn't found.");
			return false;
		}
	});
	
	return {table: items, key: key};
}



