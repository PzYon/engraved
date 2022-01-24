<script lang="ts">
  import {constants} from "./constants";

  interface IMeasurement {
    dateTime: string,
    value: number
  }

  let measurements: IMeasurement[] = [];

  (async () => {
    const response = await fetch(new Request(constants.apiBaseUrl + "/Measurements?metricKey=foo_bar"));
    measurements = await response.json();
  })();
</script>

<ul>
    {#each measurements as measurement}
        <li>{measurement.dateTime}: {measurement.value}</li>
    {/each}
</ul>

<style>
</style>
