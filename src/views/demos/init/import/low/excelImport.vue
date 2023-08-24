<template>
  <div class="excel-con">
    <div class="steps-content">
      <div v-if="current == 0" style="padding-top: 80px">
        <a-input-group compact>
          <a-input v-model:value.lazy.trim="state.name" style="width: calc(100% - 200px)" />
          <a-upload
            :show-upload-list="false"
            :max-count="1"
            :multiple="true"
            :action="url"
            :data="uploadParams"
            :headers="headers"
            @change="change"
          >
            <slot name="upload-con">
              <a-button type="primary">选择文件</a-button>
            </slot>
          </a-upload>
        </a-input-group>
        <a-button
          type="link"
          style="margin-top: 16px"
          @click="
            useDownload('/herpService/mcmsInitStock/download/template', '产品导入模板.xlsx', 'get')
          "
        >
          <download-outlined />
          下载模板文件
        </a-button>

        <a-button
          :disabled="!state.hasError"
          type="link"
          style="margin-top: 16px"
          @click="useDownload(state.errorFileUrl, '产品导入错误.xlsx', 'get')"
        >
          <download-outlined />
          下载异常文件
        </a-button>

        <p class="title-p">操作步骤：</p>
        <p class="con-p">1、下载模板文件，根据模板文件进行数据整理。</p>
        <p class="con-p">2、选择上传的文件后，系统会进行数据验证。</p>
        <p class="con-p"
          >3、若数据验证不通过，请点击【下载异常文件】，下载错误报告，根据提示信息进行调整后重新提交。</p
        >
        <p class="con-p">4、数据验证通过后，系统开始导入，提示【导入成功】后，导入完成。</p>
      </div>
    </div>
    <div class="steps-action">
      <a-button v-if="current == 0" type="primary" ghost @click="back">返回</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { useDownload } from '@/hooks/functions/useDownload';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { useSpinStore } from '@/store/modules/spin';
  import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
  import { Storage } from '@/utils/Storage';

  defineProps({
    uploadParams: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits<{
    (e: 'back'): void;
  }>();

  onMounted(async () => {});

  const current = ref<number>(0);
  const url = computed({
    get() {
      return `${process.env.VUE_APP_BASE_API}` + `/herpService/mcmsInitStock/upload/file`;
    },
    set() {},
  });

  const isProd = ['production', 'prod'].includes(process.env.NODE_ENV);

  const headers = computed({
    get() {
      const obj = {};
      const token = Storage.get(ACCESS_TOKEN_KEY);
      if (token) {
        // 请求头token信息，请根据实际情况进行修改
        obj['token'] = token;
      }
      // obj['X-APP-CODE'] = process.env.VUE_APP_CODE;
      if (!isProd && token) {
        obj['X-SESSION-ID'] = token;
      }
      // TODO 待移除
      obj['X-SESSION-ID'] = token;
      return obj;
    },
    set() {},
  });

  const state = reactive({
    hasError: false,
    errorFileUrl: '',
    name: '',
    url: '',
    param: {},
  });

  const change = (info: UploadChangeParam) => {
    useSpinStore().changeSpinning(true);
    state.name = info.file.name;

    if (info.file.status === 'done') {
      useSpinStore().changeSpinning(false);
      const { data } = info.file.response;
      if (!data.status) {
        state.hasError = true;
        state.errorFileUrl = data.url;
        message.error('导入失败, 请下载异常文件查看详情！');
        useSpinStore().changeSpinning(false);
        return;
      } else {
        message.success(`${info.file.name} 导入成功`);
        emit('back');
        state.hasError = false;
        state.errorFileUrl = '';
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  const back = () => {
    current.value = 0;
    emit('back');
  };
</script>
<style lang="less" scoped>
  .excel-con {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .steps-top {
    padding: 24px 108px 0;
  }
  .steps-content {
    margin-top: 16px;
    border-radius: 6px;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
    overflow-y: hidden;
    .title-p {
      font-size: 16px;
      line-height: 22px;
      color: #333333;
      margin: 40px 0 16px;
    }
    .con-p {
      font-size: 14px;
      line-height: 20px;
      color: #666666;
    }

    .circle {
      width: 64px;
      height: 64px;
      background: #52c41a;
      //   display: inline-block;
      border-radius: 50%;
      display: inline-flex;
      //   justify-content: center;
      //   align-items: center;
      transform: rotate(-45deg);
      &::before {
        position: absolute;
        content: '';
        display: inline-block;
        width: 32px;
        height: 16px;
        border: 5px solid #ffffff;
        border-top: 0;
        border-right: 0;
        top: 35%;
        left: 33%;
      }
    }
    .title-suc-p {
      font-size: 18px;
      line-height: 24px;
      margin: 24px 0;
    }
    .con-suc-p {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 40px;
    }

    .step-1 {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .steps-action {
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 4px;
    height: 60px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    .ant-btn {
      margin-right: 16px;
    }
  }
</style>
