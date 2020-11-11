const path = require("path");
const fs = require("fs");
const request = require("request");
const inquirer = require("inquirer");
require("./console");
let image_path = path.join(__dirname);
const consoleColor = {
  s: '\033[32m',
  f: '\033[31m'
}
const imageUrl = [
  "https://www.jq22.com/demo/scroller/assets/img1.jpg",
  "https://www.jq22.com/demo/scroller/assets/img2.jpg",
  "https://www.jq22.com/demo/scroller/assets/img3.jpg",
  "https://www.jq22.com/demo/scroller/assets/img4.jpg",
  "https://www.jq22.com/demo/scroller/assets/img5.jpg",
  "https://www.jq22.com/demo/scroller/assets/img6.jpg"
]

// 命令行输入
const inquirerResult = () => {
  return new Promise((resolve, reject) => {
    const promptArr = {
      type: "input",
      message: "请输入图片文件夹名称",
      name: "fileName",
      default: "image",
    };
    inquirer.prompt(promptArr).then(answers => {
      resolve(answers);
    }).catch(error => {
      reject(error);
      console.error(error);
    });
  })
}
// 创建文件
const createDir = (path) => {
  return new Promise(resolve => {
    fs.mkdir(path, err => {
      if (err) console.error(err);
      else console.log(consoleColor.s,"目录创建成功")
    })
    resolve();
  })

}
// 删除文件
const deleteDir = (path) => {
  return new Promise(resolve => {
    let files = [];
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(fileName => {
        const temPath = `${path}/${fileName}`
        if (fs.statSync(temPath).isDirectory()) {
          deleteDir(temPath); // 递归删除目录
        } else {
          fs.unlinkSync(temPath); //删除文件
        }
      })
      fs.rmdirSync(path); //删除目录
    }
    resolve(); 
  })
}
// 写入图片
const writeImages = () => {
  imageUrl.forEach(url => {
    const fileName = url.split("/").pop();
    const process = fs.createWriteStream(`${image_path}/${fileName}`);
    request({
      url,
      timeout: 10000
    }).pipe(process);
    process.on("finish", () => {
      console.log(consoleColor.s, `${fileName}写入成功~`);
    });
    process.on("error", err => {
      console.log(consoleColor.f,`${fileName}写入失败~`, err);
    });
  })
}
const run = () => {
  inquirerResult().then(({fileName}) => {
    image_path = path.join(image_path, `./${fileName}`);
    fs.access(image_path, fs.constants.F_OK, err => {
      if (err && err.code == 'ENOENT') {
        // 不存在该目录
        createDir(image_path).then(() => {
          writeImages();
        }) 
      } else {
        // 存在
        deleteDir(image_path).then(() => {
          console.log(consoleColor.f,"目录删除成功");
          createDir(image_path).then(() => {
            writeImages();
          }) 
        })
      }
    })
  })

}
run()