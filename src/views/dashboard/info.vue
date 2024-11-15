<template>
  <div class="wrap">
    <div class="app-container">
      <div class="app-container-left">
        <div class="info">
          <img
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            alt=""
            srcset=""
          />
          <h3>Serati Ma</h3>
          <div class="sign">海纳百川，有容乃大</div>
          <div class="info-label">
            <a-icon type="account-book" class="info-label-icon" />
            <div class="info-label-text">交互专家</div>
          </div>
          <div class="info-label">
            <a-icon type="account-book" class="info-label-icon" />
            <div class="info-label-text">
              蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED
            </div>
          </div>
          <div class="info-label">
            <a-icon type="account-book" class="info-label-icon" />
            <div class="info-label-text">低价奥特曼</div>
          </div>
        </div>
        <!-- 标签 -->
        <div class="labels">
          <div class="labels-title">个人标签</div>
          <div class="item">
            <a-tag
              class="item-tag"
              closable
              v-for="(item, index) in labelsList"
              :key="index"
              >{{ item }}</a-tag
            >
            <a-input
              v-if="inputVisible"
              ref="input"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              :value="inputValue"
              @change="handleInputChange"
              @blur="handleInputConfirm"
              @keyup.enter="handleInputConfirm"
              class="item-tag"
            />
            <a-tag v-else class="item-tag" @click="showInput">
              <a-icon type="plus" /> New Tag
            </a-tag>
          </div>
        </div>
      </div>
      <div class="app-container-right">
        <div class="tabs">
          <a-tabs default-active-key="1" @change="callback" size="large">
            <a-tab-pane key="1" tab="文章（20）">
              <div class="content-article">
                <div class="article-item" v-for="item in 4" :key="item">
                  <div class="article-item-title">Alipay</div>
                  <div class="article-item-labels">
                    <a-tag>Ant Design</a-tag>
                    <a-tag>设计语言</a-tag>
                  </div>
                  <div class="article-item-content">
                    <p>
                      段落示意：蚂蚁金服设计平台
                      ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台
                      ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。
                    </p>
                  </div>
                  <div class="article-item-info">
                    <a-icon type="account-book" class="info-label-icon" />
                    <span class="article-author">彭飞飞</span>
                    <span
                      >发布在<a href="https://ant.design.com"
                        >https://ant.design.com</a
                      ></span
                    >
                    <span>2024-10-31 10:28:07</span>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="应用" force-render>
              Content of Tab Pane 2
            </a-tab-pane>
            <a-tab-pane key="3" tab="项目"> Content of Tab Pane 3 </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      labelsList: ["很有想法的", "专注设计", "川妹子", "海纳百川"],
    };
  },
  methods: {
    handleClose(removedTag) {
      const tags = this.tags.filter((tag) => tag !== removedTag);
      console.log(tags);
      this.tags = tags;
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(function () {
        this.$refs.input.focus();
      });
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      let tags = this.labelsList;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      console.log(tags);
      Object.assign(this, {
        labelsList: tags,
        inputVisible: false,
        inputValue: "",
      });
    },
    callback() {},
  },
};
</script>
<style lang="less" scoped>
.wrap {
  width: 100%;
  padding-bottom: 30px;
  min-height: calc(100vh - 84px);
  .app-container {
    width: 95%;
    margin: 0 auto;
    display: flex;
    // align-items: center;
    .app-container-left {
      width: 30%;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
      margin-right: 30px;
      max-height: 500px;
      .info {
        text-align: center;
        padding-bottom: 30px;
        border-bottom: 1px solid #f1f2f6;
        img {
          width: 120px;
        }
        h3 {
          font-size: 20px;
          // padding: 10px 0;
        }
        .sign {
          font-size: 16px;
        }
        .info-label {
          display: flex;
          align-items: center;
          font-size: 15px;
          padding: 5px 0 0 0;
          color: #000;
          font-weight: 500;
          .info-label-icon {
            padding-right: 10px;
          }
          .info-label-text {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .labels {
        padding: 10px 0;
        padding-bottom: 30px;
        border-bottom: 1px solid #f1f2f6;
        .labels-title {
          color: #000;
          font-weight: bold;
        }
        .item {
          .item-tag {
            margin-top: 10px;
            cursor: pointer;
            background: #fff;
            // border: dashed;
          }
        }
      }
    }
    .app-container-right {
      width: calc(100% - 30px);
      padding: 10px 20px;
      border-radius: 10px;
      background-color: #fff;
      .content-article {
        .article-item {
          padding-bottom: 30px;
          border-bottom: 1px solid #f1f2f6;
          .article-item-title {
            font-size: 20px;
            font-weight: bold;
            padding: 5px 0;
          }
          .article-item-labels {
            padding: 5px 0;
          }
          .article-item-content {
            padding: 5px 0;
            p {
              font-size: 16px;
              color: #000;
              font-weight: 400;
            }
          }
          .article-item-info {
            font-size: 15px;
            .info-label-icon {
              padding-right: 5px;
            }
            .article-author {
              color: #1677ff;
              font-weight: 500;
              padding-right: 5px;
            }
            a {
              color: #1677ff;
              padding-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
