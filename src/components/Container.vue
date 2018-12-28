<style scoped lang="less">
    @headerHeight: 50px; 
    @footerHeight: 70px;
    @articleWidth:200px;

    #container{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    #container > header{
        height:@headerHeight;
        min-height: @headerHeight;
        width: 100%;
        box-sizing: border-box;
        // background:url(../../static/img/bg5.jpg) no-repeat;
        // background-size: cover;  
        background-color:cyan;
        opacity: .3;

    }
     #container > footer{
        width: 100%;
        height: @footerHeight;
        min-height: @footerHeight;
        box-sizing: border-box;
    }
    #container > main{
        width: 100%;
        flex: 1;
        display: flex;
        box-sizing: border-box;
        overflow: hidden;
    }
    #container > main > article{
        height: 100%;
        min-width: @articleWidth;
        box-sizing: border-box;
        background-color: #606266;
    }
   
    #container > main > aside{
        height: 100%;
        flex: 1;
        box-sizing: border-box;
        overflow-y:auto;
        overflow-x:hidden;
    }
</style>

<template>
    <div id="container">
        <header></header>
        <main>
            <article>
                <Menu-bar></Menu-bar>
            </article>
            <aside>
                <router-view/>
            </aside>
        </main>
        <!-- <footer>footer</footer> -->
    </div>
   
</template>
<script>
    import store from "@/store.js"
    import MenuBar from "./common/MenuBar.vue"
    export default {
        name: 'Container',
        components:{
            MenuBar
        },
        data() {
            return {
                msg: 'Container',
                state:store.state,
                action:store.actions
            }
        },
        //组件创建之前这里拿不到data里面的属性
        beforeCreate(){

        },
        //组件完成
        created(){
            // console.log(this.$route)
        },
        beforeMount(){
     
        },
        mounted(){
       
   
        },
        beforeUpdate(){
       
        },
        updated(){

        },
        beforeDestroy(){

        },
        destroyed(){
   
        },
        methods:{
        }
    }

</script>

