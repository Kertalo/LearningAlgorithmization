import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let canvasLength = canvas.offsetWidth;

    let x = 0;

    let player_length = 3.0;
    let block_length = 5.0;
    let end_length = 4.0;

    let cell = 10.0;
    //let side = 3.0;
    //let wall = 2.0;

    let width;
    let height;
    let position;
    let rotation;
    let end;

    let labyrinth = [];
    let blocks = [];

    let field = [1, 2, 3, 4, 5];

    function draw_player()
    {
      ctx.beginPath();
      let position_x = cell / 2 + (position % width) * cell;
      let position_y = cell / 2 + Math.floor(position / width) * cell;

      if (rotation % 2 === 0)
        ctx.rect(x * (position_x - player_length / 2),
            x * (rotation === 0 ? position_y - player_length * 1.3 : position_y),
            x * player_length, x * player_length * 1.3);
      else
        ctx.rect(x * (rotation === 3 ? position_x - player_length * 1.3 : position_x),
            x * (position_y - player_length / 2),
            x * player_length * 1.3, x * player_length);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(x * position_x, x * position_y,
          x * player_length, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#f5ff00";
      ctx.fill();
      ctx.closePath();
    }

    function draw_object(pos, length, color)
    {
      ctx.beginPath();
      ctx.rect(x * (cell / 2 + (pos % width) * cell - length / 2),
          x * (cell / 2 + Math.floor(pos / width) * cell - length / 2),
          x * length, x * length);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }

    function update()
    {
      if (width <= height)
        x = canvasLength / (cell * height)
      else
        x = canvasLength / (cell * width)

      /*ctx.beginPath();
      //ctx.clearRect(0, 0, canvasLength, canvasLength);
      ctx.rect(0, 0, x * width * cell, x * height * cell);
      ctx.fillStyle = "#5cb6b6";
      ctx.fill();
      ctx.closePath();*/

      for(let i = 0; i < labyrinth.length; i++)
        draw_object(labyrinth[i], cell, "#5cb6b6");

      for(let i = 0; i < blocks.length; i++)
        draw_object(blocks[i], block_length, "#000000");

      draw_object(end, end_length, "#ffffff");
      draw_player();

      /*ctx.beginPath();
      ctx.rect(0, 0, x * (2 * side + width * (cell + wall) - wall), side * x);
      ctx.rect(0, 0, side * x, x * (2 * side + height * (cell + wall) - wall));
      ctx.rect(0, x * (side + height * (cell + wall) - wall), x * (2 * side + width * (cell + wall) - wall), side * x);
      ctx.rect(x * (side + width * (cell + wall) - wall), 0, side * x, x * (2 * side + height * (cell + wall) - wall));
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.closePath();*/
    }

    async function update_level()
    {
      await fetch('/update_level')
        .then(response => response.json())
        .then(results => { width = results[0]; height = results[1]; position = results[2]; end = results[3];
          rotation = results[4]; labyrinth = results[5]; blocks = results[6]; update(); });
    }

    async function run_line()
    {
      await fetch('/run_line')
        .then(response => response.json())
        .then(results => {
          if (results !== null) {
            update_level();
            setTimeout(() => { run_line(); }, 500);
          }})
    }

    async function assert_program()
    {
      let text = { code: textarea.value };
      const token = document.querySelector('meta[name="csrf-token"]').content;

      await fetch('/run_program', {
        method: 'POST',
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(text)})
        .then(response => response.json())
        .then(results => {
          if (results === 0)
          {
            update_level();
            setTimeout(() => { run_line(); }, 500);
          }
          else
            alert("mistake on " + results + " line");
        })
    }

    const textarea = document.getElementById("code");
    const button_run = document.getElementById("run");
    button_run.addEventListener('click', (event) => assert_program());

    //save_labyrinth().then(r => r);

    update_level().then(r => r);

    /*async function save_labyrinth()
    {
      let labyrinth = { field: field };

      const token = document.querySelector('meta[name="csrf-token"]').content;

      await fetch('/save_labyrinth', {
        method: 'POST',
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(labyrinth)
      });
    }*/
  }
}
