<template>
    <div>
        <table class="table table-hover">
            <thead>
                <th>Mot origine</th>
                <th>Mot traduction</th>
                <th>Actions</th>
            </thead>
            <tbody>
                <tr v-for='word in words' :key='word._id'>
                    <td>{{ word.originalWord }}</td>
                    <td>{{ word.tradWord }}</td>
                    <td>
                        <button class="btn btn-success btn-xs" @click='modalEdit(word._id)'><i class="far fa-edit"></i></button>
                        <button class="btn btn-danger btn-xs" @click='modalDeleteWord(word._id)'><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="btn btn-outline-primary" @click='modalEdit(null)'><i class="fas fa-plus-circle mr-1"></i> Ajouter un nouveau mot</button><br />
        <a href="#/list">Retour à la liste des packs</a>


        <!-- ===================== DEBUT DIALOGS DELETE ===================== -->
        <div class="modal fade" id="modalDelete" tabindex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Suppression mot</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Êtes-vous sûr de vouloir supprimer ce mot ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Non</button>
                    <button type="button" class="btn btn-primary" @click='deleteWord()'>Oui</button>
                </div>
                </div>
            </div>
        </div>
        <!-- ===================== FIN DIALOGS DELETE ===================== -->


        <!-- ===================== DEBUT DIALOGS AJOUT/UPDATE ===================== -->
        <div class="modal fade" id="modalEdit" tabindex="-1" role="dialog" aria-labelledby="modalEdit" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><span v-if="selectedWordId === null">Ajouter</span><span v-if="selectedWordId !== null">Modifier</span> mot</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group row">
                            <label for="originalWord" class="col-4">Mot origine</label>
                            <input type="text" class="form-control col-7" id="originalWord" v-model="currentWord.originalWord">
                        </div>
                        <div class="form-group row">
                            <label for="tradWord" class="col-4">Mot traduction</label>
                            <input type="text" class="form-control col-7" id="tradWord" v-model="currentWord.tradWord">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" @click="edit()">Sauvegarder</button>
                </div>
                </div>
            </div>
        </div>
        <!-- ===================== FIN DIALOGS AJOUT/UPDATE ===================== -->

    </div>
</template>

<script>
export default {
  name: 'ListWord',
  data () {
    return {
      words: [],
      selectedWordId: null,
      currentWord: {
              originalWord: '',
              tradWord: ''
      },
      isEdit: false
    }
  },
  mounted () {
      this.$http.get('http://192.168.0.55:8081/getWordsPack/'+this.$route.params.packId)
      .then((result) => {
        this.words = result.data;
      },
      (error) => {
          console.log(error);
      })
  },
  methods: {
      editWord (wordId) {
          console.log(wordId);
      },

      modalDeleteWord (wordId) {
          this.selectedWordId = wordId;
          $('#modalDelete').modal('show');
      },

      deleteWord () {
          this.$http.delete('http://192.168.0.55:8081/deleteWord/'+this.selectedWordId).then(
              () => {
                  for(var i = 0 ; i < this.words.length ; i++){
                    if(this.words[i]._id === this.selectedWordId ){
                        this.words.splice(i, 1);
                        break;
                    }
                }
                this.selectedWordId = null;
                $('#modalDelete').modal('hide');

                this.$http.patch('http://192.168.0.55:8081/updatePackNumber/' + this.$route.params.packId +'/MINUS');
              }
          );
          
      },

      modalEdit (wordId) {
          if (wordId === null) {
              this.isEdit = false;
              this.selectedWordId = null;
          } else {
              this.isEdit = true;
              this.selectedWordId = wordId;
          }

          $('#modalEdit').modal('show');

          this.currentWord = {
              originalWord: '',
              tradWord: ''
          };
          if(this.selectedWordId) {
              for(var i = 0 ; i < this.words.length ; i++){
                if(this.words[i]._id === this.selectedWordId ){
                    this.currentWord.originalWord = this.words[i].originalWord;
                    this.currentWord.tradWord = this.words[i].tradWord;
                    break;
                }
              }
          }
      },

      edit() {
          if(this.isEdit){
              console.log(this.currentWord);
              this.$http.patch('http://192.168.0.55:8081/editWord/'+this.selectedWordId, {
                  originalWord: this.currentWord.originalWord,
                  tradWord: this.currentWord.tradWord,
                  hiragana: this.currentWord.hiragana,
                  katakana: this.currentWord.katakana
              }).then(
                  (data) => {
                      for(var i = 0 ; i < this.words.length ; i++){
                        if(this.words[i]._id === this.selectedWordId ){
                            this.words[i].originalWord = data.data.originalWord;
                            this.words[i].tradWord = data.data.tradWord;
                            break;
                        }
                    }
                      $('#modalEdit').modal('hide');
                  },
                  (error) => {
                      console.log(error);
                  }
              );
          } else {
              this.$http.post('http://192.168.0.55:8081/addWord', {
                  originalWord: this.currentWord.originalWord,
                  tradWord: this.currentWord.tradWord,
                  packId: this.$route.params.packId
              }).then(
                  (data) => {
                      console.log(data);
                      $('#modalEdit').modal('hide');
                      this.words.push(data.data);
                      this.$http.patch('http://192.168.0.55:8081/updatePackNumber/' + this.$route.params.packId +'/PLUS').then(
                          () => {},
                          (error) => {
                              console.log(error);
                          });
                  },
                  (error) => {
                      console.log(error);
                  }
              );
          }
      }
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn-xs{
        width: 25px;
        height: 25px;
        padding-left: 6px;
        padding-top: 0px;
    }
    .btn-xs i{
        font-size: 0.8rem;
    }
</style>
