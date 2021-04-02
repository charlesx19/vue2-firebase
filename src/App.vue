<template>
  <div id="app">
    <!-- <h1>{{ "認證狀態:" + emailVerified }}</h1> -->
    <router-view v-if="!user && registerPage == false" @updateFromFirebase="updateFromFirebase" @registerPageToggle="registerPageToggle"></router-view>
    <router-view name="Register" v-if="registerPage == true" @updateFromFirebase="updateFromFirebase(user)" @registerPageToggle="registerPageToggle" @registerUidSignIn="registerUidSignIn"></router-view>
    <!-- <SignIn v-if="user" @updateFromFirebase="updateFromFirebase"></SignIn> -->
    <!-- <button @click="test2" style="position: fixed; right: 30px; bottom: 120px; z-index: 1000">Test2</button>
    <button @click="signIn" style="position: fixed; right: 30px; bottom: 90px; z-index: 1000">Sign in</button>
    <button @click="signOut" style="position: fixed; right: 30px; bottom: 60px; z-index: 1000">Sign out</button>
    <button @click="test" style="position: fixed; right: 30px; bottom: 30px; z-index: 1000">Test</button> -->
    <div class="emailVerified" v-if="emailVerified == false">
      <div class="mainInfo show" ref="mainInfo">
        This account isn't Verified, make sure you already check validation Email.
      </div>
      <div class="resendValidationEmail show" ref="resendValidationEmail" @click="resendValidationEmail">Send validation email</div>
      <div class="sendSuccess" ref="sendSuccess">
        Validation email is sended to <span style="font-size: 16px; font-weight: 600; color: #007DDB">{{ user.email }}</span>!
        After you checked the validation email,
        reflesh this page, thx.
      </div>
      <button @click="signOut" class="btn btn-danger btn-sm mt-3">Sign out</button>
    </div>
    <div class="main-info" v-if="user && user.emailVerified == true">
      <div id="header" class="">
        <div class="container">
          <h1>Booking System</h1>
          <span class="text-muted">by vue2-cli with firebase RTDB</span>
          <div class="account">
            <span>哈囉，</span>
            <span style="font-size: 16px; font-weight: 400;">{{ " " + user.displayName }}</span>
            <span class="signOut ml-3" @click="signOut">登出</span>
          </div>
        </div>
      </div>
      <div id="content">
        <div class="saveSuccess">Save Success!</div>
        <div class="container">
          <div class="store-title">
            <h4>店舖名稱</h4>
            <span class="hr-line"></span>
          </div>
        </div>

        <!-- storeArea -->
        <div class="container storeArea">
          <div class="row stores no-gutters">
            <a class="col-12 col-md-6 col-lg-4 col-xl-3 px-2 mb-3 store-item" v-for="item in store" @click="showDetail" :key="item.id" href="#titleAnchor">
              <div class="delete" @click.stop.prevent="deleteStore">×</div>
              <div class="card" :class="{full: item.emptyTable == 0}" :data-store="item.name">
                <img src="https://source.unsplash.com/640x480/?restaurant" class="card-img-top" alt="storeImg">
                <div class="card-body">
                  <h5 class="card-title">{{ item.name }}</h5>
                  <p class="card-text">總桌數： {{ item.tables.length }}</p>
                  <p class="card-text">空桌數： {{ item.emptyTable }}</p>
                </div>
              </div>
            </a>
            <div class="col-12 px-2 mb-3">
              <div class="card addRestaurant" data-toggle="modal" data-target="#storeModal" data-backdrop="static">
                <!-- Click trigger store modal -->
                ADD <br> RESTAURANT
              </div>
            </div>
          </div>
        </div>

        <div class="container" v-if="isShowDetail">
          <div class="store-title">
            <span class="hr-line bottom"></span>
          </div>
        </div>

        <!-- store bookingDetail -->
        <div id="titleAnchor" class="container bookingDetail mt-5" v-if="isShowDetail">
          <h3 class="title" :class="{full: store[storeName].emptyTable == 0}">{{storeName + "店"}}</h3>
          <button class="saveButton" @click="updateInfo">save</button>

          <div class="row no-gutters">
            <div class="col-12 content">
              <div class="row items no-gutters">
                <div class="col-12 col-md-6 col-lg-4 col-xl-3 item" v-for="table in store[storeName].tables" :key="table.no" :class="{full: table.isBooking}">
                  <div class="info">
                    <div class="info-title d-flex">
                      <h6>{{ table.no + "號桌" }} / {{ "座位數" + table.bkInfo.seatCount }}</h6>
                      <div class="edit-box">
                        <span class="deleteButton" :class="{ show: table.no == store[storeName].tables.length }" @click="deleteBooking(table)">delete</span>
                        <span class="clearButton" @click="clearBooking(table)">clear</span>
                      </div>
                    </div>
                    <ul>
                      <li class="name">
                        <span class="title col-4 col-md-5">姓名</span>
                        <input class="col-7" type="text" v-model="table.bkInfo.name">
                      </li>
                      <li class="seat">
                        <span class="title col-4 col-md-5">訂位數</span>
                        <input class="seat col-7" type="number" v-model.number="table.bkInfo.seat">
                      </li>
                      <li class="kidSeat">
                        <span class="title col-4 col-md-5">兒童座椅</span>
                        <input class="col-7" type="number" v-model="table.bkInfo.kidSeat">
                      </li>
                      <li class="date">
                        <span class="title col-4 col-md-5">日期</span>
                        <input class="col-7" type="date" v-model="table.bkInfo.date">
                      </li>
                      <li class="time">
                        <span class="title col-4 col-md-5">時間</span>
                        <input class="col-7" type="time" v-model="table.bkInfo.time">
                      </li>
                      <li class="phone">
                        <span class="title col-4 col-md-5">電話</span>
                        <input class="col-7" type="text" v-model="table.bkInfo.phone">
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Click trigger table modal -->
                <div class="col-12 col-md-6 col-lg-4 col-xl-3 item addTable" data-toggle="modal" data-target="#tableModal" data-backdrop="static">
                  <div class="info"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- store Modal -->
        <div class="modal fade" id="storeModal" tabindex="-1" role="dialog" aria-labelledby="storeModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="storeModalLabel">Add new store</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="createStore">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ul class="input-box">
                    <li class="col-12">store name:<input type="text" v-model="storeInfoTemp.name"></li>
                    <li class="col-12">tables:<input type="number" v-model.number="tablesTemp"></li>
                    <li class="col-12" v-for="(seat, index) in tablesTemp" :key="index">{{ seat }}號桌
                      <input type="number" v-model.number="seatsTemp[seat-1]">
                    </li>
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="createStore">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <!-- table Modal -->
        <div class="modal fade" id="tableModal" tabindex="-1" role="dialog" aria-labelledby="tableModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="storeModalLabel">Add new table</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeTableModal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ul class="input-box">
                  <li class="name">
                    <span class="title col-4">姓名</span>
                    <input class="col-8" type="text" v-model="newBkInfo[0].bkInfo.name">
                  </li>
                  <li class="seat">
                    <span class="title col-4">訂位數</span>
                    <input class="seat col-8" type="number" v-model.number="newBkInfo[0].bkInfo.seat">
                  </li>
                  <li class="seatCount">
                    <span class="title col-4">桌座位數</span>
                    <input class="seat col-8" type="number" v-model.number="newBkInfo[0].bkInfo.seatCount">
                  </li>
                  <li class="kidSeat">
                    <span class="title col-4">兒童座椅</span>
                    <input class="col-8" type="number" v-model="newBkInfo[0].bkInfo.kidSeat">
                  </li>
                  <li class="date">
                    <span class="title col-4">日期</span>
                    <input class="col-8" type="date" v-model="newBkInfo[0].bkInfo.date">
                  </li>
                  <li class="time">
                    <span class="title col-4">時間</span>
                    <input class="col-8" type="time" v-model="newBkInfo[0].bkInfo.time">
                  </li>
                  <li class="phone">
                    <span class="title col-4">電話</span>
                    <input class="col-8" type="text" v-model="newBkInfo[0].bkInfo.phone">
                  </li>
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeTableModal">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="createTable">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <draggable class="row" v-model="users" group="people" @start="drag=true" @end="updateSort">
  <div class="col item" v-for="element in users" :key="element.id">
    <input class="title" v-model="element.name" @blur="updateTitle">
    <div class="desc">Lorem ipsum dolor sit amet.</div>
  </div>
</draggable> -->

<script>
import { db } from './db'
import firebase from 'firebase/app'
// import SignIn from './components/SignIn'
// import draggable from 'vuedraggable'

export default {
  name: 'App',
  components: {
    // draggable,
    // SignIn,
  },
  data(){
    return {
      AIid: 1,
      tablesTemp: 0,
      seatsTemp: [],
      emailVerified: false,
      uid: null,
      user: null,
      registerPage: false,
      storeInfoTemp: [
        {
          id: 1,
          name: "",
          tables: []
        }
      ],
      store: [],
      storeName: "",
      documents: [],
      isShowDetail: false,
      newBkInfo: [{
        bkInfo: {
          name: "",
          seat: 0,
          seatCount: 0,
          tableNum: 0,
          kidSeat: 0,
          date: this.getToday(),
          time: "",
          phone: "",
        },
        isBooking: null,
        no: null
      }],
      drag: false,
    }
  },
  methods: {
    test(){
      // console.log(firebase.auth().currentUser)
      // console.log(this.user.uid)
      var user = firebase.auth().currentUser;

      user.sendEmailVerification().then(function() {
        // Email sent.
      }).catch(function(error) {
        console.log(error)
      });
    },
    test2(){
    var user = firebase.auth().currentUser;
     console.log(user)
    },
    signIn(){
      firebase.auth().signInWithEmailAndPassword('charlesx106@gmail.com', '19870118')
        .then((userCredential) => {
          alert('Sign in success!')
          // console.log(userCredential)
          this.user = userCredential.user;
        })
        .then(() => {
          this.updateFromFirebase();
        })
        .catch((error) => {
          console.log(error.message);
          alert('Sign in error!')
        });
    },
    signOut(){
      let result = confirm(`確定要登出${this.user.email}嗎?`);
      if (result) {
        firebase.auth().signOut()
        .then(() => {
            alert('Sign out success!')
            // var user = firebase.auth().currentUser;
            // console.log(user)
            this.resetStore();
            this.uid = null;
        })
        .catch((error) => {
          console.log(error.message);
          alert('Sign out error!')
        });
      }
    },
    registerPageToggle(){
      this.registerPage = !this.registerPage;
    },
    registerUidSignIn(user){
      this.user = user;
      this.uid = user.uid;
    },
    resendValidationEmail(){
      var user = firebase.auth().currentUser;
      var $this = this;
      user.sendEmailVerification().then(function() {
        $this.$refs.mainInfo.classList.remove('show');
        $this.$refs.resendValidationEmail.classList.remove('show');
        $this.$refs.sendSuccess.classList.add('show');
      }).catch(function(error) {
        alert(error)
      });
    },
    updateSort(){
      this.drap = false;
      var newSort = this.users;
      db.ref("/users/").set(newSort)
    },
    getToday(){
      let d = new Date();
      let y = d.getFullYear();
      let m = "0" + parseInt(d.getMonth() + 1);
      let date = "0" + d.getDate();
      return y + "-" + m.slice(-2) + "-" + date.slice(-2);
      // console.log(y, m.slice(-2), date.slice(-2));
    },
    updateInfo(){
      // 送出更新前判斷空桌數，將emptyTable歸零
      this.store[this.storeName].emptyTable = 0;
      
      
      for (let i=0; i<this.store[this.storeName].tables.length; i++) {
        // 判斷seat有沒有大於0，有的話檢查其他欄位是否正確，通過後，isBooking為true
        if (this.store[this.storeName].tables[i].bkInfo.seat > 0) {
          this.store[this.storeName].tables[i].bkInfo.name = (this.store[this.storeName].tables[i].bkInfo.name).trim();
          this.store[this.storeName].tables[i].bkInfo.phone = (this.store[this.storeName].tables[i].bkInfo.phone).trim();
          if (this.store[this.storeName].tables[i].bkInfo.name == "") {
            alert('訂位姓名不可為空！')
            this.store[this.storeName].tables[i].bkInfo.seat = 0;
          } else if (this.store[this.storeName].tables[i].bkInfo.date == "") {
            alert('訂位日期不可為空！')
            this.store[this.storeName].tables[i].bkInfo.seat = 0;
          } else if (this.store[this.storeName].tables[i].bkInfo.time == "") {
            alert('訂位時間不可為空！')
            this.store[this.storeName].tables[i].bkInfo.seat = 0;
          } else if (this.store[this.storeName].tables[i].bkInfo.phone == "" || this.store[this.storeName].tables[i].bkInfo.phone.length != 10) {
            alert('聯絡電話格式有誤！')
            this.store[this.storeName].tables[i].bkInfo.seat = 0;
            this.store[this.storeName].tables[i].bkInfo.phone = "";
          } else {
            this.store[this.storeName].tables[i].isBooking = true;
          }
        } else {
          this.store[this.storeName].tables[i].isBooking = false;
        }
        // 判斷isBooking是否為false，是的話空桌數(emptyTable)+1
        if (this.store[this.storeName].tables[i].isBooking == false) {
          this.store[this.storeName].emptyTable += 1;
        }
      }

      var newInfo = this.store[this.storeName];
      var url = `${this.user.uid}/store/${this.storeName}`;
      db.ref(url).set(newInfo);
      let saveSuccess = document.getElementsByClassName('saveSuccess');
      saveSuccess[0].classList.add('show');
      setTimeout(() => {
        saveSuccess[0].classList.remove('show');
      },1000)
    },
    showDetail(e){
      this.isShowDetail = true;
      this.storeName = e.target.closest('.card').dataset.store;
      // console.log(this.storeName);
    },
    createStore(){
      if (this.storeInfoTemp.name == undefined) {
        this.storeInfoTemp.name = "";
      }
      let name = this.storeInfoTemp.name;
      let final = false;

      if (name.trim() != "") {
        let checkArr = [];

        checkArr.push(name.includes('.'));
        checkArr.push(name.includes('#'));
        checkArr.push(name.includes('$'));

        final = checkArr.every( x => {
          return x == false
        })
      }
      

      if (final) {
        let data = {
            id: this.AIid,
            name: this.storeInfoTemp.name,
            tables: [],
            emptyTable: 0,
        };
        for (let i=0; i < this.tablesTemp; i++) {
          let tables = 
              {
                no: i+1,
                isBooking: false,
                bkInfo: {
                  name: "",
                  seat: 0,
                  seatCount: 0,
                  kidSeat: 0,
                  date: this.getToday(),
                  time: "",
                  phone: ""
                }
              };  
          data.tables.push(tables);
          // console.log(this.seatsTemp[i])

          if (data.tables[i].isBooking == false) {
            data.emptyTable += 1;
          }
          if (this.seatsTemp[i] < 1) {
            alert('座位數最小值為2')
            data.tables[i].bkInfo.seatCount = 2;
          } else {
            data.tables[i].bkInfo.seatCount = this.seatsTemp[i];
          }
        }


        this.AIid += 1;
        // console.log(data)
        let url = `${this.user.uid}/store/${data.name}`;
        db.ref(url).set(data);
        db.ref('/AIid/').set(this.AIid);
        this.closeModal();
      } else {
        alert("店鋪名稱不可空白或包含 ' . ' 、 ' # ' 、 ' $ ' ，請重新輸入")
        this.closeModal();
      }

    },
    createTable(){
      let newTable = this.newBkInfo[0];
      let no = this.store[this.storeName].tables.length;
      newTable.no = no+1;

      if (newTable.bkInfo.seatCount > 0) {
        if (newTable.bkInfo.seat > 0) {
          newTable.isBooking = true;
          this.store[this.storeName].tables.push(newTable);
          this.updateInfo();
        } else {
          this.store[this.storeName].tables.push(newTable);
          this.updateInfo();
        }
      } else {
        alert('座位數不可為0!')
      }

      this.closeTableModal();
    },
    closeModal(){
      this.storeInfoTemp = [
        {
          id: 1,
          name: "",
          tables: []
        }
      ];
      this.tablesTemp = 0;
      this.seatsTemp = [];
    },
    closeTableModal(){
      this.newBkInfo[0].bkInfo.name = "";
      this.newBkInfo[0].bkInfo.seat = 0;
      this.newBkInfo[0].bkInfo.seatCount = 0;
      this.newBkInfo[0].bkInfo.kidSeat = 0;
      this.newBkInfo[0].bkInfo.date = this.getToday();
      this.newBkInfo[0].bkInfo.time = "";
      this.newBkInfo[0].bkInfo.phone = "";
    },
    clearBooking(tables) {
      let result = confirm("要清除訂位資訊嗎？(不可回復)");
      if (result) {
        for (let i=0; i<this.store[this.storeName].tables.length; i++) {
          if (this.store[this.storeName].tables[i].no == tables.no) {
            this.store[this.storeName].tables[i].isBooking = false;
            this.store[this.storeName].tables[i].bkInfo = {
              name: "",
              seat: 0,
              seatCount: this.store[this.storeName].tables[i].bkInfo.seatCount,
              kidSeat: 0,
              date: this.getToday(),
              time: "",
              phone: ""
            }
          }
        }
      this.updateInfo();
      }
    },
    deleteBooking(tables){
      let result = confirm("要刪除此筆訂位嗎？(不可回復)");
      if (result) {
        for (let i=0; i<this.store[this.storeName].tables.length; i++) {
          if (this.store[this.storeName].tables[i].no == tables.no) {
            let url = `${this.user.uid}/store/${this.storeName}/tables/${i}`
            db.ref(url).remove();
            // console.log(url)
          }
        }
        this.updateInfo();
      }
    },
    deleteStore(e){
      let result = confirm('要刪除這間分店嗎？(不可回復)');
      if (result) {
        let el = e.target;
        let targetStore = el.nextElementSibling.dataset.store;
        db.ref(`${this.user.uid}/store/${targetStore}`).remove();
      }
      let saveSuccess = document.getElementsByClassName('saveSuccess');
      saveSuccess[0].classList.add('show');
      setTimeout(() => {
        saveSuccess[0].classList.remove('show');
      },1000);
      this.isShowDetail = false;
      this.updateFromFirebase();
    },
    updateFromFirebase(){
      // console.log(this.user.uid);
      db.ref(`${this.user.uid}/store/`).on('value', (snapshot) => {
          var data = snapshot.val();
          this.store = data;
      });
      db.ref('/AIid/').on('value', (snapshot) => {
          var data = snapshot.val();
          this.AIid = data;
      });
      // this.updateFromFirebaseTwo();
    },
    resetStore(){
      this.store = null;
      this.isShowDetail = false;
    },
  },
  created(){
    var $this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $this.uid = user.uid;
        $this.emailVerified = user.emailVerified;
        $this.user = user;
        $this.updateFromFirebase();
      } else {
        $this.uid = null;
        $this.emailVerified = null;
        $this.user = null;
      }
    });
    
  },
  mounted(){
    // this.updateFromFirebase();
  },
  updated(){
    // this.updateFromFirebase();
  },
  watch: {

  },
  firebase: {
    documents: db.ref('documents'),
  },

}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  list-style: none;
}


html {
  scroll-behavior: smooth;
}

body {
  position: relative;
}

.emailVerified {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  .mainInfo {
    display: none;
    font-size: 18px;
    font-weight: 300;
    &.show {
      display: block;
    }
  }
  .resendValidationEmail {
    display: none;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
    color:#007DDB;
    cursor: pointer;
    &.show {
      display: block;
    }
  }
  .sendSuccess {
    display: none;
    &.show {
      display: block;
    }
  }
}

#header {
  
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 20px 0;
    color: #555;
  }
  h1 {
    margin-right: 20px;
  }
  span {
    font-size: 12px;
  }
  .account {
    position: absolute;
    right: 20px;
    .signOut {
      padding: 3px 6px;
      background: #D82735;
      font-size: 12px;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
    }
  }
}

#content {
  position: relative;
  .saveSuccess {
    position: fixed;
    display: block;
    opacity: 0;
    left: 50%;
    top: 50%;
    width: 140px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #00c44b;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    border-radius: 5px;
    z-index: 999;
    transform: translate(-50%, -50%) scale(0);
    transition: .3s all ease-in;
    &.show {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
  .store-title {
    display: flex;
    align-items: center;
    margin: 0 5px 15px 0;
    color: #555;
    h4 {
      margin: 0;
      font-size: 18px;
    }
    .hr-line {
      margin-left: 15px;
      flex-grow: 1;
      height: 2px;
      background: #555;
      &.bottom {
        margin: 0;
        margin-top: 30px;
      }
    }
  }
  .storeArea {
  }
  .stores {
    a {
      text-decoration: none;
      &:hover {
        text-decoration: none;
      }
    }
    .store-item {
      position: relative;
      .delete {
        position: absolute;
        right: 25px;
        top: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        line-height: 27px;
        font-size: 26px;
        font-weight: 700;
        background: rgba(255, 255, 255, .9);
        opacity: 0;
        transform: translateX(20px);
        transition: all .3s ease-in;
        z-index: 999;
      }
      &:hover {
        .delete {
          opacity: 1;
          transform: translateX(0px);
        }
        .card {
          box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }
      }
    }
  }

  .card {
    height: 340px;
    cursor: pointer;
    transition: .3s all ease-in;
    img {
      height: 194px;
      transition: .3s all ease-in;
    }
    &.full {
      border: 1px solid #D82735;
      .card-title,
      .card-text {
        color: #D82735;
      }
    }
    &.hide {
      height: 140px;
      img {
        height: 0px;
      }
    }
  }
  .card.addRestaurant {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: 800;
    font-size: 20px;
    color: #aaa;
    transition: .3s all ease-in;
    &.hide {
      height: 140px;
    }
  }
}

.addTable {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    width: 96.5%;
    height: 100%;
    min-height: 223px;
    border: 1px solid #aaa;
    &:after {
      content: "ADD TABLE";
      font-size: 24px;
      font-weight: 800;
      color: #aaa;
    }
  }
}

#storeModal,
#tableModal {
  .modal-body {
    .input-box {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-right: 10px;
        input {
          width: 75%;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button,
          &::-webkit-calendar-picker-indicator {
            -webkit-appearance: none;
            display: none;
            margin: 0;
          }
        }
      }
    }
  }
}

.bookingDetail {
  position: relative;
  .saveButton {
    position: absolute;
    padding: 5px 0;
    right: 25px;
    top: 15px;
    width: 100px;
    border: none;
    background: #007DDB;
    color: #fff;
    letter-spacing: 2px;
  }
  h3.title {
    padding: 15px 0;
    margin: 0 10px 10px 10px;
    color: #007DDB;
    border-bottom: 2px solid #007DDB;
    &.full {
      color: #D82735;
      border-bottom: 2px solid #D82735;
    }
  }
  .items {
    margin: 0;
    padding: 0 5px;
  }
  .item {
    display: flex;
    flex-direction: column;
    .info {
      position: relative;
      margin: 10px 5px;
      height: fit-content;
      flex-grow: 1;
      border: 1px solid #007DDB;
      overflow: hidden;
      &::before {
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: 4px solid #007DDB;
        opacity: 0;
        z-index: -10;
        transition: .2s all ease-in;
      }
      &:hover {
        &::before {
          opacity: 1;
        }
      }
    }
    .info-title {
      padding: 10px 10px;
      justify-content: space-between;
      align-items: center;
      h6 {
        margin: 0;
        padding: 5px 0;
        width: 80%;
        color: #fff;
        background: #007DDB;
      }
      .edit-box {
        display: flex;
        flex-direction: column;
      }
      .clearButton {
        display: inline-block;
        width: 20%;
        height: 100%;
        font-size: 12px;
        color: #007DDB;
        cursor: pointer;
      }
      .deleteButton {
        display: none;
        width: 20%;
        height: 100%;
        font-size: 12px;
        color: #D82735;
        cursor: pointer;
        &.show {
          display: inline-block;
        }
      }
    }
    li {
      display: flex;
      padding: 0 15px;
      margin: 5px 0;
      .title {
        text-align: right;
        font-size: 14px;
      }
      span {
        color: #007DDB;
      }
    }
    input {
      border: none;
      background: #007DDB;
      font-size: 12px;
      color: #fff;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button,
      &::-webkit-calendar-picker-indicator {
        -webkit-appearance: none;
        display: none;
        margin: 0;
      }
      &:focus {
        outline-color: #7ac5ff;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, .7);
      }
    }
  }
  .item.full {
    .info {
      border: 1px solid #D82735;
      &::before {
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: 4px solid #D82735;
        opacity: 0;
        z-index: -10;
        transition: .2s all ease-in;
      }
      &:hover {
        &::before {
          opacity: 1;
        }
      }
    }
    .info-title {
      h6 {
        background: #D82735;
      }
      .clearButton {
        color: #D82735;
      }
    }
    li {
      span {
        color: #D82735;
      }
    }
    input {
      background: #D82735;
      &:focus {
        outline-color: #ff8589;
      }
    }
  }
}
</style>

// -webkit-calendar-picker-indicator {
//     display: none;
//     -webkit-appearance: none;
// }
