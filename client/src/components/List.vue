<template>
    <div>
        <ul class="list-group w-25" style="margin: auto;">
            <span v-if="!deleteMode">
                <button @click='redirect(pack._id)' v-for='pack in packs' :key='pack._id' class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="cursor: pointer;">
                    {{ pack.name }}
                    <span class="badge badge-primary badge-pill" v-if="!deleteMode">{{ pack.nb }}</span>
                </button>
            </span>
            <span  v-if="deleteMode">
                <li v-for='pack in packs' :key='pack._id' class="list-group-item d-flex justify-content-between align-items-center" style="cursor: pointer;">
                    {{ pack.name }}
                    <span v-if="deleteMode"><a @click='deletePack(pack._id)'><i class="fa fa-times text-muted"></i></a></span>
                </li>
            </span>
            
        </ul>
        <button class="btn btn-outline-primary mt-3" @click='modalAdd()'><i class="fas fa-plus-circle mr-1"></i> Ajouter pack de mots</button>
        <button class="btn btn-outline-danger mt-3" v-bind:class="{ active: deleteMode }" @click='deleteMode=!deleteMode'> <i class="fa fa-trash"></i></button>


        <!-- ===================== DEBUT DIALOGS AJOUT/UPDATE ===================== -->
        <div class="modal fade" id="modalEdit" tabindex="-1" role="dialog" aria-labelledby="modalEdit" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout pack</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group row">
                            <label for="packName" class="col-4">Nom du pack</label>
                            <input type="text" class="form-control col-7" id="packName" v-model="packName">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" @click="save()">Sauvegarder</button>
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
      packs: [],
      packName: '',
      deleteMode: false
    }
  },
  mounted () {
      this.$http.get('http://192.168.0.55:8081/getAllPacks')
      .then((result) => {
        this.packs = result.data;
      },
      (error) => {
          console.log(error);
      })
  },
  methods: {
     save(){
         this.$http.post('http://192.168.0.55:8081/addPack', {name: this.packName}).then(
             (result) => {
                 this.packs.push(result.data);
                  $('#modalEdit').modal('hide');
                  this.packName = '';
             },
             (error) => {
                 console.log(error);
             }
         );
     },

     modalAdd(){
         this.pachName = '';
         $('#modalEdit').modal('show');
     },

     deletePack(id){
         this.$http.delete('http://192.168.0.55:8081/deletePack/'+id).then(
              () => {
                  for(var i = 0 ; i < this.packs.length ; i++){
                    if(this.packs[i]._id === id ){
                        this.packs.splice(i, 1);
                        break;
                    }
                }
                if(this.packs.length === 0){
                    this.deleteMode = false;
                }
              }
          );
     },

     redirect(id){
         this.$store.state.packId = id;
        this.$router.push({ name: 'ListWord', params: { packId: id }});
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
