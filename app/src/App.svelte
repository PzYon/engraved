<script lang="ts">
	let resultMessage = "";
	let errorMessage = "";

	fetch(new Request("https://metrix-api.azurewebsites.net/salimax"))
			.then(response => response.json())
			.then(result =>  resultMessage = "From server: " + JSON.stringify(result))
			.catch(error => errorMessage = "Server error: " + JSON.stringify(error));
</script>

<main>
	<h1>Sali Max</h1>
	<div class="success">{resultMessage}</div>
	<div class="error">{errorMessage}</div>
</main>

<style>
	.success {
		color: darkgreen;
		font-weight: bold;
	}

	.error {
		color: darkred;
	}
</style>
