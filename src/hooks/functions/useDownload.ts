import { message } from 'ant-design-vue';
import { ACCESS_TOKEN_KEY } from './../../enums/cacheEnum';
import { Storage } from './../../utils/Storage';
export const useDownload = (href: string, fileName: string, method: string, param?: any) => {
  // 创建a标签
  // 移除a标签
  const url = process.env.VUE_APP_BASE_API + href;
  //   document.body.removeChild(link);
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.responseType = 'blob'; // 返回类型blob  blob 存储着大量的二进制数据
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('token', Storage.get(ACCESS_TOKEN_KEY)); // 添加toke下载文件
  // xhr.setRequestHeader('X-APP-CODE', process.env.VUE_APP_CODE);
  xhr.setRequestHeader('X-SESSION-ID', Storage.get(ACCESS_TOKEN_KEY)); // 刘述功

  xhr.onerror = function () {
    message.error(`导出失败！`);
    // reject(err);
  };
  xhr.onload = function () {
    if (this.status === 200) {
      const blob = this.response;
      // 若返回的是json类型
      if (xhr.getResponseHeader('Content-Type') == 'application/json;charset=utf-8') {
        const readerBlob: any = new FileReader();
        readerBlob.readAsText(blob, 'utf-8');
        readerBlob.onload = function () {
          const res = JSON.parse(readerBlob.result);
          message.error(res.msg);
        };
        return;
        // message.error(`导出失败！`);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
        reader.onload = function (e: any) {
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          a.download = fileName;
          a.target = '_blank';
          a.href = String(e.target?.result) || '';
          document.body.appendChild(a); // 修复firefox中无法触发click
          a.click();
          document.body.removeChild(a); //释放之前创建的URL对象
          window.URL.revokeObjectURL(url);
        };
      }
    }
  };
  xhr.send(JSON.stringify(param)); // 发送ajax请求
};
