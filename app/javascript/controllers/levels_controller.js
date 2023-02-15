import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    //let width = canvas.offsetWidth;
    //let height = canvas.offsetHeight;

    let width = 8;
    let height = 8;
    let player_width = 12;

    let cell = 32;
    let wall = 8;
    let position;
    let rotation;
    let end;

    function draw_player()
    {
      ctx.beginPath();
      ctx.arc(wall + cell / 2 + (position % width) * (cell + wall),
          wall + cell / 2 + Math.floor(position / height) * (cell + wall),
          player_width, 0, 2 * Math.PI, false);
      //ctx.rect(((position % width) + 1) * (cell + wall) - player_width,
      //    Math.floor(position / 8 + 1) * (cell + wall) - player_width,
      //    player_width, player_width);
      ctx.fillStyle = "#f5ff00";
      ctx.fill();
      ctx.closePath();
    }

    function draw_end()
    {
      ctx.beginPath();
      ctx.rect(wall + (end % width) * (cell + wall),
          wall + Math.floor(end / height) * (cell + wall),
          cell, cell);
      ctx.fillStyle = "#6e6e6e";
      ctx.fill();
      ctx.closePath();
    }

    function update()
    {
      ctx.beginPath();
      ctx.clearRect(0, 0, width * (cell + wall) + wall, height * (cell + wall) + wall);
      ctx.closePath();
      draw_player();
      draw_end();

      ctx.beginPath();

      ctx.rect(0, 0, wall + width * (cell + wall), wall);
      ctx.rect(0, 0, wall, wall + height * (cell + wall));
      ctx.rect(0, wall + height * (cell + wall) - wall, wall + width * (cell + wall), wall);
      ctx.rect(wall + width * (cell + wall) - wall, 0, wall, wall + height * (cell + wall));

      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.closePath();
    }

    async function update_level()
    {
      await fetch('/update_level')
          .then(response => response.json())
          .then(results => { position = results[0]; rotation = results[1]; end = results[2]; update(); });
    }

    async function run_program()
    {
      let text = { code: textarea.value };
      const token = document.querySelector('meta[name="csrf-token"]').content;

      await fetch('/run_program', {
        method: 'POST',
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(text)
      }).then(response => response.json())
          .then(results => { alert(results); })
    }

    const textarea = document.getElementById("code");
    const button_run = document.getElementById("run");
    button_run.addEventListener('click', (event) => run_program());

    update_level().then(r => r);
  }
}
