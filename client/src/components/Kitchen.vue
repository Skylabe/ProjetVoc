<template>
    <div>
        <table class="table table-hover">
            <thead>
                <th>Nom</th>
                <th>Date de péremption</th>
                <th>Quantité</th>
				<th>Catégories</th>
				<th>Rangement</th>
            </thead>
            <tbody>
                <tr v-for='food in foods' :key='food._id'>
                    <td>{{ food.name }}</td>
                    <td>{{ food.expiration }}</td>
                    <td>{{ food.quantity + (food.unit == "percent" ? "%" : " pièce(s)") }}</td>
                    <td>{{ food.categories.join(", ") }}</td>
                    <td>{{ food.storage }}</td>
                </tr>
            </tbody>
        </table>
        <button class="btn btn-outline-primary" @click='modalEdit(null)'><i class="fas fa-plus-circle"></i> Ajouter un nouvel aliment</button>


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
                    <h5 class="modal-title"><span v-if="selectedWordId === null">Ajouter</span><span v-if="selectedWordId !== null">Modifier</span> aliment</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group row">
                            <label for="name" class="col-4">Nom</label>
                            <input type="text" class="form-control col-7" id="name" v-model="currentFood.name">
                        </div>
                        <div class="form-group row">
                            <label for="expiration" class="col-4">Péremption</label>
                            <input type="date" class="form-control col-7" id="expiration" v-model="currentFood.expiration">
                        </div>
						<div class="form-group row">
                            <label for="quantity" class="col-4">Quantité</label>
                            <input type="number" class="form-control col-5" id="quantity" v-model="currentFood.quantity">
							<select class="form-control col-2" id="unit" v-model="currentFood.unit">
								<option value="pieces">pc</option>
								<option value="percent">%</option>
							</select>
                        </div>
						<div class="form-group row">
                            <label for="categories" class="col-4">Catégories</label>
                            <input type="text" class="form-control col-7" id="categories" v-model="currentFood.categories" placeholder="Séparer par une virgule">
                        </div>
						<div class="form-group row">
                            <label for="storage" class="col-4">Rangement</label>
                            <input type="text" class="form-control col-7" id="storage" v-model="currentFood.storage">
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
  name: 'Kitchen',
  data () {
    return {
      foods: [],
      selectedWordId: null,
      currentFood: {
		name: '',
		expiration: '',
		quantity: 0,
		unit: 'percent',
		categories: '',
		storage: ''
	  },
      isEdit: false,
      selectedWords: []
    }
  },
  mounted () {
      this.$http.get('http://192.168.1.14:8081/getAllFoods')
      .then((result) => {
        this.foods = result.data;
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
          this.$http.delete('http://192.168.1.14:8081/deleteWord/'+this.selectedWordId).then(
              () => {
                  for(var i = 0 ; i < this.words.length ; i++){
                    if(this.words[i]._id === this.selectedWordId ){
                        this.words.splice(i, 1);
                        break;
                    }
                }
                this.selectedWordId = null;
                $('#modalDelete').modal('hide');

                this.$http.patch('http://192.168.1.14:8081/updatePackNumber/' + this.$route.params.packId +'/MINUS');
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

          this.currentFood = {
              name: '',
              expiration: '',
			  quantity: 0,
			  unit: 'percent',
			  categories: '',
			  storage: ''
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
              this.$http.patch('http://192.168.1.14:8081/editWord/'+this.selectedWordId, {
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
              this.$http.post('http://192.168.1.14:8081/addFood', {
            		name: this.currentFood.name,
					expiration: this.currentFood.expiration,
					quantity: this.currentFood.quantity,
					unit: this.currentFood.unit,
					categories: this.currentFood.categories.split(","),
					storage: this.currentFood.storage
              }).then(
                  (data) => {
                      console.log(data);
                      $('#modalEdit').modal('hide');
                      this.foods.push(data.data);
                      this.$http.patch('http://192.168.1.14:8081/updatePackNumber/' + this.$route.params.packId +'/PLUS').then(
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
