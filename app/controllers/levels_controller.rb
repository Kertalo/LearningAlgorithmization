require 'json'

class LevelsController < ApplicationController

  $level = 0
  $widths = [4, 8, 8]
  $heights = [8, 8, 8]
  $positions = [8, 35, 23]
  $rotations = [2, 0, 3]
  $end_positions = [5, 24, 1]
  $now_values = []
  $code = []
  $is_run = false

  def main

  end

  def levels

  end

  def level1

  end

  def update_values
    $now_values = [ $widths[$level], $heights[$level], $positions[$level], $rotations[$level], $end_positions[$level] ]
  end

  def forward
    if $now_values[3] % 2 == 0
      if $now_values[3] == 0
        $now_values[2] -= $now_values[2] / $now_values[0] == 0 ? 0 : $now_values[0]
      else
        $now_values[2] += $now_values[2] / $now_values[0] == $now_values[1] - 1 ? 0 : $now_values[0]
      end
    else
      if $now_values[3] == 1
        $now_values[2] += $now_values[2] % $now_values[0] == $now_values[0] - 1 ? 0 : 1
      else
        $now_values[2] -= $now_values[2] % $now_values[0] == 0 ? 0 : 1
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
      $now_values[3] = ($now_values[3] + 3) % 4
      $code = $code[1..$code.length-1]
    when 1 then #rightRotate
      $now_values[3] = ($now_values[3] + 1) % 4
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
    if $now_values == []
      update_values
    end
    render json: $now_values
  end
end
