import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let canvasLength = canvas.offsetWidth;

    let x = 0;

    let player_length = 3.0;
    let end_length = 5.0;

    let cell = 10.0;
    let side = 3.0;
    let wall = 2.0;

    let width;
    let height;
    let position;
    let rotation;
    let end;

    function draw_player()
    {
      ctx.beginPath();
      ctx.arc(x * (side + cell / 2 + (position % width) * (cell + wall)),
          x * (side + cell / 2 + Math.floor(position / width) * (cell + wall)),
          x * player_length, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#f5ff00";
      ctx.fill();
      ctx.closePath();
    }

    function draw_object(pos, length, color)
    {
      ctx.beginPath();
      ctx.rect(x * (side + cell / 2 + (pos % width) * (cell + wall) - length / 2),
          x * (side + cell / 2 + Math.floor(pos / width) * (cell + wall) - length / 2),
          x * length, x * length);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }

    function draw_wall(is_vertical, i)
    {
      if ((is_vertical && i % width === width - 1) || (!is_vertical && Math.floor(i / width) >= height - 1))
        return;

      ctx.beginPath();
      if (is_vertical)
        ctx.rect(x * (side - wall + (i % width + 1) * (cell + wall)),
          x * (side - wall / 2 + Math.floor(i / width) * (cell + wall)),
          x * wall, x * (cell + wall));
      else
        ctx.rect(x * (side - wall / 2 + (i % width) * (cell + wall)),
            x * (side - wall + Math.floor(i / width + 1) * (cell + wall)),
            x * (cell + wall), x * wall);
      ctx.fillStyle = "rgba(175,175,175,0.37)";
      ctx.fill();
      ctx.closePath();
    }

    function update()
    {
      if (width <= height)
        x = canvasLength / (2 * side - wall + (wall + cell) * height)
      else
        x = canvasLength / (2 * side - wall + (wall + cell) * width)

      ctx.beginPath();
      //ctx.clearRect(0, 0, canvasLength, canvasLength);
      ctx.rect(0, 0, x * (2 * side + width * (cell + wall) - wall), x * (2 * side + height * (cell + wall) - wall));
      ctx.fillStyle = "#5cb6b6";
      ctx.fill();
      ctx.closePath();

      for(let i = 0; i < width * height; i++)
      {
        draw_wall(true, i);
        draw_wall(false, i);
      }

      draw_object(end, end_length, "#000000");
      draw_player();

      ctx.beginPath();
      ctx.rect(0, 0, x * (2 * side + width * (cell + wall) - wall), side * x);
      ctx.rect(0, 0, side * x, x * (2 * side + height * (cell + wall) - wall));
      ctx.rect(0, x * (side + height * (cell + wall) - wall), x * (2 * side + width * (cell + wall) - wall), side * x);
      ctx.rect(x * (side + width * (cell + wall) - wall), 0, side * x, x * (2 * side + height * (cell + wall) - wall));
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.closePath();
    }

    async function update_level()
    {
      await fetch('/update_level')
          .then(response => response.json())
          .then(results => { width = results[0]; height = results[1];
            position = results[2]; rotation = results[3]; end = results[4]; update(); });
    }

    async function run_line()
    {
      await fetch('/run_line')
          .then(response => response.json())
          .then(results => {
            if (results !== null) {
              update_level();
              run_line();
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
            run_line();
          }
          else
            alert("mistake on " + results + " line");
        })
    }

    const textarea = document.getElementById("code");
    const button_run = document.getElementById("run");
    button_run.addEventListener('click', (event) => assert_program());

    update_level().then(r => r);
  }
}
