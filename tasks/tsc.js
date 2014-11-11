/*******************************************************************************
 *                                  ,     ,     ,
 *                                  `$,    $,   `$,      ;
 *                                   `$+   `$,   `$,    d;     ,
 *                                    `$b,  `$,   $$,  d$'   ,$
 *     ╔═══╗╔╗╔╗╔╗ ╔╗╔╗╔══╗            `$$+  l$+  ;$$ d$$   ,$'    ,
 *     ║╔═╗║║║║║║╚═╝║║║║╔═╝             `$$b,;$$b,$$$$$$; ,d$$   ,$
 *     ║╚═╝║║║║║║╔╗ ║║╚╝║                `$$$b$$$$$$$$$$$$$$$; ,d$'
 *     ║╔══╝║║║║║║╚╗║║╔╗║                 `$$$*""""~~""^¦$$$$$$$$P    ,,
 *     ║║   ║╚╝║║║ ║║║║║╚═╗               *^              ~^"$$$$;_,s$'
 *     ╚╝   ╚══╝╚╝ ╚╝╚╝╚══╝             ,^                    `$$$$$$'    _
 *                                     ,'                       `$$$'  ,y$"
 *                                     '                         `$$,y$$"
 *        ╔╗ ╔╗╔══╗╔════╗             (                           `$$$$'
 *        ║╚═╝║║╔╗║╚═╗╔═╝           ,^       ,,,         ,,,yyyyy,,`$$$$$#=-
 *        ║╔╗ ║║║║║  ║║             `\,  ,,/'^  ``      `$$$$$$$$$$d;$$$~
 *        ║║╚╗║║║║║  ║║              /' ,$$*=``-     `$b`?$$$$$$$$$$;$$$b,
 *        ║║ ║║║╚╝║  ║║            ,'   `^*;-=''    `$$$$$$$#$$$$$$$;$$$¦$b.
 *        ╚╝ ╚╝╚══╝  ╚╝           (,,,;,             `¦$-",¬y+`?$$$$;$b,
 *                                 `;``"                 ]$& $';$$$$d$$$b,
 *                                ,yyy,,                +@@&`'d$$$$d$P""¦$,
 *     ╔══╗ ╔═══╗╔══╗╔══╗         \?`^"$@by,            ~¦>^,$$$$$d$$b,
 *     ║╔╗╚╗║╔══╝║╔╗║║╔╗╚╗        ,&~`^"¦?~#`        ,yb, ,?$$$$$d$$$$b,
 *     ║║╚╗║║╚══╗║╚╝║║║╚╗║       '   $    ,      ,,yd$$$$$?·?$$$d$$~~"¦;
 *     ║║ ║║║╔══╝║╔╗║║║ ║║      /   '$, $$$yyyyy$$$$$" ,$$$+$$$d$$$b,
 *     ║╚═╝║║╚══╗║║║║║╚═╝║     `-=##$$$$$$$$$$$$$$^~  ,$$$$$$$R$'~  ~`
 *     ╚═══╝╚═══╝╚╝╚╝╚═══╝           ~~"$$$$$$$$$'   ,$$$$$$$D$'
 *                                       `#$$$$$'   ,$$$`,$$Z$$
 *                                         `#$$'   ,$@P',$$o$$'
 *                                           `'=*yd$$P',$$N$P'
 *                                                ~~~"+$-"~
 *
 *   ╔══╗ ╔══╗╔═══╗╔══╗╔════╗╔══╗╔╗      ╔═══╗╔╗  ╔═══╗╔╗  ╔╗╔═══╗╔╗ ╔╗╔════╗
 *   ║╔╗╚╗╚╗╔╝║╔══╝╚╗╔╝╚═╗╔═╝║╔╗║║║      ║╔══╝║║  ║╔══╝║╚╗╔╝║║╔══╝║╚═╝║╚═╗╔═╝
 *   ║║╚╗║ ║║ ║║╔═╗ ║║   ║║  ║╚╝║║║  ╔══╗║╚══╗║║  ║╚══╗║ ╚╝ ║║╚══╗║╔╗ ║  ║║
 *   ║║ ║║ ║║ ║║╚╗║ ║║   ║║  ║╔╗║║║  ╚══╝║╔══╝║║  ║╔══╝║╔╗╔╗║║╔══╝║║╚╗║  ║║
 *   ║╚═╝║╔╝╚╗║╚═╝║╔╝╚╗  ║║  ║║║║║╚═╗    ║╚══╗║╚═╗║╚══╗║║╚╝║║║╚══╗║║ ║║  ║║
 *   ╚═══╝╚══╝╚═══╝╚══╝  ╚╝  ╚╝╚╝╚══╝    ╚═══╝╚══╝╚═══╝╚╝  ╚╝╚═══╝╚╝ ╚╝  ╚╝
 *
 *      project: grunt-tsc
 *      version: 0.0.1
 *  development: http://www.digital-element.ru/
 *    copyright: (c) 2003-2014 Digital-Element
 *      license: MIT
 ******************************************************************************/
function Deferred(){"use strict";this.actions=[]}var spawn=require("child_process").spawn,path=require("path"),fs=require("fs");Deferred.prototype.actions=null,Deferred.prototype.add=function(a){"use strict";this.actions.push(a)},Deferred.prototype.run=function(a){"use strict";function b(c){setTimeout(function(){c(function(){e.length?b(e.shift()):a()},function(b){d.actions=[],a(b)})},0)}function c(){e.length?b(e.shift()):a()}var d=this,e=this.actions;c()},module.exports=function(a){"use strict";function b(b,c,d,e){a.file.write(b,c,d),e()}a.registerMultiTask("typescript","Compile *.ts files",function(){function c(a){for(var b,c=["B","K","M","G","T"],d=c.shift(),e=!1;a>1024;)a/=1024,d=c.shift(),e=!0;return b=String(a+1e-4).split("."),b[0]+(e?"."+b[1].substr(0,1):"")+d}function d(a){var b=String(a/1e3+1e-4).split(".");return b[0]+(b.length>1?"."+b[1].substr(0,3):".000")+"s"}function e(){a.log.writeln("Created %count% icon(s), %time% sec".replace(/%count%/g,String(j).cyan).replace(/%time%/g,d(Number(new Date)-l).cyan)),k()}function f(g){var h=!!g.orig.expand,j=g.src,m=String(g.dest||""),v=String(g.cwd||""),w=Number(new Date),x=new Deferred;h?(x.add(function(b,c){var d,e=[],f=[];e.push(path.join(__dirname,"../bin/tsc")),e.push("--target",r.toUpperCase()),e.push("--module",s),o&&e.push("--declaration"),q&&e.push("--removeComments"),p&&(e.push("--sourcemap"),null!==u&&e.push("--sourceRoot",u),null!==t&&e.push("--mapRoot",t)),e.push(path.basename(j[0])),d=spawn("/usr/bin/env",e,{cwd:path.dirname(j[0])}),d.stderr.on("data",function(a){f.push(a.toString())}),d.on("close",function(d){0!==d?(a.verbose.or.error().error(f.join("\n")),a.fail.warn("Something went wrong."),c()):b()})}),x.add(function(a,c){var d,e=j[0],f=path.extname(e),g=path.basename(e,f),h=path.dirname(e),i=path.join(h,g+".js"),k={encoding:n,flag:"r"},l={encoding:n,mode:438,flag:"w"};fs.readFile(i,k,function(e,f){e?c(e):(d=f,b(m,d,l,function(b){b?c(b):fs.unlink(i,function(b){b?c(b):a()})}))})}),x.add(function(b,e){fs.stat(m,function(f,g){f?e(f):(a.log.writeln("Compiled: %source% %time%".replace(/%source%/g,j[0].green).replace(/%time%/g,d(Number(new Date)-w)).bold),a.log.writeln("  %dot% %dest% %size%".replace(/%dot%/g,"*".green).replace(/%dest%/g,m.cyan).replace(/%size%/g,c(g.size))),b())})}),x.add(function(a,c){var d,e=j[0],f=path.extname(e),g=path.basename(e,f),h=path.dirname(e),i=path.join(h,g+".d.ts"),k=path.join(path.dirname(m),path.basename(m,".js")+".d.ts"),l={encoding:n,flag:"r"},p={encoding:n,mode:438,flag:"w"};o?fs.readFile(i,l,function(e,f){e?c(e):(d=f,b(k,d,p,function(b){b?c(b):fs.unlink(i,function(b){b?c(b):a()})}))}):a()}),x.add(function(b,d){var e=path.join(path.dirname(m),path.basename(m,".js")+".d.ts");fs.stat(e,function(f,g){f?d(f):(a.log.writeln("  %dot% %dest% %size%".replace(/%dot%/g,"*".green).replace(/%dest%/g,e.cyan).replace(/%size%/g,c(g.size))),b())})}),x.add(function(a,c){var d,e=path.extname(j[0]),f=path.basename(j[0],e),g=path.dirname(j[0]),h=path.join(g,f+".js.map"),i=path.join(path.dirname(m),path.basename(m,".js")+".js.map");p?fs.readFile(h,{encoding:"utf8",flag:"r"},function(e,f){e?c(e):(d=f,b(i,d,{encoding:"utf8",mode:438,flag:"w"},function(b){b?c(b):fs.unlink(h,function(b){b?c(b):a()})}))}):a()}),x.add(function(b,d){var e=path.join(path.dirname(m),path.basename(m,".js")+".js.map");fs.stat(e,function(f,g){f?d(f):(a.log.writeln("  %dot% %dest% %size%".replace(/%dot%/g,"*".green).replace(/%dest%/g,e.cyan).replace(/%size%/g,c(g.size))),b())})}),x.run(function(b){b?(a.verbose.or.error().error(b.message),a.fail.warn("Something went wrong.")):i.length?f(i.shift()):e()})):!function(){var b,c=[],e=[];c.push("tsc"),c.push("--target",r.toUpperCase()),c.push("--module",s),o&&c.push("--declaration"),q&&c.push("--removeComments"),p&&(c.push("--sourcemap"),null!==u&&c.push("--sourceRoot",u),null!==t&&c.push("--mapRoot",t)),j.forEach(function(a){c.push(path.join(v,a))}),c.push("--out",m),b=spawn("/usr/bin/env",c),b.stderr.on("data",function(a){e.push(a.toString())}),b.on("close",function(b){0!==b?(a.verbose.or.error().error(e.join("\n")),a.fail.warn("Something went wrong."),k(!1)):(a.log.writeln("Compile %count% file(s), %time% sec".replace(/%count%/g,String(j.length).cyan).replace(/%time%/g,d(Number(new Date)-l).cyan)),k(!0))})}()}function g(){i.length?f(i.shift()):e()}var h=this,i=h.files,j=i.length,k=this.async(),l=Number(new Date),m=h.options({encoding:"utf8"}),n=String(m.encoding||"utf8")||"utf8",o=!!m.declaration,p=!!m.sourcemap,q=!!m.removeComments,r=String(m.target||"").toLowerCase(),s=String(m.module||"").toLowerCase(),t=String(m.mapRoot||"")||null,u=String(m.sourceRoot||"")||null;-1===["es3","es5"].indexOf(r)&&(r="es3"),-1===["commonjs","amd"].indexOf(s)&&(s="commonjs"),g()})};