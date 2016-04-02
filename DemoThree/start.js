/*
 * 思路:
 *   1.分析页面.
 *       种子页面的路径结构:http://www.cnblogs.com/#p+页面数字.
 *       文章路径:藏在每个页面 h3>a.titlelink里.    
 *   
 * */


/*
 *第一步:获取文章入口链接.
 * 
 * */

//一些依赖

var http = require('http');
var url = require('url');

var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require("eventproxy");


//一些必须的声明
var ep = new eventproxy(),
    urlsArray = [], //存放文章url
    pageUrls = [],  //页面的URL
    pageNum = 20;   //抓取的页面总数.


//通过分析页面逻辑,得到每个页面的URL

for (var i = 0; i < 3; i++) {
    pageUrls.push('http://www.cnblogs.com/#p' + i);
}

// console.log(pageUrls);
function log(data) {
    console.log(data)
}


//开始主程序.
function start() {
    //轮询所有文章的列表页面.
    function onRequest(req, res) {
        pageUrls.forEach(function (pageUrl) {
            log('遍历pageUrls.........');
            log(pageUrl);
            superagent.get(pageUrl)
                .end(function (err, res) {
                    if (err) throw err;
                    var $ = cheerio.load(res.text);
                    //    获得每一篇文章的路径.的HTML标签
                    var curPageUrls = $('.titlelnk');
                    //    对标签,进行处理.
                    log(curPageUrls.length);
                    for (var j = 0, jLen = curPageUrls.length; j < jLen; j++) {
                        var eachPageUrls = curPageUrls.eq(j).attr('href');
                        log(eachPageUrls);
                        urlsArray.push(eachPageUrls);

                        //    监听这个事件.
                        ep.emit('BlogArticleHtml', eachPageUrls);
                    }
                });
        });

        ep.after('BlogArticleHtml', pageUrls.length * 20, function (eachPageUrls) {
            //    传回监听之后.触发下列函数执行....
            log('触发后,开始creating');
            // res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('<br/>');
            res.write('eachPageUrls.length is ' + eachPageUrls.length + '<br/>');
            for (var x = 0; x < eachPageUrls.length; x++) {
                res.write('eachPageUrl is ' + eachPageUrls[x] + '<br/>');
            }
            res.end('<br/>');
            log('已经生成');
        });
    }

    console.log("开始生成网页");
    http.createServer(onRequest).listen(3000, '127.0.0.1');
    console.log("网页已经生成");
}
exports.start = start;

