const ytdl = require('ytdl-core');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Link to video:', async (link) => {
  const downloadMP3 = async (url) => {
    const folderPath = path.join(__dirname, 'music');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const filePath = path.join(folderPath, `${title}.mp3`);

    const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

    const fileStream = fs.createWriteStream(filePath);

    let downloadedBytes = 0;
    let totalBytes = 0;

    stream.on('progress', (chunkLength, downloaded, total) => {
      downloadedBytes = downloaded;
      totalBytes = total;
      const progress = (downloadedBytes / totalBytes) * 100;
      console.log(`Progress: ${progress.toFixed(2)}%`);
    });

    stream.on('data', (chunk) => {
      fileStream.write(chunk);
    });

    stream.on('end', () => {
      fileStream.end();
      console.log('Download complete!');
      console.log('Kadrixter#1710 for the support ;3');

    });
  };

  await downloadMP3(link);
  rl.close();
});
