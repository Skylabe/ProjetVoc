<template>
  <div>
       [{{cpt+1}}/{{words.length}}]<br />
      {{ words[cpt] ? words[cpt].originalWord : '' }}<br />
      <span v-if="!answered"><input type="text" id="currentResponse" v-model="currentResponse" autofocus /><button class="btn btn-primary ml-3" @click='checkCurrentResponse()'>Valider</button></span>
      <span v-if="answered"><span v-bind:class="{ 'text-success': !response[cpt].error, 'text-danger line': response[cpt].error }">{{ response[cpt].answer }}</span> <span v-if="response[cpt].error"> - <span  class="text-success">{{ response[cpt].tradWord }}</span></span>
      <button class="btn btn-primary ml-3" @click='nextWord()' v-if="cpt < words.length-1">Suivant</button>
      <button class="btn btn-primary ml-3" @click='recap()' v-if="cpt == words.length-1">Récapitulatif</button>

      </span>
  </div>
</template>

<script>
export default {
  name: 'Revision',
  created() {
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.onKeyDown);
  },
  destroyed() {
    document.removeEventListener('keydown', this.onKeyDown);
  },
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
      
      document.getElementById('currentResponse').focus();
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
          setTimeout(
              () => {document.getElementById('currentResponse').focus();},
              100
          )

          console.log(this.cpt + ' - ' + this.words.length);
          
      },

      recap(){
          this.$store.state.responseWords = this.response;
          this.$router.push({ name: 'Recap'});
      },

      onKeyDown(e) {
      switch (e.keyCode) {
        case 13:
            if(this.answered){
              if(this.cpt === this.words.length-1){
                this.recap();
              } else {
                this.nextWord();
              }
            } else {
                this.checkCurrentResponse();
            }
            
            break;
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.line {
  text-decoration: line-through;
}
</style>
