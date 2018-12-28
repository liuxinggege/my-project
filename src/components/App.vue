<style>
    #app{
        width: 100%;
        height: 100%;
    }
</style>
 <template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
   data() {
      return {
          msg: 'app',
      }
  },
}
</script>


