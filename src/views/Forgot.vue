<template>
  <div class="my-login-page">
      <section class="h-100">
      <div class="container h-100">
        <div class="row justify-content-md-center h-100">
          <div class="card-wrapper">
            <div class="brand">
              CHRS's Booking System
            </div>
            <div class="card fat">
              <div class="card-body">
                <div class="card-body">
                  <h4 class="card-title">Forgot Password</h4>
                  <form method="POST" class="my-login-validation" novalidate="">
                    <div class="form-group">
                      <label for="email" class="d-flex justify-content-between">E-Mail Address <span @click="$emit('forgotPageToggle')" style="font-size: 12px; color: #007bff; cursor: pointer">Back to Login</span></label>
                      <input id="email" type="email" class="form-control" name="email" value="" required autofocus>
                      <div class="invalid-feedback">
                        Email is invalid
                      </div>
                      <div class="form-text text-muted">
                        By clicking "Reset Password" we will send a password reset link
                      </div>
                    </div>

                    <div class="form-group m-0">
                      <button type="submit" class="btn btn-primary btn-block" @click="sendPasswordResetEmail">
                        Reset Password
                      </button>
                    </div>
                  </form>
                </div>
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
  name: 'Forgot',
  props: {
  },
  data(){
    return {
      user: null,
    };
  },
  methods: {
    sendPasswordResetEmail(){
      var auth = firebase.auth();
      var email = $('#email');
      var emailAddress = email.val();
      var $this = this;

      auth.sendPasswordResetEmail(emailAddress).then(function() {
        alert('Reset password email is sended!')
        $this.$emit('forgotPageToggle');
      }).catch(function(error) {
        alert(error.message)
      });
    },
  },
  mounted(){
    'use strict';

    $(function() {


      $("input[type='password'][data-eye]").each(function(i) {
        var $this = $(this),
          id = 'eye-password-' + i;
          // var el = $('#' + id);
          // console.log(el)

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
	height: 100%;
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
