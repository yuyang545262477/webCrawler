//依赖包
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var request = require('request');

//头文件
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
//请求表单
var requirement = {
    info: 'isempty',
    star: [0, 0, 0, 1, 0],//这是英雄级别的关键点.
    job: [0, 0, 0, 0, 0, 0, 0, 0],
    type: [0, 0, 0, 0, 0, 0, 0],
    phase: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    cate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    phases: ['初代', '第一期', '第二期', '第三期', '第四期', '第五期', '第六期', '第七期', '第八期', '第九期', '第十期', '第十一期', '第十二期', '第十三期', '第十四期', '第十五期', '第十六期'],
    cates: ['活動限定', '限定角色', '聖誕限定', '正月限定', '黑貓限定', '中川限定', '茶熊限定', '夏日限定']
};
//种子链接
var url = 'http://wcatproject.com/charSearch/function/getData.php';

function log(data) {
    console.log(data);
}


superagent
    .post(url)
    .set(header)
    .send(requirement)
    .end(function (err, res) {
        if (err) throw  err;
//    解析返回的JSON文件
        var respone = JSON.parse(res.text);
//    获取返回JSON的英雄ID
        async.mapLimit(respone, 1, function (hero, callback) {
            var heroId = hero[0];
            // 重要的函数,将获取的ID,链接对应的页面,获取gif文件,存储到特定路径.
            console.log("开始请求");
            getGif(heroId, callback);
        }, function (err, result) {
            if (err) throw  err;
            console.log("..........文件已经存储完毕");
        })
    });


//getGif函数

function getGif(heroId, callback) {
//    分析子页面的URL路径构成.
    var childUrl = 'http://wcatproject.com/img/as1/' + heroId + '.gif';
//    存放路径
    var pathFile = './gif2';
//    存放的文件名
    var fileName = pathFile+'/' + heroId + '.gif';
//    请求头
    var childheader = {
        url: childUrl,
        headers: {
            'Host': 'wcatproject.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Cookie': '_ga=GA1.2.690711078.1458729379',
            'Connection': 'keep-alive',
            'If-Modified-Since': 'Sat, 30 May 2015 03:42:52 GMT',
            'If-None-Match': ' "43e026b-941a0-517446324a244"',
            'Cache-Control': 'max-age=0',
        }
    };


//    判断是否存在.

//     function isexists(path, fileName, fun, childUrl) {
//         fs.exists(path, function (save) {
//             if (!save) {
//                 fs.mkdir(path, 0755, function (err) {
//                     if (err)throw err;
//                     console.log("创建文件夹.......");
//                 });
//                 console.log("文件夹创建完成");
//             } else {
//                 fs.exists(fileName, function (save) {
//                     if (!save) {
//                         console.log("开始生成文件......");
//                         fun(childUrl, fileName);
//                     } else {
//                         console.log(fileName + '文件已经存在.');
//                     }
//                 })
//             }
//         });
//
//     }

    function isexists(heroId, fileName, pathFile, fun, callback) {
        //    首先判断文件是否存在.
        fs.exists(fileName, function (value) {
            //如果不存在
            if (!value) {
                //    再来判断文件夹是否存在.
                fs.exists(pathFile, function (path) {
                    if (!path) {
                        console.log("开始创建文件夹............");
                        fs.mkdirSync(pathFile, 0755, function (err) {
                            if (err) throw  err;
                            console.log(pathFile + '文件夹创建完毕');
                        });
                        log("开始请求......." + heroId);
                        fun(childheader, fileName);
                        callback(null, fileName);
                    } else {
                        //    如果存在文件夹,开启调用
                        log("开始请求........" + heroId);
                        fun(childheader, fileName);
                        callback(null, fileName);
                    }
                })
            } else {
                console.log(heroId+".....已经存在");
                callback(null, 'hello');
            }

        })
    }

//    开启请求:
    function creatFile(childheader, fileName) {
        request(childheader)
            .pipe(fs.createWriteStream(fileName))
            .on('close',function () {
                console.log(fileName + '文件生成完毕');
            })

    }
    isexists(heroId,fileName,pathFile,creatFile,callback);

}
