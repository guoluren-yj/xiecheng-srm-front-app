<script>
import indexMx from "../datasource/indexMx";
import { postReleaseApi, postReturnApi } from "../api";
export default {
  modules: [ "ssrc.inquiryHall","hipspfm.common" ],
  name: "DemandContactReleaseDetail",
  mixins: [ indexMx ],
  data() {
    return {
      visiableAttach: true,
    };
  },
  watch:{
    "headInfo.supplierCompanyId": {
      handler(val) {
        if (!val) {
          this.headInfo["supplierCompanyCode"] = "";
          this.headInfo["supplierCompanyName"] = "";
        }
      },
      deep: true
    },
    "headInfo.costCenterNum": {
      handler(val) {
        if (!val) {
          this.headInfo["costCenterName"] = "";
        }
      },
      deep: true
    },
    "headInfo.companyId": {
      handler(val) {
        if (!val) {
          this.headInfo["companyName"] = "";
        }
      },
      deep: true
    }
  },
  methods: {
    openAttach(uuid) {
      this.$showFileList({
        vm: this,
        title: "附件",
        attachmentUuid: uuid,
        canUpload: true,
        canDelete: true,
      });
    },
    released() {
      this.headInfo["jalaReqLiaisonLnList"] = [ ...this.linesInfo ];
      postReleaseApi({ ...this.headInfo, _status: "update" }).then((res)=>{
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 2000
            });
          } else {
            this.goBack();
          }
        }
      });
    },
    returnd() {
      this.headInfo["jalaReqLiaisonLnList"] = [ ...this.linesInfo ];
      postReturnApi({ ...this.headInfo, _status: "update" }).then((res)=>{
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 2000
            });
          } else {
            this.goBack();
          }
        }
      });
    }
  },
  render() {
    return (
      this.loading ?
        <section class="mainDetail">
          <div ref="wrapper" class="contentWrap wrapper">
            <SrmTab ref="content" class="content" noAll>
              <SrmTabPane label={this.getLanguageDefine("需求联络单头信息")}>
                <div ref="headInfo" class="infoContent headInfo">
                  {
                    this.headInfo && this.headInfo.liaisonNum ?
                      <ul>
                        <Customize columns={this.getHeaderColumns}
                          data-source={this.headInfo}
                          type={"list"}
                          need-padding={false}/>
                        {
                          this.headInfoLines && this.headInfoLines.length > 0 &&
                          this.headInfoLines.map((res, index)=>{
                            return (
                              <div key={index} class="lineItem">
                                <div
                                  class="first-item"
                                  style="margin-bottom: 5px">
                                  <span class="block"/>
                                  <span class="text">行号：{ index + 1 }</span>
                                </div>
                                {
                                  this.headInfo.liaisonType === "10" ?
                                    <Customize columns={this.getHeaderLineColumns}
                                      data-source={res}
                                      key={index}
                                      type={"list"}
                                      need-padding={false}/> :
                                    ""
                                }
                              </div>
                            );
                          })
                        }
                      </ul> :
                      <div class="noContent">
                        <span>
                          {this.getLanguageDefine("暂无数据")}
                        </span>
                      </div>
                  }
                </div>
              </SrmTabPane>

              <SrmTabPane label={this.getLanguageDefine("需求联络单行信息")}>
                <div ref="headInfo" class="infoContent headInfo">
                  {
                    this.linesInfo.length === 0 ?
                      <div class="noContent">
                        <span>
                          {this.getLanguageDefine("暂无数据")}
                        </span>
                      </div> :
                      <ul >
                        {
                          this.linesInfo.map((item, index)=>{
                            return (
                              <Customize columns={this.getLineColumns(index)}
                                data-source={item}
                                key={index}
                                type={"list"}
                                need-padding={false}/>
                            );
                          })
                        }
                      </ul>
                  }
                </div>
              </SrmTabPane>
            </SrmTab>
          </div>

          <SrmButtonGroup>
            <div class="attachImg" onClick={()=>{
              this.openAttach(this.headInfo.attachmentUuid);
            }}>
              <img class="image-black-default"
                src={require("@/assets/attached_file@3x.png")} alt="附件" />
            </div>
            <SrmButton onClick={
              ()=>{
                this.returnd();
              }
            }
            type="danger">
              <span>退回</span>
            </SrmButton>
            <SrmButton fill onClick={
              ()=>{
                this.released();
              }
            } >
              <span>发布</span>
            </SrmButton>
          </SrmButtonGroup>

          <SrmPopup
            visible={this.visible}
            title={this.customizeInfo.name}
            height="90%"
            ononClose={()=>{
              this.closSomePop();
            }}
            rounded>
            <CustomizeDetail
              class="card-pop"
              columns={this.customizeInfo.getColumns}
              data-source={this.detailInfo}/>
          </SrmPopup>
        </section> :
        ""
    );
  }
};
</script>

<style scoped lang="stylus">
.card-pop {
  padding: 0 12px;
}
>>> .srm-button-group-area {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  .srm-button {
    width: 40%;
    height: 48px;
    border-radius: 24px;
    font-size: 16px;
  }
  .attachImg {
    background: #ffffff;
    box-shadow: rgb(0 0 0 / 8%) 0px 0px 4px 0px;
    position: absolute;
    right: 15px;
    bottom: 104px;
    height: 44px;
    width: 44px;
    border-radius: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    .image-black-default {
      height: 24px;
      width: 24px;
    }
  }
}

.mainDetail {
  overflow: hidden;
  height: 100vh;
  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 72px);
    overflow: hidden;
    .content {
      height: 100%;
      overflow-y: scroll;
      >>> .srm-tab-pane-title {
        background: var(--color-border-default) !important;
      }
      .headInfo {
        ul {
          padding: 12px 15px 12px 15px;
          font-family: auto;
        }
        .lineItem {
          padding-bottom: 10px;
        }
        .first-item {
          display: flex;
          align-items: center;
          position: relative;
          .block {
            width: 7px;
            height: 10px;
            background-color: var(--color-other-default-b);
            position: absolute;
            left: -15px;
            top: 4px;
          }
          .text {
            line-height: 20px;
            font-size: 14px;
            color: var(--color-font-default);
            font-weight: bold;
          }
        }
        .lookSomePop {
          background: #276EF1;
          border: 1px solid #276EF1;
          border-radius: 16px;
          padding: 5px 10px;
          color: #FFFFFF;
          font-size: 12px
        }
        >>> .customize {
          margin-bottom: 8px !important;
          &:last-child  {
            margin-bottom: 0px !important;
          }
        }
        >>> .customize-item {
          margin-top: 0px !important;
          margin-bottom: 8px !important;
          &:last-child  {
            margin-bottom: 0px !important;
          }
        }
        >>> .customize-item-field {
          color: var(--color-font-default);
        }
      }
    }
  }
}
</style>