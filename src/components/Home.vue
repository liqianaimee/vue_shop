<template>
      <el-container class="home-container">
        <!--  头部区域-->
        <el-header>
          <div>
            <img src="../assets/heima.png" alt="">
            <span>后台电商管理系统</span>
          </div>
          <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--  页面主体区域-->
        <el-container>
          <!-- 侧边栏 unique-opened只允许打开一个列表项:collapse是否折叠:collapse-transition是否有动画router开启路由模式,可以通过index属性跳转-->
          <el-aside :width="isCollapse?'64px':'200px'">
            <div class="toogle-button" @click="toggleCollapse">|||</div>
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
                     unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
              <!-- 一级菜单 index绑定不同的值,否则会统一操作-->
              <el-submenu :index="i + ''" v-for="(item,i) in menuList" :key="item.id">
                <!-- 一级菜单得模板区域-->
                <template slot="title">
                  <!-- 图标-->
                  <i :class="iconList[i]"></i>
                  <!-- 文本-->
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单得模板-->
                <el-menu-item :index="'/'+ subItem.path " v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+ subItem.path )">
                  <!-- 图标-->
                  <i class="el-icon-menu"></i>
                  <!-- 文本-->
                  <span slot="title">{{subItem.authName}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <!-- 右侧主体区域  -->
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconList: [
        'iconfont icon-user',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao'],
      isCollapse: false,
      // 被激活得链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮,切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    font-size: 20px;
    color: #ffffff;
    align-items: center;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .toogle-button{
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }

</style>
