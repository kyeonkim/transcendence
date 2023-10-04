<script>
	const handleLogin = () => {
		//api call to login
	  alert('Login successful!');
	}
</script>
  
  <div class="login-container">
	<h1>Login Page</h1>
	<button on:click={handleLogin}>Login</button>
  </div>
  
  <style>
	.login-container {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  height: 100vh;
	}
  </style>
  