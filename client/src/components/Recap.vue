<template>
  <div>
      <button class="btn btn-outline-danger mb-3" @click='onlyError=!onlyError' v-if="!onlyError">Afficher uniquement les erreurs</button>
      <button class="btn btn-outline-danger mb-3" @click='onlyError=!onlyError' v-if="onlyError">Afficher tous les mots</button>
      <ul class="list-group w-25" style="margin: auto;min-width: 300px;" v-if='!onlyError'>
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
        <ul class="list-group w-25" style="margin: auto;min-width: 300px;" v-if="onlyError">
                <li class="list-group-item justify-content-between align-items-center text-center bg-light">
                    {{this.nbOk}} / {{this.recap.length}}
                </li>
                <li v-for='e in recapError' :key='e.tradWord' class="list-group-item d-flex justify-content-between align-items-center">
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
        <button class="btn btn-outline-warning mt-3" @click='reload()'>Relancer avec les même mots</button><br />
        <button class="btn btn-outline-danger mt-3" @click='reloadErrors()' v-if="nbOk-recap.length!=0">Relancer uniquement les erreurs</button><br />
        <button class="btn btn-outline-info mt-3" @click='back()'>Retour à la liste des mots</button>
  </div>
</template>

<script>
export default {
  name: 'Revision',
  data () {
    return {
        recap: [],
        nbOk: 0,
        onlyError: false,
        recapError: []
    }
  },

  mounted() {
      this.recap = this.$store.state.responseWords;
      for(var i = 0 ; i < this.recap.length ; i++){
          if(!this.recap[i].error){
              this.nbOk++;
          } else {
              this.recapError.push(this.recap[i]);
          }
      }
  },

  methods: {
      back(){
          this.$router.push({ name: 'ListWord', params: { packId: this.$store.state.packId }});
      },

      reload(){
          this.$router.push({
              name: 'Revision'
          })
      },

      reloadErrors(){
          var wordsError = [];
          for(var i = 0 ; i < this.recap.length ; i++){
            if(this.recap[i].error){
                wordsError.push(this.$store.state.revisionWords[i]);
            }
          }
          this.$store.state.revisionWords = wordsError;
          this.reload();
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
