<script lang="ts">

  export let line: string;

</script>

<span class="line">{line}</span>

<style>
  .line::selection {
    background-color: #4af626;
    color: #000;
  }
</style>