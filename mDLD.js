// JavaScript Document
/*
*管理组织JS CSS,调用方式dld.add("xxx.js/xxx.css",{id:'xxx'},['xxx','xxx'],callback);第一个参数如果忽略则必须填写依赖ID,1参数是文件url地址,2参数是文件id(默认取文件第一个"."之前的字母),3参数是文件模块以来(形式是所以来文件的id),4参数为回调函数

*/
~function(win,doc){
    var dld = function(){
        var w = win,
        d = doc,
        _this = this,
        fileArr =[],
        readArr = [],
        isArry = function(a){		
            if(typeof a == "string"){
                return "string";
            };
            if(typeof a == "function"){
                return "function";
            };
            if(typeof a == "object"){
                if(Object.prototype.toString.apply(a) === '[object Array]'){
                    return "Array";
                }else{
                    return "object";
                }
            }
        };
        this.ext.getThis = this;
        this.check = function(f){
            if(fileArr.length){
                for(var i =0;i<fileArr.length;i++){
                    for(var s = 0;s<fileArr[i]['relFile'].length;s++){
                        if(fileArr[i]['relFile'][s] == f){
                            fileArr[i]['relFile'].splice(s,1);
                        }		
                    }
                }
                var ss = fileArr.length;
                for(var j = 0;j<ss;j++){
                    if(fileArr[j].relFile.length==0||fileArr[j].relFile.length=="undefined"){
                        _this.addFile(fileArr[j]);
                    }else{
                        fileArr.push(fileArr[j]);   
                    }
                }
                fileArr.splice(0,ss);
            }
        }
        this.Docallback = function(d,s,z,ie){
            if(document.all && window.external){ 
                d.onreadystatechange = function() {  //for ie
                    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0"){   //for ie6
                        if (this.readyState == "loading"||this.readyState =="loaded") {
                            ie++;
                        }
                        if(ie==2){
                            this.onreadystatechange = null; 
                            readArr.push(d.id);
                            if (s){  
                                s();
                            }
                            _this.check(d.id);
                        }
                    }else{
                        if (this.readyState == "loaded" || this.readyState == "complete") {  
                            this.onreadystatechange = null; 
                            readArr.push(d.id);
                            if (s){  
                                s();
                            }  
                            _this.check(d.id);
                        }
                    }
                }
            }else{
                if(z=="js"){
                    d.onload = function(){   //for w3c
                        readArr.push(d.id);
                        if(s){
                            s();
                        }
                        _this.check(d.id);
                    }
                }else if(z=="css"){
                    var _loaded=function(node, callback){
                        setTimeout(function() {
                            _poll(node, callback);
                        }, 0);
                    },
                    _poll = function(node, callback){
                        var isLoaded = false;
                        if (/webkit/i.test(navigator.userAgent)) {
                            if (node['sheet']) {
                                isLoaded = true;
                            }
                        }else if(node['sheet']){
                            try{
                                if (node['sheet'].cssRules) {
                                    isLoaded = true;
                                }
                            }catch(ex){
                                if (ex.code === 1000) {
                                    isLoaded = true;
                                }
                            }
                        }
                        if (isLoaded) {
                            setTimeout(function() {
                                callback();
                            }, 1);
                        }else{
                            setTimeout(function() {
                                _poll(node, callback);
                            }, 1);
                        }
                    };
                    _loaded(d,function(){
                        readArr.push(d.id);
                        s();
                        _this.check(d.id);
                    });
					
                }
            } 
        };
        this.addFile = function(file){
            if(!file.src){
                file.callback() ;
                return ;
            }
            var  z = file.src.split("."),
            y =z.length-1,
            s = z[y],
            ids;
            if(file.ints==null){
                ids = file.src.slice(0,file.src.indexOf("."))
            }else{
                ids = file.ints['id'];
            }
            if(s == "js"){
                var dom = d.createElement("script"),
                head = d.getElementsByTagName("head")[0],
                srcIds = d.getElementById(ids), 
                srcx,paramPrefix1;
                if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0"){//防止IE拉缓存
                    paramPrefix1 = file.src.indexOf("?") == -1 ? "?" : "&";
                    srcx = file.src + paramPrefix1 + "timeStamp="+ Date.parse(new Date());
                }else{
                    srcx = file.src;
                }
                if(!srcIds){
                    try{
                        dom.id = ids;
                        dom.type="text/javascript";
                        dom.src = srcx;
                        dom.async='true';
                        dom.charset='utf-8'; 
                        head.appendChild(dom);
                    }catch(e){
                        alert(e);
                    }
                    _this.Docallback(dom,file.callback,s,file.ie6Key);
                    
                }else{
                    readArr.push(ids);
                }
            }else if(s == "css"){
                var dom1 = d.createElement("link"),
                head1 = d.getElementsByTagName("head")[0],
                srcIds1 =  d.getElementById(ids),
                paramPrefix1 = file.src.indexOf("?") == -1 ? "?" : "&",
                src1 = file.src + paramPrefix1 + "timeStamp="+ Date.parse(new Date());
                if(!srcIds1){
                    dom1.href = src1;
                    dom1.id = ids;
                    dom1.type="text/css";
                    dom1.rel = "stylesheet";
                    head1.appendChild(dom1);
                    _this.Docallback(dom1,file.callback,s);
                }
            }
        };
        var _add=function(a,b,c,d){
            if(b){
                if(b.id == 'jquery'){
                    var file = {
                        src:null,
                        ints:null,
                        relFile:[],
                        callback:null,
                        ie6Key:0
                    };
                }else{
                    var file = {
                        src:null,
                        ints:null,
                        relFile:['jquery'],
                        callback:null,
                        ie6Key:0
                    };
                }
            }else{
                var file = {
                    src:null,
                    ints:null,
                    relFile:['jquery'],
                    callback:null,
                    ie6Key:0
                };
            }
            for(var k = 0;k<arguments.length;k++){
                if(isArry(arguments[k])=="string"){	
                    file.src =arguments[k];
                }else if(isArry(arguments[k])=="object")
                {	
                    file.ints=arguments[k];
                }else if(isArry(arguments[k])=="Array")
                {	
                    file.relFile = file.relFile.concat(arguments[k]);
                }else if(isArry(arguments[k])=="function")
                {
                    file.callback = arguments[k];
                }
            }
            if(readArr.length){
                var relFileL = file.relFile.length;
                for(var i = 0;i<relFileL;i++){
                    for(var j = 0;j< readArr.length;j++){
                        if(file.relFile[i]==readArr[j]){
                            break ;
                        }else{
                            file.relFile.push(file.relFile[i]);
                        }
                    }
                }
                file.relFile.splice(0,relFileL);
            }
            if(file.relFile.length==0||file.relFile.length=="undefined"){
                _this.addFile(file); 
            }else{
                fileArr.push(file); 
            }
            return arguments.callee;
        }("http://static.dld.com/js/public/jquery.js",{
            id:'jquery'
        });
        this.onready = function(a,b,c,d){
            _add(a,b,c,d);
        }
        this.imports = function(a,b,c,d){
            _add(a,b,c,d);
        };
    };
    win.dld = new dld();
}(window,document)
