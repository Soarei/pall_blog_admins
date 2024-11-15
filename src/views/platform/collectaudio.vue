<template>
  <div class="wrap">
    <a-spin :spinning="spinning">
      <div class="wrap-text">
        <h4>生成音频文本</h4>
        <div class="form">
          <div class="form_item">
            <div class="label">音频文本</div>
            <a-textarea
              allow-clear
              @change="onChange"
              :rows="4"
              style="width: 60%"
              v-model="form.text"
              class="myinput"
            />
          </div>
          <div class="form_item">
            <div class="label">输出音频格式</div>
            <a-select v-model="form.format" style="width: 40%">
              <a-select-option
                v-for="item in formatlist"
                :key="item"
                :value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
          </div>
          <div class="form_item">
            <div class="label">输出音色</div>
            <a-select v-model="form.voice_type" style="width: 40%">
              <a-select-option
                v-for="item in voiceList"
                :key="item.id"
                :value="item.voiceCode"
                >{{ item.voiceName }}</a-select-option
              >
            </a-select>
          </div>
          <div class="form_item">
            <div class="label">输出情感</div>
            <a-select v-model="form.style" style="width: 40%">
              <a-select-option
                v-for="item in emotionList"
                :key="item.id"
                :value="item.id"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </div>
          <div class="form_item">
            <div class="label">输出语速</div>
            <a-slider
              style="width: 40%"
              id="test"
              :min="0"
              :max="3"
              :defaultValue="1"
              :step="0.1"
              @change="handleChangeSpeed"
            />
          </div>
        </div>
        <div class="actions">
          <audio :src="audioUrl" controls v-if="audioUrl"></audio>
          <a-button type="danger" class="submit" @click="submitAudio"
            >生成音频</a-button
          >
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { emotionList } from "./data";
import { getCollectionAudio, getallVoiceList } from "@/api/platform/course";
export default {
  data() {
    return {
      formatlist: ["pcm", "wav", "mp3", "ogg_opus"],
      voiceList: [],
      emotionList,
      form: {
        appid: "2169692166",
        accessToken: "AFsZrl8CIIQSFGD0uUO8FW6127T7hAMx",
        text: "",
        format: "",
        voice_type: "",
        emotion: "",
        speed: 1,
      },
      audioUrl: "",
      videoInfo: {},
      spinning: false,
    };
  },
  created() {
    this.getVoiceList();
  },
  methods: {
    onChange(e) {
      console.log(e);
    },
    submitAudio() {
      this.spinning = true;
      getCollectionAudio(this.form).then((res) => {
        this.spinning = false;
        this.audioUrl = res.data.audio_url;
      });
    },
    handleChangeSpeed(value) {
      this.form.speed = value;
    },
    getVoiceList() {
      getallVoiceList().then((res) => {
        //格式化数据
        this.voiceList = res.data;
      });
    },
    handleFilter(params) {
      console.log(params, "handleFilter");
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  width: 90%;
  background-color: #fff;
  border: 1px solid #e4e4e4;
  margin: 40px auto;
  border-radius: 4px;
  .wrap-text {
    padding: 20px 10px;
  }
  .form {
    .form_item {
      .label {
        padding: 10px 0;
      }
      .myinput {
        background-color: #f1f2f6;
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: column;
    audio {
      margin: 10px 0;
    }
    .submit {
      width: 200px;
      margin: 10px 0;
    }
  }
}
</style>
