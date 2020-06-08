<template>
  <div>
      {{ words[cpt] ? words[cpt].originalWord : '' }}<br />
      <span v-if="!answered"><input type="text" id="currentResponse" v-model="currentResponse" /><button class="btn btn-primary ml-3" @click='checkCurrentResponse()'>Valider</button></span>
      <span v-if="answered"><span v-bind:class="{ 'text-success': !response[cpt].error, 'text-danger line': response[cpt].error }">{{ response[cpt].answer }}</span> <span v-if="response[cpt].error"> - <span  class="text-success">{{ response[cpt].tradWord }}</span></span>
      <button class="btn btn-primary ml-3" @click='nextWord()' v-if="cpt < words.length-1">Suivant</button>
      <button class="btn btn-primary ml-3" @click='recap()' v-if="cpt == words.length-1">Récapitulatif</button>

      </span>
  </div>
</template>

<script>
export default {
  name: 'Revision',
  data () {
    return {
        words: [],
        response: [],
        cpt: 0,
        currentResponse: '',
        answered: false
    }
  },

  mounted() {
      this.words = this.$store.state.revisionWords;
      var i, j, tmp;
        for (i = this.words.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = this.words[i];
            this.words[i] = this.words[j];
            this.words[j] = tmp;
        }
      
      console.log(this.words);
  },

  methods: {
      checkCurrentResponse(){
          if(this.words[this.cpt].tradWord.toLowerCase() === this.currentResponse.toLowerCase()){
              this.response.push({
                  error: false,
                  originalWord: this.words[this.cpt].originalWord,
                  tradWord: this.words[this.cpt].tradWord,
                  answer: this.currentResponse
              })
          } else {
              this.response.push({
                  error: true,
                  originalWord: this.words[this.cpt].originalWord,
                  tradWord: this.words[this.cpt].tradWord,
                  answer: this.currentResponse
              })
          }
          this.answered = true;

      },

      nextWord(){
          this.cpt++;
          this.answered = false;
          this.currentResponse = '';
      },

      recap(){
          this.$store.state.responseWords = this.response;
          this.$router.push({ name: 'Recap'});
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
