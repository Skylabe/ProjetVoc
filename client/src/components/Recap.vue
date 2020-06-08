<template>
  <div>
      <ul class="list-group w-25" style="margin: auto;">
                <li class="list-group-item justify-content-between align-items-center text-center bg-light">
                    {{this.nbOk}} / {{this.recap.length}}
                </li>
                <li v-for='e in recap' :key='e.tradWord' class="list-group-item d-flex justify-content-between align-items-center">
                    {{ e.originalWord }}
                    <span>
                        <span v-bind:class="{ 'text-success': !e.error, 'text-danger line': e.error }">
                            {{ e.answer }}
                        </span>
                        <span v-if="e.error">
                            &nbsp;- <span  class="text-success">
                                {{ e.tradWord }}
                            </span>
                        </span>
                    </span>
                </li>
                <li class="list-group-item justify-content-between align-items-center text-center bg-light">
                    {{this.nbOk}} / {{this.recap.length}}
                </li>
        </ul>
        <button class="btn btn-outline-info mt-3" @click='back()'>Retour à la liste des mots</button>
  </div>
</template>

<script>
export default {
  name: 'Revision',
  data () {
    return {
        recap: [],
        nbOk: 0
    }
  },

  mounted() {
      this.recap = this.$store.state.responseWords;
      for(var i = 0 ; i < this.recap.length ; i++){
          if(!this.recap[i].error){
              this.nbOk++;
          }
      }
  },

  methods: {
      back(){
          this.$router.push({ name: 'ListWord', params: { packId: this.$store.state.packId }});
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.line {
  text-decoration: line-through;
}
</style>
