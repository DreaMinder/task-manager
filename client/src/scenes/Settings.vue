<template>
<transition name="fade">
  <div id="settings">
      <md-tabs md-fixed>
          <md-tab :md-label="$t('User settings')" id="cardtab">
              <md-card  v-if="user">
                 <md-layout md-gutter>
                    <md-layout md-column>
                    <md-card-header>
                        <md-card-header-text>
                          <div class="md-title">{{$t('Profile')}}</div>
                        </md-card-header-text>
                    </md-card-header>
                    <md-card-content>
                     <md-layout md-gutter>
                      <md-layout md-column>
                       <md-input-container>
                        <label>{{$t('First Name')}}</label>
                        <md-input v-model="user.firstName"></md-input>
                      </md-input-container>
                      </md-layout>
                       <md-layout md-column>
                       <md-input-container>
                        <label>{{$t('Last Name')}}</label>
                        <md-input v-model="user.lastName"></md-input>
                      </md-input-container>
                      </md-layout>
                    </md-layout>
                    <md-input-container>
                        <label>Email</label>
                        <md-input v-model="user.email"></md-input>
                    </md-input-container>


                 </md-card-content>

               </md-layout>
                <md-layout md-column>

                  <md-card-header>
                      <md-card-header-text>
                        <div class="md-title">{{$t('Picture')}}</div>
                      </md-card-header-text>
                      <mu-raised-button primary :label="$t('Save')" @click.native="save" />
                  </md-card-header>
                  <md-card-content>
                    <avatar class="md-large" :user="user" />
                     <md-input-container>
                      <label>{{$t('Your portrait')}}</label>
                      <md-file
                        v-model="user.avatar"
                        accept="image/*"
                        :disabled="imgLoading"
                        @selected="onFileUpload($event)"
                      />
                    </md-input-container>
                   </md-card-content>

               </md-layout>
              </md-layout>
            </md-card>
          </md-tab>
          <md-tab :md-label="$t('Interface settings')">
            <md-card>
              <md-card-content>
                <mu-select-field
                  :value="lang"
                  :label="$t('Language')"
                  @change="changeLang">
                  <mu-menu-item value="en" title="English" />
                  <mu-menu-item value="uk" title="Українська" />
                  <mu-menu-item value="ru" title="Русский" />
                </mu-select-field>

                 <br>
                 <small>
                   {{$t('interface-hint')}}
                 </small>
              </md-card-content>
            </md-card>
          </md-tab>
      </md-tabs>

  </div>
</transition>
</template>

<script>
import { request } from '../store';
import { mapGetters } from 'vuex';
import avatar from '../ui/avatar'

export default {
 name: 'settings',
 components: {
   avatar
 },
 methods: {
    save() {
      this.$store.dispatch('updateUser', this.user);
    },
    async onFileUpload (event) {
      this.imgLoading = true;
      var data = new FormData();
      data.append('image', event[0]);
      let result = await request.put('/images/avatar', data);
      this.user.avatar = result.data.name;
      this.imgLoading = false;
    },
    changeLang(lang){
      this.$i18n.set(lang)
      localStorage.setItem('lang', lang);
    }
  },
  data() {
    return {
      imgLoading: false
    }
  },
   computed: {
     lang(){
       return this.$i18n.locale()
     },
      ...mapGetters(['user'])
  },
  created (){
    this.$store.dispatch('getUser');
  }
}
</script>


<style scoped>

  #settings{
      background: #f3f3f3;
      margin:20px auto;
      max-width:900px;
      min-height:300px;
      box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.4);
  }

  .md-large{
    margin-bottom: 12px
  }
</style>
