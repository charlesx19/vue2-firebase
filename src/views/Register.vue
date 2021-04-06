<template>
	<div class="my-login-page">
	<section class="">
			<div class="container">
				<div class="row justify-content-md-center">
					<div class="card-wrapper">
						<div class="brand">
							CHRS's Booking System
						</div>
						<div class="card fat">
							<div class="card-body">
								<h4 class="card-title">Register</h4>
								<form method="POST" class="my-login-validation" novalidate="">
									<div class="form-group">
										<label for="name">Name</label>
										<input id="name" type="text" class="form-control" name="name" required autofocus>
										<div class="invalid-feedback">
											What's your name?
										</div>
									</div>

									<div class="form-group">
										<label for="email">E-Mail Address</label>
										<input id="email" type="email" class="form-control" name="email" required>
										<div class="invalid-feedback">
											Your email is invalid
										</div>
									</div>

									<div class="form-group">
										<label for="password">Password</label>
										<input id="password" type="password" class="form-control" name="password" required data-eye>
										<div class="invalid-feedback">
											Password is required
										</div>
									</div>

									<div class="form-group">
										<div class="custom-checkbox custom-control">
											<input type="checkbox" name="agree" id="agree" class="custom-control-input" required="">
											<label for="agree" class="custom-control-label">I agree to the <a href="#">Terms and Conditions</a></label>
											<div class="invalid-feedback">
												You must agree with our Terms and Conditions
											</div>
										</div>
									</div>

									<div class="form-group m-0">
										<button type="submit" class="btn btn-primary btn-block text-center" @click="registerUser">
											Register
										</button>
									</div>
									<div class="mt-4 text-center">
										Already have an account? <a class="toggleButton" @click="$emit('registerPageToggle')">Login</a>
									</div>
								</form>
							</div>
						</div>
						<div class="footer">
							Copyright &copy; 2021 &mdash; CHRS?!
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
  name: 'Register',
  props: {
  },
  emits: ['registerUidSignIn'],
  data(){
    return {
      user: null,
    };
  },
  methods: {
   registerUser(){
     let name = $('#name');
     let email = $('#email');
     let password = $('#password');
     var $this = this;
     firebase.auth().createUserWithEmailAndPassword(email.val(), password.val())
      .then((userCredential) => {
        // Signed in 
        alert('Register success!')
        $this.user = userCredential.user;
      })
      .then( () => {
        var userInfo = firebase.auth().currentUser;
        userInfo.updateProfile({
            displayName: name.val()
        }) 
      })
      .then( () => {
        $this.$emit('registerUidSignIn', $this.user);
        $this.$emit('registerPageToggle');
      })
      .then( () => {
        $this.$emit('updateFromFirebase');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });
   },
  },
  mounted(){
    'use strict';

    $(function() {

      $("input[type='password'][data-eye]").each(function(i) {
        var $this = $(this),
          id = 'eye-password-' + i;
          // el = $('#' + id);

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
	height: auto;
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}

div.my-login-page {
	background-color: #f7f9fb;
	font-size: 14px;
}

.my-login-page .brand {
	position: relative;
	width: 100%;
	height: 90px;
	overflow: hidden;
	/* border-radius: 50%; */
  border-top: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
	margin: 40px auto;
	/* box-shadow: 0 4px 8px rgba(0,0,0,.05); */
  text-align: center;
  line-height: 90px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
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

.toggleButton {
  cursor: pointer;
  color: #007bff;
}

.toggleButton:hover {
  text-decoration: none;
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
