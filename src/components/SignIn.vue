<template>
  <div class="my-login-page">
      <section class="h-100">
      <div class="container h-100">
        <div class="row justify-content-md-center h-100">
          <div class="card-wrapper">
            <div class="brand">
              <img src="../assets/logo.png" alt="logo">
            </div>
            <div class="card fat">
              <div class="card-body">
                <h4 class="card-title">Login</h4>
                <form method="POST" class="my-login-validation" novalidate="">
                  <div class="form-group">
                    <label for="email">E-Mail Address</label>
                    <input id="email" type="email" class="form-control" name="email" value="" required autofocus>
                    <div class="invalid-feedback">
                      Email is invalid
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="password">Password
                      <a href="forgot.html" class="float-right">
                        Forgot Password?
                      </a>
                    </label>
                    <input id="password" type="password" class="form-control" name="password" required data-eye>
                      <div class="invalid-feedback">
                        Password is required
                      </div>
                  </div>

                  <div class="form-group">
                    <div class="custom-checkbox custom-control">
                      <input type="checkbox" name="remember" id="remember" class="custom-control-input">
                      <label for="remember" class="custom-control-label">Remember Me</label>
                    </div>
                  </div>

                  <div class="form-group m-0">
                    <button type="submit" class="btn btn-primary btn-block" @click="signInAction">
                      Login
                    </button>
                  </div>
                  <div class="mt-4 text-center">
                    Don't have an account? <a href="Register">Create One</a>
                  </div>
                </form>
              </div>
            </div>
            <div class="footer">
              Copyright &copy; 2017 &mdash; Your Company 
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import $ from 'jquery'
import firebase from 'firebase/app'


export default {
  name: 'SignIn',
  props: {
  },
  emits: ['updateFormFirebase'],
  data(){
    return {
      user: null,
    };
  },
  methods: {
    signInAction(){
      let email = $('#email');
      let password = $('#password');
      firebase.auth().signInWithEmailAndPassword(email.val(), password.val())
      .then((userCredential) => {
          alert('Sign in success!')
          // console.log(userCredential)
          this.user = userCredential.user;
          // this.updateFromFirebase();
      })
      .then( () => {
        this.$store.commit('signInUid', this.user);
        this.$emit('updateFromFirebase');
      })
      .catch((error) => {
        // console.log(error.message)
        alert(error.message)
      });

      // alert("hi")
    },
  },
  mounted(){
    'use strict';

    $(function() {


      $("input[type='password'][data-eye]").each(function(i) {
        var $this = $(this),
          id = 'eye-password-' + i;
          var el = $('#' + id);
          console.log(el)

        $this.wrap($("<div/>", {
          style: 'position:relative',
          id: id
        }));

        $this.css({
          paddingRight: 60
        });
        $this.after($("<div/>", {
          html: 'Show',
          class: 'btn btn-primary btn-sm',
          id: 'passeye-toggle-'+i,
        }).css({
            position: 'absolute',
            right: 10,
            top: ($this.outerHeight() / 2) - 12,
            padding: '2px 7px',
            fontSize: 12,
            cursor: 'pointer',
        }));

        $this.after($("<input/>", {
          type: 'hidden',
          id: 'passeye-' + i
        }));

        var invalid_feedback = $this.parent().parent().find('.invalid-feedback');

        if(invalid_feedback.length) {
          $this.after(invalid_feedback.clone());
        }

        $this.on("keyup paste", function() {
          $("#passeye-"+i).val($(this).val());
        });
        $("#passeye-toggle-"+i).on("click", function() {
          if($this.hasClass("show")) {
            $this.attr('type', 'password');
            $this.removeClass("show");
            $(this).removeClass("btn-outline-primary");
          }else{
            $this.attr('type', 'text');
            $this.val($("#passeye-"+i).val());				
            $this.addClass("show");
            $(this).addClass("btn-outline-primary");
          }
        });
      });

      $(".my-login-validation").submit(function(e) {
        var form = $(this);
            if (form[0].checkValidity() === false) {
              e.preventDefault();
              e.stopPropagation();
              form.addClass('was-validated');
            } else {
              e.preventDefault();
              this.signInAction();
            }
      });
    });
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  text-align: left;
}

html,.my-login-page {
	height: 100%;
}

div.my-login-page {
	background-color: #f7f9fb;
	font-size: 14px;
}

.my-login-page .brand {
	width: 90px;
	height: 90px;
	overflow: hidden;
	border-radius: 50%;
	margin: 40px auto;
	box-shadow: 0 4px 8px rgba(0,0,0,.05);
	position: relative;
	z-index: 1;
}

.my-login-page .brand img {
	width: 100%;
  position: relative;
  top: 10px;
}

.my-login-page .card-wrapper {
	width: 400px;
}

.my-login-page .card {
	border-color: transparent;
	box-shadow: 0 4px 8px rgba(0,0,0,.05);
}

.my-login-page .card.fat {
	padding: 10px;
}

.my-login-page .card .card-title {
	margin-bottom: 30px;
}

.my-login-page .form-control {
	border-width: 2.3px;
}

.my-login-page .form-group label {
	width: 100%;
}

.my-login-page .btn.btn-block {
	padding: 12px 10px;
}

.my-login-page .footer {
	margin: 40px 0;
	color: #888;
	text-align: center;
}

@media screen and (max-width: 425px) {
	.my-login-page .card-wrapper {
		width: 90%;
		margin: 0 auto;
	}
}

@media screen and (max-width: 320px) {
	.my-login-page .card.fat {
		padding: 0;
	}

	.my-login-page .card.fat .card-body {
		padding: 15px;
	}
}

</style>
