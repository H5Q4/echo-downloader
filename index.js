'use strict';

const ffmpeg = require('fluent-ffmpeg');
const cheerio = require('cheerio');
const request = require('request');

let ffmpegCommand = null;

const btnDownload = document.getElementById('btn-download');
const inputUrl = document.getElementById('input-url');
const panelInfo = document.getElementById('output-info');
btnDownload.addEventListener('click', function() {
  let url = inputUrl.value;
  if (!url) {
    panelInfo.innerHTML = '请输入echo播放页面地址!';
    process.exit(0);
  }
  request(url, function(err, response, html) {
    const $ = cheerio.load(html);
    const script = $('main.main-part.clearfix>script').text();
    const findAndClean =
      findTextAndReturnRemainder(script, 'var page_sound_obj = ');
    const result = JSON.parse(findAndClean);
    panelInfo.innerHTML = result.name + '<br>';
    ffmpegProcess(result.source, result.name);
  });
});

const findTextAndReturnRemainder = function(target, variable) {
  const frontChopped = target.substring(target.search(variable) + variable.length, target.length);
  return frontChopped.substring(0, frontChopped.search('};') + 1);
};

const ffmpegProcess = function(m3u8Uri, filename) {
  ffmpegCommand = ffmpeg();
  ffmpegCommand
    .input(m3u8Uri)
    .on('error', function(err) {
      panelInfo.innerHTML += 'An error occurred: ' + err.message + '<br>';
    })
    .on('start', function() {
      panelInfo.innerHTML += '开始下载...<br>';
    })
    .on('end', function() {
      panelInfo.innerHTML += '下载完成，即将转码成mp3 !<br>';
      ffmpegCommand = ffmpeg();
      ffmpegCommand
        .input('output/' + filename + '.ts')
        .format('mp3')
        // .audioBitrate('128k')
        .audioCodec('libmp3lame')
        .on('error', function(err) {
          panelInfo.innerHTML += 'An error occurred: ' + err.message + '\n';
        })
        .on('start', function() {
          panelInfo.innerHTML += '开始转码... <br>';
        })
        .on('end', function() {
          panelInfo.innerHTML += '转码完成，歌曲处理完成!';
          ffmpegCommand = null;
        })
        .save('output/' + filename + '.mp3');
    })
    .save('output/' + filename + '.ts');
};