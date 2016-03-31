/*
 * 目标:
 * 1.获取种子URL
 * 2.获取页面中五星英雄的ID
 * 3.获取英雄详情页面的LOGO图片.
 * */


//依赖.
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var request = require('request');

var fs = require('fs');

//个人习惯,封装一个console.log()函数,我太懒了....
function log(data) {
    console.log(data);
}


/*
 * 获取英雄的ID
 * */

//种子URL

var url = 'http://wcatproject.com/charSearch/function/getData.php';
//请求头
var headers = {
    'Host': 'wcatproject.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate',
    'DNT': '1',
    'Referer': 'http://wcatproject.com/charSearch/',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'Cookie': '_ga=GA1.2.690711078.1458729379',
    'Connection': 'keep-alive'
};
//请求参数
var value = 'info=isempty&star%5B%5D=0&star%5B%5D=0&star%5B%5D=0&star%5B%5D=0&star%5B%5D=1&job%5B%5D=0&job%5B%5D=0&job%5B%5D=0&job%5B%5D=0&job%5B%5D=0&job%5B%5D=0&job%5B%5D=0&job%5B%5D=0&type%5B%5D=0&type%5B%5D=0&type%5B%5D=0&type%5B%5D=0&type%5B%5D=0&type%5B%5D=0&type%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&phase%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&cate%5B%5D=0&phases%5B%5D=%E5%88%9D%E4%BB%A3&phases%5B%5D=%E7%AC%AC%E4%B8%80%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E4%BA%8C%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E4%B8%89%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%9B%9B%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E4%BA%94%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%85%AD%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E4%B8%83%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%85%AB%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E4%B9%9D%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E4%B8%80%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E4%BA%8C%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E4%B8%89%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E5%9B%9B%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E4%BA%94%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E5%85%AD%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E4%B8%83%E6%9C%9F&phases%5B%5D=%E7%AC%AC%E5%8D%81%E5%85%AB%E6%9C%9F&cates%5B%5D=%E6%B4%BB%E5%8B%95%E9%99%90%E5%AE%9A&cates%5B%5D=%E9%99%90%E5%AE%9A%E8%A7%92%E8%89%B2&cates%5B%5D=%E8%81%96%E8%AA%952014&cates%5B%5D=%E6%AD%A3%E6%9C%882015&cates%5B%5D=%E9%BB%91%E8%B2%932015&cates%5B%5D=%E4%B8%AD%E5%B7%9D%E9%99%90%E5%AE%9A&cates%5B%5D=%E8%8C%B6%E7%86%8A%E9%99%90%E5%AE%9A&cates%5B%5D=%E5%A4%8F%E6%97%A5%E9%99%90%E5%AE%9A&cates%5B%5D=%E4%B8%83%E5%A4%A7%E7%BD%AA&cates%5B%5D=%E7%8D%85%E5%8A%8D%E9%99%90%E5%AE%9A&cates%5B%5D=%E6%BA%AB%E6%B3%89%E9%99%90%E5%AE%9A&cates%5B%5D=%E8%81%96%E8%AA%952015&cates%5B%5D=%E6%AD%A3%E6%9C%882016&cates%5B%5D=%E9%BB%91%E8%B2%932016&cates%5B%5D=%E8%8C%B6%E7%86%8A2016';


// 请求之前,先创建个文件.
(function () {
    fs.exists('./gif', function (value) {
        if (!value) {
            fs.mkdirSync('./gif');
        }
    })
})();
//开始请求.
superagent
    .post(url)
    .set(headers)
    .send(value)
    .end(function (err, data) {
        if (err) throw err;
        //如果获取成功,解码JSON
        var values = JSON.parse(data.text);
        //对解码后的数据,进行一步操作,通过async 控制异步操作.
        async.mapSeries(values, function (value,callback) {
            var heroId = value[0];
            //获取到了英雄的ID,通过详情页面的请求,获取图片.==>此处通过特定函数处理.
            log('开始请求......\n');
            getPng(heroId,callback);
        },function (err, data) {
            if (err) throw err;
            log(data);
        });


    });


function getPng(heroId,callback) {
//    种子请求.
    var childeUrl = 'http://wcatproject.com/img/as2/' + heroId + '.gif';
//    文件存放地址.
    var filePath = './gif/' + heroId + '.gif';
//    发起请求.
    request(childeUrl)
        .pipe(fs.createWriteStream(filePath))
        .on('close', function () {
            callback(null,heroId+'请求完成');
        })


}

