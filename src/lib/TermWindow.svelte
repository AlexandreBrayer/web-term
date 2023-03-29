<script lang="ts">
  import TermLine from "./TermLine.svelte";
  import LastLine from "./LastLine.svelte";
  import { prepender } from "../stores/stores";
  import { command } from "../utils/Commands";
  let lines = [
    "Hello, world!",
    "This is a terminal window.",
    "It's not very useful, but it's fun to play with.",
    "You can type in it, and it will echo back what you type.",
    "Try it out!",
  ];
</script>

<div class="terminal">
  {#each lines as line}
    <span class="line">
      {$prepender}
      <TermLine {line} />
    </span>
  {/each}
  <LastLine
    on:typed={(e) => {
      lines = [...lines, e.detail];
      const commandreturn = command(e.detail);
      if (commandreturn.output !== "") {
        lines = [...lines, command(e.detail).output];
      }
    }}
  />
</div>

<style>
  .terminal {
    background-color: #000;
    color: #4af626;
    font-family: monospace;
    font-size: 1.2em;
    min-height: 100vh;
    width: 100vw;
    padding: 1em;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box; /* Opera/IE 8+ */

    display: flex;
    flex-direction: column;
    line-height: 1.2em;
  }
  .line::selection {
    background-color: #4af626;
    color: #000;
  }
</style>
