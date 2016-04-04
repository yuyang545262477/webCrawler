/*
 思路:
 目标网站:
 */

var superagent = require('superagent');
var cheerio = require('cheerio');
// var fs = require('fs');
// var request = require('request');
// var async = require('async');
// var eventproxy = require('eventproxy');
//个人习惯
function log(data) {
    console.log(data);
}
//首页
var indexUrl = 'http://keet.dididown.net/pw/index.php';

// superagent
//     .get(indexUrl)
//     .end(function (err, res) {
//         if (err) throw err;
//         var $ = cheerio.load(res.text);
//         // var sUrl = $('.tr3.f_one').eq(0).children().eq(1).children('b')';
//         var sUrl = $('b span');
//         var secondUrls = [];
//         for (var i = 0, l = sUrl.length; i < l; i++) {
//             secondUrls[i] = sUrl.children().eq(i).attr('href');
//         }
//        return secondUrls;
//     });

//次页
// var nextUrl = 'http://keet.dididown.net/pw/thread.php?fid=3';
//
//
// superagent
//     .get(nextUrl)
//     .end(function (err, res) {
//         if (err) throw err;
//         var $ = cheerio.load(res.text);
//         var thridUrls = $('.tr3.t_one');
//         log(thridUrls.length);
//         var next2Urls = [];
//         for (var i = 3;i<thridUrls.length;i++ ){
//             next2Urls[i-3] = thridUrls.eq(i).find('td').eq(1).find('a').attr('href');
//         }
//         return next2Urls;
//    
//     })

//第三页面
/*

var thridUrl = 'http://keet.dididown.net/pw/htm_data/3/1604/328136.html';

superagent
    .get(thridUrl)
    .end(function (err, res) {
        if (err) throw err;
        var $ = cheerio.load(res.text);
        var btUrls = $('div#read_tpc.tpc_content').find('a');
        var btUrl = [];
        for (var i = 0; i < btUrls.length; i++) {
            btUrl[i] = btUrls.eq(i).attr('href');
        }
        log(btUrl);
    })

*/


