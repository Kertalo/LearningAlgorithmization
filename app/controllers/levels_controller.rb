require 'json'

class LevelsController < ApplicationController

  @@id = 0

  $width = 0
  $height = 0
  $start = 0
  $end = 0
  $rotation = 0
  $labyrinth = []
  $blocks = []

  $code = []
  $is_run = false

  def index
    @level = Level.all
  end

  def levels

  end

  def update_values
    @level = Level.find(@@id)
    $width = @level.width
    $height = @level.height
    $start = @level.start
    $end = @level.end
    $rotation = @level.rotation
    $labyrinth = JSON.parse(@level.labyrinth)
    $blocks = JSON.parse(@level.blocks)
  end

  def find_new_position(position)
    if $rotation % 2 == 0
      if $rotation == 0
        position -= position / $width == 0 ? 0 : $width
      else
        position += position / $width == $height - 1 ? 0 : $width
      end
    else
      if $rotation == 1
        position += position % $width == $width - 1 ? 0 : 1
      else
        position -= position % $width == 0 ? 0 : 1
      end
    end
    position
  end

  def forward
    new_position = find_new_position($start)

    if $labyrinth.include? new_position
      if $blocks.include? new_position
        block_new_position = find_new_position(new_position)
        if block_new_position != new_position and $labyrinth.include? block_new_position
          block_index = $blocks.find_index new_position
          puts block_index
          $blocks[block_index] = block_new_position
          $start = new_position
        end
      else
         $start = new_position
      end
    end
  end

  def run_line
    up_line = $code[0]
    case up_line
    when 130..256 then #forward(...)
      forward
      $code[0] = $code[0] - 1
    when 129 then #forward
      forward
      $code = $code[1..$code.length-1]
    when 0 then #leftRotate
      $rotation = ($rotation + 3) % 4
      $code = $code[1..$code.length-1]
    when 1 then #rightRotate
      $rotation = ($rotation + 1) % 4
      $code = $code[1..$code.length-1]
    else
      $is_run = false
      $code = []
    end
    render json: up_line
  end

  def run_program
    unless $is_run
      $is_run = true
      $code = []
      update_values

      text_code = params[:code].split(/\r?\n/)
      mistake_index = 0
      i = 1
      text_code.each do |line|
        unless /^forward\(\d*\);$/.match?(line) or /^leftRotate\(\);$/.match?(line) or /^rightRotate\(\);$/.match?(line)
          mistake_index = i
          break
        end
        i += 1
      end
      if mistake_index == 0
        0.upto text_code.length - 1 do |j|
          line = text_code[j].match(/\((?<argument>.*)\);/)
          if line[:argument] == ""
            if text_code[j] == "leftRotate();"
              $code[j] = 0
            else
              if text_code[j] == "rightRotate();"
                $code[j] = 1
              else
                $code[j] = 129
              end
            end
          else
            $code[j] = 128 + line[:argument].to_i
          end
        end
      end
      render json: mistake_index
    end
  end

  def update_level
    #if $now_values == []
    #  update_values
    #end
    result = [$width, $height, $start, $end, $rotation, $labyrinth, $blocks]
    render json: result
  end

  def show
    @level = Level.find(params[:id])
    @@id = params[:id]
    update_values
  end

  def create
    @level = Level.new(level_params)
    @level.save
    redirect_to @level
  end

  private def level_params
    params.require(:level).permit(:width, :height, :start, :end, :rotation, :labyrinth, :blocks)
  end
end
