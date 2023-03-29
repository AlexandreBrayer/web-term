<script lang="ts">
  import { prepender } from "../stores/stores";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let typed = "";
</script>

<div class="lastline">
  {$prepender}
  <input
    class="typed"
    type="text"
    bind:value={typed}
    on:keypress={(e) => {
      if (e.key === "Enter") {
        dispatch("typed", typed);
        typed = "";
      }
    }}
  />
</div>

<style>
  .typed {
    all: unset;
    background-color: #000;
    color: #4af626;
    border: none;
    outline: none;
    font-family: monospace;
    font-size: 1em;
    width: 100%;
    margin-left: 0.5em;
    caret-shape: block;
  }
  .lastline {
    display: flex;
    flex-direction: row;
  }
  .typed::selection {
    background-color: #4af626;
    color: #000;
  }
  .lastline::selection {
    background-color: #4af626;
    color: #000;
  }
</style>
