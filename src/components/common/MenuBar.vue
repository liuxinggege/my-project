<style scoped>
 .link-style{
     text-decoration: none;
     background-color: #606266;
 }
 .el-menu-vertical-demo{
     width: 100%;
 }
</style>
 <template>

        <el-menu
            default-active="0"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#606266"
            text-color="#eee"
            active-text-color="#ffd04b">
            <router-link v-for="(item,index) in data" :to="setPath(item,index)" class="link-style" :key="index">
                <el-menu-item 
                    :index="index+''"
                    :disabled="item.disabled">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.title}}</span>
                </el-menu-item>
            </router-link>
        </el-menu>
</template>
<script>
import store from "@/store.js";
export default {
  name: "menubar",
  data() {
    return {
        data:[
            {
                title:'我的故事1',
                path:'/main2',
                disabled:false
            },
            {
                title:'我的故事2',
                path:'/main3',
                disabled:false
            },
            {
                title:'Gis模拟图',
                path:'/gis',
                disabled:false
            },
            {
                title:'Gis模拟图编辑',
                path:'/gis',
                type:'edit',
                disabled:false
            },
            {
                title:'故事还没有完结',
                path:'/cccc',
                disabled:true
            }
        ]
    };
  },
  //组件创建之前这里拿不到data里面的属性/gis
  beforeCreate() {},
  //组件完成
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    setPath(item,index){
                let path = {
                    path:item.disabled?'':item.path,
                };
                if(item.type){
                  path.query = {
                      type:item.type
                  }  
                }
                return path

        return
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

