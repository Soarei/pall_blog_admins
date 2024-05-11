<template>
  <div class="wrap">
    <div class="container">
      <div class="blog_static">
        <div class="blog_static_title">
          <!-- <img src="@/assets/404_images/images/mine.png" alt="" /> -->
          <span>下午好:{{ userInfo.user_name }}同学</span>
        </div>
        <!-- 内容 -->
        <div class="blog_content">
          <div class="flex_con" style="background-color: rgb(253, 153, 151)">
            <div class="con">
              <div class="con_title">文章统计</div>
              <div class="con_static">{{ articleInfo.artile_count }}篇文章</div>
            </div>
          </div>
          <div class="flex_con" style="background-color: rgb(83, 166, 237)">
            <div class="con">
              <div class="con_title">评论总计</div>
              <div class="con_static">
                {{ articleInfo.comment_count }}条评论
              </div>
            </div>
          </div>
          <div class="flex_con" style="background-color: rgb(69, 211, 192)">
            <div class="con">
              <div class="con_title">浏览总计</div>
              <div class="con_static">{{ articleInfo.browse_count }}个浏览</div>
            </div>
          </div>
          <div class="flex_con" style="background-color: rgb(69, 211, 192)">
            <div class="con">
              <div class="con_title">点赞总计</div>
              <div class="con_static">{{ articleInfo.thumbs_count }}个点赞</div>
            </div>
          </div>
        </div>
      </div>
      <div class="blog_static">
        <!-- 内容 -->
        <div class="blog_recent">
          <div class="recent_article">
            <a-card hoverable style="width: 100%; height: 100%">
              <img
                slot="cover"
                alt="example"
                src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png"
              />
              <template slot="actions">
                <a-icon key="setting" type="setting" />
                <a-icon key="edit" type="edit" />
                <a-icon key="ellipsis" type="ellipsis" />
              </template>
              <a-card-meta title="今日计划" description="添加一个计划吧">
                <a-avatar slot="avatar" :src="userInfo.user_avatar" />
              </a-card-meta>
            </a-card>
          </div>
          <div class="recent_list">
            <a-card title="今日计划">
              <a-radio-group v-model="value" @change="onChange">
                <a-radio
                  :style="radioStyle"
                  v-for="item in 10"
                  :key="item"
                  :value="item"
                >
                  star this repository
                </a-radio>
              </a-radio-group>
            </a-card>
          </div>
          <div class="recent_reply">
            <a-card title="最近收到的回复">
              <a-radio-group v-model="value" @change="onChange">
                <a-radio
                  :style="radioStyle"
                  v-for="item in 10"
                  :key="item"
                  :value="item"
                >
                  star this repository
                </a-radio>
              </a-radio-group>
            </a-card>
          </div>
        </div>
      </div>
      <div class="blog_static">
        <a-card :bordered="false" style="width: 100%">
          <div class="blog_static">
            <!-- 内容 -->
            <div id="myChart"></div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>
<script>
import { getSaleLine } from "@/mock/option";
import { getStaticArtile } from "@/api/dashboard";
export default {
  data() {
    return {
      // blogStatic:require('../../assets/404')
      columnsArticle: [
        {
          title: "日期",
          dataIndex: "date",
          key: "date",
          width: 200,
        },
        {
          title: "文章标题",
          dataIndex: "title",
          key: "title",
          key: "title",
        },
      ],
      dataArticle: [
        {
          date: "2022-12-13 22:13:14",
          title: "如何成为富婆的心上人",
        },
        {
          date: "2022-12-14 22:13:15",
          title: "如何成为富婆的心上人",
        },
        {
          date: "2022-12-14 22:13:16",
          title: "如何成为富婆的心上人",
        },
        {
          date: "2022-12-14 22:13:17",
          title: "如何成为富婆的心上人",
        },
      ],
      list: [
        {
          title: "Ant Design Title 1",
        },
        {
          title: "Ant Design Title 2",
        },
        {
          title: "Ant Design Title 3",
        },
        {
          title: "Ant Design Title 4",
        },
      ],
      radioStyle: {
        display: "block",
        height: "40px",
        lineHeight: "40px",
        fontSize: "20px",
        fontWeight: "normal",
      },
      articleInfo: {},
      value: 4,
    };
  },
  mounted() {
    this.getSaleLine();
    this.getStaticArtile();
  },
  methods: {
    // 设置表格头部属性
    customRow(column) {
      column.forEach((e, index) => {
        column[index].className = "tableClass";
      });
    },
    getStaticArtile() {
      getStaticArtile().then((res) => {
        this.articleInfo = res.data;
        console.log(this.articleInfo);
      });
    },
    getSaleLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      const option = getSaleLine();
      myChart.setOption(option);
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user_info;
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  padding-bottom: 30px;
  min-height: calc(100vh - 84px);
  .container {
    width: 90%;
    margin: 0 auto;
    padding: 30px 0;
    .blog_static {
      width: 100%;
      .blog_static_title {
        width: 100%;
        display: flex;
        line-height: 50px;
        img {
          width: 50px;
          height: 50px;
        }
        span {
          margin-left: 10px;
          color: #333;
          font-size: 24px;
          font-weight: bold;
        }
      }
      .blog_content {
        width: 100%;
        display: flex;
        margin: 20px auto;
        .flex_con {
          flex: 1;
          width: 100%;
          height: 150px;
          background-color: aquamarine;
          background-image: url("../../assets/404_images/images/011.png");
          background-size: 100%;
          margin-left: 20px;
          border-radius: 5px;
          .con {
            width: 90%;
            margin: 20px auto;
            .con_title {
              color: #fff;
              font-size: 18px;
            }
            .con_static {
              color: #fff;
              font-size: 24px;
              margin-top: 5px;
              font-style: italic;
            }
          }
        }
        .flex_con:first-child {
          margin-left: 0;
        }
      }
      #myChart {
        width: 100%;
        height: 450px;
      }
      @media screen and (min-width: 320px) and (max-width: 640px) {
        .blog_content {
          flex-direction: column;
          .flex_con {
            margin-left: 0;
            margin-top: 10px;
          }
        }
      }
      @media screen and (min-width: 320px) and (max-width: 640px) {
        .blog_recent {
          flex-direction: column;
          .recent_reply {
            margin-top: 20px;
          }
        }
      }
      .blog_recent {
        width: 100%;
        display: flex;
        margin: 20px auto;
        padding: 20px 0;
        align-items: center;
        justify-content: space-between;
        .recent_article {
          flex: 1;
          width: 100%;
          margin-right: 20px;
          // padding-bottom: 20px;
          background-color: #fff;
          height: 400px;
          max-height: 400px;
          /deep/.ant-card-actions {
            position: absolute;
            bottom: 0;
            width: 100%;
          }
        }
        .recent_list {
          flex: 1.5;
          width: 100%;
          height: 400px;
          max-height: 400px;
          overflow: hidden;
          margin-right: 20px;
        }
        .recent_reply {
          flex: 1.5;
          width: 100%;
          background-color: #fff;
          height: 400px;
          max-height: 400px;
          overflow: hidden;
          h3 {
            margin-left: 20px;
            padding: 20px 0;
          }
        }
      }
    }
  }
}
</style>
