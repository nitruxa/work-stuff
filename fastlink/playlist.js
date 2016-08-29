'use strict';

var fs = require('fs');
var http = require('http');
var uniqby = require('lodash.uniqby');
var parseString = require('xml2js').parseString

var suffix = null;
var index = process.argv.indexOf('-s');

if (index > -1) {
    suffix = process.argv[index + 1];
}

var sortIds = [
    261, 473, 16, 17, 226, 19, 66, 273, 121, 88, 134, 18, 193, 1168, 120,
    1140, 454, 476, 115, 116, 1094, 113, 470, 471, 1263, 433, 1238, 449,
    54, 28, 1084, 628, 14,
    87, 109, 623, 50, 29, 25, 51, 287, 176
];

module.exports = function () {
    return new Promise(resolve => {
        http.get('http://stb.fastlink.lt/conf/skyter_play_list.php', res => {
            var xml = '';
            res.on('data', chunk => {
                xml += chunk;
            });

            res.on('end', () => {
                parseString(xml, (err, result) => {
                    var iptv = uniqby(result.playlist.feed.map(feed => {
                        return {
                            id: feed.$.id,
                            name: feed.name[0],
                            url: feed.url_hls[0]
                        }
                    }), 'name');

                    var m3u8 = ['#EXTM3U'];

                    sortIds.forEach(id => {
                        var feedIndex = iptv.findIndex(feed => feed.id == id);
                        if (feedIndex > -1) {
                            var feed = iptv[feedIndex];
                            m3u8.push(`#EXTINF:0,${feed.name}`);
                            m3u8.push(feed.url);
                            iptv.splice(feedIndex, 1);
                        }
                    })

                    iptv.forEach(feed => {
                        m3u8.push(`#EXTINF:0,${feed.name}`);
                        m3u8.push(feed.url);
                    });

                    resolve(m3u8.join('\n'));
                });
            });
        });
    });
};
