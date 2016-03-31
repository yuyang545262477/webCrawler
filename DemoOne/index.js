//第三方 依赖包

var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
//NODE 自带包

var fs = require('fs');

/*
 *  种子URL及XHR文件
 */
var url = 'http://wcatproject.com/charSearch/';
var file = 'getData.php';
var seedUrl = 'http://wcatproject.com/charSearch/function/getData.php';

/*
 *   分析头文件
 */

//注意'content-length' 不能要,因为响应头文件包涵"Transfer-Encoding:'chunked'",这一点非常重要,这回导致请求失败.
//详细请浏览:https://en.wikipedia.org/wiki/Chunked_transfer_encoding
var header = {
    'Host': 'wcatproject.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate',
    'DNT': '1',
    'Referer': 'http://wcatproject.com/charSearch/',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Length': ' 2195',
    'Cookie': '_ga=GA1.2.690711078.1458729379',
    'Connection': 'keep-alive'
};
/*
 * 分析,请求内容
 * */

var requirement = {
    info: 'isempty',
    star: [0, 0, 0, 0, 1],//这是英雄级别的关键点.
    job: [0, 0, 0, 0, 0, 0, 0, 0],
    type: [0, 0, 0, 0, 0, 0, 0],
    phase: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    cate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    phases: ['初代', '第一期', '第二期', '第三期', '第四期', '第五期', '第六期', '第七期', '第八期', '第九期', '第十期', '第十一期', '第十二期', '第十三期', '第十四期', '第十五期', '第十六期'],
    cates: ['活動限定', '限定角色', '聖誕限定', '正月限定', '黑貓限定', '中川限定', '茶熊限定', '夏日限定']
};

/*
 * 开始主程序
 * */
superagent
    .post(seedUrl) //方法+ 路径
    .send(requirement)// 参数
    .set(header) //头文件
    .end(function (err, res) {
        if (err) throw  err;
        //说明已经请求成功,之后的步骤
        /*
         * 首先,来理清思路.
         * 1.获取所有四星的ID   这是一个非常重要的KEY, 每个英雄的详情页面的URL==> http://wcatproject.com/char/ + "英雄ID"
         * 2.获取英雄详情页面的HTMl
         * 3.通过cheerio 进行分析.
         * 4.筛选出重要信息,呈现在终端.
         * */


        //得到所有英雄的ID

        // 分析响应部分,返回JSON格式.所以,首先要进行转码.
        var respone = JSON.parse(res.text);//为什么是res.text,请翻略superagent文档.
        // 在获取,响应部分,并进行转码之后,进入重点,将内部数据进行分析,提取英雄ID
        async.mapSeries(respone, function (respone, callback) {
            var heroId = respone[0];//步骤一,完成.
            GetHtml(heroId, callback);
        }, function (err, result) {
            if (err) throw  err;
            console.log('Demo1的抓包演习结束' + '\n 此次抓包数量为' + result.length);
        })


    });

/*
 * 因为完成步骤二,需要再次发送请求,所以分装在一个函数完成.
 * */

function GetHtml(heroId, callback) {
    //英雄详情页面的链接
    var deepUrl = 'http://wcatproject.com/char/';
    superagent
        .get(deepUrl + heroId)
        .end(function (err, res) {
            if (err) throw err;
            var deepRespone = res.text;//获取英雄详情页面的HTML;步骤二,完成.
            var $ = cheerio.load(deepRespone, {
                ignoreWhitespace: true,
                xmlMode: false,
                lowerCaseTags: false
            });// 将获取获得HTML交给cheerio分析; 步骤三,完成.
            //获取英雄名称;
            var name = $('span.title').text();
            //    获取英雄形态
            var states = $('div.tag-of-2').eq(0).children().last().text();
            //    获取英雄稀有度
            var stars = $('div.tag-of-2').eq(1).children().last().text();
            //      获取COST
            var cost = $('div.tag-of-2').eq(2).children().last().text();
            //   获取配音
            var dub = $('div.tag-of-2').eq(-1).children().last().text();
            // console.log('英雄名称'+ name + '\n' + '型态' + states +'\n' +'稀有度'+ cost + '\n'+'配音'+dub);
            console.log(name + '\n' + '\t' + '型态' + states + '稀有度' + cost + '配音' + dub);
            callback(null, heroId);
        });
}