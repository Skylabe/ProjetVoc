<template>
  <div id="app">
	<h1>What's in my kitchen ?</h1>
    <!--<a href="http://192.168.1.14:8080/#/index"><img src="./assets/logoJapan.png" style="width: 250px;"></a>-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
